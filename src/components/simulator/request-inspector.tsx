"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { FlowStep } from "@/lib/flows/types";
import { cn } from "@/lib/utils";

interface SimulatorResponse {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: string;
}

interface RequestInspectorProps {
  readonly step: FlowStep;
  readonly response?: SimulatorResponse;
}

export function RequestInspector({ step, response }: RequestInspectorProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <Tabs defaultValue="request">
        <div className="border-b border-zinc-800 px-4 py-2">
          <TabsList>
            <TabsTrigger value="request">リクエスト</TabsTrigger>
            <TabsTrigger value="response">レスポンス</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="request" className="p-0">
          <RequestPanel step={step} />
        </TabsContent>
        <TabsContent value="response" className="p-0">
          <ResponsePanel step={step} response={response} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestPanel({ step }: { readonly step: FlowStep }) {
  const { method, url, headers, body } = step.request;
  const highlightParams = step.highlightParams;

  return (
    <div className="space-y-0">
      <MethodUrl method={method} url={url} />
      {headers && <HeadersBlock headers={headers} highlightParams={highlightParams} />}
      {body && <BodyBlock body={body} highlightParams={highlightParams} />}
    </div>
  );
}

function ResponsePanel({
  step,
  response,
}: {
  readonly step: FlowStep;
  readonly response?: SimulatorResponse;
}) {
  if (response) {
    return <ActualResponseBlock response={response} highlightParams={step.highlightParams} />;
  }

  if (step.response) {
    return (
      <div className="space-y-0">
        <div className="border-b border-zinc-800 px-4 py-2">
          <span className="text-xs text-zinc-500">予想されるレスポンス</span>
        </div>
        <MethodUrl method={step.response.method} url={step.response.url} />
        {step.response.body && (
          <BodyBlock body={step.response.body} highlightParams={step.highlightParams} />
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-8 text-center text-sm text-zinc-500">
      「このステップを実行」でリクエストを送信してください
    </div>
  );
}

function ActualResponseBlock({
  response,
  highlightParams,
}: {
  readonly response: SimulatorResponse;
  readonly highlightParams: readonly string[];
}) {
  const statusColor = response.status < 300
    ? "text-emerald-400"
    : response.status < 400
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="space-y-0">
      <div className="border-b border-zinc-800 px-4 py-2">
        <span className={cn("font-mono text-sm font-bold", statusColor)}>
          HTTP {response.status}
        </span>
        <span className="ml-2 text-xs text-zinc-500">実際のレスポンス</span>
      </div>
      {Object.keys(response.headers).length > 0 && (
        <HeadersBlock headers={response.headers} highlightParams={highlightParams} />
      )}
      {response.body && (
        <BodyBlock
          body={formatBodySafe(response.body)}
          highlightParams={highlightParams}
        />
      )}
    </div>
  );
}

function MethodUrl({
  method,
  url,
}: {
  readonly method: string;
  readonly url: string;
}) {
  return (
    <div className="border-b border-zinc-800 px-4 py-3">
      <span className="mr-2 rounded bg-blue-600/20 px-2 py-0.5 font-mono text-xs font-bold text-blue-400">
        {method}
      </span>
      <span className="font-mono text-sm text-zinc-300">{url}</span>
    </div>
  );
}

function HeadersBlock({
  headers,
  highlightParams,
}: {
  readonly headers: Readonly<Record<string, string>>;
  readonly highlightParams: readonly string[];
}) {
  return (
    <div className="border-b border-zinc-800 px-4 py-3">
      <div className="mb-1 text-xs font-medium text-zinc-500">Headers</div>
      <div className="space-y-0.5 font-mono text-xs">
        {Object.entries(headers).map(([key, value]) => {
          const isHighlighted = highlightParams.some(
            (p) => key.toLowerCase().includes(p.toLowerCase()),
          );
          return (
            <div key={key}>
              <span className="text-zinc-400">{key}: </span>
              <span className={isHighlighted ? "text-amber-400" : "text-zinc-300"}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BodyBlock({
  body,
  highlightParams,
}: {
  readonly body: string;
  readonly highlightParams: readonly string[];
}) {
  return (
    <div className="px-4 py-3">
      <div className="mb-1 text-xs font-medium text-zinc-500">Body</div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed">
        <HighlightedBody body={body} highlightParams={highlightParams} />
      </pre>
    </div>
  );
}

function HighlightedBody({
  body,
  highlightParams,
}: {
  readonly body: string;
  readonly highlightParams: readonly string[];
}) {
  if (highlightParams.length === 0) {
    return <span className="text-zinc-300">{body}</span>;
  }

  const pattern = highlightParams
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = body.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isHighlighted = highlightParams.some(
          (p) => p.toLowerCase() === part.toLowerCase(),
        );
        return (
          <span
            key={i}
            className={isHighlighted ? "font-bold text-amber-400" : "text-zinc-300"}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

function formatBodySafe(body: string): string {
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return body;
  }
}
