import { implicitFlow } from "@/lib/flows/implicit";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ImplicitFlowPage() {
  return (
    <FlowPageLayout flow={implicitFlow} deprecated>
      <WhyDeprecated />
    </FlowPageLayout>
  );
}

const deprecationReasons = [
  {
    title: "トークンがURLに露出する",
    description:
      "アクセストークンがURLフラグメントに含まれるため、ブラウザ履歴やRefererヘッダーから漏洩する可能性があります。",
  },
  {
    title: "トークンインジェクション攻撃に脆弱",
    description:
      "トークンがフロントチャネル（ブラウザ経由）で返されるため、攻撃者が偽のトークンを注入できる可能性があります。認可コードフローのようなバックチャネル検証がありません。",
  },
  {
    title: "送信元の検証ができない",
    description:
      "認可コードフローでは client_secret や code_verifier でクライアントを検証できますが、インプリシットフローにはそのような仕組みがありません。",
  },
  {
    title: "リフレッシュトークンが使えない",
    description:
      "セキュリティ上の理由からリフレッシュトークンを発行できません。トークンの有効期限が切れるたびにユーザーは再認証が必要になります。",
  },
  {
    title: "OAuth 2.1 で削除予定",
    description:
      "OAuth 2.1 の仕様ではインプリシットフローは完全に削除されます。RFC 9700（OAuth 2.0 Security Best Current Practice）でも非推奨とされています。",
  },
] as const;

function WhyDeprecated() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        なぜ非推奨なのか?
      </h2>
      <div className="space-y-3">
        {deprecationReasons.map((reason, index) => (
          <Card
            key={reason.title}
            className="border-amber-800/50 bg-amber-950/30"
          >
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/20 text-xs font-bold text-amber-400">
                  {index + 1}
                </span>
                <CardTitle className="text-sm text-amber-300">
                  {reason.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {reason.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-emerald-800/30 bg-emerald-950/10">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-emerald-400">
            代替手段: 認可コード + PKCE フロー
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            SPAやネイティブアプリでは、認可コード + PKCE
            フローを使用してください。
            PKCEを使えばclient_secretなしでも安全に認可コードフローを利用でき、
            インプリシットフローのセキュリティ上の問題をすべて回避できます。
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
