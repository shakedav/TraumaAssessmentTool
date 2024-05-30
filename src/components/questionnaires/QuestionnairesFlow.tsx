import { QuestionnairesStore } from '../../store/QuestionnairesStore';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { OnNextClickedFunction, QuestionBase, questionTypeToComponentMap } from './base/types';
import { QuestionnaireContext } from '../../store/QuestionnaireContext';
import { useFirebase } from '../hooks/useFirebase';

export const QuestionnairesFlow: React.FC<QuestionnairesFlowProps> = observer(({ questionnairesStore }) => {

  const { logEvent } = useFirebase();
  const onNextClicked = useCallback((state: unknown, didPassThreshold: boolean, isDangerousSituation: boolean, score?: number | string) => {
      logEvent('next_question', questionnairesStore.analyticsData);
      questionnairesStore.nextQuestion(state, didPassThreshold, isDangerousSituation, score);
      scrollToTop();
    }
    , [logEvent, questionnairesStore]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    logEvent('questionnaires_started');
  }, [logEvent]);


  return <div className="full-width flex-column full-height">
    {      
      <QuestionnaireContext.Provider value={questionnairesStore.questionnaireContext}>
        {
          useQuestionnaireComponent(questionnairesStore.currentQuestion, questionnairesStore.currentQuestionState, onNextClicked)
        }
      </QuestionnaireContext.Provider>
    }
  </div>;
});

export const useQuestionnaireComponent = (questionnaire: QuestionBase, initialState: unknown, onNextClicked?: OnNextClickedFunction) => {
  const QuestionnaireComponent = questionTypeToComponentMap[questionnaire.questionnaireType];
  return (
    <QuestionnaireContainer>
      <QuestionnaireComponent key={questionnaire.questionnaire}
                              {...questionnaire}
                              initialState={initialState}
                              onNextClicked={onNextClicked}/>
    </QuestionnaireContainer>
  );
};

export type QuestionnairesFlowProps = {
  questionnairesStore: QuestionnairesStore;
}

const QuestionnaireContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 24px;
  @media (max-width: 390px) {
    border-radius: 0;
    padding: 16px;
  }
`;
