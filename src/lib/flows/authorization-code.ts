import type { FlowDefinition } from "./types";

export const authorizationCodeFlow: FlowDefinition = {
  id: "authorization-code",
  name: "認可コードフロー",
  description:
    "最も標準的で安全なフロー。サーバーサイドアプリケーションに適しています。認可コードを中間的な資格情報として使用し、バックチャネルでトークンを取得します。",
  actors: [
    "user-agent",
    "client",
    "authorization-server",
    "resource-server",
  ],
  steps: [
    {
      id: "auth-request",
      order: 1,
      title: "認可リクエスト送信",
      description:
        "クライアントがブラウザを認可サーバーの認可エンドポイントにリダイレクトします。",
      from: "user-agent",
      to: "authorization-server",
      request: {
        method: "GET",
        url: "/authorize",
        description: "認可エンドポイントへのリダイレクト",
        body: [
          "response_type=code",
          "client_id=my-app",
          "redirect_uri=https://example.com/callback",
          "scope=openid profile",
          "state=random-csrf-token",
        ].join("&"),
      },
      securityNotes: [
        "state パラメータでCSRF攻撃を防止する",
        "redirect_uri は事前登録されたものと完全一致させる",
      ],
      highlightParams: ["response_type", "state"],
    },
    {
      id: "user-auth",
      order: 2,
      title: "ユーザー認証・同意",
      description:
        "認可サーバーがユーザーにログイン画面と同意画面を表示します。ユーザーが認証し、要求されたスコープへのアクセスを許可します。",
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
        description: "ユーザーが資格情報を送信し、スコープを承認",
        body: "username=user&password=****&consent=approve",
      },
      securityNotes: [
        "認可サーバーのドメインでのみ認証が行われる",
        "クライアントはユーザーの資格情報に触れない",
      ],
      highlightParams: [],
    },
    {
      id: "auth-code-redirect",
      order: 3,
      title: "認可コードでリダイレクト",
      description:
        "認可サーバーが認可コード付きのリダイレクトURIにブラウザをリダイレクトします。認可コードは一時的で短命です。",
      from: "authorization-server",
      to: "client",
      request: {
        method: "GET",
        url: "https://example.com/callback",
        description: "認可コード付きリダイレクト",
        body: "code=SplxlOBeZQQYbYS6WxSbIA&state=random-csrf-token",
      },
      securityNotes: [
        "認可コードは短命（通常10分以内）",
        "state の値を検証してCSRF攻撃を防ぐ",
        "認可コードは1回のみ使用可能",
      ],
      highlightParams: ["code", "state"],
    },
    {
      id: "token-request",
      order: 4,
      title: "トークンリクエスト",
      description:
        "クライアントがバックチャネル（サーバー間通信）で認可コードをトークンエンドポイントに送信します。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic base64(client_id:client_secret)",
        },
        description: "認可コードをトークンと交換",
        body: [
          "grant_type=authorization_code",
          "code=SplxlOBeZQQYbYS6WxSbIA",
          "redirect_uri=https://example.com/callback",
        ].join("&"),
      },
      securityNotes: [
        "バックチャネル通信のためブラウザを経由しない",
        "client_secret による認証でクライアントの正当性を確認",
      ],
      highlightParams: ["grant_type", "code", "client_secret"],
    },
    {
      id: "token-response",
      order: 5,
      title: "トークンレスポンス",
      description:
        "認可サーバーがアクセストークン（とオプションでリフレッシュトークン）を返します。",
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
        description: "トークンレスポンス",
        body: JSON.stringify(
          {
            access_token: "eyJhbGciOiJSUzI1NiIs...",
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "dGhpcyBpcyBhIHJlZnJlc2g...",
            scope: "openid profile",
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "トークンはバックチャネルで安全に受け取る",
        "アクセストークンは有効期限を設定する",
      ],
      highlightParams: ["access_token", "refresh_token", "expires_in"],
    },
    {
      id: "resource-access",
      order: 6,
      title: "リソースアクセス",
      description:
        "クライアントがアクセストークンを使用してリソースサーバーにアクセスします。",
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
      response: {
        method: "200",
        url: "/api/userinfo",
        description: "保護されたリソースの取得",
        body: JSON.stringify(
          {
            sub: "user123",
            name: "山田太郎",
            email: "taro@example.com",
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "Bearer トークンは Authorization ヘッダーで送信",
        "リソースサーバーはトークンの有効性を検証する",
      ],
      highlightParams: ["Authorization"],
    },
  ],
  whenToUse: [
    "サーバーサイドWebアプリケーション",
    "client_secret を安全に保管できる環境",
    "最も一般的で推奨されるフロー",
  ],
  whenNotToUse: [
    "SPA（シングルページアプリケーション）→ PKCE を使用する",
    "ネイティブアプリ → PKCE を使用する",
    "サーバー間通信 → クライアントクレデンシャルを使用する",
  ],
  securityConsiderations: [
    "認可コードは短命で1回のみ使用可能にする",
    "state パラメータで CSRF 攻撃を防止する",
    "redirect_uri は完全一致で検証する",
    "client_secret はサーバーサイドで安全に管理する",
    "HTTPS を必ず使用する",
  ],
};
