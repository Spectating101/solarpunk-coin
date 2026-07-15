import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  DEFAULT_CASE_ID,
  DEFAULT_POLICY_ID,
  DEFAULT_SCENARIO_ID,
  ENERGY_CASE_PACK,
  caseDecisionKey,
} from '../lib/energyCasePack';
import {
  evaluateCaseSet,
  evaluateComparisonMatrix,
  runSettlementStress,
} from '../lib/caseWorkbenchRuntime';

const CaseWorkbenchContext = createContext(null);

const initialState = {
  activeCaseId: DEFAULT_CASE_ID,
  activePolicyId: DEFAULT_POLICY_ID,
  activeScenarioId: DEFAULT_SCENARIO_ID,
  settlementMultiplier: 1,
  runsByKey: {},
  decisionsById: {},
  receiptsById: {},
  activeStress: null,
  pinnedCaseIds: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_CASE':
      return { ...state, activeCaseId: action.caseId, activeStress: null };
    case 'SELECT_POLICY':
      return { ...state, activePolicyId: action.policyId, activeStress: null };
    case 'SELECT_SCENARIO':
      return { ...state, activeScenarioId: action.scenarioId, activeStress: null };
    case 'SET_STRESS_MULTIPLIER':
      return { ...state, settlementMultiplier: action.multiplier };
    case 'RUN_START':
      return { ...state, loading: true, error: null };
    case 'RUN_SUCCESS': {
      const runsByKey = { ...state.runsByKey };
      const decisionsById = { ...state.decisionsById };
      const receiptsById = { ...state.receiptsById };
      for (const run of action.runs) {
        runsByKey[run.key] = run;
        decisionsById[run.decision.decision_id] = run.decision;
        receiptsById[run.decision.decision_id] = run.receipt;
      }
      return {
        ...state,
        loading: false,
        error: null,
        runsByKey,
        decisionsById,
        receiptsById,
      };
    }
    case 'RUN_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'STRESS_SUCCESS':
      return { ...state, activeStress: action.stress, error: null };
    case 'STRESS_ERROR':
      return { ...state, activeStress: null, error: action.error };
    case 'PIN_CASE':
      return state.pinnedCaseIds.includes(action.caseId)
        ? state
        : { ...state, pinnedCaseIds: [...state.pinnedCaseIds, action.caseId].slice(-3) };
    case 'UNPIN_CASE':
      return { ...state, pinnedCaseIds: state.pinnedCaseIds.filter((id) => id !== action.caseId) };
    default:
      return state;
  }
}

export function CaseWorkbenchProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;
    dispatch({ type: 'RUN_START' });
    evaluateCaseSet({
      caseIds: ENERGY_CASE_PACK.manifest.case_ids,
      policyId: state.activePolicyId,
      scenarioId: state.activeScenarioId,
    }).then((runs) => {
      if (active) dispatch({ type: 'RUN_SUCCESS', runs });
    }).catch((error) => {
      if (active) dispatch({ type: 'RUN_ERROR', error: error?.message || String(error) });
    });
    return () => { active = false; };
  }, [state.activePolicyId, state.activeScenarioId]);

  const activeKey = caseDecisionKey(
    state.activeCaseId,
    state.activePolicyId,
    state.activeScenarioId,
  );
  const activeRun = state.runsByKey[activeKey] || null;

  useEffect(() => {
    if (!activeRun?.decision) return;
    let active = true;
    runSettlementStress({
      decision: activeRun.decision,
      multiplier: state.settlementMultiplier,
    }).then((stress) => {
      if (active) dispatch({ type: 'STRESS_SUCCESS', stress });
    }).catch((error) => {
      if (active) dispatch({ type: 'STRESS_ERROR', error: error?.message || String(error) });
    });
    return () => { active = false; };
  }, [activeRun?.decision?.decision_id, state.settlementMultiplier]);

  const selectCase = useCallback((caseId) => {
    if (!ENERGY_CASE_PACK.casesById[caseId]) return false;
    dispatch({ type: 'SELECT_CASE', caseId });
    return true;
  }, []);
  const selectPolicy = useCallback((policyId) => {
    if (!ENERGY_CASE_PACK.policiesById[policyId]) return false;
    dispatch({ type: 'SELECT_POLICY', policyId });
    return true;
  }, []);
  const selectScenario = useCallback((scenarioId) => {
    if (!ENERGY_CASE_PACK.scenariosById[scenarioId]) return false;
    dispatch({ type: 'SELECT_SCENARIO', scenarioId });
    return true;
  }, []);
  const setSettlementMultiplier = useCallback((multiplier) => {
    const value = Number(multiplier);
    if (!Number.isFinite(value) || value < 0) return false;
    dispatch({ type: 'SET_STRESS_MULTIPLIER', multiplier: value });
    return true;
  }, []);
  const pinCase = useCallback((caseId) => dispatch({ type: 'PIN_CASE', caseId }), []);
  const unpinCase = useCallback((caseId) => dispatch({ type: 'UNPIN_CASE', caseId }), []);

  const compare = useCallback(({ caseIds, policyIds, scenarioId = state.activeScenarioId }) => (
    evaluateComparisonMatrix({ caseIds, policyIds, scenarioId })
  ), [state.activeScenarioId]);

  const visibleRunsByCaseId = useMemo(() => Object.fromEntries(
    ENERGY_CASE_PACK.manifest.case_ids.map((caseId) => [
      caseId,
      state.runsByKey[caseDecisionKey(caseId, state.activePolicyId, state.activeScenarioId)] || null,
    ]),
  ), [state.activePolicyId, state.activeScenarioId, state.runsByKey]);

  const value = useMemo(() => ({
    ...state,
    pack: ENERGY_CASE_PACK,
    activeRun,
    activeDecision: activeRun?.decision || null,
    activeReceipt: activeRun ? state.receiptsById[activeRun.decision.decision_id] || null : null,
    visibleRunsByCaseId,
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    pinCase,
    unpinCase,
    compare,
  }), [
    state,
    activeRun,
    visibleRunsByCaseId,
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    pinCase,
    unpinCase,
    compare,
  ]);

  return (
    <CaseWorkbenchContext.Provider value={value}>
      {children}
    </CaseWorkbenchContext.Provider>
  );
}

export function useCaseWorkbench() {
  const value = useContext(CaseWorkbenchContext);
  if (!value) throw new Error('useCaseWorkbench must be used inside CaseWorkbenchProvider');
  return value;
}
