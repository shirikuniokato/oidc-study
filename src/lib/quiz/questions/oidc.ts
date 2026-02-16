import type { QuizTopic } from "../types";

export const oidcTopic: QuizTopic = {
  id: "oidc",
  title: "OpenID Connect",
  description: "OpenID Connect の仕組みとOAuth 2.0 との違いを確認しましょう。",
  questions: [
    {
      type: "multiple-choice",
      id: "oidc-1",
      question: "OpenID Connect が OAuth 2.0 に追加するものはどれですか？",
      options: [
        "暗号化レイヤー",
        "認証レイヤー",
        "認可レイヤー",
        "トランスポートレイヤー",
      ],
      correctIndex: 1,
      explanation:
        "OpenID Connect は OAuth 2.0 の上に認証（Authentication）レイヤーを追加します。OAuth 2.0 単体では認可のみを扱いますが、OIDCによりユーザーの本人確認が可能になります。",
    },
    {
      type: "multiple-choice",
      id: "oidc-2",
      question:
        "ID トークンに必ず含まれる必須クレームの組み合わせとして正しいものはどれですか？",
      options: [
        "iss, sub, name, email",
        "iss, sub, aud, exp, iat",
        "sub, aud, scope, nonce",
        "iss, aud, name, picture",
      ],
      correctIndex: 1,
      explanation:
        "IDトークンの必須クレームは iss（発行者）、sub（主体）、aud（対象者）、exp（有効期限）、iat（発行日時）です。name や email はオプションのクレームです。",
    },
    {
      type: "multiple-choice",
      id: "oidc-3",
      question: "OpenID Connect のディスカバリエンドポイントのパスはどれですか？",
      options: [
        "/.well-known/oauth-configuration",
        "/.well-known/openid-configuration",
        "/oauth/discovery",
        "/oidc/metadata",
      ],
      correctIndex: 1,
      explanation:
        "OpenID Connect のディスカバリドキュメントは /.well-known/openid-configuration で公開されます。認可エンドポイント、トークンエンドポイント、JWKSエンドポイントなどの情報が含まれます。",
    },
    {
      type: "multiple-choice",
      id: "oidc-4",
      question: "nonce パラメータの目的はどれですか？",
      options: [
        "トークンの暗号化",
        "リプレイ攻撃の防止",
        "スコープの指定",
        "クライアントの認証",
      ],
      correctIndex: 1,
      explanation:
        "nonce パラメータは IDトークンのリプレイ攻撃を防ぎます。認可リクエスト時にランダムな値を生成し、受け取ったIDトークンに同じ値が含まれていることを検証します。",
    },
  ],
};
