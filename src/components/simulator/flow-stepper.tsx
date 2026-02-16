"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlowStepperProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly isRunning: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onRun: () => void;
  readonly onReset: () => void;
}

export function FlowStepper({
  currentStep,
  totalSteps,
  isRunning,
  onPrev,
  onNext,
  onRun,
  onReset,
}: FlowStepperProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        progressPercent={progressPercent}
      />
      <StepButtons
        isFirst={isFirst}
        isLast={isLast}
        isRunning={isRunning}
        onPrev={onPrev}
        onNext={onNext}
        onRun={onRun}
        onReset={onReset}
      />
    </div>
  );
}

function ProgressBar({
  currentStep,
  totalSteps,
  progressPercent,
}: {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly progressPercent: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          ステップ {currentStep + 1} / {totalSteps}
        </span>
        <span className="text-zinc-500">
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <StepIndicators currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
}

function StepIndicators({
  currentStep,
  totalSteps,
}: {
  readonly currentStep: number;
  readonly totalSteps: number;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-200",
            i < currentStep
              ? "bg-blue-600/60"
              : i === currentStep
                ? "bg-blue-500"
                : "bg-zinc-700",
          )}
        />
      ))}
    </div>
  );
}

function StepButtons({
  isFirst,
  isLast,
  isRunning,
  onPrev,
  onNext,
  onRun,
  onReset,
}: {
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly isRunning: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onRun: () => void;
  readonly onReset: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={isFirst || isRunning}
      >
        前へ
      </Button>
      <Button size="sm" onClick={onRun} disabled={isRunning}>
        {isRunning ? "実行中..." : "このステップを実行"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isLast || isRunning}
      >
        次へ
      </Button>
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={onReset} disabled={isRunning}>
        リセット
      </Button>
    </div>
  );
}
