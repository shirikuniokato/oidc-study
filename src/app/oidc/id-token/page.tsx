import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const standardClaims = [
  {
    name: "iss",
    fullName: "Issuer",
    description: "IDトークンを発行した認可サーバーの識別子（URL）",
    example: '"https://accounts.example.com"',
    required: true,
  },
  {
    name: "sub",
    fullName: "Subject",
    description:
      "ユーザーの一意な識別子。プロバイダー内でユニークであることが保証される",
    example: '"user-12345"',
    required: true,
  },
  {
    name: "aud",
    fullName: "Audience",
    description:
      "このトークンの対象となるクライアントのclient_id。配列の場合もある",
    example: '"my-app-client-id"',
    required: true,
  },
  {
    name: "exp",
    fullName: "Expiration Time",
    description:
      "トークンの有効期限（UNIXタイムスタンプ）。この時刻以降はトークンを受け入れてはならない",
    example: "1700000000",
    required: true,
  },
  {
    name: "iat",
    fullName: "Issued At",
    description: "トークンが発行された時刻（UNIXタイムスタンプ）",
    example: "1699996400",
    required: true,
  },
  {
    name: "nonce",
    fullName: "Nonce",
    description:
      "リプレイ攻撃防止用。認可リクエストで送ったnonceと一致することを検証する",
    example: '"abc123random"',
    required: false,
  },
  {
    name: "auth_time",
    fullName: "Authentication Time",
    description:
      "ユーザーが実際に認証を行った時刻。max_ageを指定した場合は必須",
    example: "1699996000",
    required: false,
  },
] as const;

const validationSteps = [
  {
    step: 1,
    title: "JWTの署名を検証する",
    description:
      "プロバイダーのJWKSエンドポイントから公開鍵を取得し、IDトークンの署名が正しいことを確認する。ヘッダーのkidで鍵を特定する。",
  },
  {
    step: 2,
    title: "issクレームを検証する",
    description:
      "issの値が期待するプロバイダーのURLと一致することを確認する。異なるプロバイダーが発行したトークンを受け入れてはならない。",
  },
  {
    step: 3,
    title: "audクレームを検証する",
    description:
      "audに自分のclient_idが含まれていることを確認する。他のクライアント向けのトークンを受け入れてはならない。",
  },
  {
    step: 4,
    title: "expクレームを検証する",
    description:
      "現在時刻がexpを超えていないことを確認する。クロックスキューを考慮して数分の猶予を持たせることが一般的。",
  },
  {
    step: 5,
    title: "nonceを検証する（使用した場合）",
    description:
      "認可リクエストでnonceを送った場合、IDトークン内のnonceが一致することを確認する。リプレイ攻撃を防止する。",
  },
] as const;

export default function IdTokenPage() {
  return (
    <ContentLayout
      title="IDトークン詳解"
      description="OIDCの中核となるIDトークン。JWT形式の構造、標準クレーム、検証手順を理解しましょう。"
      badge="OIDC"
    >
      {/* IDトークンの構造 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            IDトークンの構造（JWT形式）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            IDトークンは JSON Web Token (JWT) 形式で発行されます。
            JWTはドット（.）で区切られた3つの部分から構成されます。
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
            <span className="text-red-400">eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9</span>
            <span className="text-zinc-500">.</span>
            <span className="text-blue-400">
              eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUifQ
            </span>
            <span className="text-zinc-500">.</span>
            <span className="text-emerald-400">SflKxwRJSMeKKF2QT4fwpM...</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-red-950/20 border border-red-800/30 p-3">
              <p className="font-semibold text-red-400 text-sm mb-1">
                Header
              </p>
              <p className="text-xs text-zinc-400">
                署名アルゴリズム (alg) とトークンタイプ (typ) を含む
              </p>
            </div>
            <div className="rounded-lg bg-blue-950/20 border border-blue-800/30 p-3">
              <p className="font-semibold text-blue-400 text-sm mb-1">
                Payload
              </p>
              <p className="text-xs text-zinc-400">
                ユーザー情報や発行者情報などのクレームを含む
              </p>
            </div>
            <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/30 p-3">
              <p className="font-semibold text-emerald-400 text-sm mb-1">
                Signature
              </p>
              <p className="text-xs text-zinc-400">
                Header + Payload を秘密鍵で署名した値
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 標準クレーム */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            標準クレーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {standardClaims.map((claim) => (
              <div
                key={claim.name}
                className="rounded-lg bg-zinc-950 border border-zinc-800 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-blue-400 font-mono font-semibold">
                    {claim.name}
                  </code>
                  <span className="text-zinc-500 text-sm">
                    ({claim.fullName})
                  </span>
                  {claim.required ? (
                    <Badge variant="destructive">必須</Badge>
                  ) : (
                    <Badge variant="secondary">任意</Badge>
                  )}
                </div>
                <p className="text-zinc-300 text-sm mb-2">
                  {claim.description}
                </p>
                <p className="text-zinc-500 text-xs font-mono">
                  例: {claim.example}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IDトークン vs アクセストークン */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            IDトークン vs アクセストークン
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    アクセストークン
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">目的</td>
                  <td className="py-3 px-4">認証（誰であるか）</td>
                  <td className="py-3 px-4">
                    認可（何ができるか）
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">対象</td>
                  <td className="py-3 px-4">
                    クライアントアプリ
                  </td>
                  <td className="py-3 px-4">
                    リソースサーバー
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">形式</td>
                  <td className="py-3 px-4">JWT（必須）</td>
                  <td className="py-3 px-4">
                    任意（JWT、opaque等）
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    送信先
                  </td>
                  <td className="py-3 px-4">
                    APIに送ってはいけない
                  </td>
                  <td className="py-3 px-4">
                    APIに送る
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">
                    検証者
                  </td>
                  <td className="py-3 px-4">
                    クライアントが検証
                  </td>
                  <td className="py-3 px-4">
                    リソースサーバーが検証
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg bg-red-950/30 border border-red-800/30 p-4">
            <p className="text-red-400 text-sm font-medium">
              IDトークンをAPIのアクセス制御に使ってはいけません。
              IDトークンはクライアントアプリが「誰がログインしたか」を知るためのものです。
              APIへのアクセスにはアクセストークンを使いましょう。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* IDトークンの検証手順 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            IDトークンの検証手順
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationSteps.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-lg bg-zinc-950 border border-zinc-800 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-400 font-semibold text-sm">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 次のステップ */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="pt-6">
          <p className="text-blue-400 font-medium mb-2">次のステップ</p>
          <p className="text-zinc-300">
            IDトークンの仕組みを理解したら、次は{" "}
            <Link
              href="/oidc/discovery"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              ディスカバリドキュメント
            </Link>{" "}
            で、OIDCプロバイダーの自動設定の仕組みを学びましょう。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
