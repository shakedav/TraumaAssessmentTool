
export type QuestionnairesSummary = ({
  questionnaireName: string;
  questionnaireType: string;
  score: number | string;
  didPassThreshold: boolean;
  isDangerousSituation: boolean;
  isReversed: boolean;
} & QuestionnaireRange)[];

export type QuestionnaireRange = {
  maxScore: number;
  minScore: number;
  minThreshold: number;
  maxThreshold: number;
}

export const SECOND_STAGE_RESULT_CATEGORY = {
  NEGATIVE: 'NEGATIVE',
  POSITIVE: 'POSITIVE',
  SLIGHTLY_POSITIVE: 'SLIGHTLY_POSITIVE',
} as const;

export type SecondStageResultCategory = typeof SECOND_STAGE_RESULT_CATEGORY[keyof typeof SECOND_STAGE_RESULT_CATEGORY];
