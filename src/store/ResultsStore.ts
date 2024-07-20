import { computed, makeAutoObservable } from 'mobx';
import _ from 'lodash';
import { QuestionnairesStore } from './QuestionnairesStore';
import { QuestionBase } from '../components/questionnaires/base/types';
import { QuestionnairesSummary, SECOND_STAGE_RESULT_CATEGORY, SecondStageResultCategory } from './types';
import { exportToPdf } from './pdf-utils';
import {
  QUESTIONNAIRE_NAME_TO_ELEMENT,
  QUESTIONNAIRE_NAME_TO_SYMPTOMS,
  QuestionnaireTypes,
  PHQ8SuicidalQuestionIndex,
  PHQ8SuicidalQuestionThreshold,
  QuestionnaireNames
} from '../data/data.consts';

export class ResultsStore {

  constructor(private questionnairesStore: QuestionnairesStore) {
    makeAutoObservable(this);
  }

  @computed
  get summary(): QuestionnairesSummary {
    return _.reduce(this.questionnairesStore.questions, (acc, question, index) => {
      const { questionnaire, questionnaireType } = question;     
      const score = this.questionnairesStore.questionnaireScores[index]?.score;
      const didPassThreshold = this.questionnairesStore.questionnaireScores[index]?.didPassThreshold;
      const isDangerousSituation = this.questionnairesStore.questionnaireScores[index]?.isDangerousSituation;
      if (score === undefined) {
        return acc;
      }
      if (questionnaireType === QuestionnaireTypes.MULTI_DISCRETE_SCALE) {
        return [...acc, ...(this._getMultiDiscreteScaleQuestionnaireSummary(score, question, didPassThreshold, isDangerousSituation))];
      }
      return [...acc, {
        questionnaireName: questionnaire,
        questionnaireType,
        didPassThreshold,
        isDangerousSituation,
        score: this._getQuestionnaireSummaryScore(question, score),
        ...this.questionnairesStore.getQuestionnaireRange(question),
      }];
    }, []);
  }

  @computed
  get questionnairesOverThreshold(): QuestionnairesSummary {
    return _.filter(this.summary, ({ didPassThreshold }) => didPassThreshold);
  }

  @computed
  get secondStageResultCategory(): SecondStageResultCategory {
    // Negative if all questionnaires are under the threshold
    // Slightly positive if 1-2 questionnaires are not more than 20% over the threshold
    // Positive else
    if (this.questionnairesOverThreshold.length === 0) {
      return SECOND_STAGE_RESULT_CATEGORY.NEGATIVE;
    }
    if (this.questionnairesOverThreshold.length < 3) {
      const isSlightlyPositive = this.questionnairesOverThreshold.every(({
                                                                           score,
                                                                           maxScore,
                                                                           minThreshold
                                                                         }) => {
        if (typeof score !== 'number') {
          return true;
        }
        const percentage = this._percentOverThreshold(score, maxScore, minThreshold);
        return percentage <= 20;
      });
      if (isSlightlyPositive && !this.phq8SuicidalPositive) {
        return SECOND_STAGE_RESULT_CATEGORY.SLIGHTLY_POSITIVE;
      }
    }
    return SECOND_STAGE_RESULT_CATEGORY.POSITIVE;
  }

  @computed
  get resultsElements(): string | null {
    const elements = _.chain(this.summary)
      .filter(s => !_.isNil(s.score))
      .map(s => QUESTIONNAIRE_NAME_TO_ELEMENT[s.questionnaireName])
      .filter(Boolean)
      .uniq()
      .value();
    return this._toDelimitedString(elements);
  }

  @computed
  get resultsSymptoms() {
    if (this.secondStageResultCategory === SECOND_STAGE_RESULT_CATEGORY.NEGATIVE) {
      return null;
    }

    const pcl5AndDissSymptom = 'custom_symptom';

    // Check if "PCL-5" and "Dissociation" exist in the array
    const pcl5Exists = this.questionnairesOverThreshold.some(q => q.questionnaireName === QuestionnaireNames.PCL_5);
    const dissociationExists = this.questionnairesOverThreshold.some(q => q.questionnaireName === QuestionnaireNames.Dissociation);

    // Generate the results array excluding "PCL-5" and "Dissociation"
    const results = _.chain(this.questionnairesOverThreshold)
          .filter(q => q.questionnaireName !== QuestionnaireNames.PCL_5 && q.questionnaireName !== QuestionnaireNames.Dissociation)
          .map(q => QUESTIONNAIRE_NAME_TO_SYMPTOMS[q.questionnaireName])
          .filter(Boolean)
          .uniq()
          .value();

    // Add the custom value if either "PCL-5" or "Dissociation" exist
    if (pcl5Exists && dissociationExists) {
        results.unshift(QUESTIONNAIRE_NAME_TO_SYMPTOMS[QuestionnaireNames.Dissociation]);
    } else {
      if (pcl5Exists) {
        results.unshift(QUESTIONNAIRE_NAME_TO_SYMPTOMS[QuestionnaireNames.PCL_5]);
      }
    }

    console.log(results);
    return results;
  }

  @computed
  get resultsSymptomsString(): string | null {
    return this._toDelimitedString(this.resultsSymptoms);
  }

  @computed
  get phq8SuicidalPositive(): boolean {
    const phqIndex = this.questionnairesStore.questions.findIndex(q => q.questionnaire === 'PHQ-8');
    const suicidalQuestionScore = this.questionnairesStore.questionnairesStates[phqIndex]?.[PHQ8SuicidalQuestionIndex];
    return !_.isNil(suicidalQuestionScore) && suicidalQuestionScore >= PHQ8SuicidalQuestionThreshold;
  }

  @computed
  get resultsVerbalSummary(): { summaryTitle?: string, summary: string[]; actions: string[]; } {
    const baseActions = [
      'אם רוצים, כדאי לדבר עם אדם שסומכים עליו, קרוב/ה או חבר/ה, ולשתף במה שאת/ה מרגיש/ה וחווה, ולא להישאר לבד עם התחושות הקשות.',
      'אפשר ליצור קשר עם ארגוני תמיכה נפשית כמו ער"ן (1-201), נט"ל (1-800-363-363), או סה"ר (https://sahar.org.il) אם מרגישים מצוקה גדולה כרגע.',
    ];
    const negativeActions = [
      'אם את/ה בכל זאת מרגיש/ה צורך בכך, כדאי לפנות לייעוץ בהקדם. באפשרותך להדפיס את התוצאות ולהציגן למטפל/ת שתבחרי או לרופא/ת המשפחה, כדי לקבל עזרה או לקבל המלצות לטיפול נוסף.',
      'כדאי לחזור ולבצע שוב את ההערכה בעוד שבועיים, כדי לוודא שהמצב נשאר יציב והתגובות עדיין תקינות.',
      ...baseActions,
    ];
    switch (this.secondStageResultCategory) {
      case SECOND_STAGE_RESULT_CATEGORY.NEGATIVE:
        // if (this.questionnairesStore.skippedSecondSection) {
        //   return {
        //     summary: ['הסימנים עליהם דיווחת דומים לאלה שרוב האנשים מרגישים. הם אינם מדאיגים ויחלפו עם הזמן וכאשר האירועים יירגעו, ונראה שאינך זקוק/ה לעזרה טיפולית כרגע. ' +
        //       'יש לך כוח היום לעזור לאחרים, לשמור על שיגרת החיים, לתת למי שצריך או צריכה, וגם לנהל חיים בריאים. '],
        //     actions: negativeActions,
        //   }
        // }
        return {
          summary: ['דיווחת על רמות מצוקה, שאופייניות להרבה אנשים שעברו התנסויות כמו אלה שלך. לידיעתך: רוב האנשים המדווחים על רמות מצוקה כמו שלך יכולים לקבל מספיק תמיכה ועידוד מחברים ומהמשפחה, להיעזר על ידי תחושת מטרה לעזור לאחרים ולאחר מכן לחזור לחיים בריאים. אנו ממליצים לך לחזור ולבצע את ההערכה שכרגע גמרת כל כמה זמן כדי לעקוב אחרי מצבך.'],
          actions: negativeActions,
        };
      case SECOND_STAGE_RESULT_CATEGORY.SLIGHTLY_POSITIVE:
        return {
          summary: ['בתחומים אחרים הסימפטומים שלך אינם שונים ממה שאנשים מרגישים בדרך כלל במצבים דומים.',
          'אין הכרח לפנות לעזרה מקצועית עכשיו, ורוב הסיכויים הם שתחלימ/י עם חלוף הזמן ועם תמיכה של אחרים.'],
          actions: [
            'אם את/ה בכל זאת מרגיש/ה צורך בכך, או אם את/ה מאוד לבד או במצוקה - כדאי לפנות לייעוץ.',
            'בכל מקרה כדאי לחזור ולבצע שוב את ההערכה בעוד שבועיים.',
            ...baseActions,
          ],
        };
      case SECOND_STAGE_RESULT_CATEGORY.POSITIVE:
        return {
          summaryTitle: 'אתה יכול לעזור להתאוששות שלך על ידי שמירה על קשר ובילוי זמן יחד עם אנשים, לא לבודד את עצמך או להישאר לבד, לעסוק בפעילויות ולראות אם אתה יכול לעזור לאנשים אחרים סביבך.',
          summary: ['חשוב לבדוק שוב את מצבך בעוד שבועיים-שלושה כדי לוודא שאת/ה על מסלול התאוששות והסימפטומים שלך נעלמים לאט.',
                 'אם זה לא קורה, או אם את/ה לא רוצה לחכות ומרגיש/ה שאת/ה זקוק/ה לתמיכה מקצועית עכשיו – השתמש/י בדו"ח הנ"ל כדי ליידע את המטפל שלכם (למשל, רופא המשפחה) שיש נושאים בחייכם שדורשים הערכה ותמיכה נוספת.',
                 'כמו כן, אם נראה שמישהו סביבך זקוק לתשומת לב, עודדו אותו להשתמש בכלי זה כדי להעריך את עצמו, ואם יש צורך, לבקש עזרה.',
                 'וחשוב במיוחד: אל תימנע/י מלבקש עזרה אם הלב שלך אומר לך שאת/ה צריך/ה לעשות את זה או אם אנשים סביבך מייעצים לך לחפש הערכה אישית.'],
         actions: [
            'כדאי לפנות ראשית לגורם הכי זמין – למשל רופא/ת המשפחה או עובד/ת סוציאלי/ת. כדאי לשמור את התוצאות בדף זה ולהשתמש בהן כדי לעזור בפנייתך.',
            ...baseActions,
          ],
        };
      default:
        return { summary: [''], actions: [] };
    }
  }

  public async exportToPdf() {
    return exportToPdf(this.summary.filter(questionaire => ![QuestionnaireNames.Derealization.toString(), QuestionnaireNames.Dissociation.toString()].includes(questionaire.questionnaireName)), this.resultsVerbalSummary.summary, this.resultsVerbalSummary.actions,
      this.resultsSymptomsString);
  }

  private _getQuestionnaireSummaryScore(questionnaire: QuestionBase, score: number | string): number | string {
    if (questionnaire.questionnaireType === QuestionnaireTypes.TRUE_FALSE) {
      return score === 0 ? 'לא' : 'כן';
    }
    return score;
  }

  private _toDelimitedString(elements: string[] | null) {
    if (!elements || elements?.length === 0) {
      return null;
    }
    if (elements.length === 1) {
      return elements[0];
    }
    return elements.slice(0, elements.length - 1).join(', ') + ' ו' + elements.slice(-1).pop();
  }

  private _getMultiDiscreteScaleQuestionnaireSummary(scores, question, didPassThreshold, isDangerousSituation) {
    return scores.map((qScore, qIndex) => {
      return ({
        questionnaireName: question.questionnaires[qIndex].questionnaire,
        questionnaireType: QuestionnaireTypes.DISCRETE_SCALE,
        score: qScore,
        didPassThreshold,
        isDangerousSituation,
        ...this.questionnairesStore.getQuestionnaireRange(question.questionnaires[qIndex]),
      });
    });
  }

  private _percentOverThreshold(score: number, max: number, minThreshold: number): number {
    return Math.round((score - minThreshold) / (max - minThreshold) * 100);
  }
}
