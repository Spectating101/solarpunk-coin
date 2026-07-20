import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CaseWorkbenchProvider } from './app/CaseWorkbenchProvider';
import './index.css';
import './decisionBriefPolish.css';
import './constraintProtocolHardening.css';
import './styles/caseWorkbenchVisualPolish.css';
import './styles/productPolish.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaseWorkbenchProvider>
      <App />
    </CaseWorkbenchProvider>
  </React.StrictMode>,
);
