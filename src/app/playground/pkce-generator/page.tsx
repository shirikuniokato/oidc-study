"use client";

import { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

interface PkceResult {
  readonly verifier: string;
  readonly challenge: string;
}

function generateRandomVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return arrayToBase64Url(array);
}

function arrayToBase64Url(array: Uint8Array): string {
  const binary = Array.from(array)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function computeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return arrayToBase64Url(new Uint8Array(digest));
}

export default function PkceGeneratorPage() {
  const [verifierInput, setVerifierInput] = useState("");
  const [result, setResult] = useState<PkceResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    const verifier = generateRandomVerifier();
    const challenge = await computeChallenge(verifier);
    setVerifierInput(verifier);
    setResult({ verifier, challenge });
    setIsGenerating(false);
  }, []);

  const handleComputeFromInput = useCallback(async () => {
    if (!verifierInput.trim()) return;
    setIsGenerating(true);
    const challenge = await computeChallenge(verifierInput.trim());
    setResult({ verifier: verifierInput.trim(), challenge });
    setIsGenerating(false);
  }, [verifierInput]);

  const handleVerifierChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVerifierInput(e.target.value);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              PKCE ジェネレーター
            </h1>
            <Badge variant="secondary">ツール</Badge>
          </div>
          <p className="text-lg text-zinc-400 leading-relaxed">
            PKCE の code_verifier と code_challenge を生成し、変換過程を確認できます。
          </p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>code_verifier</CardTitle>
              <CardDescription>
                ランダム生成するか、手動で入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verifierInput}
                  onChange={handleVerifierChange}
                  className="flex-1 rounded-lg border border-border bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="code_verifier を入力..."
                  spellCheck={false}
                />
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  ランダム生成
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleComputeFromInput}
                  disabled={isGenerating || !verifierInput.trim()}
                >
                  計算
                </Button>
              </div>
            </CardContent>
          </Card>

          <PkceFlowDiagram result={result} />

          {result && <PkceResultView result={result} />}
        </div>
      </div>
    </div>
  );
}

function PkceFlowDiagram({
  result,
}: {
  readonly result: PkceResult | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>変換過程</CardTitle>
        <CardDescription>
          code_verifier から code_challenge への変換ステップ (S256)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FlowStep
            step={1}
            label="code_verifier（ランダム文字列）"
            value={result?.verifier ?? "---"}
          />
          <FlowArrow label="SHA-256 ハッシュ" />
          <FlowStep
            step={2}
            label="SHA-256 ダイジェスト（バイト列）"
            value={result ? "[256ビットのハッシュ値]" : "---"}
          />
          <FlowArrow label="Base64URL エンコード" />
          <FlowStep
            step={3}
            label="code_challenge"
            value={result?.challenge ?? "---"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FlowStep({
  step,
  label,
  value,
}: {
  readonly step: number;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-zinc-900 p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {step}
        </span>
        <span className="text-sm font-medium text-zinc-300">{label}</span>
      </div>
      <p className="mt-2 font-mono text-sm text-zinc-400 break-all">{value}</p>
    </div>
  );
}

function FlowArrow({ label }: { readonly label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-zinc-500">
      <span className="text-lg">↓</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function PkceResultView({ result }: { readonly result: PkceResult }) {
  const authRequestSnippet = `GET /authorize?
  response_type=code
  &client_id=my-client
  &redirect_uri=https://app.example.com/callback
  &code_challenge=${result.challenge}
  &code_challenge_method=S256
  &scope=openid profile`;

  const tokenRequestSnippet = `POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE
&redirect_uri=https://app.example.com/callback
&client_id=my-client
&code_verifier=${result.verifier}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>使用例</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CodeBlock
          title="認可リクエスト（code_challenge を含む）"
          code={authRequestSnippet}
        />
        <CodeBlock
          title="トークンリクエスト（code_verifier を含む）"
          code={tokenRequestSnippet}
        />
      </CardContent>
    </Card>
  );
}
