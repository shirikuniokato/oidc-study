import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const oidcTopics = [
  {
    title: "IDトークン",
    href: "/oidc/id-token",
    description:
      "JWT形式のIDトークンの構造、標準クレーム、検証手順を詳しく解説します。",
    badge: "重要",
  },
  {
    title: "ディスカバリドキュメント",
    href: "/oidc/discovery",
    description:
      ".well-known/openid-configuration による自動設定の仕組みを学びます。",
    badge: "実践",
  },
  {
    title: "UserInfoエンドポイント",
    href: "/oidc/userinfo",
    description:
      "ユーザー情報を取得するエンドポイントの使い方とスコープの関係を解説します。",
    badge: "実践",
  },
] as const;

export default function OidcPage() {
  return (
    <ContentLayout
      title="OpenID Connect (OIDC)"
      description="OAuth 2.0 の上に構築された認証レイヤー。OIDCがなぜ必要で、何を追加するのかを理解しましょう。"
    >
      {/* OIDCとは何か */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            OIDCとは何か
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            OpenID Connect (OIDC) は、OAuth 2.0
            プロトコルの上に構築された<strong className="text-zinc-100">認証レイヤー</strong>です。
            OAuth 2.0 が「認可」（リソースへのアクセス権の委譲）を扱うのに対し、
            OIDC は「認証」（ユーザーが誰であるかの確認）を標準化された方法で実現します。
          </p>
          <p>
            OIDC は 2014 年に OpenID Foundation によって策定され、
            Google、Microsoft、Auth0 など多くのプロバイダーが採用しています。
          </p>
        </CardContent>
      </Card>

      {/* OAuthだけでは認証できない理由 */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            OAuth 2.0 だけでは認証できない理由
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            OAuth 2.0 のアクセストークンは「このトークンの持ち主は、特定のリソースにアクセスする権限がある」
            ということしか示しません。以下の重要な情報が欠けています。
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-zinc-100">誰がログインしたのか</strong> -
              アクセストークンにはユーザーの識別情報が含まれる保証がない
            </li>
            <li>
              <strong className="text-zinc-100">いつ認証されたのか</strong> -
              トークンは過去の認証セッションから発行された可能性がある
            </li>
            <li>
              <strong className="text-zinc-100">どのように認証されたのか</strong> -
              パスワード認証なのか、多要素認証なのかわからない
            </li>
            <li>
              <strong className="text-zinc-100">トークンの対象者</strong> -
              アクセストークンは特定のクライアント向けとは限らない
            </li>
          </ul>
          <div className="mt-4 rounded-lg bg-red-950/40 border border-red-800/30 p-4">
            <p className="text-red-400 text-sm font-medium">
              OAuth 2.0 のアクセストークンを認証に流用すると、
              トークン置換攻撃やトークン横取りなど、深刻なセキュリティ問題が発生します。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* OIDCが追加するもの */}
      <Card className="bg-emerald-950/30 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-400">
            OIDCが追加するもの
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-zinc-300 leading-relaxed">
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-zinc-100 mb-2">
                1. IDトークン (ID Token)
              </h3>
              <p>
                JWT 形式のトークンで、ユーザーの認証情報を含みます。
                誰が (sub)、いつ (iat/auth_time)、どのクライアント向けに (aud)
                認証されたかを暗号的に証明します。
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-zinc-100 mb-2">
                2. UserInfoエンドポイント
              </h3>
              <p>
                アクセストークンを使ってユーザーのプロフィール情報
                （名前、メールアドレスなど）を取得できる標準化されたエンドポイントです。
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-zinc-100 mb-2">
                3. ディスカバリドキュメント
              </h3>
              <p>
                .well-known/openid-configuration により、
                プロバイダーのエンドポイントや対応機能を自動的に取得できます。
                手動設定が不要になり、設定ミスを防ぎます。
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-zinc-100 mb-2">
                4. 標準化されたスコープ
              </h3>
              <p>
                openid, profile, email, address, phone
                といった標準スコープが定義されており、
                プロバイダー間で一貫したユーザー情報の取得が可能です。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OAuth 2.0 vs OIDC 比較表 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            OAuth 2.0 vs OIDC
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
                    OAuth 2.0
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    OIDC
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">目的</td>
                  <td className="py-3 px-4">認可（アクセス委譲）</td>
                  <td className="py-3 px-4">認証 + 認可</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    発行トークン
                  </td>
                  <td className="py-3 px-4">アクセストークン</td>
                  <td className="py-3 px-4">
                    IDトークン + アクセストークン
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    ユーザー情報
                  </td>
                  <td className="py-3 px-4">標準なし</td>
                  <td className="py-3 px-4">
                    UserInfoエンドポイント
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-zinc-100">
                    プロバイダー設定
                  </td>
                  <td className="py-3 px-4">手動</td>
                  <td className="py-3 px-4">ディスカバリで自動</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-100">
                    トークン形式
                  </td>
                  <td className="py-3 px-4">規定なし</td>
                  <td className="py-3 px-4">
                    IDトークンはJWT必須
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* サブページへのリンク */}
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          OIDCを深く理解する
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {oidcTopics.map((topic) => (
            <Link key={topic.href} href={topic.href}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-zinc-100">
                      {topic.title}
                    </CardTitle>
                    <Badge variant="secondary">{topic.badge}</Badge>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 次のステップ */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="pt-6">
          <p className="text-blue-400 font-medium mb-2">次のステップ</p>
          <p className="text-zinc-300">
            まずは{" "}
            <Link
              href="/oidc/id-token"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              IDトークン
            </Link>{" "}
            から学び始めましょう。OIDCの中核となるトークンの仕組みを理解することが、
            全体を理解する鍵です。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
