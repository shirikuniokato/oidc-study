import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const discoveryFields = [
  {
    name: "issuer",
    description: "プロバイダーの識別子URL",
    required: true,
  },
  {
    name: "authorization_endpoint",
    description: "認可エンドポイントのURL",
    required: true,
  },
  {
    name: "token_endpoint",
    description: "トークンエンドポイントのURL",
    required: true,
  },
  {
    name: "userinfo_endpoint",
    description: "UserInfoエンドポイントのURL",
    required: false,
  },
  {
    name: "jwks_uri",
    description: "JSON Web Key Set (公開鍵) のURL",
    required: true,
  },
  {
    name: "registration_endpoint",
    description: "動的クライアント登録エンドポイントのURL",
    required: false,
  },
  {
    name: "scopes_supported",
    description: "サポートされるスコープの一覧",
    required: false,
  },
  {
    name: "response_types_supported",
    description: 'サポートされるresponse_type値 (例: "code", "id_token")',
    required: true,
  },
  {
    name: "grant_types_supported",
    description:
      'サポートされるgrant_type値 (例: "authorization_code", "refresh_token")',
    required: false,
  },
  {
    name: "subject_types_supported",
    description: 'サポートされるsubject識別子タイプ (例: "public", "pairwise")',
    required: true,
  },
  {
    name: "id_token_signing_alg_values_supported",
    description: "IDトークンの署名に使用されるアルゴリズム (例: RS256)",
    required: true,
  },
  {
    name: "token_endpoint_auth_methods_supported",
    description:
      "トークンエンドポイントの認証方法 (例: client_secret_basic)",
    required: false,
  },
  {
    name: "claims_supported",
    description: "サポートされるクレームの一覧",
    required: false,
  },
  {
    name: "code_challenge_methods_supported",
    description: "サポートされるPKCEメソッド (例: S256)",
    required: false,
  },
] as const;

const discoveryJson = `{
  "issuer": "https://accounts.example.com",
  "authorization_endpoint": "https://accounts.example.com/authorize",
  "token_endpoint": "https://accounts.example.com/token",
  "userinfo_endpoint": "https://accounts.example.com/userinfo",
  "jwks_uri": "https://accounts.example.com/.well-known/jwks.json",
  "registration_endpoint": "https://accounts.example.com/register",
  "scopes_supported": [
    "openid", "profile", "email", "address", "phone"
  ],
  "response_types_supported": [
    "code", "code id_token", "id_token"
  ],
  "grant_types_supported": [
    "authorization_code", "refresh_token"
  ],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic", "client_secret_post"
  ],
  "claims_supported": [
    "sub", "iss", "aud", "exp", "iat",
    "name", "email", "email_verified", "picture"
  ],
  "code_challenge_methods_supported": ["S256"]
}`;

export default function DiscoveryPage() {
  return (
    <ContentLayout
      title="ディスカバリドキュメント"
      description=".well-known/openid-configuration によるOIDCプロバイダーの自動設定の仕組みを学びます。"
      badge="OIDC"
    >
      {/* ディスカバリドキュメントとは */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            ディスカバリドキュメントとは
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            OIDC ディスカバリドキュメントは、OIDCプロバイダーが公開するJSON形式のメタデータです。
            以下のURLで取得できます。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm">
            <span className="text-zinc-500">GET </span>
            <span className="text-blue-400">
              https://accounts.example.com/.well-known/openid-configuration
            </span>
          </div>
          <p>
            このドキュメントを取得するだけで、クライアントはプロバイダーの
            全エンドポイントURL、サポートされる機能、暗号化アルゴリズムなどを
            自動的に知ることができます。
          </p>
        </CardContent>
      </Card>

      {/* なぜ自動設定が重要か */}
      <Card className="bg-emerald-950/30 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">
            なぜ自動設定が重要か
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">1.</span>
              <div>
                <strong className="text-zinc-100">設定ミスの防止</strong>
                <p className="text-sm text-zinc-400 mt-1">
                  エンドポイントURLを手動で設定すると、タイプミスや古いURLの使用が起こりやすい。
                  ディスカバリなら常に最新の正しい設定を取得できる。
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">2.</span>
              <div>
                <strong className="text-zinc-100">
                  プロバイダー切り替えの容易さ
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  issuerのURLを変更するだけで、別のプロバイダーに切り替えられる。
                  個別のエンドポイントURLを調べ直す必要がない。
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">3.</span>
              <div>
                <strong className="text-zinc-100">
                  機能サポートの自動検出
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  PKCEのサポート有無、使用可能な署名アルゴリズム、
                  サポートされるスコープなどを自動的に判断できる。
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">4.</span>
              <div>
                <strong className="text-zinc-100">
                  セキュリティの向上
                </strong>
                <p className="text-sm text-zinc-400 mt-1">
                  公開鍵 (JWKS) のURLも含まれるため、
                  トークン検証に必要な鍵を安全に取得できる。
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* フィールドの説明 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            主要なフィールド
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {discoveryFields.map((field) => (
              <div
                key={field.name}
                className="flex items-start gap-4 rounded-lg bg-zinc-950 border border-zinc-800 p-3"
              >
                <code className="text-blue-400 font-mono text-sm shrink-0 min-w-[280px]">
                  {field.name}
                </code>
                <p className="text-zinc-300 text-sm flex-1">
                  {field.description}
                </p>
                <span
                  className={`text-xs shrink-0 ${field.required ? "text-red-400" : "text-zinc-500"}`}
                >
                  {field.required ? "必須" : "推奨"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 実際のJSONサンプル */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            JSONサンプル
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-300 whitespace-pre">
              {discoveryJson}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 実際のプロバイダーの例 */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-blue-400">
            実際のプロバイダーのディスカバリURL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-sm">
            <p className="text-zinc-400 mb-1"># Google</p>
            <p className="text-zinc-300">
              https://accounts.google.com/.well-known/openid-configuration
            </p>
          </div>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-sm">
            <p className="text-zinc-400 mb-1"># Microsoft</p>
            <p className="text-zinc-300">
              https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
            </p>
          </div>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-sm">
            <p className="text-zinc-400 mb-1"># Auth0 (テナント名を置換)</p>
            <p className="text-zinc-300">
              {"https://{tenant}.auth0.com/.well-known/openid-configuration"}
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
              href="/oidc/userinfo"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              UserInfoエンドポイント
            </Link>{" "}
            で、ユーザー情報を取得する仕組みを学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
