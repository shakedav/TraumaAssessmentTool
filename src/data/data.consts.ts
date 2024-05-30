
export const QuestionnaireTypes = {
  MIN_MAX_SCALE: 'min-max-scale',
  DISCRETE_SCALE: 'discrete-scale',
  YES_NO: 'yes-no',
  FREE_NUMERIC: 'free-numeric',
  CONDITION_QUESTIONNAIRE: 'condition-questionnaire',
  FREE_TEXT: 'free-text',
  MULTI_DISCRETE_SCALE: 'multi-discrete-scale',
  TRUE_FALSE: 'true-false',
} as const;

export type QuestionnaireType = typeof QuestionnaireTypes[keyof typeof QuestionnaireTypes];

export const QuestionnaireNames = {
  CGI: 'CGI',
  K5: 'K5',
  Dissociation: 'Dissociation',
  Derealization: 'Derealization',
  SAST: 'SAST',
  PCL_5: 'PCL-5',
  GAD_7: 'GAD-7',
  PHQ_8: 'PHQ-8',
  WANT_HELP: 'צורך/רצון בעזרה מקצועית',
  EXTRA_INFO: 'מידע נוסף',
  CSE: 'CSE'
} as const;

export type QuestionnaireName = typeof QuestionnaireNames[keyof typeof QuestionnaireNames];

export const QUESTIONNAIRE_NAME_TO_PURPOSE: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.CGI]: 'מצוקה',
  [QuestionnaireNames.K5]: 'מצוקה',
  [QuestionnaireNames.Dissociation]: 'דיסוציאציה',
  [QuestionnaireNames.Derealization]: 'דיסוציאציה',
  [QuestionnaireNames.SAST]: 'מתח וחרדה',
  [QuestionnaireNames.PCL_5]: 'סימני PTSD (מלא)',
  [QuestionnaireNames.GAD_7]: 'שאלון חרדה (מלא)',
  [QuestionnaireNames.PHQ_8]: 'שאלון דיכאון (מלא)',
  [QuestionnaireNames.WANT_HELP]: 'מצוקה כללית',
  [QuestionnaireNames.CSE]: 'התמודדות יעילה'

}

export const QUESTIONNAIRE_NAME_TO_ELEMENT: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.CGI]: 'מצוקה כללית',
  [QuestionnaireNames.K5]: 'מצוקה',
  [QuestionnaireNames.Dissociation]: 'דיסוציאציה',
  [QuestionnaireNames.Derealization]: 'דיסוציאציה',
  [QuestionnaireNames.SAST]: 'מתח',
  [QuestionnaireNames.PCL_5]: 'פוסט־טראומה',
  [QuestionnaireNames.GAD_7]: 'חרדה',
  [QuestionnaireNames.PHQ_8]: 'דיכאון',
  [QuestionnaireNames.WANT_HELP]: 'מצוקה',
  [QuestionnaireNames.CSE]: 'התמודדות יעילה'
}

export const QUESTIONNAIRE_NAME_TO_SYMPTOMS: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.Dissociation]: 'אובדן קשר עם מה שקורה לך או סביבך',
  [QuestionnaireNames.Derealization]: 'אובדן קשר עם מה שקורה לך או סביבך',
  [QuestionnaireNames.SAST]: 'אי־שקט ומצב רוח רע',
  [QuestionnaireNames.PCL_5]: 'סימני פוסט־טראומה',
  [QuestionnaireNames.GAD_7]: 'חרדה',
  [QuestionnaireNames.PHQ_8]: 'עצב או דיכאון',
  [QuestionnaireNames.WANT_HELP]: 'רצון בייעוץ או טיפול',
  [QuestionnaireNames.CSE]: 'התמודדות יעילה'
}

export const PHQ8SuicidalQuestionIndex = 7;
export const PHQ8SuicidalQuestionThreshold = 1;
