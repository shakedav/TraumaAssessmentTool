import { action, computed, makeAutoObservable } from 'mobx';
import _ from 'lodash';
import { QuestionBase } from '../components/questionnaires/base/types';
import { QuestionnaireRange } from './types';
import { QuestionnaireTypes } from '../data/data.consts';
import { QuestionnaireContextType } from './QuestionnaireContext';

export class QuestionnairesStore {

  questionnaireIndex: number = 0;
  questionnaireScores = Array<{ score: number | string; didPassThreshold: boolean; isDangerousSituation: boolean; }>(this.questions.length);
  questionnairesStates = Array<unknown>(this.questions.length);
  skippedSecondSection: boolean = false;
  
  constructor(public skipToSummary: () => void, private completedQuestionnaires: () => void, public questions: QuestionBase[]) {
    makeAutoObservable(this);
  }

  @computed
  get currentQuestion(): QuestionBase {
    return this.questions[this.questionnaireIndex];
  }

  @computed
  get analyticsData() {
    return {
      currentQuestionnaireName: this.currentQuestion.questionnaire,
      nextQuestionnaireName: this.questions[this.questionnaireIndex + 1]?.questionnaire,
    };
  }

  @computed
  get currentQuestionState(): unknown {
    return this.questionnairesStates[this.questionnaireIndex];
  }

  @computed
  get progress(): number {
    return this.questionnaireIndex;
  }

  @computed
  get maxProgress(): number {
    return (this.questions.length);
  }

  @computed
  get questionnaireContext(): QuestionnaireContextType {
    return  {
      progress: this.progress,
      maxProgress: this.maxProgress,
    }
  }


  @computed
  get stepDisplayName() {
    return this.currentQuestion?.questionnaire;
  }

  public getQuestionnaireRange(question): QuestionnaireRange | Record<string, never> {
    const subQuestionsCount = question.questions?.length;
    switch (question.questionnaireType) {
      case QuestionnaireTypes.MIN_MAX_SCALE:
        return {
          minThreshold: question.minThreshold,          
          maxThreshold: question.maxThreshold,
          maxScore: question.max,
          minScore: question.min,
        };
      case QuestionnaireTypes.DISCRETE_SCALE:
        return {
          minThreshold: question.minThreshold,
          maxThreshold: question.maxThreshold,     
          maxScore: _.maxBy(question.answers, 'value').value * subQuestionsCount,
          minScore: _.minBy(question.answers, 'value').value * subQuestionsCount,
        };
      case QuestionnaireTypes.YES_NO:
        return {
          minThreshold: question.minThreshold,
          maxThreshold: question.maxThreshold,
          maxScore: question.questions.length,
          minScore: 0,
        };
      case QuestionnaireTypes.CONDITION_QUESTIONNAIRE:
        return this.getQuestionnaireRange(question.conditionQuestionnaire);
      case QuestionnaireTypes.TRUE_FALSE:
        return {
          minThreshold: 1,
          maxThreshold: 1,
          maxScore: 1,
          minScore: 0,
        };
      default:
        return {};
    }
  }

  @action
  previousQuestion() {
    this.questionnaireIndex--;
  }

  @action
  nextQuestion(currentState: unknown, didPassThreshold: boolean, isDangerousSituation: boolean, score?: number | string) {
    const conditionQuestionFalseAnswer = this._isConditionQuestionWithFalseAnswer(score);
    if (!conditionQuestionFalseAnswer) {
      this.questionnairesStates[this.questionnaireIndex] = currentState;
      this.questionnaireScores[this.questionnaireIndex] = { score: score ?? 0, didPassThreshold, isDangerousSituation };
    }
    const finishedAllQuestionnaires = this.questionnaireIndex === this.questions.length - 1;
    if (finishedAllQuestionnaires) {
      this.completedQuestionnaires();
      return;
    }
    this.questionnaireIndex++;
  }


  private _isConditionQuestionWithFalseAnswer(score?: number | string) {
    return this.currentQuestion?.questionnaireType === QuestionnaireTypes.CONDITION_QUESTIONNAIRE && score === undefined;
  }
}
