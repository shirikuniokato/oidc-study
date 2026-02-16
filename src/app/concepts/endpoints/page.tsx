import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    name: "認可エンドポイント",
    path: "/authorize",
    method: "GET",
    color: "text-blue-400",
    borderColor: "border-blue-900/50",
    description:
      "ユーザーの認証と認可を行うエンドポイント。ブラウザでアクセスし、ログイン画面と同意画面を表示する。",
    params: [
      { name: "response_type", value: "code (認可コードフロー)" },
      { name: "client_id", value: "クライアントの識別子" },
      { name: "redirect_uri", value: "認可後のリダイレクト先" },
      { name: "scope", value: "要求する権限の範囲" },
      { name: "state", value: "CSRF対策のランダム値" },
    ],
  },
  {
    name: "トークンエンドポイント",
    path: "/token",
    method: "POST",
    color: "text-emerald-400",
    borderColor: "border-emerald-900/50",
    description:
      "認可コードをトークンに交換するエンドポイント。サーバー間通信で使用し、ブラウザからは直接アクセスしない。",
    params: [
      { name: "grant_type", value: "authorization_code / refresh_token" },
      { name: "code", value: "認可コード（初回取得時）" },
      { name: "redirect_uri", value: "認可リクエスト時と同じ値" },
      { name: "client_id", value: "クライアントの識別子" },
      { name: "client_secret", value: "クライアントの秘密鍵（機密クライアント）" },
    ],
  },
  {
    name: "ユーザー情報エンドポイント",
    path: "/userinfo",
    method: "GET / POST",
    color: "text-purple-400",
    borderColor: "border-purple-900/50",
    description:
      "アクセストークンを使ってユーザーのプロフィール情報を取得するエンドポイント。IDトークンの補完として使える。",
    params: [
      {
        name: "Authorization",
        value: "Bearer {access_token}（ヘッダーで送信）",
      },
    ],
  },
  {
    name: "JWKS エンドポイント",
    path: "/.well-known/jwks.json",
    method: "GET",
    color: "text-amber-400",
    borderColor: "border-amber-900/50",
    description:
      "トークンの署名を検証するための公開鍵情報 (JSON Web Key Set) を提供するエンドポイント。",
    params: [
      { name: "(パラメータなし)", value: "公開鍵セットをJSON形式で返す" },
    ],
  },
  {
    name: "ディスカバリエンドポイント",
    path: "/.well-known/openid-configuration",
    method: "GET",
    color: "text-cyan-400",
    borderColor: "border-cyan-900/50",
    description:
      "OIDCプロバイダーの設定情報を提供するエンドポイント。各エンドポイントのURL、対応するスコープ、署名アルゴリズムなどが含まれる。",
    params: [
      {
        name: "(パラメータなし)",
        value: "プロバイダーのメタデータをJSON形式で返す",
      },
    ],
  },
  {
    name: "失効エンドポイント",
    path: "/revoke",
    method: "POST",
    color: "text-red-400",
    borderColor: "border-red-900/50",
    description:
      "発行済みのトークンを無効化するエンドポイント。ログアウト時やセキュリティインシデント時に使用する。",
    params: [
      { name: "token", value: "無効化するトークン" },
      {
        name: "token_type_hint",
        value: "access_token / refresh_token",
      },
    ],
  },
];

export default function EndpointsPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-10">
        <div>
          <Badge className="bg-amber-500/15 text-amber-400">実践</Badge>
          <h1 className="mt-3 text-3xl font-bold text-zinc-100">
            各エンドポイント
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0 / OIDC では、複数のエンドポイントが連携して動作します。
            それぞれの役割とパラメータを理解しましょう。
          </p>
        </div>

        {/* 概要図 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            エンドポイントの全体像
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-zinc-400 leading-relaxed">
                <p className="text-zinc-500">
                  # 認可コードフローにおける各エンドポイントの出番
                </p>
                <p className="mt-3">
                  1. <span className="text-cyan-400">[ディスカバリ]</span>{" "}
                  プロバイダーの設定情報を取得
                </p>
                <p>
                  2. <span className="text-blue-400">[認可]</span>{" "}
                  ユーザーの認証と同意取得
                </p>
                <p>
                  3. <span className="text-emerald-400">[トークン]</span>{" "}
                  認可コードをトークンに交換
                </p>
                <p>
                  4. <span className="text-amber-400">[JWKS]</span>{" "}
                  IDトークンの署名を検証
                </p>
                <p>
                  5. <span className="text-purple-400">[ユーザー情報]</span>{" "}
                  追加のプロフィール情報を取得
                </p>
                <p>
                  6. <span className="text-red-400">[失効]</span>{" "}
                  ログアウト時にトークンを無効化
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 各エンドポイントの詳細 */}
        <section className="space-y-6">
          {endpoints.map((endpoint) => (
            <Card
              key={endpoint.path}
              className={`${endpoint.borderColor} bg-zinc-900`}
            >
              <CardHeader>
                <CardTitle className={endpoint.color}>
                  {endpoint.name}
                  <code className="ml-2 text-sm font-normal text-zinc-500">
                    {endpoint.path}
                  </code>
                </CardTitle>
                <Badge variant="outline" className="w-fit">
                  {endpoint.method}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 text-zinc-400">
                <p>{endpoint.description}</p>
                <div>
                  <p className="text-sm font-medium text-zinc-300 mb-2">
                    主要なパラメータ
                  </p>
                  <div className="space-y-2">
                    {endpoint.params.map((param) => (
                      <div
                        key={param.name}
                        className="flex items-start gap-3 text-sm"
                      >
                        <code className="mt-0.5 shrink-0 rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                          {param.name}
                        </code>
                        <span>{param.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ディスカバリの例 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">
            ディスカバリレスポンスの例
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            ディスカバリエンドポイントのレスポンスには、そのプロバイダーが提供する
            すべてのエンドポイントのURLが含まれます。クライアントはまずこの情報を取得して、
            各エンドポイントのURLを把握します。
          </p>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-400 overflow-x-auto">
                <p className="text-zinc-500">
                  // GET /.well-known/openid-configuration
                </p>
                <p className="mt-1">{"{"}</p>
                <p>{"  "}&quot;issuer&quot;: &quot;https://auth.example.com&quot;,</p>
                <p>
                  {"  "}&quot;authorization_endpoint&quot;:
                  &quot;https://auth.example.com/authorize&quot;,
                </p>
                <p>
                  {"  "}&quot;token_endpoint&quot;:
                  &quot;https://auth.example.com/token&quot;,
                </p>
                <p>
                  {"  "}&quot;userinfo_endpoint&quot;:
                  &quot;https://auth.example.com/userinfo&quot;,
                </p>
                <p>
                  {"  "}&quot;jwks_uri&quot;:
                  &quot;https://auth.example.com/.well-known/jwks.json&quot;,
                </p>
                <p>
                  {"  "}&quot;revocation_endpoint&quot;:
                  &quot;https://auth.example.com/revoke&quot;,
                </p>
                <p>
                  {"  "}&quot;scopes_supported&quot;: [&quot;openid&quot;, &quot;profile&quot;,
                  &quot;email&quot;],
                </p>
                <p>
                  {"  "}&quot;response_types_supported&quot;: [&quot;code&quot;],
                </p>
                <p>
                  {"  "}&quot;grant_types_supported&quot;:
                  [&quot;authorization_code&quot;, &quot;refresh_token&quot;]
                </p>
                <p>{"}"}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 次のステップ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Link
            href="/concepts/scopes-and-claims"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            ← 前へ
          </Link>
          <div className="text-right">
            <p className="text-sm text-zinc-500">次のステップ</p>
            <p className="mt-1 font-medium text-zinc-100">
              クライアントタイプ
            </p>
          </div>
          <Link
            href="/concepts/client-types"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            次へ →
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
