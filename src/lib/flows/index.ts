export type {
  Actor,
  HttpExchange,
  FlowStep,
  FlowDefinition,
} from "./types";
export { ACTOR_LABELS } from "./types";

export { authorizationCodeFlow } from "./authorization-code";
export { authorizationCodePkceFlow } from "./authorization-code-pkce";
export { implicitFlow } from "./implicit";
export { clientCredentialsFlow } from "./client-credentials";
export { deviceAuthorizationFlow } from "./device-authorization";
export { refreshTokenFlow } from "./refresh-token";

import { authorizationCodeFlow } from "./authorization-code";
import { authorizationCodePkceFlow } from "./authorization-code-pkce";
import { implicitFlow } from "./implicit";
import { clientCredentialsFlow } from "./client-credentials";
import { deviceAuthorizationFlow } from "./device-authorization";
import { refreshTokenFlow } from "./refresh-token";
import type { FlowDefinition } from "./types";

export const ALL_FLOWS: readonly FlowDefinition[] = [
  authorizationCodeFlow,
  authorizationCodePkceFlow,
  implicitFlow,
  clientCredentialsFlow,
  deviceAuthorizationFlow,
  refreshTokenFlow,
];
