import { deviceAuthorizationFlow } from "@/lib/flows/device-authorization";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function DeviceAuthorizationPage() {
  return (
    <FlowPageLayout flow={deviceAuthorizationFlow}>
      <DeviceUseCases />
    </FlowPageLayout>
  );
}

const devices = [
  {
    title: "スマートTV・ストリーミングデバイス",
    description:
      "Netflix、YouTube、Amazon Prime Video などのストリーミングサービスへのログイン。リモコンでの文字入力は困難なため、スマートフォンで認証します。",
  },
  {
    title: "ゲームコンソール",
    description:
      "PlayStation、Xbox、Nintendo Switch でのアカウントリンクやサービスログイン。コントローラーでの入力を最小限にします。",
  },
  {
    title: "IoTデバイス・スマートスピーカー",
    description:
      "Amazon Echo、Google Home などのスマートスピーカーでのアカウント連携。画面がないか限定的なデバイスに最適です。",
  },
  {
    title: "CLIツール",
    description:
      "GitHub CLI（gh auth login）、AWS CLI、Google Cloud CLI などの開発者ツール。ターミナルから安全にOAuth認証を行います。",
  },
] as const;

function DeviceUseCases() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        対象デバイスのユースケース
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {devices.map((device) => (
          <Card key={device.title} className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-zinc-100">
                {device.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {device.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PollingBehavior />
    </section>
  );
}

function PollingBehavior() {
  return (
    <Card className="mt-4 border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-100">
          ポーリングの動作
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <PollingState
            status="authorization_pending"
            statusClass="text-amber-400"
            description="ユーザーがまだ認証を完了していない。ポーリングを継続。"
          />
          <PollingState
            status="slow_down"
            statusClass="text-amber-400"
            description="ポーリングが速すぎる。interval を5秒延長して再試行。"
          />
          <PollingState
            status="access_denied"
            statusClass="text-red-400"
            description="ユーザーがアクセスを拒否した。ポーリングを停止。"
          />
          <PollingState
            status="expired_token"
            statusClass="text-red-400"
            description="device_code の有効期限切れ。最初からやり直し。"
          />
          <PollingState
            status="200 OK (トークン発行)"
            statusClass="text-emerald-400"
            description="認証完了。アクセストークンを取得。"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PollingState({
  status,
  statusClass,
  description,
}: {
  readonly status: string;
  readonly statusClass: string;
  readonly description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2">
      <code className={`shrink-0 text-xs font-mono ${statusClass}`}>
        {status}
      </code>
      <p className="text-xs text-zinc-400">{description}</p>
    </div>
  );
}
