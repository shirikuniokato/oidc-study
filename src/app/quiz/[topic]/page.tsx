"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findTopicById } from "@/lib/quiz/questions";
import type { QuizQuestion, MultipleChoiceQuestion, OrderingQuestion } from "@/lib/quiz/types";

interface AnswerState {
  readonly answered: boolean;
  readonly correct: boolean;
}

export default function QuizTopicPage() {
  const params = useParams();
  const topicId = params.topic as string;
  const topic = useMemo(() => findTopicById(topicId), [topicId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<readonly AnswerState[]>([]);
  const [finished, setFinished] = useState(false);

  const score = useMemo(
    () => answers.filter((a) => a.correct).length,
    [answers],
  );

  useEffect(() => {
    if (!topic || !finished) return;
    const storageKey = `quiz-best-${topicId}`;
    const stored = localStorage.getItem(storageKey);
    const best = stored ? Number.parseInt(stored, 10) : 0;
    if (score > best) {
      localStorage.setItem(storageKey, String(score));
    }
  }, [finished, score, topicId, topic]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setAnswers((prev) => [...prev, { answered: true, correct }]);
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (!topic) return;
    if (currentIndex + 1 >= topic.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, topic]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setFinished(false);
  }, []);

  if (!topic) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">トピックが見つかりません</p>
      </div>
    );
  }

  const currentQuestion = topic.questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              {topic.title}
            </h1>
            <Badge variant="secondary">
              {currentIndex + 1} / {topic.questions.length}
            </Badge>
          </div>
          <ProgressBar current={currentIndex + 1} total={topic.questions.length} />
        </header>

        {finished ? (
          <ScoreView
            score={score}
            total={topic.questions.length}
            topicId={topicId}
            onRetry={handleRetry}
          />
        ) : (
          <QuestionView
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}

function ProgressBar({
  current,
  total,
}: {
  readonly current: number;
  readonly total: number;
}) {
  const percentage = (current / total) * 100;
  return (
    <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800">
      <div
        className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function QuestionView({
  question,
  answer,
  onAnswer,
  onNext,
}: {
  readonly question: QuizQuestion;
  readonly answer: AnswerState | undefined;
  readonly onAnswer: (correct: boolean) => void;
  readonly onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {question.type === "multiple-choice" ? (
            <MultipleChoiceView
              question={question}
              answered={answer?.answered ?? false}
              onAnswer={onAnswer}
            />
          ) : (
            <OrderingView
              question={question}
              answered={answer?.answered ?? false}
              onAnswer={onAnswer}
            />
          )}
        </CardContent>
      </Card>

      {answer && (
        <>
          <FeedbackView correct={answer.correct} explanation={question.explanation} />
          <div className="flex justify-end">
            <Button onClick={onNext}>次の問題へ</Button>
          </div>
        </>
      )}
    </div>
  );
}

function MultipleChoiceView({
  question,
  answered,
  onAnswer,
}: {
  readonly question: MultipleChoiceQuestion;
  readonly answered: boolean;
  readonly onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
    },
    [answered],
  );

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    onAnswer(selected === question.correctIndex);
  }, [selected, question.correctIndex, onAnswer]);

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selected === index;
        const isCorrect = index === question.correctIndex;
        const showResult = answered;

        let optionClass =
          "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors";

        if (showResult && isCorrect) {
          optionClass += " border-emerald-400/50 bg-emerald-950/30 text-emerald-400";
        } else if (showResult && isSelected && !isCorrect) {
          optionClass += " border-red-400/50 bg-red-950/30 text-red-400";
        } else if (isSelected) {
          optionClass += " border-blue-500 bg-blue-950/20 text-zinc-200";
        } else {
          optionClass += " border-border text-zinc-300 hover:border-zinc-600";
        }

        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(index)}
            disabled={answered}
            className={optionClass}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-sm">{option}</span>
          </button>
        );
      })}
      {!answered && (
        <div className="mt-4">
          <Button onClick={handleSubmit} disabled={selected === null}>
            回答する
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderingView({
  question,
  answered,
  onAnswer,
}: {
  readonly question: OrderingQuestion;
  readonly answered: boolean;
  readonly onAnswer: (correct: boolean) => void;
}) {
  const [order, setOrder] = useState<number[]>(() =>
    question.items.map((_, i) => i),
  );

  const moveItem = useCallback(
    (index: number, direction: "up" | "down") => {
      if (answered) return;
      setOrder((prev) => {
        const newOrder = [...prev];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newOrder.length) return prev;
        [newOrder[index], newOrder[swapIndex]] = [
          newOrder[swapIndex],
          newOrder[index],
        ];
        return newOrder;
      });
    },
    [answered],
  );

  const handleSubmit = useCallback(() => {
    const isCorrect = order.every(
      (itemIndex, position) => question.correctOrder[position] === itemIndex,
    );
    onAnswer(isCorrect);
  }, [order, question.correctOrder, onAnswer]);

  return (
    <div className="space-y-2">
      {order.map((itemIndex, position) => {
        const isCorrectPosition = answered && question.correctOrder[position] === itemIndex;
        const isWrongPosition = answered && question.correctOrder[position] !== itemIndex;

        let itemClass = "flex items-center gap-3 rounded-lg border px-4 py-3";
        if (isCorrectPosition) {
          itemClass += " border-emerald-400/50 bg-emerald-950/30 text-emerald-400";
        } else if (isWrongPosition) {
          itemClass += " border-red-400/50 bg-red-950/30 text-red-400";
        } else {
          itemClass += " border-border text-zinc-300";
        }

        return (
          <div key={itemIndex} className={itemClass}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400">
              {position + 1}
            </span>
            <span className="flex-1 text-sm">{question.items[itemIndex]}</span>
            {!answered && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(position, "up")}
                  disabled={position === 0}
                  className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(position, "down")}
                  disabled={position === order.length - 1}
                  className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        );
      })}
      {!answered && (
        <div className="mt-4">
          <Button onClick={handleSubmit}>回答する</Button>
        </div>
      )}
    </div>
  );
}

function FeedbackView({
  correct,
  explanation,
}: {
  readonly correct: boolean;
  readonly explanation: string;
}) {
  return (
    <Card
      className={
        correct ? "border-emerald-400/30" : "border-red-400/30"
      }
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-lg font-bold ${correct ? "text-emerald-400" : "text-red-400"}`}
          >
            {correct ? "正解!" : "不正解"}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{explanation}</p>
      </CardContent>
    </Card>
  );
}

function ScoreView({
  score,
  total,
  topicId,
  onRetry,
}: {
  readonly score: number;
  readonly total: number;
  readonly topicId: string;
  readonly onRetry: () => void;
}) {
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`quiz-best-${topicId}`);
    if (stored) {
      setBestScore(Number.parseInt(stored, 10));
    }
  }, [topicId]);

  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">結果</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div>
          <p
            className={`text-5xl font-bold ${isPerfect ? "text-emerald-400" : "text-zinc-100"}`}
          >
            {score} / {total}
          </p>
          <p className="mt-2 text-lg text-zinc-400">正答率 {percentage}%</p>
        </div>
        <div className="text-sm text-zinc-500">
          最高スコア: {bestScore} / {total}
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={onRetry}>もう一度挑戦</Button>
          <Link href="/quiz">
            <Button variant="secondary">トピック一覧へ</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
