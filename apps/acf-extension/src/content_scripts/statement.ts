import { ACTION_CONDITION_OPR, ACTION_RUNNING, ActionCondition, ActionStatement, GOTO } from '@dhruv-techapps/acf-common';
import { I18N_COMMON } from './i18n';

const Statement = (() => {
  const conditionResult = (conditions: Array<ActionCondition>, actions: Array<string>) => {
    return conditions
      .map(({ actionIndex, status, operator }) => ({ status: actions[actionIndex] === status, operator }))
      .reduce((accumulator, currentValue) => {
        if (currentValue.operator === undefined) {
          return currentValue.status;
        }
        return currentValue.operator === ACTION_CONDITION_OPR.AND ? accumulator && currentValue.status : accumulator || currentValue.status;
      }, false);
  };

  const checkThen = (condition: boolean | { status: boolean; operator: ACTION_CONDITION_OPR }, then: ACTION_RUNNING, goto?: GOTO) => {
    window.__actionError = `↔️ ${chrome.i18n.getMessage('@ACTION__TITLE')} ${condition ? I18N_COMMON.CONDITION_SATISFIED : I18N_COMMON.CONDITION_NOT_SATISFIED}`;
    if (!condition || then === ACTION_RUNNING.SKIP) {
      throw ACTION_RUNNING.SKIP;
    } else if (then === ACTION_RUNNING.GOTO) {
      throw goto;
    }
  };

  const check = (actions: Array<string>, statement?: ActionStatement) => {
    if (statement) {
      const { conditions, then, goto } = statement;
      if (conditions && then) {
        checkThen(conditionResult(conditions, actions), then, goto);
      }
    }
  };

  return { check };
})();

export default Statement;
