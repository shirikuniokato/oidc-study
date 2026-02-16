import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClientTypesPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-amber-500/15 text-amber-400">実践</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            クライアントタイプ
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0 では、クライアント（アプリケーション）を2つのタイプに分類します。
            この分類は、セキュリティの考え方やフローの選択に大きく影響します。
          </p>
        </div>

        {/* 2つのタイプ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            なぜ分類するのか？
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            クライアントタイプの分類は、
            「クライアントシークレット（秘密鍵）を安全に保管できるかどうか」
            で決まります。秘密鍵を安全に保管できないアプリケーションには、
            異なるセキュリティ対策が必要です。
          </p>
        </section>

        {/* 機密クライアント */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            機密クライアント (Confidential Client)
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            サーバーサイドで動作し、クライアントシークレットを安全に保管できるアプリケーションです。
          </p>

          <Card className="border-emerald-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-emerald-400">特徴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    シークレットを安全に保管
                  </span>
                  : サーバー側の環境変数やシークレットマネージャーに保存。
                  ユーザーのブラウザからはアクセスできない。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    トークン交換がサーバー間で行われる
                  </span>
                  : 認可コードからトークンへの交換は、バックエンドサーバーから直接認可サーバーに通信する。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    リフレッシュトークンを安全に利用できる
                  </span>
                  : 長期間有効なリフレッシュトークンもサーバー側で管理。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">具体例</p>
              <div className="space-y-2 text-zinc-400">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500/15 text-emerald-400">
                    サーバー
                  </Badge>
                  <span>Next.js / Rails / Django のサーバーサイドアプリ</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500/15 text-emerald-400">
                    サーバー
                  </Badge>
                  <span>バックエンド API サーバー</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500/15 text-emerald-400">
                    サーバー
                  </Badge>
                  <span>バッチ処理 / デーモンプロセス</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* パブリッククライアント */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-400">
            パブリッククライアント (Public Client)
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            ユーザーのデバイス上で動作し、クライアントシークレットを安全に保管できないアプリケーションです。
            ソースコードやネットワーク通信がユーザーに見える環境で動作します。
          </p>

          <Card className="border-amber-900/50 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-amber-400">特徴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    シークレットを持てない
                  </span>
                  : JavaScript のソースコードやモバイルアプリのバイナリは解析可能。
                  埋め込んだシークレットは秘密にならない。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    PKCE が必須
                  </span>
                  : シークレットの代わりに PKCE (Proof Key for Code Exchange)
                  を使って、認可コードの横取りを防ぐ。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400">-</span>
                <p>
                  <span className="font-medium text-zinc-200">
                    トークンの扱いに注意が必要
                  </span>
                  : ブラウザの localStorage や sessionStorage
                  に保存するトークンは、XSS攻撃で窃取されるリスクがある。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">具体例</p>
              <div className="space-y-2 text-zinc-400">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500/15 text-amber-400">
                    ブラウザ
                  </Badge>
                  <span>React / Vue / Angular の SPA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500/15 text-amber-400">
                    モバイル
                  </Badge>
                  <span>iOS / Android のネイティブアプリ</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500/15 text-amber-400">
                    デスクトップ
                  </Badge>
                  <span>Electron アプリ / CLI ツール</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 比較表 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            セキュリティの違い
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
                      機密クライアント
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-amber-400">
                      パブリッククライアント
                    </th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      シークレット
                    </td>
                    <td className="px-4 py-3">安全に保管可能</td>
                    <td className="px-4 py-3">保管不可</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      PKCE
                    </td>
                    <td className="px-4 py-3">推奨</td>
                    <td className="px-4 py-3">必須</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      リフレッシュトークン
                    </td>
                    <td className="px-4 py-3">安全に利用可能</td>
                    <td className="px-4 py-3">ローテーション必須</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      トークン保管場所
                    </td>
                    <td className="px-4 py-3">サーバーのメモリ/DB</td>
                    <td className="px-4 py-3">ブラウザ/デバイス</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-zinc-300">
                      推奨フロー
                    </td>
                    <td className="px-4 py-3">認可コード + シークレット</td>
                    <td className="px-4 py-3">認可コード + PKCE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* フロー選択への影響 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            フロー選択への影響
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500"># どのフローを選ぶべきか？</p>
                <p className="mt-3">
                  <span className="text-emerald-400">
                    サーバーサイドアプリ（機密）
                  </span>
                </p>
                <p>→ 認可コードフロー + クライアントシークレット</p>
                <p>→ 最も安全。バックチャネルでトークン交換。</p>
                <p className="mt-3">
                  <span className="text-amber-400">
                    SPA・モバイルアプリ（パブリック）
                  </span>
                </p>
                <p>→ 認可コードフロー + PKCE</p>
                <p>→ シークレット不要。コード横取り攻撃を防止。</p>
                <p className="mt-3 text-red-400">
                  非推奨: インプリシットフロー
                </p>
                <p className="text-zinc-500">
                  → セキュリティ上の問題が多く、現在は推奨されない。
                </p>
                <p className="text-zinc-500">
                  → 代わりに認可コード + PKCE を使うべき。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* まとめ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">まとめ</h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6 space-y-3 text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">1.</span>
                <p>
                  クライアントタイプの分類は
                  <span className="font-medium text-zinc-200">
                    シークレットを安全に保管できるかどうか
                  </span>
                  で決まる
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">2.</span>
                <p>
                  パブリッククライアントでは
                  <span className="font-medium text-zinc-200">
                    PKCE が必須
                  </span>
                  （機密クライアントでも推奨）
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">3.</span>
                <p>
                  どちらのタイプでも、現在は
                  <span className="font-medium text-zinc-200">
                    認可コードフロー
                  </span>
                  が推奨される
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ナビゲーション */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/endpoints"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">
              フロー一覧
            </p>
          </div>
          <Link
            href="/flows"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
