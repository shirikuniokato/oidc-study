"use client";

import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const SAMPLE_JWT =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiYXVkIjoibXktY2xpZW50LWlkIiwibmFtZSI6IuWxseeUsOWkqumDjiIsImVtYWlsIjoidGFyb0BleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MDkwMDAwMDAsImV4cCI6MTcwOTAwMzYwMCwibm9uY2UiOiJhYmMxMjMifQ.signature-placeholder";

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: "発行者 (Issuer)",
  sub: "主体 (Subject)",
  aud: "対象者 (Audience)",
  exp: "有効期限 (Expiration Time)",
  iat: "発行日時 (Issued At)",
  nbf: "有効開始 (Not Before)",
  jti: "JWT ID",
  nonce: "ナンス (Nonce) - リプレイ攻撃防止",
  name: "名前",
  email: "メールアドレス",
  email_verified: "メール確認済み",
  picture: "プロフィール画像URL",
};

function decodeBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const paddedWithEquals = padded.padEnd(
    padded.length + ((4 - (padded.length % 4)) % 4),
    "=",
  );
  return atob(paddedWithEquals);
}

function tryParseJson(input: string): Record<string, unknown> | null {
  try {
    return JSON.parse(input) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function formatTimestamp(value: unknown): string {
  if (typeof value !== "number") return "";
  const date = new Date(value * 1000);
  return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export default function PlaygroundPage() {
  const [jwtInput, setJwtInput] = useState(SAMPLE_JWT);

  const decoded = useMemo(() => {
    const parts = jwtInput.trim().split(".");
    if (parts.length !== 3) return null;

    const header = tryParseJson(decodeBase64Url(parts[0]));
    const payload = tryParseJson(decodeBase64Url(parts[1]));
    if (!header || !payload) return null;

    return { header, payload, parts };
  }, [jwtInput]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJwtInput(e.target.value);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              JWT プレイグラウンド
            </h1>
            <Badge variant="secondary">デコーダー</Badge>
          </div>
          <p className="text-lg text-zinc-400 leading-relaxed">
            JWT をペーストしてヘッダー、ペイロード、署名を視覚的に確認できます。
          </p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JWT 入力</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={jwtInput}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-border bg-zinc-900 p-4 font-mono text-sm text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                placeholder="JWT をペーストしてください..."
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {decoded ? (
            <>
              <EncodedView parts={decoded.parts} />
              <DecodedHeaderView header={decoded.header} />
              <DecodedPayloadView payload={decoded.payload} />
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-zinc-400">
                  有効な JWT を入力してください（ドット区切りの3パート構成）
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function EncodedView({ parts }: { readonly parts: readonly string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>エンコード済み JWT</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-zinc-900 p-4 font-mono text-sm break-all leading-relaxed">
          <span className="text-red-400">{parts[0]}</span>
          <span className="text-zinc-500">.</span>
          <span className="text-violet-400">{parts[1]}</span>
          <span className="text-zinc-500">.</span>
          <span className="text-emerald-400">{parts[2]}</span>
        </div>
        <div className="mt-3 flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            ヘッダー
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            ペイロード
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            署名
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DecodedHeaderView({
  header,
}: {
  readonly header: Record<string, unknown>;
}) {
  return (
    <Card className="border-red-400/20">
      <CardHeader>
        <CardTitle className="text-red-400">ヘッダー (Header)</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed text-red-400 overflow-x-auto">
          {JSON.stringify(header, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

function DecodedPayloadView({
  payload,
}: {
  readonly payload: Record<string, unknown>;
}) {
  return (
    <Card className="border-violet-400/20">
      <CardHeader>
        <CardTitle className="text-violet-400">ペイロード (Payload)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(payload).map(([key, value]) => (
            <ClaimRow key={key} claimKey={key} claimValue={value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ClaimRow({
  claimKey,
  claimValue,
}: {
  readonly claimKey: string;
  readonly claimValue: unknown;
}) {
  const description = CLAIM_DESCRIPTIONS[claimKey];
  const isTimestamp = claimKey === "exp" || claimKey === "iat" || claimKey === "nbf";
  const formattedTime = isTimestamp ? formatTimestamp(claimValue) : null;

  return (
    <div className="flex items-start gap-3 rounded-lg bg-zinc-900 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {description ? (
            <Tooltip>
              <TooltipTrigger>
                <span className="font-mono text-sm font-medium text-violet-400 underline decoration-dotted underline-offset-4">
                  {claimKey}
                </span>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          ) : (
            <span className="font-mono text-sm font-medium text-violet-400">
              {claimKey}
            </span>
          )}
        </div>
        <div className="mt-1 font-mono text-sm text-zinc-300">
          {JSON.stringify(claimValue)}
          {formattedTime && (
            <span className="ml-2 text-xs text-zinc-500">
              ({formattedTime})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
