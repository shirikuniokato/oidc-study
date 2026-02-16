import { authorizationCodeFlow } from "@/lib/flows/authorization-code";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";

export default function AuthorizationCodePage() {
  return <FlowPageLayout flow={authorizationCodeFlow} />;
}
