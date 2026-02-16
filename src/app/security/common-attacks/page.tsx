import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const attacks = [
  {
    name: "トークン漏洩",
    severity: "critical",
    scenario:
      "XSS攻撃、安全でないストレージ、ログへの出力、リファラヘッダーなどを通じて、アクセストークンやリフレッシュトークンが第三者に漏洩する。",
    countermeasures: [
      "トークンをlocalStorageに保存しない（HttpOnly Cookieまたはメモリ保存）",
      "トークンをURLのクエリパラメータに含めない",
      "ログにトークンを出力しない",
      "アクセストークンの有効期限を短く設定する（5～15分）",
      "トークンの失効（revocation）機能を実装する",
    ],
  },
  {
    name: "リプレイ攻撃",
    severity: "high",
    scenario:
      "攻撃者が過去のリクエストやトークンを再利用して、不正にリソースにアクセスする。IDトークンの場合、過去に傍受したトークンを使って認証をバイパスする。",
    countermeasures: [
      "nonce パラメータを使用し、IDトークンでの一致を検証する",
      "認可コードは一度使用したら即座に無効化する",
      "トークンの exp クレームを検証する",
      "jti（JWT ID）クレームでトークンの一意性を検証する",
      "TLS を使用して通信経路上での傍受を防止する",
    ],
  },
  {
    name: "フィッシング攻撃",
    severity: "high",
    scenario:
      "攻撃者が正規の認可サーバーに似せた偽のログインページを作成し、ユーザーのクレデンシャルを盗む。OAuthの認可フローでは、ユーザーが外部サイトにリダイレクトされることが普通であるため、フィッシングに気づきにくい。",
    countermeasures: [
      "redirect_uri を完全一致で検証する（ワイルドカードを使わない）",
      "認可サーバーのURLが正しいことをユーザーに確認させるUI設計",
      "登録済みの redirect_uri のみを許可する",
      "iss パラメータ（RFC 9207）で認可サーバーの正当性を検証する",
    ],
  },
  {
    name: "オープンリダイレクト",
    severity: "high",
    scenario:
      "redirect_uri の検証が不十分な場合、攻撃者が任意のURLにリダイレクトさせることで、認可コードやトークンを外部に流出させる。",
    countermeasures: [
      "redirect_uri を事前登録し、完全一致で検証する",
      "パス部分の比較にも厳密一致を使う（前方一致ではなく）",
      "ワイルドカードやパターンマッチを redirect_uri の検証に使わない",
      "フラグメント (#) を含む redirect_uri を拒否する",
    ],
  },
  {
    name: "クリックジャッキング",
    severity: "medium",
    scenario:
      "攻撃者が透明なiframeで認可サーバーの同意画面を埋め込み、ユーザーが気づかずに「許可」ボタンをクリックさせる。これにより、ユーザーの意図しない認可が行われる。",
    countermeasures: [
      "認可サーバーで X-Frame-Options: DENY ヘッダーを設定する",
      "Content-Security-Policy: frame-ancestors 'none' を設定する",
      "フレームバスティングスクリプトを実装する",
      "ユーザーの操作を必要とするインタラクティブな同意画面を使う",
    ],
  },
] as const;

function severityLabel(severity: string) {
  switch (severity) {
    case "critical":
      return { text: "Critical", variant: "destructive" as const };
    case "high":
      return { text: "High", variant: "destructive" as const };
    default:
      return { text: "Medium", variant: "secondary" as const };
  }
}

export default function CommonAttacksPage() {
  return (
    <ContentLayout
      title="よくある攻撃と対策"
      description="OAuth 2.0 / OIDC に対する代表的な攻撃パターンと、その防御方法を学びます。"
      badge="セキュリティ"
    >
      {/* 概要 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            OAuth/OIDCに対する攻撃
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300 leading-relaxed">
          <p>
            OAuth 2.0 と OIDC はセキュリティを重視して設計されていますが、
            実装の誤りや設定の不備により脆弱性が生まれることがあります。
            ここでは代表的な攻撃パターンと、その具体的な対策を解説します。
          </p>
        </CardContent>
      </Card>

      {/* 各攻撃 */}
      {attacks.map((attack) => {
        const label = severityLabel(attack.severity);
        return (
          <Card key={attack.name} className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl text-zinc-100">
                  {attack.name}
                </CardTitle>
                <Badge variant={label.variant}>{label.text}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 攻撃シナリオ */}
              <div className="rounded-lg bg-red-950/20 border border-red-800/30 p-4">
                <h3 className="text-sm font-medium text-red-400 mb-2">
                  攻撃シナリオ
                </h3>
                <p className="text-sm text-zinc-300">{attack.scenario}</p>
              </div>

              {/* 対策 */}
              <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/30 p-4">
                <h3 className="text-sm font-medium text-emerald-400 mb-3">
                  対策
                </h3>
                <ul className="space-y-2">
                  {attack.countermeasures.map((measure) => (
                    <li
                      key={measure}
                      className="flex gap-2 text-sm text-zinc-300"
                    >
                      <span className="text-emerald-400 shrink-0">-</span>
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 追加のセキュリティ推奨事項 */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-blue-400">
            追加のセキュリティ推奨事項
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              すべての通信にHTTPSを使用する
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              セキュリティヘッダー（CSP, HSTS, X-Content-Type-Options）を設定する
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              定期的に依存パッケージの脆弱性をスキャンする
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              OAuthライブラリは実績のあるものを使い、自前実装は避ける
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              OAuth 2.1 のベストプラクティスに従う
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">-</span>
              トークンのスコープは必要最小限にする（最小権限の原則）
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* まとめ */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            セキュリティ対策のまとめ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    攻撃
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    主な対策
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">CSRF</td>
                  <td className="py-3 px-4">
                    state パラメータ
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    認可コード横取り
                  </td>
                  <td className="py-3 px-4">PKCE</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    トークン漏洩
                  </td>
                  <td className="py-3 px-4">
                    HttpOnly Cookie / BFF パターン
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    リプレイ攻撃
                  </td>
                  <td className="py-3 px-4">
                    nonce / jti / exp 検証
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    オープンリダイレクト
                  </td>
                  <td className="py-3 px-4">
                    redirect_uri の完全一致検証
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">
                    クリックジャッキング
                  </td>
                  <td className="py-3 px-4">
                    X-Frame-Options / CSP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 次のステップ */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="pt-6">
          <p className="text-blue-400 font-medium mb-2">次のステップ</p>
          <p className="text-zinc-300">
            セキュリティの基礎を理解したら、{" "}
            <Link
              href="/simulator"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              シミュレーター
            </Link>{" "}
            で実際のOAuthフローを体験し、学んだセキュリティ機構がどのように
            動作するかを確認しましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
