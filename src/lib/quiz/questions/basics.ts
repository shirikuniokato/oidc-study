import type { QuizTopic } from "../types";

export const basicsTopic: QuizTopic = {
  id: "basics",
  title: "OAuth 基礎",
  description: "OAuth 2.0 の基本的な概念と用語を確認しましょう。",
  questions: [
    {
      type: "multiple-choice",
      id: "basics-1",
      question: "OAuth 2.0 の主な目的はどれですか？",
      options: ["認証", "認可", "暗号化", "セッション管理"],
      correctIndex: 1,
      explanation:
        "OAuth 2.0 は認可（Authorization）のためのフレームワークです。ユーザーの認証ではなく、リソースへのアクセス権限の委譲を目的としています。",
    },
    {
      type: "multiple-choice",
      id: "basics-2",
      question: "OAuth 2.0 の4つの役割に含まれないものはどれですか？",
      options: [
        "リソースオーナー",
        "クライアント",
        "認証局（CA）",
        "認可サーバー",
      ],
      correctIndex: 2,
      explanation:
        "OAuth 2.0 の4つの役割は、リソースオーナー、クライアント、認可サーバー、リソースサーバーです。認証局（CA）はTLS/SSL証明書に関する概念であり、OAuthの役割には含まれません。",
    },
    {
      type: "multiple-choice",
      id: "basics-3",
      question: "OAuth 2.0 においてスコープ（scope）の役割はどれですか？",
      options: [
        "ユーザーのパスワードを暗号化する",
        "アクセス権限の範囲を制限する",
        "トークンの有効期限を設定する",
        "リダイレクトURIを検証する",
      ],
      correctIndex: 1,
      explanation:
        "スコープはクライアントがアクセスできるリソースの範囲を制限するために使われます。例えば、openid profile email のように、必要な権限のみを要求します。",
    },
    {
      type: "ordering",
      id: "basics-4",
      question: "認可コードフローの基本的なステップを正しい順序に並べてください。",
      items: [
        "認可サーバーがクライアントに認可コードを返す",
        "クライアントが認可サーバーにリダイレクト",
        "ユーザーが認可を承認する",
        "クライアントが認可コードをトークンに交換する",
        "認可サーバーがアクセストークンを発行する",
      ],
      correctOrder: [1, 2, 0, 3, 4],
      explanation:
        "認可コードフローでは、まずクライアントがユーザーを認可サーバーにリダイレクトし、ユーザーが認可を承認すると認可コードが返されます。その後、クライアントがバックチャネルで認可コードをトークンに交換し、アクセストークンを受け取ります。",
    },
  ],
};
