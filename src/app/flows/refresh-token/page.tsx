import { refreshTokenFlow } from "@/lib/flows/refresh-token";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function RefreshTokenPage() {
  return (
    <FlowPageLayout flow={refreshTokenFlow}>
      <TokenRotation />
    </FlowPageLayout>
  );
}

function TokenRotation() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        トークンローテーション
      </h2>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            トークンローテーションは、リフレッシュトークンを使用するたびに新しいリフレッシュトークンを発行し、
            古いリフレッシュトークンを無効化するセキュリティ手法です。
          </p>

          <RotationStep
            step={1}
            title="初回トークン発行"
            description="認可フロー完了時にアクセストークンとリフレッシュトークンRT1が発行される。"
          />
          <RotationStep
            step={2}
            title="トークン更新"
            description="RT1でリフレッシュすると、新しいアクセストークンとRT2が発行される。RT1は無効化される。"
          />
          <RotationStep
            step={3}
            title="漏洩検知"
            description="攻撃者がRT1を使用すると、既に無効化されているため失敗する。認可サーバーはRT1の不正使用を検知し、RT2も含めて全トークンを無効化できる。"
          />

          <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-3">
            <p className="text-xs font-medium text-amber-300">
              リプレイ検知の仕組み
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              無効化されたリフレッシュトークンが使用された場合、
              そのトークンファミリー全体が侵害されたとみなし、
              関連するすべてのトークンを無効化します。
              これにより、トークン漏洩時の被害を最小限に抑えられます。
            </p>
          </div>
        </CardContent>
      </Card>

      <TokenStorageGuidance />
    </section>
  );
}

function RotationStep({
  step,
  title,
  description,
}: {
  readonly step: number;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
          {step}
        </span>
        <p className="text-sm font-medium text-zinc-200">{title}</p>
      </div>
      <p className="text-xs text-zinc-400">{description}</p>
    </div>
  );
}

function TokenStorageGuidance() {
  return (
    <Card className="mt-4 border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-100">
          リフレッシュトークンの保存場所
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {storageOptions.map((option) => (
            <div
              key={option.location}
              className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2"
            >
              <span className={`shrink-0 text-xs font-medium ${option.colorClass}`}>
                {option.recommendation}
              </span>
              <div>
                <p className="text-xs font-medium text-zinc-200">
                  {option.location}
                </p>
                <p className="text-xs text-zinc-400">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const storageOptions = [
  {
    location: "サーバーサイドセッション",
    recommendation: "推奨",
    colorClass: "text-emerald-400",
    description:
      "HTTPOnly Cookie でセッションIDを管理し、サーバー側でリフレッシュトークンを保存。最も安全。",
  },
  {
    location: "HTTPOnly Cookie（直接）",
    recommendation: "許容",
    colorClass: "text-amber-400",
    description:
      "Secure、HttpOnly、SameSite=Strict 属性を設定。XSS攻撃からは保護されるが、CSRF対策が必要。",
  },
  {
    location: "localStorage / sessionStorage",
    recommendation: "非推奨",
    colorClass: "text-red-400",
    description:
      "XSS攻撃で容易にアクセスされる。パブリッククライアントでは避けるべき。",
  },
] as const;
