import type { FlowDefinition } from "./types";

export const clientCredentialsFlow: FlowDefinition = {
  id: "client-credentials",
  name: "クライアントクレデンシャルフロー",
  description:
    "ユーザーが関与しないマシン間（M2M）通信のためのフロー。クライアント自身の資格情報でトークンを取得します。バックエンドサービス間の通信に適しています。",
  actors: ["client", "authorization-server", "resource-server"],
  steps: [
    {
      id: "token-request",
      order: 1,
      title: "トークンリクエスト",
      description:
        "クライアントが自身の資格情報（client_id と client_secret）を使って、直接トークンエンドポイントにリクエストします。認可エンドポイントは使用しません。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic base64(client_id:client_secret)",
        },
        description: "クライアント資格情報でトークンを要求",
        body: [
          "grant_type=client_credentials",
          "scope=api:read api:write",
        ].join("&"),
      },
      securityNotes: [
        "client_secret は安全に管理する必要がある",
        "Basic 認証またはPOSTボディでクライアント認証を行う",
      ],
      highlightParams: ["grant_type", "scope", "Authorization"],
    },
    {
      id: "token-response",
      order: 2,
      title: "トークンレスポンス",
      description:
        "認可サーバーがクライアントを認証し、アクセストークンを発行します。リフレッシュトークンは通常発行されません。",
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
        description: "アクセストークンの発行",
        body: JSON.stringify(
          {
            access_token: "eyJhbGciOiJSUzI1NiIs...",
            token_type: "Bearer",
            expires_in: 3600,
            scope: "api:read api:write",
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "リフレッシュトークンは発行しない（再認証が容易なため）",
        "トークンの有効期限は短く設定する",
      ],
      highlightParams: ["access_token", "expires_in"],
    },
    {
      id: "resource-access",
      order: 3,
      title: "リソースアクセス",
      description:
        "取得したアクセストークンでリソースサーバーのAPIにアクセスします。",
      from: "client",
      to: "resource-server",
      request: {
        method: "GET",
        url: "/api/data",
        headers: {
          Authorization: "Bearer eyJhbGciOiJSUzI1NiIs...",
        },
        description: "アクセストークンでAPIにアクセス",
      },
      response: {
        method: "200",
        url: "/api/data",
        description: "リソースの取得",
        body: JSON.stringify(
          { data: [{ id: 1, value: "サービスデータ" }] },
          null,
          2,
        ),
      },
      securityNotes: [
        "リソースサーバーはスコープに基づいてアクセスを制御する",
      ],
      highlightParams: ["Authorization"],
    },
  ],
  whenToUse: [
    "バックエンドサービス間のAPI通信（M2M）",
    "バッチ処理やcronジョブ",
    "マイクロサービス間の通信",
    "CLIツールやデーモンプロセス",
  ],
  whenNotToUse: [
    "ユーザーの代理でアクセスする場合 → 認可コードフローを使用",
    "フロントエンドアプリケーション → PKCE を使用",
    "ユーザーの権限を使いたい場合",
  ],
  securityConsiderations: [
    "client_secret の安全な管理が必須",
    "ユーザーコンテキストがないため、クライアント単位でのアクセス制御になる",
    "トークンの有効期限を短く設定する",
    "スコープを最小限に制限する（最小権限の原則）",
    "client_secret のローテーションを定期的に行う",
  ],
};
