import type { QuizTopic } from "../types";

export const tokensTopic: QuizTopic = {
  id: "tokens",
  title: "トークン",
  description: "アクセストークン、IDトークン、リフレッシュトークンの違いを確認しましょう。",
  questions: [
    {
      type: "multiple-choice",
      id: "tokens-1",
      question: "OpenID Connect の IDトークンの形式はどれですか？",
      options: ["XML", "SAML Assertion", "JWT", "Opaque Token"],
      correctIndex: 2,
      explanation:
        "IDトークンは必ず JWT（JSON Web Token）形式です。ヘッダー、ペイロード、署名の3つのパートで構成され、Base64URLエンコードされています。",
    },
    {
      type: "multiple-choice",
      id: "tokens-2",
      question: "アクセストークンの主な用途はどれですか？",
      options: [
        "ユーザーの本人確認",
        "APIリソースへのアクセス",
        "新しいトークンの発行",
        "クライアントの登録",
      ],
      correctIndex: 1,
      explanation:
        "アクセストークンはリソースサーバーのAPIにアクセスするために使用されます。リソースサーバーはアクセストークンを検証し、適切なリソースを返します。",
    },
    {
      type: "multiple-choice",
      id: "tokens-3",
      question: "リフレッシュトークンの主な役割はどれですか？",
      options: [
        "ユーザーのプロフィール情報を取得する",
        "認可サーバーのエンドポイントを発見する",
        "有効期限切れのアクセストークンを再取得する",
        "クライアントを認証する",
      ],
      correctIndex: 2,
      explanation:
        "リフレッシュトークンは、アクセストークンの有効期限が切れた際に、ユーザーの再認可なしに新しいアクセストークンを取得するために使用されます。",
    },
    {
      type: "multiple-choice",
      id: "tokens-4",
      question: "JWT のペイロードに含まれる「exp」クレームは何を表しますか？",
      options: [
        "トークンの発行者",
        "トークンの有効期限",
        "トークンの対象者",
        "トークンの発行日時",
      ],
      correctIndex: 1,
      explanation:
        "exp（expiration time）クレームはトークンの有効期限をUnixタイムスタンプで表します。この時刻を過ぎたトークンは無効として扱う必要があります。",
    },
  ],
};
