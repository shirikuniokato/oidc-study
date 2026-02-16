import type { FlowStep, Actor } from "@/lib/flows/types";
import { ACTOR_LABELS } from "@/lib/flows/types";
import { cn } from "@/lib/utils";

interface SequenceDiagramProps {
  readonly actors: readonly Actor[];
  readonly steps: readonly FlowStep[];
}

export function SequenceDiagram({ actors, steps }: SequenceDiagramProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <ActorHeaders actors={actors} />
        <div className="relative">
          <ActorLifelines actors={actors} />
          <div className="relative space-y-2 py-4">
            {steps.map((step) => (
              <ArrowRow key={step.id} step={step} actors={actors} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActorHeaders({ actors }: { readonly actors: readonly Actor[] }) {
  const columnWidth = 100 / actors.length;
  return (
    <div className="flex">
      {actors.map((actor) => (
        <div
          key={actor}
          className="flex flex-col items-center"
          style={{ width: `${columnWidth}%` }}
        >
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-xs font-medium text-zinc-200">
            {ACTOR_LABELS[actor]}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActorLifelines({
  actors,
}: {
  readonly actors: readonly Actor[];
}) {
  const columnWidth = 100 / actors.length;
  return (
    <div className="pointer-events-none absolute inset-0 flex" aria-hidden>
      {actors.map((actor) => (
        <div
          key={actor}
          className="flex justify-center"
          style={{ width: `${columnWidth}%` }}
        >
          <div className="h-full w-px border-l border-dashed border-zinc-700/50" />
        </div>
      ))}
    </div>
  );
}

function ArrowRow({
  step,
  actors,
}: {
  readonly step: FlowStep;
  readonly actors: readonly Actor[];
}) {
  const fromIndex = actors.indexOf(step.from);
  const toIndex = actors.indexOf(step.to);
  const isSelfLoop = fromIndex === toIndex;
  const columnWidth = 100 / actors.length;

  if (isSelfLoop) {
    return (
      <SelfLoopArrow
        step={step}
        actorIndex={fromIndex}
        columnWidth={columnWidth}
      />
    );
  }

  const leftIndex = Math.min(fromIndex, toIndex);
  const rightIndex = Math.max(fromIndex, toIndex);
  const goingRight = toIndex > fromIndex;

  const leftPercent = leftIndex * columnWidth + columnWidth / 2;
  const widthPercent = (rightIndex - leftIndex) * columnWidth;

  return (
    <div className="relative flex h-10 items-center">
      <div
        className="absolute flex items-center"
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
        }}
      >
        <div className="relative h-px w-full bg-zinc-500">
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-zinc-500",
              goingRight ? "right-0 translate-x-0" : "left-0 -translate-x-0",
            )}
          >
            {goingRight ? ">" : "<"}
          </span>
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-zinc-400">
            {step.order}. {step.title}
          </span>
        </div>
      </div>
    </div>
  );
}

function SelfLoopArrow({
  step,
  actorIndex,
  columnWidth,
}: {
  readonly step: FlowStep;
  readonly actorIndex: number;
  readonly columnWidth: number;
}) {
  const centerPercent = actorIndex * columnWidth + columnWidth / 2;
  return (
    <div className="relative flex h-10 items-center">
      <div
        className="absolute flex items-center"
        style={{ left: `${centerPercent}%`, transform: "translateX(-50%)" }}
      >
        <div className="rounded border border-dashed border-zinc-600 px-3 py-1 text-[10px] text-zinc-400">
          {step.order}. {step.title}
        </div>
      </div>
    </div>
  );
}
