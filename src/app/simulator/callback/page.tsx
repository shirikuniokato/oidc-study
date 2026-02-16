"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackContent />
    </Suspense>
  );
}

function CallbackLoading() {
  return (
    <ContentLayout>
      <div className="text-center">
        <p className="text-zinc-400">読み込み中...</p>
      </div>
    </ContentLayout>
  );
}

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-zinc-500">認可コールバック</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-100">
            コールバック受信
          </h1>
        </div>

        {error ? (
          <ErrorCard
            error={error}
            errorDescription={errorDescription}
          />
        ) : (
          <SuccessCard code={code} state={state} />
        )}

        <div className="flex gap-3">
          <Link href="/simulator/authorization-code">
            <Button variant="outline">
              認可コードフローに戻る
            </Button>
          </Link>
          <Link href="/simulator">
            <Button variant="ghost">
              フロー一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}

function SuccessCard({
  code,
  state,
}: {
  readonly code: string | null;
  readonly state: string | null;
}) {
  return (
    <Card className="border-emerald-800/30 bg-emerald-950/10">
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm font-medium text-emerald-400">
          認可コードを受信しました
        </p>
        <p className="text-sm text-zinc-400">
          認可サーバーからリダイレクトされ、以下のパラメータを受け取りました。
          実際のアプリケーションでは、この認可コードをバックエンドでトークンと交換します。
        </p>

        <div className="rounded-lg bg-zinc-900 p-4 font-mono text-sm">
          <ParamLine label="code" value={code} />
          <ParamLine label="state" value={state} />
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorCard({
  error,
  errorDescription,
}: {
  readonly error: string;
  readonly errorDescription: string | null;
}) {
  return (
    <Card className="border-red-800/30 bg-red-950/10">
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm font-medium text-red-400">
          認可エラーが発生しました
        </p>

        <div className="rounded-lg bg-zinc-900 p-4 font-mono text-sm">
          <ParamLine label="error" value={error} />
          {errorDescription && (
            <ParamLine label="error_description" value={errorDescription} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ParamLine({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string | null;
}) {
  return (
    <p className="text-zinc-400">
      <span className="text-zinc-500">{label}=</span>
      <span className="text-amber-300">{value ?? "(未指定)"}</span>
    </p>
  );
}
