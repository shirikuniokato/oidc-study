import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function StateCsrfPage() {
  return (
    <ContentLayout
      title="stateパラメータとCSRF防止"
      description="CSRF攻撃の仕組みと、stateパラメータによる防止方法を具体的なシナリオで理解しましょう。"
      badge="セキュリティ"
    >
      {/* CSRF攻撃とは */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            CSRF攻撃とは何か
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            CSRF（Cross-Site Request Forgery）は、
            <strong className="text-zinc-100">
              攻撃者が被害者のブラウザを利用して、被害者の意図しないリクエストを送信させる攻撃
            </strong>
            です。OAuthのフローにおいては、コールバックURLへのリダイレクトが特に狙われます。
          </p>
        </CardContent>
      </Card>

      {/* 具体的な攻撃シナリオ */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            具体的な攻撃シナリオ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p className="text-sm font-medium text-zinc-100">
            攻撃者のアカウントを被害者に紐付ける攻撃（アカウント乗っ取り）
          </p>
          <div className="space-y-3">
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                1
              </div>
              <div>
                <p className="text-sm">
                  <strong className="text-zinc-100">攻撃者</strong>が
                  正規のOAuthフローを開始し、認可サーバーでログインする
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                2
              </div>
              <div>
                <p className="text-sm">
                  コールバックURLにリダイレクトされる直前で、
                  <strong className="text-zinc-100">
                    認可コード付きのコールバックURLを記録して中断する
                  </strong>
                </p>
                <code className="text-xs text-zinc-500 mt-1 block">
                  https://app.example.com/callback?code=ATTACKERS_CODE
                </code>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                3
              </div>
              <div>
                <p className="text-sm">
                  このURLを被害者に踏ませる（メール、SNS、不正なWebページなど）
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                4
              </div>
              <div>
                <p className="text-sm">
                  被害者のブラウザがコールバックURLにアクセスし、
                  アプリケーションが<strong className="text-zinc-100">
                    攻撃者の認可コードを使ってトークンを取得
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                5
              </div>
              <div>
                <p className="text-sm">
                  被害者のセッションに
                  <strong className="text-red-400">
                    攻撃者のアカウント
                  </strong>
                  が紐付けられる。攻撃者は自分のアカウントで被害者のデータにアクセスできる。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* stateパラメータの役割 */}
      <Card className="bg-emerald-950/30 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">
            stateパラメータの役割
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            stateパラメータは、
            <strong className="text-zinc-100">
              認可リクエストとコールバックを紐付けるためのランダムな値
            </strong>
            です。これにより、コールバックが自分が開始したフローの結果であることを確認できます。
          </p>
          <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4 space-y-3">
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 font-semibold text-xs">
                1
              </div>
              <p className="text-sm">
                クライアントがランダムな state 値を生成し、セッションに保存する
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 font-semibold text-xs">
                2
              </div>
              <p className="text-sm">
                認可リクエストに state パラメータを含めて送信する
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 font-semibold text-xs">
                3
              </div>
              <p className="text-sm">
                認可サーバーは state をそのままコールバックURLに付与して返す
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 font-semibold text-xs">
                4
              </div>
              <p className="text-sm">
                クライアントは、返ってきた state とセッションに保存した値を比較し、
                <strong className="text-zinc-100">一致しなければリクエストを拒否する</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* stateの生成方法と検証方法 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            stateの生成と検証
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">
              state値の生成（推奨）
            </h3>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre text-zinc-300">{`// 暗号的に安全なランダム値を生成
const state = crypto.randomUUID();

// セッションに保存
session.oauthState = state;

// 認可リクエストに含める
const authUrl = new URL("https://auth.example.com/authorize");
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("client_id", "my-app");
authUrl.searchParams.set("redirect_uri", "https://app.example.com/callback");
authUrl.searchParams.set("state", state);`}</pre>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">
              コールバックでの検証
            </h3>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre text-zinc-300">{`// コールバックで受け取ったstateを検証
function handleCallback(callbackParams, session) {
  const returnedState = callbackParams.get("state");
  const savedState = session.oauthState;

  // stateが一致しない場合はCSRF攻撃の可能性
  if (!returnedState || returnedState !== savedState) {
    throw new Error("state mismatch - possible CSRF attack");
  }

  // 使用済みのstateを削除（再利用防止）
  delete session.oauthState;

  // 認可コードの処理を続ける...
}`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* stateがない場合のリスク */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            stateがない場合のリスク
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-red-400 shrink-0">1.</span>
              <div>
                <strong className="text-zinc-100">
                  アカウント紐付け攻撃
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  攻撃者のソーシャルアカウントが被害者のアプリアカウントに紐付けられ、
                  攻撃者がそのアカウントにアクセスできるようになる。
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400 shrink-0">2.</span>
              <div>
                <strong className="text-zinc-100">
                  セッション固定攻撃
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  攻撃者が自分のセッションを被害者に使わせることで、
                  被害者の操作を攻撃者のアカウントで行わせる。
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400 shrink-0">3.</span>
              <div>
                <strong className="text-zinc-100">
                  ログインCSRF
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  被害者が知らないうちに攻撃者のアカウントにログインさせられ、
                  被害者の行動が攻撃者のアカウントに記録される。
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* ベストプラクティス */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-blue-400">
            ベストプラクティス
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              暗号的に安全なランダム値を使う（UUIDv4 や crypto.getRandomValues）
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              state値は最低128ビットのエントロピーを持つ
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              stateは一度使用したら破棄する（再利用しない）
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              stateに有効期限を設定する（長時間放置されたフローは無効にする）
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              SPAの場合、sessionStorageに保存する（タブごとに独立）
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 次のステップ */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="pt-6">
          <p className="text-blue-400 font-medium mb-2">次のステップ</p>
          <p className="text-zinc-300">
            次は{" "}
            <Link
              href="/security/pkce"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              PKCEの仕組み
            </Link>{" "}
            で、認可コード横取り攻撃に対する防御策を学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
