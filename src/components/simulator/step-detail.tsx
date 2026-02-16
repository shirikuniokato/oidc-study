import type { FlowStep } from "@/lib/flows/types";
import { ACTOR_LABELS } from "@/lib/flows/types";

interface StepDetailProps {
  readonly step: FlowStep;
}

export function StepDetail({ step }: StepDetailProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {step.order}
          </span>
          <h3 className="text-lg font-semibold text-zinc-100">{step.title}</h3>
        </div>
        <FlowDirection from={step.from} to={step.to} />
      </div>

      <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>

      <RequestDescription description={step.request.description} />

      {step.securityNotes.length > 0 && (
        <SecurityNotes notes={step.securityNotes} />
      )}
    </div>
  );
}

function FlowDirection({
  from,
  to,
}: {
  readonly from: string;
  readonly to: string;
}) {
  const fromLabel = ACTOR_LABELS[from as keyof typeof ACTOR_LABELS] ?? from;
  const toLabel = ACTOR_LABELS[to as keyof typeof ACTOR_LABELS] ?? to;

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500">
      <span className="rounded bg-zinc-800 px-2 py-0.5">{fromLabel}</span>
      <span>→</span>
      <span className="rounded bg-zinc-800 px-2 py-0.5">{toLabel}</span>
    </div>
  );
}

function RequestDescription({
  description,
}: {
  readonly description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
      <span className="text-xs font-medium text-zinc-500">
        リクエスト概要
      </span>
      <p className="mt-1 text-sm text-zinc-300">{description}</p>
    </div>
  );
}

function SecurityNotes({
  notes,
}: {
  readonly notes: readonly string[];
}) {
  return (
    <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-3">
      <span className="text-xs font-medium text-amber-400">
        セキュリティ注意事項
      </span>
      <ul className="mt-2 space-y-1">
        {notes.map((note) => (
          <li key={note} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className="mt-0.5 text-amber-400">!</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
