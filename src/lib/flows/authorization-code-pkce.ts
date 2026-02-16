import type { FlowDefinition } from "./types";

export const authorizationCodePkceFlow: FlowDefinition = {
  id: "authorization-code-pkce",
  name: "認可コード + PKCE フロー",
  description:
    "認可コードフローに PKCE（Proof Key for Code Exchange）を追加したフロー。SPAやネイティブアプリなど、client_secret を安全に保管できない環境で使用します。現在最も推奨されるフローです。",
  actors: [
    "user-agent",
    "client",
    "authorization-server",
    "resource-server",
  ],
  steps: [
    {
      id: "pkce-generate",
      order: 1,
      title: "PKCE パラメータ生成",
      description:
        "クライアントが code_verifier（ランダム文字列）を生成し、そのSHA-256ハッシュから code_challenge を計算します。",
      from: "client",
      to: "client",
      request: {
        method: "GENERATE",
        url: "(ローカル処理)",
        description: "code_verifier と code_challenge の生成",
        body: [
          "code_verifier = dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "code_challenge = E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
          "code_challenge_method = S256",
        ].join("\n"),
      },
      securityNotes: [
        "code_verifier は43〜128文字のランダム文字列",
        "code_challenge = BASE64URL(SHA256(code_verifier))",
        "S256メソッドを必ず使用する（plainは非推奨）",
      ],
      highlightParams: [
        "code_verifier",
        "code_challenge",
        "code_challenge_method",
      ],
    },
    {
      id: "auth-request",
      order: 2,
      title: "認可リクエスト送信（code_challenge付き）",
      description:
        "認可リクエストに code_challenge と code_challenge_method を含めて送信します。code_verifier はクライアント側で安全に保持します。",
      from: "user-agent",
      to: "authorization-server",
      request: {
        method: "GET",
        url: "/authorize",
        description: "PKCE付き認可リクエスト",
        body: [
          "response_type=code",
          "client_id=my-spa-app",
          "redirect_uri=https://example.com/callback",
          "scope=openid profile",
          "state=random-csrf-token",
          "code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
          "code_challenge_method=S256",
        ].join("&"),
      },
      securityNotes: [
        "code_challenge のみ送信し、code_verifier は送信しない",
        "認可サーバーが code_challenge を保存する",
      ],
      highlightParams: ["code_challenge", "code_challenge_method"],
    },
    {
      id: "user-auth",
      order: 3,
      title: "ユーザー認証・同意",
      description:
        "認可サーバーがユーザーにログイン画面と同意画面を表示します。通常の認可コードフローと同じです。",
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
      securityNotes: [
        "通常の認可コードフローと同じ認証プロセス",
      ],
      highlightParams: [],
    },
    {
      id: "auth-code-redirect",
      order: 4,
      title: "認可コードでリダイレクト",
      description:
        "認可サーバーが認可コード付きでリダイレクトします。通常の認可コードフローと同じです。",
      from: "authorization-server",
      to: "client",
      request: {
        method: "GET",
        url: "https://example.com/callback",
        description: "認可コード付きリダイレクト",
        body: "code=SplxlOBeZQQYbYS6WxSbIA&state=random-csrf-token",
      },
      securityNotes: [
        "認可コード単体では不十分。code_verifier が必要",
      ],
      highlightParams: ["code", "state"],
    },
    {
      id: "token-request",
      order: 5,
      title: "トークンリクエスト（code_verifier付き）",
      description:
        "クライアントが認可コードと一緒に code_verifier を送信します。認可サーバーは保存していた code_challenge と照合して検証します。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        description: "code_verifier 付きトークンリクエスト",
        body: [
          "grant_type=authorization_code",
          "code=SplxlOBeZQQYbYS6WxSbIA",
          "redirect_uri=https://example.com/callback",
          "client_id=my-spa-app",
          "code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
        ].join("&"),
      },
      securityNotes: [
        "client_secret の代わりに code_verifier で証明",
        "認可サーバーは SHA256(code_verifier) == code_challenge を検証",
        "認可コードを傍受されても code_verifier がなければトークンを取得できない",
      ],
      highlightParams: ["code_verifier", "client_id"],
    },
    {
      id: "token-response",
      order: 6,
      title: "トークンレスポンス",
      description:
        "PKCE検証に成功すると、認可サーバーがアクセストークンを返します。",
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
            scope: "openid profile",
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "パブリッククライアントのためリフレッシュトークンは返さない場合が多い",
      ],
      highlightParams: ["access_token", "expires_in"],
    },
    {
      id: "resource-access",
      order: 7,
      title: "リソースアクセス",
      description:
        "取得したアクセストークンでリソースサーバーにアクセスします。",
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
        "通常の認可コードフローと同じリソースアクセス",
      ],
      highlightParams: ["Authorization"],
    },
  ],
  whenToUse: [
    "SPA（シングルページアプリケーション）",
    "モバイル/ネイティブアプリケーション",
    "client_secret を安全に保管できないパブリッククライアント",
    "現在最も推奨されるフロー（RFC 7636、OAuth 2.1）",
  ],
  whenNotToUse: [
    "サーバー間通信 → クライアントクレデンシャルフローを使用",
    "入力デバイスがないIoT → デバイス認可フローを使用",
  ],
  securityConsiderations: [
    "code_challenge_method は必ず S256 を使用する",
    "code_verifier は暗号論的に安全な乱数で生成する",
    "code_verifier はリクエストごとに新規生成する",
    "インプリシットフローの代わりにこのフローを使用すること",
    "state パラメータも併用して CSRF を防止する",
  ],
};
