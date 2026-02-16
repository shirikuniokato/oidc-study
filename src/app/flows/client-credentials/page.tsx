import { clientCredentialsFlow } from "@/lib/flows/client-credentials";
import { FlowPageLayout } from "@/components/flows/flow-page-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ClientCredentialsPage() {
  return (
    <FlowPageLayout flow={clientCredentialsFlow}>
      <M2MUseCases />
    </FlowPageLayout>
  );
}

const useCases = [
  {
    title: "マイクロサービス間通信",
    description:
      "バックエンドサービスAがサービスBのAPIにアクセスする場合。ユーザーのリクエストを処理する過程で、他のサービスにアクセスする際に使用します。",
    example: "注文サービス → 在庫サービス、決済サービス → 通知サービス",
  },
  {
    title: "バッチ処理・cronジョブ",
    description:
      "定期的に実行されるバックグラウンドジョブがAPIにアクセスする場合。ユーザーの介入なしで自動的にデータを処理します。",
    example: "日次集計バッチ、定期レポート生成、データ同期ジョブ",
  },
  {
    title: "CLIツール・管理ツール",
    description:
      "サーバー上で実行される管理ツールやCLIがAPIにアクセスする場合。デプロイスクリプトや監視ツールなどで使用します。",
    example: "デプロイスクリプト、監視エージェント、管理CLI",
  },
  {
    title: "IoTデバイス（サーバーサイド処理）",
    description:
      "IoTデバイスからのデータを集約するサーバーが、分析APIにアクセスする場合。デバイス自体ではなく、集約サーバーが認証主体になります。",
    example: "IoTゲートウェイ → クラウドAPI",
  },
] as const;

function M2MUseCases() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-100">
        M2M通信のユースケース
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {useCases.map((useCase) => (
          <Card key={useCase.title} className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-zinc-100">
                {useCase.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {useCase.description}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                例: {useCase.example}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-zinc-200">
            ユーザーコンテキストがない点に注意
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            クライアントクレデンシャルフローではユーザー情報がトークンに含まれません。
            アクセス制御はクライアント単位になるため、
            「誰の代理でアクセスしているか」を区別する必要がある場合は、
            認可コードフロー等のユーザー参加型フローを使用してください。
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
