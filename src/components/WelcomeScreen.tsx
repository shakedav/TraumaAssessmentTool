import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useFirebase } from './hooks/useFirebase';
import { StickyBottomButtonPage } from './StickyButtonPage';
import { Button, Divider, Checkbox } from '@fluentui/react-components';
import { ChevronLeft24Filled } from '@fluentui/react-icons';
import { mobile, smallDesktop } from './styles/style.consts';

const StartButtonText = 'שנתחיל?';

export const WelcomeScreen: React.FC<WelcomeScreenProps> = observer(({ onNextClicked }) => {
  const [optOut, setOptOut] = useState<boolean>(false);

  const { logEvent } = useFirebase();
  useEffect(() => {
    logEvent('welcome_page_visited');
  }, [logEvent]);

  return (
    <div className="flex-column flex-1">
      <Container>
        <RightColumn>
          <StyledImage className="full-width" src="/blue-male.png"/>
        </RightColumn>
        <LeftColumn>
          <StickyBottomButtonPage className="full-height" buttonText={StartButtonText} onButtonClick={() => onNextClicked(optOut)} smallScreenOnly>
            <div className="flex-column space-between flex-1">
              <div className="flex-column">
                <StyledHeader>שאלון לבדיקה עצמית של תוכנית עמית</StyledHeader>
                <p>
                  החזרה לשגרה אחרי ימים של מלחמה, בחזית ובעורף, היא לא קלה. לפעמים צריך ליווי, עזרה וחיזוק - ולכן אנחנו כאן. כדי לתת לך את העזרה שתתאים לך צריך לדעת היכן מופיעים הקשיים שלך ומהי עוצמתם; לכך נועד השאלון הבא, שפותח בחסות ובמעורבות המועצה הלאומית לפוסט טראומה. <br />
                  בסופו מחכה לך הערכת מצב וגם המלצות מדויקות לסיוע. <br />
                  זמן המענה על השאלות הוא לא ארוך במיוחד, ובתמורה אפשר לקבל המון. זוהי השקעה נהדרת בעצמך.
                </p>
                <p>
                  <strong>מה עוד כדאי לדעת?</strong><br />
                  <ul>
                    <li>
                      השאלות נוסחו ותוקפו על ידי אנשי מקצוע ומשמשות כבר שנים בדיוק עבור מצבי חיים כאלה.
                    </li>
                    <li>
                      גילינו שלפעמים אפילו עצם המענה על השאלון מרגיע ומקל, בכך שהוא מאפשר מבט פנימה.
                    </li>
                    <li>
                      בכמה מהשאלות יחזור הביטוי "אירוע קשה או טראומטי". אירוע כזה יכול להיות חשיפה למראות קשים, סכנת חיים, פציעה, לחץ – או כל חוויה אחרת שהביאה אותך אלינו.
                    </li>
                  </ul>
                </p>
              </div>
              <StyledTextContainer>
                <Divider className="margin-top-xl" appearance="brand"/>
                <ButtonContainer className="flex-row space-between align-center">
                  <StyledButton appearance="primary" size="large" shape="circular" onClick={() => onNextClicked(optOut)}
                                icon={<ChevronLeft24Filled/>} iconPosition="after">
                    {StartButtonText}
                  </StyledButton>
                </ButtonContainer>
                <div className="full-width align-text-center">
                    <Checkbox label="אני מאשר/ת איסוף מידע אנונימי לצרכי מחקר ושיפור כלי זה" checked={!optOut}
                              onChange={() => setOptOut(!optOut)}/>
                  </div>
                <Divider className="margin-bottom-xl" appearance="brand"/>                
              </StyledTextContainer>
            </div>
          </StickyBottomButtonPage>
        </LeftColumn>
      </Container>
      <Footer>
        <div className="margin-bottom-xs">הכלי פותח בשיתוף המועצה הלאומית לפוסט-טראומה.</div>
        <div>פיתוח מקצועי ותוכן: פרופ' אריה שלו, פרופ' שרה פרידמן, ד"ר יעל שובל-צוקרמן. </div>
        <div>פיתוח אפליקציה: שקד אברהם.</div>
        <div>מנהל הפרויקט: צחי זאבי.</div>
      </Footer>
    </div>
  );
});

export type WelcomeScreenProps = {
  onNextClicked: (optOut: boolean) => void;
}

const StyledHeader = styled.h1`
          @media (max-width: ${mobile.max}) {
            text-align: center;
          }
  `,
  StyledUl = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 8px;
    margin-bottom: 24px;
    padding-inline-start: 20px;
  `,
  StyledH2 = styled.h2`
    margin-top: 16px;
    margin-bottom: 16px;
  `,
  StyledTextContainer = styled.div`
    text-align: right;
  `,
  StyledButton = styled(Button)`
    width: 300px;
    height: 54px;
    font-size: 20px;
    margin: 32px;
    @media (max-width: ${smallDesktop.max}) {
      margin: 0 16px 32px;
    }
    @media (max-width: ${mobile.max}) {
      display: none;
    }
  `,
  ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  `,
  StyledImage = styled.img`
    width: 90%;
    box-sizing: border-box;
    padding: 32px;
    @media (max-width: ${mobile.max}) {
      padding: 24px;
      max-width: 400px;
    }
  `,
  Container = styled.div`
    background: #f8f8f8;
    flex: 1;
    display: flex;
    flex-direction: column;
    @media (min-width: ${mobile.min}) {
      flex-direction: row;
    }
  `,
  RightColumn = styled.div`
    background: white;
    flex: 0 0 40%;
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    @media (max-width: ${mobile.max}) {
      flex: 0;
    }
  `,
  LeftColumn = styled.div`
    background: #f8f8f8;
    height: 100%;
    overflow-y: auto;
    flex: 1;
    order: 2;
    @media (max-width: ${mobile.max}) {
      background: white;
      flex: 1;
    }
  `,
  Footer = styled.div`
    background: #e8e8e8;
    color: #b2b2b2;
    padding: 32px;
    text-align: center;
  `;
