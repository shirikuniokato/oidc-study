import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function PkcePage() {
  return (
    <ContentLayout
      title="PKCEの仕組み"
      description="認可コード横取り攻撃を防ぐProof Key for Code Exchange (PKCE) の仕組みを詳しく解説します。"
      badge="セキュリティ"
    >
      {/* PKCEが解決する問題 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            PKCEが解決する問題
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            PKCE（Proof Key for Code Exchange、「ピクシー」と読む）は、
            <strong className="text-zinc-100">
              認可コード横取り攻撃
            </strong>
            を防ぐためのセキュリティ拡張です（RFC 7636）。
          </p>
          <p>
            認可コードフローでは、認可サーバーからクライアントに認可コードがリダイレクトで渡されます。
            この時、悪意のあるアプリがリダイレクトを傍受して認可コードを盗み、
            正規のクライアントになりすましてトークンを取得する攻撃が可能です。
          </p>
        </CardContent>
      </Card>

      {/* 認可コード横取り攻撃のシナリオ */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            認可コード横取り攻撃
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p className="text-sm">
            特にモバイルアプリやSPAなどのパブリッククライアントでは、
            client_secret を安全に保持できないため、この攻撃が深刻です。
          </p>
          <div className="space-y-3">
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                1
              </div>
              <p className="text-sm">
                正規のアプリがブラウザで認可リクエストを送信
              </p>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                2
              </div>
              <p className="text-sm">
                ユーザーが認可サーバーで認証・同意する
              </p>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                3
              </div>
              <p className="text-sm">
                認可サーバーがredirect_uriにリダイレクト（認可コード付き）
              </p>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-red-800/50 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-800 text-white font-semibold text-xs">
                !
              </div>
              <p className="text-sm">
                <strong className="text-red-400">
                  悪意のあるアプリがカスタムURLスキームを登録しており、
                  リダイレクトを横取りして認可コードを取得
                </strong>
              </p>
            </div>
            <div className="flex gap-4 rounded-lg bg-zinc-950/50 border border-zinc-800 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950/50 border border-red-800/50 text-red-400 font-semibold text-xs">
                5
              </div>
              <p className="text-sm">
                悪意のあるアプリが認可コードでトークンを取得（client_secretなしで）
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* code_verifier と code_challenge */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            code_verifier と code_challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-blue-400 text-sm mb-2">
                code_verifier
              </h3>
              <p className="text-sm">
                クライアントが生成する暗号的にランダムな文字列。
                43～128文字の英数字および記号（-._~）で構成される。
              </p>
              <div className="mt-2 rounded bg-zinc-900 p-2 font-mono text-xs text-zinc-400 overflow-x-auto">
                dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 text-sm mb-2">
                code_challenge
              </h3>
              <p className="text-sm">
                code_verifierのSHA-256ハッシュをBase64URLエンコードした値。
                認可リクエストに含めて送信する。
              </p>
              <div className="mt-2 rounded bg-zinc-900 p-2 font-mono text-xs text-zinc-400 overflow-x-auto">
                E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* S256メソッド */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            S256メソッド
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            code_challengeの生成には S256 メソッドが推奨されます。
            plain メソッドも仕様上は存在しますが、セキュリティ上の理由から S256 を使うべきです。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`code_challenge = BASE64URL(SHA256(code_verifier))

// 具体的な実装例
async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64
    .replace(/\\+/g, "-")
    .replace(/\\//g, "_")
    .replace(/=+$/, "");
}`}</pre>
          </div>
          <div className="rounded-lg bg-red-950/30 border border-red-800/30 p-4">
            <p className="text-red-400 text-sm">
              plain メソッド（code_challenge = code_verifier）は、
              通信経路上で傍受された場合にcode_verifierが漏洩するため、
              使用してはいけません。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PKCEフロー図 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            PKCEを使ったフロー
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs sm:text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`クライアント                    認可サーバー
    |                                |
    |  1. code_verifier を生成         |
    |  2. code_challenge を計算        |
    |                                |
    |--- 認可リクエスト --------------->|
    |    code_challenge=E9Me...       |
    |    code_challenge_method=S256   |
    |                                |
    |<-- 認可コード -------------------|
    |    code=SplxlOB...              |
    |                                |
    |--- トークンリクエスト ----------->|
    |    code=SplxlOB...              |
    |    code_verifier=dBjf...        |
    |                                |
    |    認可サーバーが検証:            |
    |    SHA256(code_verifier)         |
    |    == 保存していたcode_challenge? |
    |                                |
    |<-- トークンレスポンス ------------|
    |    access_token=...             |
    |    id_token=...                 |`}</pre>
          </div>
          <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/30 p-4">
            <p className="text-emerald-400 text-sm">
              攻撃者が認可コードを横取りしても、code_verifierを知らないため
              トークンリクエストが成功しません。
              code_challengeからcode_verifierを逆算することは
              SHA-256の一方向性により不可能です。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* なぜパブリッククライアントに必須か */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            なぜパブリッククライアントに必須か
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    クライアントタイプ
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    client_secret
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    PKCE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">SPA</td>
                  <td className="py-3 px-4 text-red-400">
                    保持不可
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    必須
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    モバイルアプリ
                  </td>
                  <td className="py-3 px-4 text-red-400">
                    保持不可
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    必須
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    デスクトップアプリ
                  </td>
                  <td className="py-3 px-4 text-red-400">
                    保持不可
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    必須
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">
                    サーバーサイドアプリ
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    保持可
                  </td>
                  <td className="py-3 px-4 text-blue-400">
                    推奨
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
            <p className="text-blue-400 text-sm">
              OAuth 2.1 のドラフトでは、すべてのクライアントタイプでPKCEが必須とされています。
              サーバーサイドアプリであっても、PKCEを使うことが強く推奨されます。
            </p>
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
              href="/security/token-storage"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              トークンの安全な保存方法
            </Link>{" "}
            で、取得したトークンをどこに保存すべきかを学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
