import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CaseWorkbenchProvider } from './app/CaseWorkbenchProvider';
import FullAnalysisRouteGuard from './app/FullAnalysisRouteGuard';
import StudyProofNavigator from './components/StudyProofNavigator';
import './index.css';
import './decisionBriefPolish.css';
import './constraintProtocolHardening.css';
import './styles/caseWorkbenchVisualPolish.css';
import './styles/productPolish.css';
import './styles/policyDisclosurePolish.css';
import './styles/receiptPolish.css';
import './styles/caseInvestigationPolish.css';
import './styles/caseInvestigationLayoutTuning.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaseWorkbenchProvider>
      <App />
      <FullAnalysisRouteGuard />
      <StudyProofNavigator />
    </CaseWorkbenchProvider>
  </React.StrictMode>,
);
