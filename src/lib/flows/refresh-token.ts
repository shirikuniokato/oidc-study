import type { FlowDefinition } from "./types";

export const refreshTokenFlow: FlowDefinition = {
  id: "refresh-token",
  name: "リフレッシュトークンフロー",
  description:
    "アクセストークンの有効期限が切れた際に、ユーザーの再認証なしで新しいアクセストークンを取得するフロー。ユーザー体験を向上させつつ、セキュリティを維持します。",
  actors: ["client", "authorization-server"],
  steps: [
    {
      id: "refresh-request",
      order: 1,
      title: "リフレッシュトークンリクエスト",
      description:
        "クライアントがリフレッシュトークンを使用してトークンエンドポイントに新しいアクセストークンを要求します。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic base64(client_id:client_secret)",
        },
        description: "リフレッシュトークンで新しいアクセストークンを要求",
        body: [
          "grant_type=refresh_token",
          "refresh_token=dGhpcyBpcyBhIHJlZnJlc2g...",
          "scope=openid profile",
        ].join("&"),
      },
      securityNotes: [
        "リフレッシュトークンは安全に保存する（サーバーサイド推奨）",
        "scope は元のスコープ以下に限定される",
        "機密クライアントはクライアント認証が必要",
      ],
      highlightParams: ["grant_type", "refresh_token", "scope"],
    },
    {
      id: "token-response",
      order: 2,
      title: "新しいアクセストークン取得",
      description:
        "認可サーバーがリフレッシュトークンを検証し、新しいアクセストークン（と場合によっては新しいリフレッシュトークン）を発行します。",
      from: "authorization-server",
      to: "client",
      request: {
        method: "POST",
        url: "/token",
        description: "トークンエンドポイントへのリクエスト（上記の続き）",
      },
      response: {
        method: "200",
        url: "/token",
        description: "新しいトークンの発行",
        body: JSON.stringify(
          {
            access_token: "eyJhbGciOiJSUzI1NiIs...(新しいトークン)",
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "bmV3IHJlZnJlc2ggdG9rZW4...(新しいRT)",
            scope: "openid profile",
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "トークンローテーション: 新しいリフレッシュトークンが発行される場合がある",
        "古いリフレッシュトークンは無効化される（ローテーション時）",
        "トークンローテーションにより漏洩時の被害を限定できる",
      ],
      highlightParams: [
        "access_token",
        "refresh_token",
        "expires_in",
      ],
    },
  ],
  whenToUse: [
    "アクセストークンの有効期限が切れた場合",
    "長期間のセッション維持が必要な場合",
    "ユーザーに再ログインを求めたくない場合",
    "オフラインアクセスが必要な場合",
  ],
  whenNotToUse: [
    "サーバー間通信 → 新しいアクセストークンを直接取得する",
    "短命なセッションのみの場合",
    "セキュリティ要件が特に厳しく、毎回認証が必要な場合",
  ],
  securityConsiderations: [
    "リフレッシュトークンは長命なため、厳格に管理する",
    "トークンローテーションを実装して漏洩リスクを軽減する",
    "リフレッシュトークン漏洩を検知したら全トークンを無効化する",
    "パブリッククライアントではリフレッシュトークンの発行を慎重に検討する",
    "リフレッシュトークンにも有効期限を設定する",
    "不審なリフレッシュトークンの使用パターンを監視する",
  ],
};
