import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Button } from '@fluentui/react-components';
import { ChevronLeft16Regular } from '@fluentui/react-icons/lib/fonts';
import { QuestionnairesStore } from '../store/QuestionnairesStore';
import { useEffect } from 'react';
import { useFirebase } from './hooks/useFirebase';

export const SecondSectionIntro: React.FC<SecondSectionIntroProps> = observer(({ questionnairesStore }) => {

  const onPrimaryClicked = () => {
    if (questionnairesStore.requiresSecondSection) {
      logEvent('second_section_start', { voluntary: false });
      questionnairesStore.skippedSecondSection = false;
      questionnairesStore.nextQuestion(true, false, 0);
    } else {
      logEvent('second_section_skipped');
      questionnairesStore.skippedSecondSection = true;
      questionnairesStore.skipToSummary();
    }
  }

  const onSecondaryClicked = () => {
    logEvent('second_section_start', { voluntary: true });
    questionnairesStore.skippedSecondSection = false;
    questionnairesStore.nextQuestion(false, false, 0);
  }

  const { logEvent } = useFirebase();
  useEffect(() => {
    logEvent('second_section_intro_visited', { shouldProceed: questionnairesStore.requiresSecondSection });
  }, [logEvent, questionnairesStore.requiresSecondSection]);

  return (
    <IntroContainer>
      <div>
        <StyledImage src="/second-section.png"/>
        <h1 className="margin-bottom-xxs">חלק א' הושלם!</h1>
        <StyledText className="margin-bottom-xl">
          <p>
            {
              'תודה רבה על שהשלמת את החלק הראשון של השאלון.\n'
            }
          </p>
          <p>
            {
              questionnairesStore.requiresSecondSection &&
              `כעת נעבור לשלב הבא שבו יוצגו בפניך שאלות מפורטות ומעמיקות יותר. השאלות הללו נחוצות לצורך קבלת תמונה מלאה ומדויקת של תגובותיך וחוויותיך. יכול להיות שחלק מהשאלות יעסקו בנושאים שכבר נגענו בהם במהלך החלק הראשון. להרחבה ולהחזרה על נושאים מסוימים יש חלק מאוד חשוב בתהליך ההערכה הכולל, ואנחנו מעריכים את שיתוף הפעולה והסבלנות שלך!`
            }
            {
              !questionnairesStore.requiresSecondSection &&
              `לנוכח האירועים שעברת תגובותיך אינן חריגות, ואנו מעודדים אותך לסיים את התהליך בלחיצה על "סיום האבחון". אם את/ה מעוניינ/ת בכל זאת להרחיב ולהעמיק את ההערכה, אפשר לבחור להמשיך לחלק ב'.`
            }
          </p>
        </StyledText>
      </div>
      <StyledButtonsContainer>
        <Button
          size="large"
          appearance="primary"
          className="flex-1 margin-ml"
          icon={questionnairesStore.requiresSecondSection ? <ChevronLeft16Regular/> : undefined}
          iconPosition="after"
          shape="circular"
          onClick={onPrimaryClicked}>
          {
            questionnairesStore.requiresSecondSection ? 'התחלת חלק ב' : 'סיום האבחון'
          }
        </Button>
        {
          !questionnairesStore.requiresSecondSection &&
          <Button
            appearance="secondary"
            className="flex-1 margin-ml"
            shape="circular"
            onClick={onSecondaryClicked}>
             המשך בכל זאת לחלק ב'
          </Button>
        }
      </StyledButtonsContainer>
    </IntroContainer>
  );
});

export type SecondSectionIntroProps = {
  questionnairesStore: QuestionnairesStore;
}

const StyledButtonsContainer = styled.div`
          display: flex;
          flex-direction: column;
          width: 100%;
          row-gap: 16px;
          margin-top: 32px;
  `,
  IntroContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    flex: 1;
    width: 100%;
  `,
  StyledImage = styled.img`
    width: 60%;
    max-width: 250px;
    margin-bottom: 32px;
    @media (max-width: 390px) {
      width: 70%;
      margin-bottom: 8px;
    }
  `,
  StyledText = styled.div`
    white-space: pre-wrap;
  `;

