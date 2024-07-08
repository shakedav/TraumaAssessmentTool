import { Button } from '@fluentui/react-components';
import { SummaryTable } from './SummaryTable';
import { useEffect } from 'react';
import styled from 'styled-components';
import { ResultsStore } from '../store/ResultsStore';
import { QuestionnairesSummary } from '../store/types';
import { useFirebase } from './hooks/useFirebase';
import { useDebugMode } from './hooks/useDebugMode';
import { DebugResults } from './DebugResults';
import { mobile, smallDesktop } from './styles/style.consts';

export const Summary: React.FC<SummaryProps> = ({ resultsStore, sendAnonymousResults }) => {
  const isDangerousSituation = resultsStore.summary.some(item => item.isDangerousSituation);
  const didPassThreshold= resultsStore.summary.some(item => item.didPassThreshold);
  const debugMode = useDebugMode();
  useEffect(() => {
    sendAnonymousResults && resultsStore.summary && sendAnonymousResults(resultsStore.summary);
  }, [resultsStore.summary, sendAnonymousResults]);

  const { logEvent } = useFirebase();
  useEffect(() => {
    logEvent('summary_page_visited', { resultCategory: resultsStore.secondStageResultCategory });
  }, [logEvent, resultsStore.secondStageResultCategory]);

  const exportToPdf = () => {
    logEvent('export_to_pdf', { resultCategory: resultsStore.secondStageResultCategory });
    resultsStore.exportToPdf();
  }

  console.log('Store', JSON.stringify(resultsStore));
  return (
    <StyledSummaryContainer>
      {
        debugMode &&
        <DebugResults resultsSummary={resultsStore.summary}/>
      }
      <h1 className="margin-vertical-sm">תוצאות השאלונים:</h1>
      {
        resultsStore.resultsElements &&
        <div className="margin-bottom-ml">{` בדקנו איתך רמות של ${resultsStore.resultsElements}.`}</div>
      }
      <SummaryTableContainer className="margin-bottom-ml overflow-x">
        <SummaryTable questionnairesSummary={resultsStore.summary}/>
      </SummaryTableContainer>
      {isDangerousSituation && <StyledVerbalSummaryContainer>
        <h1>דיווחת על רמות מצוקה שמחייבות התייעצות והערכה מקצועית – וייתכן גם קבלת עזרה.</h1>
        <StyledUl>
        <p>רופא המשפחה או המרפאה שלך הם הגורם הראשון אליו אפשר לפנות.</p>
        <p>אנא השתמש בדו"ח הכתוב שתקבל בסיום ההערכה כדי ליידע את המטפל שלך (למשל, רופא המשפחה שלך) שאתה זקוק להערכה נוספת ולתמיכה מקצועית.</p>
        <p>אם תזמון הערכה לוקח זמן, בינתיים עליך לנקוט פעולה לא לבודד את עצמך:</p>
        <ul>
            <li>ליצור מעורבות ולבלות זמן עם אנשים.</li>
            <li>מצא מישהו שאתה סומך עליו איתו או איתה תוכל לשוחח בחופשיות - ותן לו או לה ללוות אותך.</li>
            <li>במידת האפשר חזור/חזרי לעסוק בפעילויות - הן בעבודה והן בבילוי.</li>
        </ul>
        <p>הימנע שתיית אלכוהול ונטילת כדורי הרגעה על בסיס קבוע.</p>
        <p>זכור/זכרי והזכירו לסובבים אתכם כי מצוקה קשה היא מוגבלת בזמן, וכאב חריף נעלם עם הזמן.</p>
        <p>אבל אם אינך יכול/ה יותר לסבול את הסימפטומים שלך, בקש/י עזרה מיידית (למשל באמצעות שירותי חירום). שירותים אלה יודעים להקל על כאב נפשי חריף ויכולים לתכנן המשך טיפול. אין כל צורך ולא נכון לסבול לבד. ייאוש הוא יועץ גרוע ומטעה.</p>
        </StyledUl>
      </StyledVerbalSummaryContainer>}
      <StyledVerbalSummaryContainer>
        <h1>סיכום והמלצות:</h1>
        {
          resultsStore.resultsSymptoms?.length > 0 &&
          <>
            <span className="semi-bold">
            כפי שניתן לראות בטבלה דיווחת על רמות מצוקה גבוהות בכמה אזורים, ובהם:
            </span>
            <StyledUl>
              {
                resultsStore.resultsSymptoms.map((s, index) => (
                  <li key={index}>{s}</li>
                ))
              }
            </StyledUl>
          </>
        }
        <div className="margin-bottom-xl margin-top-m">
          {resultsStore.resultsVerbalSummary.summaryTitle}
          <StyledUl>
              {resultsStore.resultsVerbalSummary.summary.map((line, index) => (
                  <li key={index}>{line}</li>
              ))}
          </StyledUl>
          {
            resultsStore.phq8SuicidalPositive &&
            <div className="margin-vertical-ml">
              <div>
              <span className="bold">דיווחת כי לעיתים את/ה חושב/ת שהיה עדיף לו היית מת/ה או שחשב/ת לפגוע בעצמך. </span>
              מחשבות אלו קשורות לא פעם לכאב נפשי ולתחושת בדידות, ואין סיבה להישאר עם זה לבד. יש דרכים רבות לסייע לך להרגיש אחרת.
              </div>
              <div>
               <span className="bold">חשוב לפנות עוד היום לקבלת סיוע ראשוני. </span>
                האפשרויות העומדות לרשותך מפורטות כאן למטה. בנוסף, עמותת סה"ר מציעה <a href="https://ask-s.co.il/">שאלון מקוון</a> ייעודי שיעזור לך להבין את המצב שלך ולקבל עזרה מקצועית.
              </div>
            </div>
          }
          <h1>מה עכשיו?</h1>
          <StyledUl>
            {
              resultsStore.resultsVerbalSummary.actions.map((r, index) => {
                const containsLink = r.includes('http');
                if (containsLink) {
                  const linkRegex = /http[s]?:\/\/[^\s]+/g;
                  const link = r.match(linkRegex)?.[0];
                  const textParts = r.split(linkRegex);
                  return (
                    <li key={index}>
                      {textParts[0]}
                      <a href={link} target="_blank" rel="noreferrer">{link}</a>
                      {textParts[1]}
                    </li>
                  );
                }
                return (
                  <li key={index}>{r}</li>
                );
              })
            }
            {didPassThreshold && <li>להוסיף הפניה ליחידה לתגובות קרב / לאגף השיקום</li>}
          </StyledUl>
        </div>
      </StyledVerbalSummaryContainer>
      <StyledButtonsContainer>
        <StyledSaveButton appearance="primary" size="large" shape="circular" className="full-width"
                onClick={() => exportToPdf()}>
          שמור תוצאות כ-PDF
        </StyledSaveButton>
      </StyledButtonsContainer>
    </StyledSummaryContainer>
  );
}

export type SummaryProps = {
  resultsStore: ResultsStore;
  sendAnonymousResults?: (questionnaireResults: QuestionnairesSummary) => void;
}

const StyledSummaryContainer = styled.div`
          display: flex;
          flex-direction: column;
          flex: 1;
          font-size: 16px;
          line-height: 24px;
          box-sizing: border-box;
          padding: 32px;
          @media (max-width: ${smallDesktop.max}) {
            padding: 24px;
          }
          @media (max-width: ${mobile.max}) {
            border-radius: 0;
            padding: 16px;
          }
  `,
  SummaryTableContainer = styled.div`
    max-width: ${smallDesktop.max};
  `,
  StyledButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  `,
  StyledSaveButton = styled(Button)`
    padding: 8px;
    max-width: ${mobile.min};
  `,
  StyledButton = styled(StyledSaveButton)`
    margin-top: 16px;
    width: 100%;
    background-color: #9196e3;
    &:hover {
      background-color: #8085cb;
    }
  `,
  StyledUl = styled.ul`
    margin-top: 8px;
    margin-bottom: 8px;
    padding-inline-start: 24px;
  `,
  StyledVerbalSummaryContainer = styled.div`
    white-space: pre-wrap;
  `;
