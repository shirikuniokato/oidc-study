import Link from "next/link";
import {
  Shield,
  Key,
  Lock,
  Fingerprint,
  GitBranch,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const phases = [
  {
    number: 1,
    title: "なぜ OAuth が必要か",
    description:
      "パスワード共有の危険性、認証と認可の違い、4つの役割、トークンの基本概念を学びます。",
    icon: Key,
    href: "/concepts/the-problem",
    badge: "基礎",
    topics: [
      "パスワード共有の問題",
      "認証 vs 認可",
      "4つの役割",
      "トークンの概念",
    ],
  },
  {
    number: 2,
    title: "基本フローを理解する",
    description:
      "認可コードフローを中心に、OAuth 2.0 の基本的な仕組みを理解します。",
    icon: GitBranch,
    href: "/flows/authorization-code",
    badge: "コア",
    topics: ["認可コードフロー", "スコープと同意", "トークンレスポンス"],
  },
  {
    number: 3,
    title: "セキュリティを理解する",
    description:
      "state パラメータ、PKCE など、OAuth 2.0 を安全に使うための重要な仕組みを学びます。",
    icon: Shield,
    href: "/security/state-csrf",
    badge: "重要",
    topics: ["state と CSRF", "PKCE", "認可コード + PKCE"],
  },
  {
    number: 4,
    title: "OIDC で認証を追加する",
    description:
      "OAuth だけでは認証できない理由と、OpenID Connect が解決する問題を理解します。",
    icon: Fingerprint,
    href: "/oidc",
    badge: "発展",
    topics: ["なぜ OAuth では認証できないか", "ID トークン", "クレーム", "ディスカバリ"],
  },
  {
    number: 5,
    title: "その他のフロー",
    description:
      "クライアントクレデンシャル、デバイス認可など、ユースケースに応じたフローを学びます。",
    icon: Lock,
    href: "/flows",
    badge: "応用",
    topics: [
      "クライアントクレデンシャル",
      "デバイス認可",
      "リフレッシュトークン",
      "非推奨フロー",
    ],
  },
  {
    number: 6,
    title: "セキュリティ深掘り",
    description:
      "トークンの安全な保存方法、よくある攻撃と対策など、実務で必要な知識を身につけます。",
    icon: AlertTriangle,
    href: "/security",
    badge: "実践",
    topics: [
      "トークン検証",
      "トークン保存",
      "よくある攻撃",
    ],
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <HeroSection />
      <PhaseGrid />
      <QuickLinks />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="mb-16 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
        <Shield size={14} className="text-accent" />
        インタラクティブ学習
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
        OIDC / OAuth 2.0 を
        <br />
        <span className="text-accent">完全に理解する</span>
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        モック OIDC プロバイダーで実際のフローを体験し、JWT
        デコーダーでトークンを分解し、クイズで理解度を確認。段階的に学べるインタラクティブ学習サイトです。
      </p>
    </section>
  );
}

function PhaseGrid() {
  return (
    <section className="mb-16">
      <h2 className="mb-8 text-center text-2xl font-bold">学習ロードマップ</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => (
          <PhaseCard key={phase.number} {...phase} />
        ))}
      </div>
    </section>
  );
}

function PhaseCard({
  number,
  title,
  description,
  icon: Icon,
  href,
  badge,
  topics,
}: (typeof phases)[number]) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors hover:border-accent/40">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Phase {number}
            </span>
            <Badge variant="secondary">{badge}</Badge>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Icon size={18} className="text-accent" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <ul className="mb-4 space-y-1">
            {topics.map((topic) => (
              <li
                key={topic}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="h-1 w-1 rounded-full bg-accent/50" />
                {topic}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
            学習を始める
            <ArrowRight size={14} />
          </span>
        </div>
      </Card>
    </Link>
  );
}

function QuickLinks() {
  const links = [
    {
      label: "シミュレーター",
      description: "OAuth フローを実際に体験",
      href: "/simulator",
    },
    {
      label: "JWT プレイグラウンド",
      description: "トークンをデコード・検証",
      href: "/playground",
    },
    {
      label: "クイズ",
      description: "理解度をテスト",
      href: "/quiz",
    },
  ];

  return (
    <section>
      <h2 className="mb-6 text-center text-2xl font-bold">
        インタラクティブツール
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card className="text-center transition-colors hover:border-accent/40">
              <CardHeader>
                <CardTitle className="text-base">{link.label}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
