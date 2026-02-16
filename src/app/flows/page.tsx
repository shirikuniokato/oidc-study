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


interface FlowCardInfo {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly badge: string;
  readonly badgeClass: string;
  readonly deprecated?: boolean;
}

const flowCards: readonly FlowCardInfo[] = [
  {
    id: "authorization-code",
    name: "認可コードフロー",
    description: "サーバーサイドアプリ向けの最も標準的なフロー",
    badge: "推奨",
    badgeClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: "authorization-code-pkce",
    name: "認可コード + PKCE",
    description: "SPA・ネイティブアプリ向け。現在最も推奨されるフロー",
    badge: "最推奨",
    badgeClass: "bg-blue-500/15 text-blue-400",
  },
  {
    id: "implicit",
    name: "インプリシットフロー",
    description: "直接トークンを返す。セキュリティ上の問題から非推奨",
    badge: "非推奨",
    badgeClass: "bg-red-500/15 text-red-400",
    deprecated: true,
  },
  {
    id: "client-credentials",
    name: "クライアントクレデンシャル",
    description: "ユーザーが関与しないサーバー間（M2M）通信向け",
    badge: "M2M",
    badgeClass: "bg-purple-500/15 text-purple-400",
  },
  {
    id: "device-authorization",
    name: "デバイス認可フロー",
    description: "スマートTV・IoTなど入力制限のあるデバイス向け",
    badge: "デバイス",
    badgeClass: "bg-amber-500/15 text-amber-400",
  },
  {
    id: "refresh-token",
    name: "リフレッシュトークン",
    description: "アクセストークンを再認証なしで更新するフロー",
    badge: "補助",
    badgeClass: "bg-cyan-500/15 text-cyan-400",
  },
];

export default function FlowsPage() {
  return (
    <ContentLayout section="flows">
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            OAuth 2.0 フロー
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            OAuth 2.0
            では、アプリケーションの種類や要件に応じて異なるフロー（グラントタイプ）を使用します。
            各フローの仕組みを理解し、適切なフローを選択できるようになりましょう。
          </p>
        </div>

        <FlowCardList />
        <ComparisonTable />
        <FlowSelectionGuide />
      </div>
    </ContentLayout>
  );
}

function FlowCardList() {
  return (
    <div className="grid gap-4">
      {flowCards.map((flow) => (
        <Link
          key={flow.id}
          href={`/flows/${flow.id}`}
          className="group"
        >
          <Card
            className={
              flow.deprecated
                ? "border-amber-800/50 bg-amber-950/30 transition-colors group-hover:border-amber-700/60 group-hover:bg-amber-950/40"
                : "border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-700 group-hover:bg-zinc-800/80"
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-zinc-100 group-hover:text-white">
                    {flow.name}
                  </CardTitle>
                  <Badge className={flow.badgeClass}>{flow.badge}</Badge>
                </div>
                <span className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400">
                  →
                </span>
              </div>
              <CardDescription className="text-zinc-400">
                {flow.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

const comparisonRows = [
  {
    name: "認可コード",
    useCase: "サーバーサイドWebアプリ",
    security: "高",
    securityClass: "text-emerald-400",
    recommendation: "推奨",
    recommendationClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    name: "認可コード + PKCE",
    useCase: "SPA・ネイティブアプリ",
    security: "高",
    securityClass: "text-emerald-400",
    recommendation: "最推奨",
    recommendationClass: "bg-blue-500/15 text-blue-400",
  },
  {
    name: "インプリシット",
    useCase: "（レガシーSPA）",
    security: "低",
    securityClass: "text-red-400",
    recommendation: "非推奨",
    recommendationClass: "bg-red-500/15 text-red-400",
  },
  {
    name: "クライアントクレデンシャル",
    useCase: "サーバー間通信",
    security: "高",
    securityClass: "text-emerald-400",
    recommendation: "用途限定",
    recommendationClass: "bg-purple-500/15 text-purple-400",
  },
  {
    name: "デバイス認可",
    useCase: "IoT・スマートTV",
    security: "中",
    securityClass: "text-amber-400",
    recommendation: "用途限定",
    recommendationClass: "bg-amber-500/15 text-amber-400",
  },
  {
    name: "リフレッシュトークン",
    useCase: "トークン更新",
    security: "中〜高",
    securityClass: "text-emerald-400",
    recommendation: "推奨",
    recommendationClass: "bg-emerald-500/15 text-emerald-400",
  },
] as const;

function ComparisonTable() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">フロー比較表</h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                フロー名
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                ユースケース
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                セキュリティ
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                推奨度
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-zinc-800/50 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-zinc-200">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-zinc-400">{row.useCase}</td>
                <td className={`px-4 py-3 font-medium ${row.securityClass}`}>
                  {row.security}
                </td>
                <td className="px-4 py-3">
                  <Badge className={row.recommendationClass}>
                    {row.recommendation}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FlowSelectionGuide() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        どのフローを使うべきか?
      </h2>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6">
          <div className="space-y-4 text-sm">
            <GuideStep
              question="ユーザーが関与する?"
              yesLabel="はい"
              noLabel="いいえ → クライアントクレデンシャルフロー"
            />
            <GuideStep
              question="ブラウザ/入力機能がある?"
              yesLabel="はい"
              noLabel="いいえ → デバイス認可フロー"
              indent={1}
            />
            <GuideStep
              question="client_secret を安全に保管できる?"
              yesLabel="はい → 認可コードフロー"
              noLabel="いいえ → 認可コード + PKCE フロー"
              indent={2}
            />
            <div className="mt-6 rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
              <p className="font-medium text-amber-300">
                インプリシットフローは使わない
              </p>
              <p className="mt-1 text-zinc-400">
                どのケースでもインプリシットフローは選択肢に入りません。
                レガシーシステムを維持している場合は、認可コード + PKCE
                フローへの移行を検討してください。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GuideStep({
  question,
  yesLabel,
  noLabel,
  indent = 0,
}: {
  readonly question: string;
  readonly yesLabel: string;
  readonly noLabel: string;
  readonly indent?: number;
}) {
  const marginLeft = indent * 24;
  return (
    <div style={{ marginLeft }}>
      <p className="font-medium text-zinc-200">{question}</p>
      <div className="mt-1 flex flex-col gap-1 pl-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">Yes:</span>
          <span className="text-zinc-300">{yesLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">No:</span>
          <span className="text-zinc-300">{noLabel}</span>
        </div>
      </div>
    </div>
  );
}
