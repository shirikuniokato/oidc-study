import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scopeClaimsMap = [
  {
    scope: "openid",
    description: "OIDC認証の必須スコープ",
    claims: ["sub"],
  },
  {
    scope: "profile",
    description: "基本的なプロフィール情報",
    claims: [
      "name",
      "family_name",
      "given_name",
      "middle_name",
      "nickname",
      "preferred_username",
      "profile",
      "picture",
      "website",
      "gender",
      "birthdate",
      "zoneinfo",
      "locale",
      "updated_at",
    ],
  },
  {
    scope: "email",
    description: "メールアドレス情報",
    claims: ["email", "email_verified"],
  },
  {
    scope: "address",
    description: "住所情報",
    claims: ["address"],
  },
  {
    scope: "phone",
    description: "電話番号情報",
    claims: ["phone_number", "phone_number_verified"],
  },
] as const;

const requestExample = `GET /userinfo HTTP/1.1
Host: accounts.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`;

const responseExample = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "sub": "user-12345",
  "name": "Alice Smith",
  "given_name": "Alice",
  "family_name": "Smith",
  "preferred_username": "alice",
  "email": "alice@example.com",
  "email_verified": true,
  "picture": "https://example.com/alice/photo.jpg",
  "updated_at": 1699900000
}`;

export default function UserInfoPage() {
  return (
    <ContentLayout
      title="UserInfoエンドポイント"
      description="アクセストークンを使ってユーザー情報を取得する標準化されたエンドポイントの仕組みを学びます。"
      badge="OIDC"
    >
      {/* UserInfoエンドポイントの役割 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            UserInfoエンドポイントの役割
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            UserInfoエンドポイントは、OIDCプロバイダーが提供する
            <strong className="text-zinc-100">
              ユーザー情報取得用のAPI
            </strong>
            です。アクセストークンをBearerトークンとして送信することで、
            認証されたユーザーのプロフィール情報を取得できます。
          </p>
          <p>
            このエンドポイントはOIDCの仕様で標準化されており、
            どのプロバイダーでも同じ方法でユーザー情報を取得できます。
          </p>
        </CardContent>
      </Card>

      {/* リクエスト/レスポンスのサンプル */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            リクエストとレスポンス
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">
              リクエスト
            </h3>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-zinc-300 whitespace-pre">
                {requestExample}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">
              レスポンス
            </h3>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-zinc-300 whitespace-pre">
                {responseExample}
              </pre>
            </div>
          </div>
          <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
            <p className="text-blue-400 text-sm">
              POSTメソッドでも取得可能です。その場合、アクセストークンは
              リクエストボディの access_token パラメータとして送信します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* IDトークン内のクレーム vs UserInfo */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            IDトークン vs UserInfo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    項目
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    IDトークン
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    UserInfoエンドポイント
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">取得方法</td>
                  <td className="py-3 px-4">
                    トークンレスポンスに含まれる
                  </td>
                  <td className="py-3 px-4">
                    別途APIリクエストが必要
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">情報量</td>
                  <td className="py-3 px-4">
                    最小限（認証に必要な情報のみ）
                  </td>
                  <td className="py-3 px-4">
                    豊富（スコープに応じて詳細）
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">署名</td>
                  <td className="py-3 px-4">署名あり（JWT）</td>
                  <td className="py-3 px-4">
                    通常は署名なし（HTTPS依存）
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">鮮度</td>
                  <td className="py-3 px-4">
                    発行時点の情報（キャッシュ可）
                  </td>
                  <td className="py-3 px-4">
                    リクエスト時点の最新情報
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">用途</td>
                  <td className="py-3 px-4">
                    認証の証明
                  </td>
                  <td className="py-3 px-4">
                    プロフィール情報の取得
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/30 p-4">
            <p className="text-emerald-400 text-sm font-medium">
              IDトークンは認証の証明として使い、
              詳細なプロフィール情報が必要な場合にUserInfoエンドポイントを呼び出す、
              というのが推奨パターンです。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* スコープに基づく返却クレーム */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            スコープとクレームの対応
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-300 text-sm">
            認可リクエストで指定するスコープによって、
            UserInfoエンドポイントから返却されるクレームが決まります。
          </p>
          {scopeClaimsMap.map((item) => (
            <div
              key={item.scope}
              className="rounded-lg bg-zinc-950 border border-zinc-800 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <code className="text-blue-400 font-mono font-semibold">
                  {item.scope}
                </code>
                <span className="text-zinc-500 text-sm">
                  - {item.description}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.claims.map((claim) => (
                  <Badge key={claim} variant="secondary">
                    {claim}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* エラーレスポンス */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            エラーレスポンス
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <p className="text-sm">
            アクセストークンが無効な場合や権限が不足している場合、
            以下のようなエラーが返されます。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre text-zinc-300">{`HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer error="invalid_token",
  error_description="The access token expired"`}</pre>
          </div>
          <ul className="text-sm space-y-1 text-zinc-400">
            <li>
              <code className="text-red-400">invalid_token</code> -
              トークンが無効または期限切れ
            </li>
            <li>
              <code className="text-red-400">insufficient_scope</code> -
              要求されたクレームに対してスコープが不足
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 次のステップ */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="pt-6">
          <p className="text-blue-400 font-medium mb-2">次のステップ</p>
          <p className="text-zinc-300">
            OIDCの基礎を理解したら、次は{" "}
            <Link
              href="/security"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              セキュリティ
            </Link>{" "}
            セクションで、OAuth/OIDCのセキュリティ対策を学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
