"use client";

import { useCallback, useState } from "react";
import type { FlowDefinition, FlowStep } from "@/lib/flows/types";

interface SimulatorResponse {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: string;
}

interface SimulatorState {
  readonly currentStep: number;
  readonly isRunning: boolean;
  readonly responses: ReadonlyMap<number, SimulatorResponse>;
  readonly error: string | null;
}

interface SimulatorActions {
  readonly nextStep: () => void;
  readonly prevStep: () => void;
  readonly reset: () => void;
  readonly runCurrentStep: () => Promise<void>;
}

export type FlowSimulator = SimulatorState & SimulatorActions;

const BASE_URL = "/api/mock-oidc";

function buildFetchUrl(step: FlowStep): string {
  const url = step.request.url;
  if (url.startsWith("/authorize")) return `${BASE_URL}/authorize`;
  if (url.startsWith("/token")) return `${BASE_URL}/token`;
  if (url.startsWith("/device/code")) return `${BASE_URL}/device/authorize`;
  if (url.startsWith("/api/userinfo")) return `${BASE_URL}/userinfo`;
  if (url.startsWith("/api/data")) return `${BASE_URL}/userinfo`;
  return url;
}

function shouldFetch(step: FlowStep): boolean {
  const method = step.request.method.toUpperCase();
  return method === "GET" || method === "POST";
}

async function executeFetch(
  step: FlowStep,
): Promise<SimulatorResponse> {
  const url = buildFetchUrl(step);
  const method = step.request.method.toUpperCase();

  const headers: Record<string, string> = {
    ...(step.request.headers ?? {}),
  };

  let fetchUrl = url;
  let body: string | undefined;

  if (method === "GET" && step.request.body) {
    const separator = url.includes("?") ? "&" : "?";
    fetchUrl = `${url}${separator}${step.request.body}`;
  }

  if (method === "POST" && step.request.body) {
    body = step.request.body;
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
  }

  const response = await fetch(fetchUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const responseBody = await response.text();

  return {
    status: response.status,
    headers: responseHeaders,
    body: responseBody,
  };
}

export function useFlowSimulator(flow: FlowDefinition): FlowSimulator {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [responses, setResponses] = useState<ReadonlyMap<number, SimulatorResponse>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const totalSteps = flow.steps.length;

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setResponses(new Map());
    setError(null);
    setIsRunning(false);
  }, []);

  const runCurrentStep = useCallback(async () => {
    const step = flow.steps[currentStep];
    if (!step || !shouldFetch(step)) return;

    setIsRunning(true);
    setError(null);

    try {
      const response = await executeFetch(step);
      setResponses((prev) => {
        const next = new Map(prev);
        next.set(currentStep, response);
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "リクエストに失敗しました";
      setError(message);
    } finally {
      setIsRunning(false);
    }
  }, [flow.steps, currentStep]);

  return {
    currentStep,
    isRunning,
    responses,
    error,
    nextStep,
    prevStep,
    reset,
    runCurrentStep,
  };
}
