import type { FlowDefinition } from "./types";

export const implicitFlow: FlowDefinition = {
  id: "implicit",
  name: "インプリシットフロー",
  description:
    "認可コードを介さず、認可エンドポイントから直接アクセストークンを返すフロー。セキュリティ上の問題から現在は非推奨です。代わりに認可コード + PKCE フローを使用してください。",
  actors: ["user-agent", "client", "authorization-server", "resource-server"],
  steps: [
    {
      id: "auth-request",
      order: 1,
      title: "認可リクエスト送信",
      description:
        "クライアントが response_type=token で認可リクエストを送信します。トークンエンドポイントを使わず、直接トークンを受け取ります。",
      from: "user-agent",
      to: "authorization-server",
      request: {
        method: "GET",
        url: "/authorize",
        description: "インプリシットフローの認可リクエスト",
        body: [
          "response_type=token",
          "client_id=my-spa-app",
          "redirect_uri=https://example.com/callback",
          "scope=openid profile",
          "state=random-csrf-token",
        ].join("&"),
      },
      securityNotes: [
        "response_type=token がインプリシットフローの特徴",
        "client_secret は使用しない",
      ],
      highlightParams: ["response_type"],
    },
    {
      id: "user-auth",
      order: 2,
      title: "ユーザー認証・同意",
      description:
        "認可サーバーがユーザーにログインと同意を求めます。他のフローと同じプロセスです。",
      from: "authorization-server",
      to: "user-agent",
      request: {
        method: "GET",
        url: "/login",
        description: "ログインページの表示",
      },
      response: {
        method: "POST",
        url: "/login",
        description: "ユーザーが資格情報を送信",
        body: "username=user&password=****&consent=approve",
      },
      securityNotes: [],
      highlightParams: [],
    },
    {
      id: "token-in-fragment",
      order: 3,
      title: "フラグメントでトークン返却",
      description:
        "認可サーバーがアクセストークンをURLフラグメント（#）に含めてリダイレクトします。フラグメントはサーバーに送信されませんが、ブラウザのJavaScriptからアクセスできます。",
      from: "authorization-server",
      to: "user-agent",
      request: {
        method: "GET",
        url: "https://example.com/callback",
        description: "アクセストークンがフラグメントに含まれる",
        body: [
          "#access_token=eyJhbGciOiJSUzI1NiIs...",
          "token_type=Bearer",
          "expires_in=3600",
          "state=random-csrf-token",
        ].join("&"),
      },
      securityNotes: [
        "トークンがURLに露出する（ブラウザ履歴、Refererヘッダー）",
        "トークン漏洩のリスクが高い",
        "リフレッシュトークンは発行できない",
      ],
      highlightParams: ["access_token", "token_type"],
    },
    {
      id: "resource-access",
      order: 4,
      title: "リソースアクセス",
      description:
        "JavaScriptがフラグメントからトークンを抽出し、APIリクエストに使用します。",
      from: "client",
      to: "resource-server",
      request: {
        method: "GET",
        url: "/api/userinfo",
        headers: {
          Authorization: "Bearer eyJhbGciOiJSUzI1NiIs...",
        },
        description: "アクセストークンでAPIにアクセス",
      },
      securityNotes: [
        "トークンがフロントエンドのみで管理される",
        "XSS 攻撃でトークンが窃取されるリスクが高い",
      ],
      highlightParams: ["Authorization"],
    },
  ],
  whenToUse: [
    "使用しないでください（非推奨）",
  ],
  whenNotToUse: [
    "すべてのケース → 認可コード + PKCE フローを使用する",
    "レガシーシステムからの移行も計画すべき",
  ],
  securityConsiderations: [
    "OAuth 2.0 Security Best Current Practice (RFC 9700) で非推奨",
    "アクセストークンがURLフラグメントに露出し漏洩リスクが高い",
    "ブラウザ履歴やRefererヘッダーからトークンが漏洩する可能性がある",
    "トークンの送信元を検証する仕組みがない（トークンインジェクション攻撃に脆弱）",
    "リフレッシュトークンを発行できないため、ユーザー体験が低下する",
    "OAuth 2.1 ではインプリシットフローは削除される予定",
  ],
};
