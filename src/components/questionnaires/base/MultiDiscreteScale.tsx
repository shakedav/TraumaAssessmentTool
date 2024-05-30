import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { QuestionnaireBaseProps } from './types';
import { DiscreteScaleProps } from './DiscreteScale';
import { useCallback, useState } from 'react';
import { PagedQuestions } from './PagedQuestions';

export type MultiDiscreteScaleProps = QuestionnaireBaseProps & {
  minThreshold: number;
  maxThreshold: number;
  questionnaires: DiscreteScaleProps[];
}

export const MultiDiscreteScale: React.FC<MultiDiscreteScaleProps> = observer(({
                                                                                 onNextClicked,
                                                                                 initialState,
                                                                                 minThreshold,
                                                                                 questionnaires,
                                                                               }) => {

  const [allQuestionnaireAnswers, setAllQuestionnaireAnswers] = useState<(number[])[]>(initialState as number[][] ?? []);
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState<number>(0);

  const onQuestionnaireNext = useCallback((index: number, values: number[]) => {
    const newAnswersValues = [...allQuestionnaireAnswers];
    newAnswersValues[index] = values;
    setAllQuestionnaireAnswers(newAnswersValues);
    if (index === questionnaires.length - 1) {
      const scores = _.map(newAnswersValues, a => _.sum(a));
      const questionnairesThatPassedThreshold = _.filter(questionnaires, (q, i) => scores[i] >= q.minThreshold).length;
      onNextClicked?.(newAnswersValues, questionnairesThatPassedThreshold >= minThreshold, scores);
    } else {
      setCurrentQuestionnaireIndex(index + 1);
    }
  }, [allQuestionnaireAnswers, onNextClicked, questionnaires, minThreshold]);

  return (
    <PagedQuestions key={currentQuestionnaireIndex} {...questionnaires[currentQuestionnaireIndex]}
                    onNext={(answers) => onQuestionnaireNext(currentQuestionnaireIndex, answers)}
                    initialState={(initialState as number[][])?.[currentQuestionnaireIndex]}/>
  );
});
