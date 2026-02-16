import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quizTopics } from "@/lib/quiz/questions";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              理解度クイズ
            </h1>
            <Badge variant="secondary">テスト</Badge>
          </div>
          <p className="text-lg text-zinc-400 leading-relaxed">
            各トピックのクイズに挑戦して、OAuth 2.0 / OIDC
            の理解度を確認しましょう。
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {quizTopics.map((topic) => (
            <Link key={topic.id} href={`/quiz/${topic.id}`} className="group">
              <Card className="h-full transition-colors hover:border-accent/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{topic.title}</CardTitle>
                    <Badge variant="secondary">
                      {topic.questions.length} 問
                    </Badge>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    クイズを始める →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
