import { authorizationCodePkceFlow } from "@/lib/flows/authorization-code-pkce";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function AuthorizationCodePkcePage() {
  return (
    <FlowPageLayout flow={authorizationCodePkceFlow}>
      <PkceExplanation />
      <DifferenceFromStandard />
    </FlowPageLayout>
  );
}

function PkceExplanation() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        PKCE の仕組み
      </h2>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-3">
            <PkceStep
              step={1}
              title="code_verifier の生成"
              description="クライアントが暗号論的に安全な43〜128文字のランダム文字列を生成します。"
              code="code_verifier = dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
            />
            <PkceStep
              step={2}
              title="code_challenge の計算"
              description="code_verifier の SHA-256 ハッシュを Base64URL エンコードします。"
              code="code_challenge = BASE64URL(SHA256(code_verifier))"
            />
            <PkceStep
              step={3}
              title="認可リクエストで送信"
              description="code_challenge のみを認可サーバーに送信します。code_verifier は送信しません。"
              code="GET /authorize?...&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256"
            />
            <PkceStep
              step={4}
              title="トークンリクエストで検証"
              description="トークン交換時に code_verifier を送信し、認可サーバーが SHA256(code_verifier) == code_challenge を検証します。"
              code="POST /token ... code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function PkceStep({
  step,
  title,
  description,
  code,
}: {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly code: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-[10px] font-bold text-blue-400">
          {step}
        </span>
        <p className="text-sm font-medium text-zinc-200">{title}</p>
      </div>
      <p className="text-xs text-zinc-400 mb-2">{description}</p>
      <code className="block rounded bg-zinc-900 px-2 py-1 text-xs text-amber-300 font-mono">
        {code}
      </code>
    </div>
  );
}

function DifferenceFromStandard() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        通常の認可コードフローとの違い
      </h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                項目
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                認可コード
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">
                認可コード + PKCE
              </th>
            </tr>
          </thead>
          <tbody>
            {differenceRows.map((row) => (
              <tr
                key={row.item}
                className="border-b border-zinc-800/50 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-zinc-200">
                  {row.item}
                </td>
                <td className="px-4 py-3 text-zinc-400">{row.standard}</td>
                <td className="px-4 py-3 text-zinc-300">{row.pkce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const differenceRows = [
  {
    item: "クライアント認証",
    standard: "client_secret を使用",
    pkce: "code_verifier / code_challenge を使用",
  },
  {
    item: "対象クライアント",
    standard: "機密クライアント（サーバーサイド）",
    pkce: "パブリッククライアント（SPA、ネイティブ）",
  },
  {
    item: "認可コード傍受対策",
    standard: "client_secret で保護",
    pkce: "PKCE チャレンジで保護",
  },
  {
    item: "認可リクエスト",
    standard: "標準パラメータのみ",
    pkce: "code_challenge, code_challenge_method を追加",
  },
  {
    item: "トークンリクエスト",
    standard: "client_secret を送信",
    pkce: "code_verifier を送信",
  },
] as const;
