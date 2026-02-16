export type QuestionType = "multiple-choice" | "ordering" | "fill-blank";

export interface MultipleChoiceQuestion {
  readonly type: "multiple-choice";
  readonly id: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface OrderingQuestion {
  readonly type: "ordering";
  readonly id: string;
  readonly question: string;
  readonly items: readonly string[];
  readonly correctOrder: readonly number[];
  readonly explanation: string;
}

export type QuizQuestion = MultipleChoiceQuestion | OrderingQuestion;

export interface QuizTopic {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly questions: readonly QuizQuestion[];
}
