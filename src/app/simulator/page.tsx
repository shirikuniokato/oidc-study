import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimulatorCardInfo {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly badge: string;
  readonly badgeClass: string;
  readonly deprecated?: boolean;
}

const simulatorCards: readonly SimulatorCardInfo[] = [
  {
    id: "authorization-code",
    name: "認可コードフロー",
    description:
      "サーバーサイドアプリ向けの標準的なフロー。認可コードを中間的な資格情報として使用します。",
    badge: "推奨",
    badgeClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: "authorization-code-pkce",
    name: "認可コード + PKCE",
    description:
      "SPA・ネイティブアプリ向け。PKCEでclient_secretなしのセキュリティを実現します。",
    badge: "最推奨",
    badgeClass: "bg-blue-500/15 text-blue-400",
  },
  {
    id: "implicit",
    name: "インプリシットフロー",
    description:
      "認可エンドポイントから直接トークンを返すフロー。セキュリティ上の問題から非推奨。",
    badge: "非推奨",
    badgeClass: "bg-red-500/15 text-red-400",
    deprecated: true,
  },
  {
    id: "client-credentials",
    name: "クライアントクレデンシャル",
    description:
      "ユーザーが関与しないM2M通信向け。クライアント自身の資格情報でトークンを取得します。",
    badge: "M2M",
    badgeClass: "bg-purple-500/15 text-purple-400",
  },
  {
    id: "device-authorization",
    name: "デバイス認可フロー",
    description:
      "スマートTV・IoTなど入力制限のあるデバイス向け。別デバイスのブラウザで認証します。",
    badge: "デバイス",
    badgeClass: "bg-amber-500/15 text-amber-400",
  },
  {
    id: "refresh-token",
    name: "リフレッシュトークン",
    description:
      "アクセストークンの有効期限切れ時に、再認証なしで新しいトークンを取得します。",
    badge: "補助",
    badgeClass: "bg-cyan-500/15 text-cyan-400",
  },
];

export default function SimulatorPage() {
  return (
    <ContentLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            フローシミュレーター
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-400">
            OAuth 2.0 / OpenID Connect
            の各フローをステップバイステップで体験できます。
            各ステップで実際のHTTPリクエスト/レスポンスを確認しながら、
            フローの動作を理解しましょう。
          </p>
        </div>

        <div className="grid gap-4">
          {simulatorCards.map((card) => (
            <SimulatorCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}

function SimulatorCard({
  card,
}: {
  readonly card: SimulatorCardInfo;
}) {
  return (
    <Link href={`/simulator/${card.id}`} className="group">
      <Card
        className={
          card.deprecated
            ? "border-amber-800/50 bg-amber-950/30 transition-colors group-hover:border-amber-700/60 group-hover:bg-amber-950/40"
            : "border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-700 group-hover:bg-zinc-800/80"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-zinc-100 group-hover:text-white">
                {card.name}
              </CardTitle>
              <Badge className={card.badgeClass}>{card.badge}</Badge>
            </div>
            <span className="text-sm text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-zinc-300">
              シミュレーション開始 →
            </span>
          </div>
          <CardDescription className="text-zinc-400">
            {card.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
