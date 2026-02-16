import type { QuizTopic } from "../types";
import { basicsTopic } from "./basics";
import { tokensTopic } from "./tokens";
import { flowsTopic } from "./flows";
import { securityTopic } from "./security";
import { oidcTopic } from "./oidc";

export const quizTopics: readonly QuizTopic[] = [
  basicsTopic,
  tokensTopic,
  flowsTopic,
  securityTopic,
  oidcTopic,
];

export function findTopicById(id: string): QuizTopic | undefined {
  return quizTopics.find((topic) => topic.id === id);
}
