import { observer } from 'mobx-react-lite';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';
import { QuestionnairesSummary } from '../store/types';
import styled from 'styled-components';


export const DebugResults: React.FC<DebugResultsProps> = observer(({ resultsSummary }) => {
  return (
    <StyledAccordion collapsible className="full-width align-text-left" dir="ltr">
      <AccordionItem value="1">
        <AccordionHeader expandIconPosition="end">Questionnaires Debug Data</AccordionHeader>
        <AccordionPanel id="questionnaires-debug">
          {
            resultsSummary.map(({ score, questionnaireName, didPassThreshold }, index) => {
              return (
                <div key={index}>
                  <p>{questionnaireName}: {score} {didPassThreshold ? 'passed' : 'did not pass'}</p>
                </div>
              )
            })
          }
        </AccordionPanel>
      </AccordionItem>     
    </StyledAccordion>
  );
});

type DebugResultsProps = {
  resultsSummary: QuestionnairesSummary;
}

const StyledAccordion = styled(Accordion)`
  max-height: 300px;
  overflow-y: auto;
  flex: 1;
`;
