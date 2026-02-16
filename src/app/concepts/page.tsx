import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const concepts = [
  {
    href: "/concepts/the-problem",
    step: 1,
    title: "OAuth が解決する問題",
    description:
      "なぜ OAuth が必要なのか？パスワード共有の危険性と、OAuth が生まれた背景を理解します。",
    badge: "入門",
    badgeColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    href: "/concepts/auth-vs-authz",
    step: 2,
    title: "認証 vs 認可",
    description:
      "「あなたは誰？」と「何ができる？」の違い。OAuth と OIDC の役割分担を学びます。",
    badge: "入門",
    badgeColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    href: "/concepts/roles",
    step: 3,
    title: "4つの役割",
    description:
      "リソースオーナー、クライアント、認可サーバー、リソースサーバー。OAuth の登場人物を整理します。",
    badge: "基礎",
    badgeColor: "bg-blue-500/15 text-blue-400",
  },
  {
    href: "/concepts/tokens",
    step: 4,
    title: "トークンの概要",
    description:
      "アクセストークン、IDトークン、リフレッシュトークン。それぞれの役割とライフサイクルを学びます。",
    badge: "基礎",
    badgeColor: "bg-blue-500/15 text-blue-400",
  },
  {
    href: "/concepts/scopes-and-claims",
    step: 5,
    title: "スコープとクレーム",
    description:
      "権限の範囲を定義するスコープと、トークンに含まれる情報であるクレームの関係を理解します。",
    badge: "基礎",
    badgeColor: "bg-blue-500/15 text-blue-400",
  },
  {
    href: "/concepts/endpoints",
    step: 6,
    title: "各エンドポイント",
    description:
      "認可、トークン、ユーザー情報など、OAuth/OIDC で使われる各エンドポイントの役割を学びます。",
    badge: "実践",
    badgeColor: "bg-amber-500/15 text-amber-400",
  },
  {
    href: "/concepts/client-types",
    step: 7,
    title: "クライアントタイプ",
    description:
      "機密クライアントとパブリッククライアント。アプリの種類によるセキュリティの違いを理解します。",
    badge: "実践",
    badgeColor: "bg-amber-500/15 text-amber-400",
  },
];

export default function ConceptsPage() {
  return (
    <ContentLayout section="concepts">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            コンセプトを理解する
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0 と OpenID Connect
            の基本概念を、順番に学んでいきましょう。
            各トピックは前のトピックの知識を前提としているため、上から順に読むことをお勧めします。
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500">難易度:</span>
          <Badge className="bg-emerald-500/15 text-emerald-400">入門</Badge>
          <Badge className="bg-blue-500/15 text-blue-400">基礎</Badge>
          <Badge className="bg-amber-500/15 text-amber-400">実践</Badge>
        </div>

        <div className="grid gap-4">
          {concepts.map((concept) => (
            <Link key={concept.href} href={concept.href} className="group">
              <Card className="border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-700 group-hover:bg-zinc-800/80">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300 group-hover:bg-zinc-700">
                      {concept.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-zinc-100 group-hover:text-white">
                          {concept.title}
                        </CardTitle>
                        <Badge className={concept.badgeColor}>
                          {concept.badge}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1 text-zinc-400">
                        {concept.description}
                      </CardDescription>
                    </div>
                    <span className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400">
                      →
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
