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

const securityTopics = [
  {
    title: "stateパラメータとCSRF防止",
    href: "/security/state-csrf",
    description:
      "CSRF攻撃の仕組みとstateパラメータによる防止方法を学びます。",
    badge: "必須",
    severity: "high",
  },
  {
    title: "PKCEの仕組み",
    href: "/security/pkce",
    description:
      "認可コード横取り攻撃を防ぐPKCEの仕組みを詳しく解説します。",
    badge: "必須",
    severity: "high",
  },
  {
    title: "トークンの安全な保存方法",
    href: "/security/token-storage",
    description:
      "localStorage、Cookie、メモリなど各保存方法のリスクと推奨パターンを比較します。",
    badge: "実践",
    severity: "medium",
  },
  {
    title: "よくある攻撃と対策",
    href: "/security/common-attacks",
    description:
      "トークン漏洩、リプレイ攻撃、フィッシングなど代表的な攻撃と対策を解説します。",
    badge: "必読",
    severity: "high",
  },
] as const;

const checklist = [
  {
    category: "認可リクエスト",
    items: [
      "stateパラメータを生成し、コールバックで検証している",
      "PKCEを使用している（パブリッククライアントでは必須）",
      "redirect_uriを完全一致で検証している",
      "nonceを生成し、IDトークンで検証している",
    ],
  },
  {
    category: "トークン管理",
    items: [
      "アクセストークンをlocalStorageに保存していない",
      "トークンの有効期限を適切に設定している",
      "リフレッシュトークンを安全に保存している",
      "不要になったトークンを失効させている",
    ],
  },
  {
    category: "通信",
    items: [
      "すべての通信がHTTPSで行われている",
      "redirect_uriがHTTPSを使用している（localhostを除く）",
      "CORSポリシーが適切に設定されている",
    ],
  },
  {
    category: "検証",
    items: [
      "IDトークンの署名を検証している",
      "issクレームを検証している",
      "audクレームを検証している",
      "expクレームを検証している",
    ],
  },
] as const;

export default function SecurityPage() {
  return (
    <ContentLayout
      title="セキュリティ"
      description="OAuth 2.0 / OIDC のセキュリティモデルを理解し、安全な実装を行うための知識を身につけましょう。"
    >
      {/* セキュリティモデル概要 */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            OAuth/OIDC のセキュリティモデル
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            OAuth 2.0 と OIDC は、ユーザーのパスワードを第三者に渡さずに
            安全にアクセスを委譲するために設計されています。
            しかし、その実装には多くのセキュリティ上の注意点があります。
          </p>
          <p>
            プロトコル自体は安全に設計されていますが、
            <strong className="text-zinc-100">
              実装の誤り
            </strong>
            によって脆弱性が生まれることが多くあります。
            以下の3つの原則を常に意識しましょう。
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
              <h3 className="font-semibold text-zinc-100 text-sm mb-2">
                1. 最小権限の原則
              </h3>
              <p className="text-xs text-zinc-400">
                必要最小限のスコープのみを要求する。
                不要な権限は攻撃の表面積を広げる。
              </p>
            </div>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
              <h3 className="font-semibold text-zinc-100 text-sm mb-2">
                2. 多層防御
              </h3>
              <p className="text-xs text-zinc-400">
                state、PKCE、nonce など複数のセキュリティ機構を
                組み合わせて使用する。
              </p>
            </div>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
              <h3 className="font-semibold text-zinc-100 text-sm mb-2">
                3. トークンの短命化
              </h3>
              <p className="text-xs text-zinc-400">
                アクセストークンの有効期限は短く設定し、
                リフレッシュトークンで更新する。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 脅威モデル */}
      <Card className="bg-red-950/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-red-400">
            主な脅威
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 p-3">
              <p className="text-sm font-medium text-zinc-100 mb-1">
                認可コードの横取り
              </p>
              <p className="text-xs text-zinc-400">
                攻撃者がリダイレクト時に認可コードを傍受する
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                対策: PKCE
              </p>
            </div>
            <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 p-3">
              <p className="text-sm font-medium text-zinc-100 mb-1">
                CSRF攻撃
              </p>
              <p className="text-xs text-zinc-400">
                攻撃者が偽のコールバックをユーザーに踏ませる
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                対策: stateパラメータ
              </p>
            </div>
            <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 p-3">
              <p className="text-sm font-medium text-zinc-100 mb-1">
                トークン漏洩
              </p>
              <p className="text-xs text-zinc-400">
                XSS等でクライアント側のトークンが盗まれる
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                対策: HttpOnly Cookie / BFFパターン
              </p>
            </div>
            <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 p-3">
              <p className="text-sm font-medium text-zinc-100 mb-1">
                オープンリダイレクト
              </p>
              <p className="text-xs text-zinc-400">
                不正なredirect_uriで認可コードを外部に流出させる
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                対策: redirect_uriの完全一致検証
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* セキュリティトピックへのリンク */}
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          セキュリティトピック
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {securityTopics.map((topic) => (
            <Link key={topic.href} href={topic.href}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-zinc-100">
                      {topic.title}
                    </CardTitle>
                    <Badge
                      variant={
                        topic.severity === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {topic.badge}
                    </Badge>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* セキュリティチェックリスト */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-100">
            セキュリティチェックリスト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklist.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold text-zinc-100 mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3"
                  >
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-zinc-600" />
                    <p className="text-sm text-zinc-300">{item}</p>
                  </div>
                ))}
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
            まずは{" "}
            <Link
              href="/security/state-csrf"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              stateパラメータとCSRF防止
            </Link>{" "}
            から学び始めましょう。OAuthフローで最も基本的なセキュリティ機構です。
          </p>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
