import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { QuestionnaireBaseProps } from './types';
import { PagedQuestions } from './PagedQuestions';

export type YesNoProps = QuestionnaireBaseProps & {
  minThreshold: number;
  maxThreshold: number;
  questionTitle: string;
  questions: string[];
}

const answers = [
  { label: 'לא', value: 0 },
  { label: 'כן', value: 1 },
];

export const YesNo: React.FC<YesNoProps> = observer(({
                                                       initialState,
                                                       minThreshold,
                                                       maxThreshold,
                                                       questions,
                                                       questionTitle,
                                                       onNextClicked,
                                                     }) => {

  const onNext = useMemo(() => {
    if (!onNextClicked) {
      return undefined;
    }
    return (answersValues: number[]) => {
      const score = answersValues.reduce((acc, curr) => acc + curr, 0);
      const didPassThreshold = score >= minThreshold;
      const isDangerousSituation = score >= maxThreshold;
      onNextClicked(answersValues, didPassThreshold, isDangerousSituation, score);
    }
  }, [onNextClicked,  minThreshold, maxThreshold]);

  return (
    <PagedQuestions questionTitle={questionTitle} questions={questions} answers={answers} onNext={onNext}
                    initialState={initialState as number[]} />
  );
});
