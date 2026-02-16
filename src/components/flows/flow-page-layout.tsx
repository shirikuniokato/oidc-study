import type { FlowDefinition } from "@/lib/flows/types";
import { ContentLayout } from "@/components/layout/content-layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { SequenceDiagram } from "./sequence-diagram";
import { StepDetail } from "./step-detail";

interface FlowPageLayoutProps {
  readonly flow: FlowDefinition;
  readonly deprecated?: boolean;
  readonly children?: React.ReactNode;
}

export function FlowPageLayout({
  flow,
  deprecated = false,
  children,
}: FlowPageLayoutProps) {
  return (
    <ContentLayout section="flows">
      <div className="space-y-8">
        <FlowHeader
          name={flow.name}
          description={flow.description}
          deprecated={deprecated}
        />

        {children}

        <section>
          <h2 className="mb-4 text-xl font-bold text-zinc-100">
            シーケンス図
          </h2>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="pt-6">
              <SequenceDiagram actors={flow.actors} steps={flow.steps} />
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-zinc-100">
            各ステップの詳細
          </h2>
          <div className="space-y-4">
            {flow.steps.map((step) => (
              <StepDetail key={step.id} step={step} />
            ))}
          </div>
        </section>

        <UsageGuide
          whenToUse={flow.whenToUse}
          whenNotToUse={flow.whenNotToUse}
        />
        <SecuritySection considerations={flow.securityConsiderations} />
      </div>
    </ContentLayout>
  );
}

function FlowHeader({
  name,
  description,
  deprecated,
}: {
  readonly name: string;
  readonly description: string;
  readonly deprecated: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-zinc-100">{name}</h1>
        {deprecated && (
          <Badge className="bg-red-500/15 text-red-400">非推奨</Badge>
        )}
      </div>
      <p className="mt-3 text-zinc-400 leading-relaxed">{description}</p>
      {deprecated && (
        <div className="mt-4 rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
          <p className="text-sm font-medium text-amber-300">
            このフローは非推奨です
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            セキュリティ上の問題があるため、新規の実装では使用しないでください。
            代わりに認可コード + PKCE フローを使用してください。
          </p>
        </div>
      )}
    </div>
  );
}

function UsageGuide({
  whenToUse,
  whenNotToUse,
}: {
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="border-emerald-800/30 bg-emerald-950/10">
        <CardHeader>
          <CardTitle className="text-emerald-400">使うべき場面</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {whenToUse.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-emerald-400">+</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-red-800/30 bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-400">使うべきでない場面</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {whenNotToUse.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-red-400">-</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function SecuritySection({
  considerations,
}: {
  readonly considerations: readonly string[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        セキュリティ上の考慮事項
      </h2>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {considerations.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 text-amber-400">!</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
