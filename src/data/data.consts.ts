
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
  Assistance: 'Assistance',
  EXTRA_INFO: 'מידע נוסף',
  CSE: 'CSE'
} as const;

export type QuestionnaireName = typeof QuestionnaireNames[keyof typeof QuestionnaireNames];

export const QUESTIONNAIRE_NAME_TO_PURPOSE: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.Dissociation]: 'דיסוציאציה',
  [QuestionnaireNames.Derealization]: 'דיריאליזציה',
  [QuestionnaireNames.CGI]: 'תפיסה עצמית של חומרת המצב',
  [QuestionnaireNames.K5]: 'דיווח מצוקה',
  [QuestionnaireNames.SAST]: 'מתח וחרדה',
  [QuestionnaireNames.PCL_5]: 'סימני PTSD',
  [QuestionnaireNames.GAD_7]: 'שאלון חרדה',
  [QuestionnaireNames.PHQ_8]: 'שאלון דיכאון',
  [QuestionnaireNames.Assistance]: 'רצון בקבלת עזרה',
  [QuestionnaireNames.CSE]: 'התמודדות יעילה'

}

export const QUESTIONNAIRE_NAME_TO_ELEMENT: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.CGI]: 'מצוקה כללית',
  [QuestionnaireNames.K5]: 'מצוקה',
  [QuestionnaireNames.SAST]: 'מתח',
  [QuestionnaireNames.PCL_5]: 'פוסט־טראומה',
  [QuestionnaireNames.GAD_7]: 'חרדה',
  [QuestionnaireNames.PHQ_8]: 'דיכאון',
  [QuestionnaireNames.Assistance]: 'מצוקה',
  [QuestionnaireNames.CSE]: 'התמודדות יעילה'
}

export const QUESTIONNAIRE_NAME_TO_SYMPTOMS: Partial<Record<QuestionnaireName, string>> = {
  [QuestionnaireNames.Dissociation]: 'לפעמים יש לך תחושת ריחוק או ניתוק ממה שקורה סביבך.',
  [QuestionnaireNames.SAST]: 'אי־שקט ומצב רוח רע',
  [QuestionnaireNames.K5]: 'הנך חווה כיום מצוקה משמעותית. כדאי לנסות לזהות את מקורות המצוקה שלך ולהפחית אותם בעצמך, בעזרת אחרים (חברים ומשפחה) או לחלופין בעזרת איש/אשת מקצוע. חשוב לא להשאיר אזורי מצוקה ללא התערבות.',
  [QuestionnaireNames.PCL_5]: 'הנך חווה מצבי מצוקה הקשורים לאירועים שעברת.',
  [QuestionnaireNames.GAD_7]: 'יש לך חוויית חרדה משמעותית.',
  [QuestionnaireNames.PHQ_8]: 'הנך חווה עצב ומצב רוח ירוד.',
  [QuestionnaireNames.Assistance]: 'יש לך רצון בייעוץ או הדרכה אישית. חשוב לא לדחות זאת.',
  [QuestionnaireNames.CSE]: 'הנך מנסה להתמודד עם אתגרי החיים, אך עדיין מתקשה בביצוע מטלות , אינך מרוצה מעצמך, אינך חווה הצלחה בשליטה ברגשות או שהנך מתקשה להיות בקשרים רגשיים עם אחרים.לעתים קרובות הקשיים האלו מתפוגגים עם הזמן והכניסה לחיים פעילים. אם זה לא קורה, כדאי לנסות לזהות את הסיבות למצוקה ולצמצם אותן, בעצמך או דרך שיחות עם חברים ומשפחה. לפעמים לוקח זמן לחזור לשגרה, אבל אם מבטאים ומתייחסים למצוקה זמן זה מתקצר'
}

export const PHQ8SuicidalQuestionIndex = 7;
export const PHQ8SuicidalQuestionThreshold = 1;
