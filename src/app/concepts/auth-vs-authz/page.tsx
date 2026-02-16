import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuthVsAuthzPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-emerald-500/15 text-emerald-400">入門</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            認証 vs 認可
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            「認証」と「認可」は似ているようで全く違う概念です。 OAuth と OIDC
            を理解するうえで、この違いを正確に把握することが重要です。
          </p>
        </div>

        {/* 認証とは */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            認証 (Authentication) - あなたは誰？
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            認証とは、「あなたが本当にあなたであること」を確認するプロセスです。
            身分証明書を見せて本人確認をするようなものです。
          </p>

          <Card className="border-blue-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-blue-400">認証の例</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    パスポートを見せる
                  </span>
                  : 空港で「私は田中太郎です」と証明する
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    ログインする
                  </span>
                  : ID とパスワードで「私はこのアカウントの持ち主です」と証明する
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    指紋認証をする
                  </span>
                  : 生体情報で本人であることを証明する
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 認可とは */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            認可 (Authorization) - 何ができる？
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            認可とは、「あなたが何をする権限を持っているか」を決定するプロセスです。
            入場許可証やチケットのようなものです。
          </p>

          <Card className="border-emerald-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-emerald-400">認可の例</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    映画のチケット
                  </span>
                  : 特定のスクリーンの特定の席に座る権限
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    社員カード
                  </span>
                  : 特定のフロア・部屋に入る権限
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    管理者ロール
                  </span>
                  : システム設定を変更する権限
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 比較表 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            身分証明書 vs 入場許可証
          </h2>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500">
                  # コンサート会場での例え
                </p>
                <p className="mt-4">
                  <span className="text-blue-400">[認証]</span> 身分証明書を見せる
                </p>
                <p>→ 「この人は田中太郎さんです」</p>
                <p>→ 本人確認完了</p>
                <p className="mt-4">
                  <span className="text-emerald-400">[認可]</span> チケットを見せる
                </p>
                <p>→ 「A席のVIPエリアに入れます」</p>
                <p>→ 権限確認完了</p>
                <p className="mt-4 text-zinc-500">
                  # 認証と認可は独立している
                </p>
                <p className="mt-2">
                  - 身分証明書があっても、チケットがなければ入場できない
                </p>
                <p>
                  - チケットがあっても、本人でなければ使えない
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="px-4 py-3 text-left font-medium text-zinc-300">
                    &nbsp;
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-blue-400">
                    認証 (Authentication)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-emerald-400">
                    認可 (Authorization)
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">
                    問い
                  </td>
                  <td className="px-4 py-3">あなたは誰？</td>
                  <td className="px-4 py-3">何ができる？</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">
                    例え
                  </td>
                  <td className="px-4 py-3">身分証明書</td>
                  <td className="px-4 py-3">入場許可証</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-300">
                    結果
                  </td>
                  <td className="px-4 py-3">ユーザーの身元が判明</td>
                  <td className="px-4 py-3">許可された操作が判明</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-300">
                    プロトコル
                  </td>
                  <td className="px-4 py-3">OpenID Connect (OIDC)</td>
                  <td className="px-4 py-3">OAuth 2.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* OAuth と OIDC */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            OAuth = 認可、OIDC = 認証 + 認可
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            OAuth 2.0 は「認可」のためのプロトコルです。
            「このアプリに写真へのアクセスを許可する」といった権限の委譲を扱います。
            しかし、OAuth 2.0 だけでは「ユーザーが誰であるか」を知ることはできません。
          </p>
          <p className="text-zinc-400 leading-relaxed">
            そこで登場したのが OpenID Connect (OIDC) です。 OIDC は OAuth 2.0
            の上に「認証」の機能を追加した拡張仕様です。 OIDC を使うと、認可に加えて
            「このユーザーは田中太郎です」という身元情報も取得できます。
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-amber-400">OAuth 2.0</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-zinc-400">
                <p>「このアプリに写真を見せてOK」</p>
                <p>→ アクセストークンを発行</p>
                <p>→ 権限の委譲のみ</p>
                <p className="mt-2 text-zinc-500">
                  ユーザーが誰かは分からない
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  OpenID Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-zinc-400">
                <p>「このユーザーは田中太郎です」</p>
                <p>→ IDトークンも発行</p>
                <p>→ 認証 + 認可</p>
                <p className="mt-2 text-zinc-500">
                  OAuth 2.0 を拡張した仕様
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/the-problem"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">4つの役割</p>
          </div>
          <Link
            href="/concepts/roles"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
