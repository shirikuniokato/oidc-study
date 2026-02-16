import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    name: "リソースオーナー",
    english: "Resource Owner",
    color: "text-blue-400",
    borderColor: "border-blue-900/50",
    description: "保護されたリソースの所有者。通常はエンドユーザー（あなた自身）です。",
    analogy: "マンションの住人。自分の部屋の鍵と、誰を招くかの決定権を持っている。",
    examples: ["Google アカウントを持つユーザー", "GitHub リポジトリのオーナー"],
  },
  {
    name: "クライアント",
    english: "Client",
    color: "text-amber-400",
    borderColor: "border-amber-900/50",
    description:
      "リソースオーナーの代わりにリソースにアクセスしたいアプリケーション。",
    analogy:
      "清掃業者。住人（リソースオーナー）の許可を得て、部屋に入りたい。",
    examples: ["写真印刷アプリ", "タスク管理ツール", "サードパーティの分析ツール"],
  },
  {
    name: "認可サーバー",
    english: "Authorization Server",
    color: "text-emerald-400",
    borderColor: "border-emerald-900/50",
    description:
      "リソースオーナーを認証し、クライアントにアクセストークンを発行するサーバー。",
    analogy:
      "マンションの管理会社。住人の本人確認をし、清掃業者に制限付きの鍵を発行する。",
    examples: ["Google の認証サーバー", "Auth0", "Keycloak"],
  },
  {
    name: "リソースサーバー",
    english: "Resource Server",
    color: "text-purple-400",
    borderColor: "border-purple-900/50",
    description:
      "保護されたリソースをホストし、アクセストークンを検証してリソースを提供するサーバー。",
    analogy:
      "マンションのドアのオートロック。有効な鍵（トークン）を持っている人だけを通す。",
    examples: ["Google Photos API", "GitHub API", "Twitter API"],
  },
];

export default function RolesPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-blue-500/15 text-blue-400">基礎</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            4つの役割
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0 には4つの主要な役割（ロール）があります。
            それぞれの役割と関係性を、マンションの例えで理解しましょう。
          </p>
        </div>

        {/* 各役割の詳細 */}
        <section className="space-y-6">
          {roles.map((role) => (
            <Card
              key={role.english}
              className={`${role.borderColor} bg-zinc-900`}
            >
              <CardHeader>
                <CardTitle className={role.color}>
                  {role.name}
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({role.english})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-zinc-400">
                <p>{role.description}</p>
                <div className="rounded-lg bg-zinc-950 p-4">
                  <p className="text-sm text-zinc-500">例え話</p>
                  <p className="mt-1 text-zinc-300">{role.analogy}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">具体例</p>
                  <ul className="mt-2 space-y-1">
                    {role.examples.map((example) => (
                      <li key={example} className="flex items-center gap-2">
                        <span className={role.color}>-</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* 関係図 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            4つの役割の関係
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500">
                  # 写真印刷アプリの例
                </p>
                <p className="mt-4">
                  <span className="text-blue-400">[リソースオーナー]</span>{" "}
                  ユーザー (あなた)
                </p>
                <p>  |</p>
                <p>  | 1. 「Google Photos の写真を使って印刷したい」</p>
                <p>  v</p>
                <p>
                  <span className="text-amber-400">[クライアント]</span>{" "}
                  写真印刷アプリ
                </p>
                <p>  |</p>
                <p>
                  {" "}
                  | 2. 「Google に許可をもらってきてください」
                </p>
                <p>  v</p>
                <p>
                  <span className="text-emerald-400">[認可サーバー]</span>{" "}
                  Google の認証画面
                </p>
                <p>  |</p>
                <p>
                  {" "}
                  | 3. ユーザーが許可 → アクセストークン発行
                </p>
                <p>  v</p>
                <p>
                  <span className="text-amber-400">[クライアント]</span>{" "}
                  写真印刷アプリ (トークン取得)
                </p>
                <p>  |</p>
                <p>  | 4. トークンを使って写真をリクエスト</p>
                <p>  v</p>
                <p>
                  <span className="text-purple-400">[リソースサーバー]</span>{" "}
                  Google Photos API
                </p>
                <p>  |</p>
                <p>  | 5. トークンを検証 → 写真データを返す</p>
                <p>  v</p>
                <p>
                  <span className="text-amber-400">[クライアント]</span>{" "}
                  写真を受け取り、印刷処理へ
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 補足 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            知っておきたいポイント
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6 space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-zinc-500">1.</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    認可サーバーとリソースサーバーは同じ場合もある
                  </span>
                  : 小規模なシステムでは、1つのサーバーが両方の役割を担うことがあります。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-zinc-500">2.</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    クライアントは必ずしもブラウザアプリとは限らない
                  </span>
                  : モバイルアプリ、サーバーサイドアプリ、CLI
                  ツールなど、様々な形態があります。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-zinc-500">3.</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    リソースオーナーは人間とは限らない
                  </span>
                  : マシン間通信では、サービスアカウントがリソースオーナーになることもあります。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/auth-vs-authz"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">トークンの概要</p>
          </div>
          <Link
            href="/concepts/tokens"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
