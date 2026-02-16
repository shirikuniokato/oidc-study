import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TheProblemPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-emerald-500/15 text-emerald-400">入門</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            OAuth が解決する問題
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth が生まれる前、サードパーティアプリにデータを共有するには
            パスワードを渡すしかありませんでした。この章では、なぜそれが危険で、
            OAuth がどのように解決したのかを学びます。
          </p>
        </div>

        {/* パスワード共有の問題 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            パスワード共有の時代
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            2007年以前、あるサービスが別のサービスのデータにアクセスしたい場合、
            ユーザーは自分のパスワードを直接渡す必要がありました。
            例えば、写真印刷サービスが Google Photos
            の写真にアクセスするには、Google
            のパスワードをそのサービスに教えなければなりませんでした。
          </p>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-red-400">
                パスワード共有の問題点
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-red-400">1.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    全権限の譲渡
                  </span>
                  <p className="mt-1">
                    パスワードを渡すと、写真の閲覧だけでなく、
                    メールの送信、連絡先の削除、アカウント設定の変更まで
                    すべてが可能になってしまいます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-red-400">2.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    取り消し不可
                  </span>
                  <p className="mt-1">
                    一度パスワードを教えてしまうと、パスワード自体を変更しない限り
                    アクセスを取り消せません。変更すると、他の正当なサービスにも
                    影響が出ます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-red-400">3.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    漏洩リスク
                  </span>
                  <p className="mt-1">
                    パスワードを知るサービスが増えるほど、漏洩のリスクが高まります。
                    一つのサービスが攻撃を受ければ、あなたのアカウントが危険にさらされます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 鍵の例え */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            鍵の例えで理解する
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            パスワード共有の問題を、マンションの鍵に例えて考えてみましょう。
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-red-900/50 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-red-400">
                  マスターキーを渡す
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-zinc-400">
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm">
                  <p className="text-zinc-500">
                    # パスワード共有 = マスターキーを渡す
                  </p>
                  <p className="mt-2">清掃業者に依頼したい</p>
                  <p>→ マスターキーのコピーを渡す</p>
                  <p className="mt-2 text-red-400">結果:</p>
                  <p>- 全部屋に入れる</p>
                  <p>- 金庫も開けられる</p>
                  <p>- いつでも出入り自由</p>
                  <p>- 取り消すには鍵交換が必要</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/50 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-emerald-400">
                  合鍵を作る（OAuth）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-zinc-400">
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm">
                  <p className="text-zinc-500">
                    # OAuth = 制限付き合鍵を作る
                  </p>
                  <p className="mt-2">清掃業者に依頼したい</p>
                  <p>→ リビングだけの合鍵を作る</p>
                  <p className="mt-2 text-emerald-400">結果:</p>
                  <p>- リビングのみアクセス可</p>
                  <p>- 金庫は開けられない</p>
                  <p>- 期限付き（有効期限あり）</p>
                  <p>- いつでも無効化できる</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* OAuthによる解決 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            OAuth による解決
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            OAuth は「パスワードを渡す代わりに、制限付きのトークン（合鍵）を
            発行する」という仕組みです。これにより、以下が実現されました。
          </p>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6 space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">1.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    最小権限の原則
                  </span>
                  <p className="mt-1">
                    「写真の読み取りのみ」「プロフィール情報のみ」のように、
                    必要最小限の権限だけを許可できます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">2.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    簡単な取り消し
                  </span>
                  <p className="mt-1">
                    パスワードを変更せずに、特定のアプリのアクセスだけを
                    取り消すことができます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">3.</span>
                <div>
                  <span className="font-medium text-zinc-200">
                    パスワード非共有
                  </span>
                  <p className="mt-1">
                    サードパーティアプリはパスワードを知ることなく、
                    必要なデータにアクセスできます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">4.</span>
                <div>
                  <span className="font-medium text-zinc-200">有効期限</span>
                  <p className="mt-1">
                    トークンには有効期限があり、期限が切れると自動的に
                    アクセスできなくなります。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* フロー図 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            OAuth の基本的な流れ
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500">
                  # 写真印刷アプリが Google Photos にアクセスする場合
                </p>
                <p className="mt-4">
                  <span className="text-blue-400">[ユーザー]</span> → 写真印刷アプリを使いたい
                </p>
                <p className="mt-1">
                  <span className="text-amber-400">[印刷アプリ]</span> →
                  「Google Photos へのアクセス許可をください」
                </p>
                <p className="mt-1">
                  <span className="text-blue-400">[ユーザー]</span> → Google
                  のログイン画面で認証
                </p>
                <p className="mt-1">
                  <span className="text-emerald-400">[Google]</span> →
                  「写真の読み取りを許可しますか？」
                </p>
                <p className="mt-1">
                  <span className="text-blue-400">[ユーザー]</span> →
                  「許可する」
                </p>
                <p className="mt-1">
                  <span className="text-emerald-400">[Google]</span> →
                  印刷アプリにアクセストークンを発行
                </p>
                <p className="mt-1">
                  <span className="text-amber-400">[印刷アプリ]</span> →
                  トークンを使って写真を取得
                </p>
                <p className="mt-4 text-zinc-500">
                  # ポイント: ユーザーのパスワードは印刷アプリに渡らない
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">認証 vs 認可</p>
          </div>
          <Link
            href="/concepts/auth-vs-authz"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
