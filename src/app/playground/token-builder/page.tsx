"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEFAULT_HEADER = JSON.stringify({ alg: "RS256", typ: "JWT" }, null, 2);

const DEFAULT_PAYLOAD = JSON.stringify(
  {
    iss: "https://auth.example.com",
    sub: "1234567890",
    aud: "my-client-id",
    name: "山田太郎",
    email: "taro@example.com",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  null,
  2,
);

function encodeBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const encoded = btoa(String.fromCharCode(...bytes));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function tryParseJson(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export default function TokenBuilderPage() {
  const [headerJson, setHeaderJson] = useState(DEFAULT_HEADER);
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD);

  const headerError = useMemo(
    () => (tryParseJson(headerJson) === null ? "無効なJSONです" : null),
    [headerJson],
  );

  const payloadError = useMemo(
    () => (tryParseJson(payloadJson) === null ? "無効なJSONです" : null),
    [payloadJson],
  );

  const encodedJwt = useMemo(() => {
    if (headerError || payloadError) return null;
    const headerPart = encodeBase64Url(headerJson);
    const payloadPart = encodeBase64Url(payloadJson);
    return `${headerPart}.${payloadPart}.<署名なし>`;
  }, [headerJson, payloadJson, headerError, payloadError]);

  const handleHeaderChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHeaderJson(e.target.value);
    },
    [],
  );

  const handlePayloadChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPayloadJson(e.target.value);
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    if (encodedJwt) {
      await navigator.clipboard.writeText(encodedJwt);
    }
  }, [encodedJwt]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              JWT トークンビルダー
            </h1>
            <Badge variant="secondary">ビルダー</Badge>
          </div>
          <p className="text-lg text-zinc-400 leading-relaxed">
            ヘッダーとペイロードを編集して JWT を構築できます（署名なし）。
          </p>
        </header>

        <div className="space-y-6">
          <Card className="border-red-400/20">
            <CardHeader>
              <CardTitle className="text-red-400">ヘッダー (Header)</CardTitle>
              <CardDescription>
                アルゴリズムとトークンタイプを指定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={headerJson}
                onChange={handleHeaderChange}
                className="w-full rounded-lg border border-border bg-zinc-900 p-4 font-mono text-sm text-red-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                spellCheck={false}
                placeholder='{"alg": "RS256", "typ": "JWT"}'
              />
              {headerError && (
                <p className="mt-2 text-sm text-red-500">{headerError}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-violet-400/20">
            <CardHeader>
              <CardTitle className="text-violet-400">
                ペイロード (Payload)
              </CardTitle>
              <CardDescription>
                クレーム（iss, sub, aud, exp, iat など）を編集します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={payloadJson}
                onChange={handlePayloadChange}
                className="w-full rounded-lg border border-border bg-zinc-900 p-4 font-mono text-sm text-violet-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={10}
                spellCheck={false}
                placeholder='{"iss": "https://auth.example.com", "sub": "user-id", ...}'
              />
              {payloadError && (
                <p className="mt-2 text-sm text-red-500">{payloadError}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-emerald-400/20">
            <CardHeader>
              <CardTitle className="text-emerald-400">
                エンコード済み JWT（署名なし）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {encodedJwt ? (
                <>
                  <pre className="rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-300 break-all whitespace-pre-wrap">
                    {encodedJwt}
                  </pre>
                  <div className="mt-4">
                    <Button onClick={handleCopy}>コピー</Button>
                  </div>
                </>
              ) : (
                <p className="text-zinc-400">
                  有効な JSON を入力するとプレビューが表示されます
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
