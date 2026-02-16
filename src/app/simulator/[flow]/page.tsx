"use client";

import { use } from "react";
import Link from "next/link";
import { ALL_FLOWS } from "@/lib/flows";
import type { FlowDefinition } from "@/lib/flows/types";
import { useFlowSimulator } from "@/hooks/use-flow-simulator";
import { FlowStepper } from "@/components/simulator/flow-stepper";
import { SimulatorSequenceDiagram } from "@/components/simulator/sequence-diagram";
import { RequestInspector } from "@/components/simulator/request-inspector";
import { StepDetail } from "@/components/simulator/step-detail";
import { Button } from "@/components/ui/button";

const FLOW_MAP: ReadonlyMap<string, FlowDefinition> = new Map(
  ALL_FLOWS.map((flow) => [flow.id, flow]),
);

export default function SimulatorFlowPage({
  params,
}: {
  readonly params: Promise<{ flow: string }>;
}) {
  const { flow: flowId } = use(params);
  const flowDefinition = FLOW_MAP.get(flowId);

  if (!flowDefinition) {
    return <FlowNotFound flowId={flowId} />;
  }

  return <SimulatorView flow={flowDefinition} />;
}

function SimulatorView({ flow }: { readonly flow: FlowDefinition }) {
  const simulator = useFlowSimulator(flow);
  const currentFlowStep = flow.steps[simulator.currentStep];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <SimulatorHeader flow={flow} />

      <div className="mt-6">
        <FlowStepper
          currentStep={simulator.currentStep}
          totalSteps={flow.steps.length}
          isRunning={simulator.isRunning}
          onPrev={simulator.prevStep}
          onNext={simulator.nextStep}
          onRun={simulator.runCurrentStep}
          onReset={simulator.reset}
        />
      </div>

      {simulator.error && <ErrorBanner message={simulator.error} />}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SimulatorSequenceDiagram
            actors={flow.actors}
            steps={flow.steps}
            currentStep={simulator.currentStep}
          />
          {currentFlowStep && <StepDetail step={currentFlowStep} />}
        </div>
        <div>
          {currentFlowStep && (
            <RequestInspector
              step={currentFlowStep}
              response={simulator.responses.get(simulator.currentStep)}
            />
          )}
        </div>
      </div>

      <FlowMetadata flow={flow} />
    </div>
  );
}

function SimulatorHeader({ flow }: { readonly flow: FlowDefinition }) {
  return (
    <div>
      <Link
        href="/simulator"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        ← シミュレーター一覧
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-zinc-100">{flow.name}</h1>
      <p className="mt-1 text-sm text-zinc-400">{flow.description}</p>
    </div>
  );
}

function ErrorBanner({ message }: { readonly message: string }) {
  return (
    <div className="mt-4 rounded-lg border border-red-800/50 bg-red-950/30 px-4 py-3">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}

function FlowMetadata({ flow }: { readonly flow: FlowDefinition }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      <MetadataCard title="使用すべき場面" items={flow.whenToUse} />
      <MetadataCard title="使用すべきでない場面" items={flow.whenNotToUse} />
      <MetadataCard
        title="セキュリティ考慮事項"
        items={flow.securityConsiderations}
        variant="warning"
      />
    </div>
  );
}

function MetadataCard({
  title,
  items,
  variant = "default",
}: {
  readonly title: string;
  readonly items: readonly string[];
  readonly variant?: "default" | "warning";
}) {
  const borderClass =
    variant === "warning"
      ? "border-amber-800/50 bg-amber-950/20"
      : "border-zinc-800 bg-zinc-900/50";

  return (
    <div className={`rounded-xl border p-4 ${borderClass}`}>
      <h3
        className={`mb-3 text-sm font-semibold ${
          variant === "warning" ? "text-amber-400" : "text-zinc-300"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-zinc-400">
            <span className="mt-0.5 shrink-0">
              {variant === "warning" ? "!" : "-"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowNotFound({ flowId }: { readonly flowId: string }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-zinc-100">
        フローが見つかりません
      </h1>
      <p className="mt-2 text-zinc-400">
        「{flowId}」に該当するフローは存在しません。
      </p>
      <div className="mt-6">
        <Link href="/simulator">
          <Button variant="outline">シミュレーター一覧に戻る</Button>
        </Link>
      </div>
    </div>
  );
}
