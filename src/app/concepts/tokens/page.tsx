import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TokensPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-blue-500/15 text-blue-400">基礎</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            トークンの概要
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0 / OIDC では3種類のトークンが使われます。
            それぞれの役割、特徴、ライフサイクルを理解しましょう。
          </p>
        </div>

        {/* アクセストークン */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            アクセストークン
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            API にアクセスするための「通行証」です。
            リソースサーバーに対して「この操作を行う権限があります」と証明します。
          </p>

          <Card className="border-emerald-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-emerald-400">特徴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">短い有効期限</span>
                  : 通常15分〜1時間。漏洩した場合の被害を最小限にする。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    スコープで権限を制限
                  </span>
                  : 「写真の読み取りのみ」のように、できることが限定される。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    形式は仕様で定められていない
                  </span>
                  : ランダム文字列の場合も、JWT 形式の場合もある。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">例え話</p>
              <div className="rounded-lg bg-zinc-950 p-4 text-zinc-400">
                <p>
                  ホテルのカードキーのようなもの。
                  チェックアウト日まで有効で、割り当てられた部屋だけを開けられる。
                  ホテル全体の管理はできない。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* IDトークン */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">
            IDトークン
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            OIDC で追加された「身分証明書」です。 ユーザーが誰であるかという情報（クレーム）が含まれます。
            必ず JWT (JSON Web Token) 形式です。
          </p>

          <Card className="border-blue-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-blue-400">特徴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    JWT 形式で署名されている
                  </span>
                  : 改ざんを検出できる。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    ユーザー情報を含む
                  </span>
                  : 名前、メールアドレスなどのクレームが含まれる。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    API アクセスには使わない
                  </span>
                  : IDトークンはクライアント向け。API にはアクセストークンを使う。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">JWT の構造</p>
              <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-400 overflow-x-auto">
                <p className="text-zinc-500"># IDトークンは3つのパートで構成</p>
                <p className="mt-2">
                  <span className="text-red-400">eyJhbGciOiJSUzI1NiJ9</span>
                  .
                  <span className="text-emerald-400">eyJzdWIiOiIxMjM0NTY3ODkwIn0</span>
                  .
                  <span className="text-blue-400">SflKxwRJSMeKKF2QT4fw...</span>
                </p>
                <p className="mt-3 text-zinc-500"># デコードすると</p>
                <p className="mt-1">
                  <span className="text-red-400">ヘッダー</span>: {"{"} alg:
                  &quot;RS256&quot; {"}"}
                </p>
                <p>
                  <span className="text-emerald-400">ペイロード</span>: {"{"}
                  sub: &quot;1234567890&quot;, name: &quot;田中太郎&quot; {"}"}
                </p>
                <p>
                  <span className="text-blue-400">署名</span>:
                  改ざん検出用のデジタル署名
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* リフレッシュトークン */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-400">
            リフレッシュトークン
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            アクセストークンの「更新チケット」です。
            アクセストークンの有効期限が切れたとき、ユーザーに再ログインを
            求めることなく新しいアクセストークンを取得できます。
          </p>

          <Card className="border-amber-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-amber-400">特徴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">長い有効期限</span>
                  : 数日〜数ヶ月。ユーザー体験のために長めに設定される。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    厳重に保管が必要
                  </span>
                  : 新しいアクセストークンを発行できるため、漏洩すると危険。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    認可サーバーにのみ送信
                  </span>
                  : リソースサーバーには送らない。トークンエンドポイントでのみ使用。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">例え話</p>
              <div className="rounded-lg bg-zinc-950 p-4 text-zinc-400">
                <p>
                  定期券の更新券のようなもの。
                  定期券（アクセストークン）が切れても、更新券（リフレッシュトークン）があれば
                  窓口（認可サーバー）で新しい定期券を受け取れる。
                  毎回購入手続き（ログイン）をやり直す必要がない。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ライフサイクル */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            トークンのライフサイクル
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500"># トークンの一生</p>
                <p className="mt-3">1. ユーザーが認証・認可</p>
                <p>   → 認可サーバーがトークンを発行</p>
                <p className="mt-2">
                  2. クライアントがアクセストークンで API を呼び出す
                </p>
                <p>   → リソースサーバーがトークンを検証</p>
                <p className="mt-2">
                  3. アクセストークンの有効期限が切れる
                  <span className="text-amber-400"> (15分〜1時間後)</span>
                </p>
                <p className="mt-2">
                  4. リフレッシュトークンで新しいアクセストークンを取得
                </p>
                <p>   → ユーザーの操作は不要</p>
                <p className="mt-2">
                  5. リフレッシュトークンも期限切れ or 取り消し
                </p>
                <p>   → ユーザーに再ログインを求める</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 比較表 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            3つのトークンの比較
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900">
                    <th className="px-4 py-3 text-left font-medium text-zinc-300">
                      &nbsp;
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-emerald-400">
                      アクセストークン
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-blue-400">
                      IDトークン
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-amber-400">
                      リフレッシュトークン
                    </th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      目的
                    </td>
                    <td className="px-4 py-3">API アクセス</td>
                    <td className="px-4 py-3">ユーザー識別</td>
                    <td className="px-4 py-3">トークン更新</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      送信先
                    </td>
                    <td className="px-4 py-3">リソースサーバー</td>
                    <td className="px-4 py-3">クライアント内で利用</td>
                    <td className="px-4 py-3">認可サーバー</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      有効期限
                    </td>
                    <td className="px-4 py-3">短い (分〜時間)</td>
                    <td className="px-4 py-3">短い (分〜時間)</td>
                    <td className="px-4 py-3">長い (日〜月)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      形式
                    </td>
                    <td className="px-4 py-3">不定 / JWT</td>
                    <td className="px-4 py-3">必ず JWT</td>
                    <td className="px-4 py-3">不定</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/roles"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">
              スコープとクレーム
            </p>
          </div>
          <Link
            href="/concepts/scopes-and-claims"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
