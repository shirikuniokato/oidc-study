import type { QuizTopic } from "../types";

export const flowsTopic: QuizTopic = {
  id: "flows",
  title: "フロー",
  description: "OAuth 2.0 の各フローの特徴と適切な使い分けを確認しましょう。",
  questions: [
    {
      type: "multiple-choice",
      id: "flows-1",
      question: "SPA（シングルページアプリケーション）に最適なフローはどれですか？",
      options: [
        "インプリシットフロー",
        "認可コードフロー + PKCE",
        "クライアントクレデンシャルフロー",
        "リソースオーナーパスワードクレデンシャルフロー",
      ],
      correctIndex: 1,
      explanation:
        "SPAにはPKCEを使った認可コードフローが推奨されます。インプリシットフローは非推奨であり、PKCEにより公開クライアントでも安全に認可コードフローを使用できます。",
    },
    {
      type: "multiple-choice",
      id: "flows-2",
      question:
        "バックエンドサーバー間（M2M）の通信に適したフローはどれですか？",
      options: [
        "認可コードフロー",
        "インプリシットフロー",
        "クライアントクレデンシャルフロー",
        "デバイス認可フロー",
      ],
      correctIndex: 2,
      explanation:
        "クライアントクレデンシャルフローはユーザーの介在なしに、クライアントIDとクライアントシークレットでトークンを取得します。サーバー間通信に最適です。",
    },
    {
      type: "multiple-choice",
      id: "flows-3",
      question:
        "スマートTVなどの入力制限のあるデバイスに適したフローはどれですか？",
      options: [
        "認可コードフロー",
        "クライアントクレデンシャルフロー",
        "デバイス認可フロー",
        "インプリシットフロー",
      ],
      correctIndex: 2,
      explanation:
        "デバイス認可フローは、ブラウザやキーボード入力が困難なデバイスのために設計されています。ユーザーは別のデバイスで認可を行います。",
    },
    {
      type: "ordering",
      id: "flows-4",
      question:
        "認可コード + PKCE フローのステップを正しい順序に並べてください。",
      items: [
        "code_verifier からcode_challenge を生成",
        "認可リクエストに code_challenge を含める",
        "認可コードを受け取る",
        "トークンリクエストに code_verifier を含める",
        "認可サーバーが code_verifier を検証してトークンを発行",
      ],
      correctOrder: [0, 1, 2, 3, 4],
      explanation:
        "PKCEフローでは、まずcode_verifierを生成しそこからcode_challengeを作成します。認可リクエストにcode_challengeを含め、トークンリクエスト時にcode_verifierを送ることで、認可コードの横取りを防ぎます。",
    },
  ],
};
