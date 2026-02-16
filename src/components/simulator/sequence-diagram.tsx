"use client";

import type { FlowStep, Actor } from "@/lib/flows/types";
import { ACTOR_LABELS } from "@/lib/flows/types";
import { cn } from "@/lib/utils";

interface SimulatorSequenceDiagramProps {
  readonly actors: readonly Actor[];
  readonly steps: readonly FlowStep[];
  readonly currentStep: number;
}

export function SimulatorSequenceDiagram({
  actors,
  steps,
  currentStep,
}: SimulatorSequenceDiagramProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="min-w-[500px]">
        <ActorHeaders actors={actors} />
        <div className="relative">
          <ActorLifelines actors={actors} />
          <div className="relative space-y-1 py-4">
            {steps.map((step, index) => (
              <ArrowRow
                key={step.id}
                step={step}
                actors={actors}
                state={getStepState(index, currentStep)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type StepState = "completed" | "active" | "upcoming";

function getStepState(index: number, currentStep: number): StepState {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "active";
  return "upcoming";
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

function ActorLifelines({ actors }: { readonly actors: readonly Actor[] }) {
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
  state,
}: {
  readonly step: FlowStep;
  readonly actors: readonly Actor[];
  readonly state: StepState;
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
        state={state}
      />
    );
  }

  const leftIndex = Math.min(fromIndex, toIndex);
  const rightIndex = Math.max(fromIndex, toIndex);
  const goingRight = toIndex > fromIndex;

  const leftPercent = leftIndex * columnWidth + columnWidth / 2;
  const widthPercent = (rightIndex - leftIndex) * columnWidth;

  return (
    <div
      className={cn(
        "relative flex h-10 items-center transition-opacity duration-200",
        state === "upcoming" && "opacity-30",
      )}
    >
      <div
        className="absolute flex items-center"
        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      >
        <div
          className={cn(
            "relative h-px w-full transition-colors duration-200",
            state === "active" ? "bg-blue-500" : "bg-zinc-500",
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              state === "active" ? "text-blue-500" : "text-zinc-500",
              goingRight ? "right-0" : "left-0",
            )}
          >
            {goingRight ? ">" : "<"}
          </span>
          <span
            className={cn(
              "absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] transition-colors duration-200",
              state === "active"
                ? "font-semibold text-blue-400"
                : "text-zinc-400",
            )}
          >
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
  state,
}: {
  readonly step: FlowStep;
  readonly actorIndex: number;
  readonly columnWidth: number;
  readonly state: StepState;
}) {
  const centerPercent = actorIndex * columnWidth + columnWidth / 2;
  return (
    <div
      className={cn(
        "relative flex h-10 items-center transition-opacity duration-200",
        state === "upcoming" && "opacity-30",
      )}
    >
      <div
        className="absolute flex items-center"
        style={{ left: `${centerPercent}%`, transform: "translateX(-50%)" }}
      >
        <div
          className={cn(
            "rounded border border-dashed px-3 py-1 text-[10px] transition-colors duration-200",
            state === "active"
              ? "border-blue-500 text-blue-400 font-semibold"
              : "border-zinc-600 text-zinc-400",
          )}
        >
          {step.order}. {step.title}
        </div>
      </div>
    </div>
  );
}
