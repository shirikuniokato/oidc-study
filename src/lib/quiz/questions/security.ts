import type { QuizTopic } from "../types";

export const securityTopic: QuizTopic = {
  id: "security",
  title: "セキュリティ",
  description: "OAuth 2.0 のセキュリティ対策とベストプラクティスを確認しましょう。",
  questions: [
    {
      type: "multiple-choice",
      id: "security-1",
      question: "state パラメータの主な目的はどれですか？",
      options: [
        "トークンの暗号化",
        "CSRF（クロスサイトリクエストフォージェリ）攻撃の防止",
        "ユーザーのセッション管理",
        "リダイレクトURIの検証",
      ],
      correctIndex: 1,
      explanation:
        "state パラメータはCSRF攻撃を防ぐために使用されます。認可リクエスト時にランダムな値を生成し、コールバック時にその値を検証することで、攻撃者が偽のコールバックを送ることを防ぎます。",
    },
    {
      type: "multiple-choice",
      id: "security-2",
      question: "PKCE（Proof Key for Code Exchange）が防ぐ攻撃はどれですか？",
      options: [
        "クロスサイトスクリプティング（XSS）",
        "認可コード横取り攻撃",
        "SQLインジェクション",
        "中間者攻撃（MITM）",
      ],
      correctIndex: 1,
      explanation:
        "PKCEは認可コード横取り攻撃を防ぎます。悪意のあるアプリが認可コードを傍受しても、code_verifier を持っていないためトークンに交換することができません。",
    },
    {
      type: "multiple-choice",
      id: "security-3",
      question:
        "ブラウザベースのアプリでアクセストークンを保存する際に最も安全な方法はどれですか？",
      options: [
        "localStorage に保存する",
        "Cookie（HttpOnly, Secure, SameSite）に保存する",
        "sessionStorage に保存する",
        "URL パラメータに含める",
      ],
      correctIndex: 1,
      explanation:
        "HttpOnly, Secure, SameSite 属性を持つ Cookie が最も安全です。localStorage や sessionStorage はXSS攻撃に対して脆弱であり、URLパラメータはサーバーログやRefererヘッダーで漏洩する危険があります。",
    },
    {
      type: "multiple-choice",
      id: "security-4",
      question: "リダイレクトURIの厳密な一致検証が必要な理由はどれですか？",
      options: [
        "パフォーマンスの向上",
        "オープンリダイレクト攻撃の防止",
        "ユーザー体験の改善",
        "トークンの暗号強度の向上",
      ],
      correctIndex: 1,
      explanation:
        "リダイレクトURIの厳密な一致検証により、攻撃者が認可コードやトークンを自分が管理するURIにリダイレクトさせるオープンリダイレクト攻撃を防止できます。",
    },
  ],
};
