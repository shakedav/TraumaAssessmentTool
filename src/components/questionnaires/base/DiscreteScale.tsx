import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { QuestionnaireBaseProps } from './types';
import { PagedQuestions } from './PagedQuestions';

export type DiscreteScaleProps = QuestionnaireBaseProps & {
  minThreshold: number;
  maxThreshold: number;
  questionTitle: string;
  questions: string[];
  answers: {
    label: string;
    value: number;
  }[];
}

export const DiscreteScale: React.FC<DiscreteScaleProps> = observer(({
                                                                       initialState,
                                                                       minThreshold,
                                                                       maxThreshold,
                                                                       questions,
                                                                       answers,
                                                                       questionTitle,
                                                                       onNextClicked,
                                                                     }) => {
  const onNext = useMemo(() => {
    if (!onNextClicked) {
      return undefined;
    }
    return (answersValues: number[], forcePassthreshold: boolean = false) => {
      const score = answersValues.reduce((acc, curr) => acc + curr, 0);
      const didPassMinThreshold = score >= minThreshold || forcePassthreshold;
      const isDangerousSituation = score >= maxThreshold 
      onNextClicked?.(answersValues, didPassMinThreshold, isDangerousSituation, score)
    }
  }, [onNextClicked, minThreshold, maxThreshold]);

  return (
    <PagedQuestions key={questionTitle} questionTitle={questionTitle} questions={questions} answers={answers} onNext={onNext}
                    initialState={initialState as number[]} />
  );
});
