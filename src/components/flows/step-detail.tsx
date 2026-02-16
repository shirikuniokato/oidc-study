import type { FlowStep } from "@/lib/flows/types";
import { ACTOR_LABELS } from "@/lib/flows/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface StepDetailProps {
  readonly step: FlowStep;
}

export function StepDetail({ step }: StepDetailProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300">
            {step.order}
          </span>
          <div>
            <CardTitle className="text-zinc-100">{step.title}</CardTitle>
            <p className="mt-1 text-xs text-zinc-500">
              {ACTOR_LABELS[step.from]} → {ACTOR_LABELS[step.to]}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {step.description}
        </p>

        <HttpExchangeBlock
          label="リクエスト"
          method={step.request.method}
          url={step.request.url}
          headers={step.request.headers}
          body={step.request.body}
          highlightParams={step.highlightParams}
        />

        {step.response && (
          <HttpExchangeBlock
            label="レスポンス"
            method={step.response.method}
            url={step.response.url}
            headers={step.response.headers}
            body={step.response.body}
            highlightParams={step.highlightParams}
          />
        )}

        {step.securityNotes.length > 0 && (
          <SecurityNotes notes={step.securityNotes} />
        )}
      </CardContent>
    </Card>
  );
}

function HttpExchangeBlock({
  label,
  method,
  url,
  headers,
  body,
  highlightParams,
}: {
  readonly label: string;
  readonly method: string;
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly highlightParams: readonly string[];
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="mb-2 text-xs font-medium text-zinc-500">{label}</p>
      <div className="font-mono text-xs leading-relaxed">
        <p className="text-zinc-300">
          <span className="text-blue-400">{method}</span> {url}
        </p>
        {headers &&
          Object.entries(headers).map(([key, value]) => (
            <p key={key} className="text-zinc-500">
              {key}: <span className="text-zinc-400">{value}</span>
            </p>
          ))}
        {body && (
          <div className="mt-2 border-t border-zinc-800 pt-2">
            <HighlightedBody body={body} params={highlightParams} />
          </div>
        )}
      </div>
    </div>
  );
}

function HighlightedBody({
  body,
  params,
}: {
  readonly body: string;
  readonly params: readonly string[];
}) {
  if (params.length === 0) {
    return <pre className="whitespace-pre-wrap text-zinc-400">{body}</pre>;
  }

  return (
    <pre className="whitespace-pre-wrap text-zinc-400">
      {body.split("\n").map((line, lineIndex) => {
        const highlighted = params.some((param) => line.includes(param));
        return (
          <span
            key={lineIndex}
            className={highlighted ? "text-amber-300" : undefined}
          >
            {line}
            {"\n"}
          </span>
        );
      })}
    </pre>
  );
}

function SecurityNotes({ notes }: { readonly notes: readonly string[] }) {
  return (
    <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3">
      <p className="mb-2 text-xs font-medium text-zinc-400">
        セキュリティノート
      </p>
      <ul className="space-y-1">
        {notes.map((note) => (
          <li key={note} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 text-amber-400">!</span>
            <span className="text-zinc-400">{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
