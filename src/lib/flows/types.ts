export type Actor =
  | "user-agent"
  | "client"
  | "authorization-server"
  | "resource-server";

export interface HttpExchange {
  readonly method: string;
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly description: string;
}

export interface FlowStep {
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly description: string;
  readonly from: Actor;
  readonly to: Actor;
  readonly request: HttpExchange;
  readonly response?: HttpExchange;
  readonly securityNotes: readonly string[];
  readonly highlightParams: readonly string[];
}

export interface FlowDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly actors: readonly Actor[];
  readonly steps: readonly FlowStep[];
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
  readonly securityConsiderations: readonly string[];
}

export const ACTOR_LABELS: Readonly<Record<Actor, string>> = {
  "user-agent": "ブラウザ",
  client: "クライアント",
  "authorization-server": "認可サーバー",
  "resource-server": "リソースサーバー",
};
