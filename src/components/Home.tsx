import { APPLICATION_STEP, ApplicationStateStore } from '../store/ApplicationStateStore';
import { useEffect, useRef, useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionnairesFlow } from './questionnaires/QuestionnairesFlow';
import { Summary } from './Summary';
import { observer } from 'mobx-react-lite'
import { AppCommandBar } from './AppCommandBar';
import { Spinner } from '@fluentui/react-components';
import { useQuestions } from './hooks/useQuestions';
import { FirstSectionIntro } from './FirstSectionIntro';
import { CompletedSecondSection } from './CompletedSecondSection';
import { useAnonymousResults } from './hooks/useAnonymousResults';
import { useSearchParams } from 'react-router-dom';

export const Home: React.FC = observer(() => {

  const cardRef = useRef<HTMLDivElement>(null);
  const questions = useQuestions();
  const { optOutOfAnonymousDataCollection, sendAnonymousResults } = useAnonymousResults();
  const [appStateStore, setAppStateStore] = useState<ApplicationStateStore>();
  const [searchParams,] = useSearchParams();

  useEffect(() => {
    const idFromUrl = searchParams.get("externalId");
    console.log(idFromUrl);
    if (questions) {
      setAppStateStore(new ApplicationStateStore(questions, idFromUrl));
    }
  }, [questions]);

  const nextAndScrollToTop = () => {
    appStateStore?.next();
    cardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="flex-column flex-1 full-width" ref={cardRef}>
            {
        !appStateStore &&
        <Spinner/>
      }
      {
        appStateStore &&
        <>
          {
            appStateStore.step !== APPLICATION_STEP.WELCOME &&
            <AppCommandBar appStateStore={appStateStore}/>
          }
          {
            appStateStore.step === APPLICATION_STEP.WELCOME &&
            <WelcomeScreen onNextClicked={nextAndScrollToTop}/>
          }         
          {
            appStateStore.step === APPLICATION_STEP.FIRST_SECTION_INTRO &&
            <FirstSectionIntro onNextClicked={(optOut: boolean) => {
              if (optOut) {
                optOutOfAnonymousDataCollection();
              }
              nextAndScrollToTop();
            }}/>
          }
          {
            appStateStore.step === APPLICATION_STEP.QUESTIONNAIRES &&
            <QuestionnairesFlow questionnairesStore={appStateStore.questionnairesStore}/>
          }
          {
            appStateStore.step === APPLICATION_STEP.COMPLETED_QUESTIONNAIRES &&
            <CompletedSecondSection resultsStore={appStateStore.resultsStore} onNextClicked={nextAndScrollToTop}/>
          }
          {
            appStateStore.step === APPLICATION_STEP.SUMMARY &&
            <Summary resultsStore={appStateStore.resultsStore}
                     sendAnonymousResults={sendAnonymousResults}/>
          }
        </>
      }
    </div>
  );
});

