import type { FlowDefinition } from "./types";

export const deviceAuthorizationFlow: FlowDefinition = {
  id: "device-authorization",
  name: "デバイス認可フロー",
  description:
    "入力機能が制限されたデバイス（スマートTV、IoTデバイス、CLIツール等）のためのフロー。ユーザーは別のデバイス（スマートフォン等）のブラウザでコードを入力して認証します。",
  actors: ["client", "user-agent", "authorization-server", "resource-server"],
  steps: [
    {
      id: "device-auth-request",
      order: 1,
      title: "デバイス認可リクエスト",
      description:
        "デバイスが認可サーバーのデバイス認可エンドポイントにリクエストを送信し、ユーザーコードとデバイスコードを取得します。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/device/code",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        description: "デバイス認可エンドポイントへのリクエスト",
        body: "client_id=my-tv-app&scope=openid profile",
      },
      response: {
        method: "200",
        url: "/device/code",
        description: "デバイスコードとユーザーコードの発行",
        body: JSON.stringify(
          {
            device_code: "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNh",
            user_code: "WDJB-MJHT",
            verification_uri: "https://auth.example.com/device",
            verification_uri_complete:
              "https://auth.example.com/device?user_code=WDJB-MJHT",
            expires_in: 1800,
            interval: 5,
          },
          null,
          2,
        ),
      },
      securityNotes: [
        "device_code はデバイスが保持する秘密の値",
        "user_code はユーザーに表示する短いコード",
        "interval はポーリング間隔（秒）",
      ],
      highlightParams: [
        "device_code",
        "user_code",
        "verification_uri",
        "interval",
      ],
    },
    {
      id: "display-code",
      order: 2,
      title: "ユーザーコード表示",
      description:
        "デバイスがユーザーコードと検証URIを画面に表示します。ユーザーはスマートフォン等の別デバイスでアクセスします。",
      from: "client",
      to: "user-agent",
      request: {
        method: "DISPLAY",
        url: "(デバイス画面)",
        description: "ユーザーに表示するメッセージ",
        body: [
          "以下のURLにアクセスしてください:",
          "https://auth.example.com/device",
          "",
          "コードを入力してください: WDJB-MJHT",
        ].join("\n"),
      },
      securityNotes: [
        "ユーザーコードは推測困難な形式にする",
        "QRコードの表示も一般的",
      ],
      highlightParams: ["user_code", "verification_uri"],
    },
    {
      id: "user-auth",
      order: 3,
      title: "ユーザーがブラウザでコード入力・認証",
      description:
        "ユーザーがスマートフォン等のブラウザで検証URIにアクセスし、ユーザーコードを入力して認証・同意します。",
      from: "user-agent",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/device",
        description: "ユーザーコードの入力と認証",
        body: "user_code=WDJB-MJHT",
      },
      response: {
        method: "200",
        url: "/device",
        description: "認証成功メッセージ",
        body: "認証が完了しました。デバイスに戻ってください。",
      },
      securityNotes: [
        "ユーザーは信頼できるブラウザで認証する",
        "デバイスはユーザーの資格情報に一切触れない",
        "フィッシング攻撃に注意（正しいURLか確認する）",
      ],
      highlightParams: ["user_code"],
    },
    {
      id: "polling",
      order: 4,
      title: "デバイスがポーリング",
      description:
        "デバイスがトークンエンドポイントに定期的にポーリングし、ユーザーの認証完了を待ちます。認証が完了するまで authorization_pending エラーが返されます。",
      from: "client",
      to: "authorization-server",
      request: {
        method: "POST",
        url: "/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        description: "トークンエンドポイントへのポーリング",
        body: [
          "grant_type=urn:ietf:params:oauth:grant-type:device_code",
          "device_code=GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNh",
          "client_id=my-tv-app",
        ].join("&"),
      },
      response: {
        method: "400",
        url: "/token",
        description: "認証待ちのレスポンス",
        body: JSON.stringify(
          { error: "authorization_pending" },
          null,
          2,
        ),
      },
      securityNotes: [
        "interval で指定された間隔を守ってポーリングする",
        "slow_down エラーの場合は間隔を5秒延長する",
        "expires_in を超えたらポーリングを停止する",
      ],
      highlightParams: ["grant_type", "device_code"],
    },
    {
      id: "token-response",
      order: 5,
      title: "トークン取得",
      description:
        "ユーザーの認証が完了すると、ポーリングに対してアクセストークンが返されます。",
      from: "authorization-server",
      to: "client",
      request: {
        method: "POST",
        url: "/token",
        description: "認証完了後のポーリングリクエスト（上記と同じ）",
      },
      response: {
        method: "200",
        url: "/token",
        description: "トークンの発行",
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
        "リフレッシュトークンも発行されることが多い",
        "デバイスにトークンを安全に保存する",
      ],
      highlightParams: ["access_token", "refresh_token"],
    },
  ],
  whenToUse: [
    "スマートTV、ストリーミングデバイス",
    "IoTデバイス、スマートスピーカー",
    "CLIツール（GitHub CLI、AWS CLI等）",
    "入力機能が制限されたデバイス全般",
  ],
  whenNotToUse: [
    "ブラウザベースのアプリ → 認可コード + PKCE を使用",
    "サーバー間通信 → クライアントクレデンシャルを使用",
    "通常のWebアプリ → 認可コードフローを使用",
  ],
  securityConsiderations: [
    "ユーザーコードは十分なエントロピーを持たせる",
    "device_code の有効期限を適切に設定する",
    "ポーリング間隔を守り、サーバーに過度な負荷をかけない",
    "リモートフィッシング攻撃のリスクに注意",
    "ユーザーコードの入力画面でドメインを確認するよう促す",
  ],
};
