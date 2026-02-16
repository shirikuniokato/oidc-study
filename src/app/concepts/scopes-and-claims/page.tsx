import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const standardScopes = [
  {
    name: "openid",
    description: "OIDC を使うことを示す必須スコープ。IDトークンが返される。",
    required: true,
  },
  {
    name: "profile",
    description: "名前、ニックネーム、写真などのプロフィール情報。",
    required: false,
  },
  {
    name: "email",
    description: "メールアドレスとメール確認状態。",
    required: false,
  },
  {
    name: "address",
    description: "住所情報。",
    required: false,
  },
  {
    name: "phone",
    description: "電話番号と電話番号確認状態。",
    required: false,
  },
  {
    name: "offline_access",
    description: "リフレッシュトークンの発行を要求する。",
    required: false,
  },
];

const standardClaims = [
  { name: "sub", description: "ユーザーの一意識別子", scope: "openid" },
  { name: "name", description: "フルネーム", scope: "profile" },
  { name: "given_name", description: "名", scope: "profile" },
  { name: "family_name", description: "姓", scope: "profile" },
  { name: "picture", description: "プロフィール画像のURL", scope: "profile" },
  { name: "email", description: "メールアドレス", scope: "email" },
  {
    name: "email_verified",
    description: "メール確認済みかどうか",
    scope: "email",
  },
  { name: "iss", description: "トークン発行者", scope: "(必須)" },
  { name: "aud", description: "トークンの対象者", scope: "(必須)" },
  { name: "exp", description: "有効期限", scope: "(必須)" },
  { name: "iat", description: "発行日時", scope: "(必須)" },
];

export default function ScopesAndClaimsPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-blue-500/15 text-blue-400">基礎</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            スコープとクレーム
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            スコープは「何を許可するか」を定義し、
            クレームは「トークンに何が含まれるか」を表します。
            この2つの関係を理解することが、OIDC を使いこなす鍵です。
          </p>
        </div>

        {/* スコープ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            スコープ (Scope) - 権限の範囲
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            スコープは、クライアントがアクセスしたい情報や操作の「範囲」を宣言するものです。
            ユーザーは認可画面で、どのスコープを許可するか選択できます。
          </p>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">例え話</p>
              <div className="rounded-lg bg-zinc-950 p-4 text-zinc-400">
                <p>
                  スコープは「注文書」のようなもの。レストランで「ドリンクメニューだけ見せてください」
                  と頼むのと、「全メニュー見せてください」と頼むのでは、見られる範囲が違います。
                  スコープで「何を要求するか」を明確にし、お客さん（ユーザー）が承認します。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-zinc-100">
                OIDC 標準スコープ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {standardScopes.map((scope) => (
                  <div
                    key={scope.name}
                    className="flex items-start gap-3 text-zinc-400"
                  >
                    <code className="mt-0.5 shrink-0 rounded bg-zinc-800 px-2 py-0.5 text-sm font-medium text-emerald-400">
                      {scope.name}
                    </code>
                    <div className="flex-1">
                      <p>{scope.description}</p>
                      {scope.required && (
                        <Badge className="mt-1 bg-red-500/15 text-red-400">
                          必須
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 mb-2">
                認可リクエストでのスコープ指定
              </p>
              <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-400 overflow-x-auto">
                <p className="text-zinc-500"># 認可エンドポイントへのリクエスト</p>
                <p className="mt-2">
                  GET /authorize?
                </p>
                <p>
                  {"  "}response_type=code&
                </p>
                <p>
                  {"  "}client_id=my-app&
                </p>
                <p>
                  {"  "}scope=
                  <span className="text-emerald-400">
                    openid profile email
                  </span>
                  &
                </p>
                <p>{"  "}redirect_uri=https://my-app.com/callback</p>
                <p className="mt-3 text-zinc-500">
                  # スコープはスペース区切りで複数指定可能
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* クレーム */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            クレーム (Claim) - トークンに含まれる情報
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            クレームは、トークン（特にIDトークン）の中に含まれる個々の情報のことです。
            「名前」「メールアドレス」「発行者」「有効期限」などが、それぞれ1つのクレームです。
          </p>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-zinc-100">主要なクレーム</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="overflow-hidden rounded-lg border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950">
                        <th className="px-3 py-2 text-left font-medium text-zinc-300">
                          クレーム
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-zinc-300">
                          説明
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-zinc-300">
                          スコープ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                      {standardClaims.map((claim) => (
                        <tr
                          key={claim.name}
                          className="border-b border-zinc-800/50"
                        >
                          <td className="px-3 py-2">
                            <code className="text-blue-400">{claim.name}</code>
                          </td>
                          <td className="px-3 py-2">{claim.description}</td>
                          <td className="px-3 py-2">
                            <code className="text-emerald-400">
                              {claim.scope}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 関係 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            スコープとクレームの関係
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            スコープを要求すると、そのスコープに対応するクレームがトークンに含まれます。
            つまり、スコープは「クレームのグループ」と考えることができます。
          </p>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500">
                  # scope=openid profile email を要求した場合
                </p>
                <p className="mt-3">
                  <span className="text-emerald-400">openid</span> → sub
                </p>
                <p>
                  <span className="text-emerald-400">profile</span> → name,
                  given_name, family_name, picture, ...
                </p>
                <p>
                  <span className="text-emerald-400">email</span> → email,
                  email_verified
                </p>
                <p className="mt-3 text-zinc-500"># IDトークンのペイロード</p>
                <p className="mt-1">{"{"}</p>
                <p>{"  "}&quot;sub&quot;: &quot;user-123&quot;,</p>
                <p>
                  {"  "}&quot;name&quot;: &quot;田中太郎&quot;,
                </p>
                <p>
                  {"  "}&quot;email&quot;: &quot;tanaka@example.com&quot;,
                </p>
                <p>{"  "}&quot;email_verified&quot;: true,</p>
                <p>{"  "}&quot;iss&quot;: &quot;https://auth.example.com&quot;,</p>
                <p>{"  "}&quot;aud&quot;: &quot;my-app&quot;,</p>
                <p>{"  "}&quot;exp&quot;: 1700000000,</p>
                <p>{"  "}&quot;iat&quot;: 1699996400</p>
                <p>{"}"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6 space-y-3 text-zinc-400">
              <p className="font-medium text-zinc-200">覚えておきたいポイント</p>
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">1.</span>
                <p>
                  <code className="text-emerald-400">openid</code>{" "}
                  スコープがないと OIDC として扱われない（純粋な OAuth 2.0 になる）
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">2.</span>
                <p>
                  プロバイダーによっては独自のスコープやクレームを提供している
                  （例: Google の{" "}
                  <code className="text-emerald-400">
                    https://www.googleapis.com/auth/drive.readonly
                  </code>
                  ）
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-500">3.</span>
                <p>
                  最小権限の原則に従い、必要なスコープだけを要求すべき
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/tokens"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">
              各エンドポイント
            </p>
          </div>
          <Link
            href="/concepts/endpoints"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
