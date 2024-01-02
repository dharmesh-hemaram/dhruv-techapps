import { ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { ACTION_CONDITION_OPR, ACTION_STATUS, ActionCondition } from '@dhruv-techapps/acf-common';
import { X } from '../../util';
import { getFieldNameValue } from '../../util/element';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removeActionStatementCondition, selectedConfigSelector, updateActionStatementCondition } from '../../store/config';

type Props = {
  condition: ActionCondition;
  index: number;
};

function ActionStatementCondition({ condition, index }: Props) {
  const { actionIndex, status, operator = ACTION_CONDITION_OPR.AND } = condition;
  const { actions } = useAppSelector(selectedConfigSelector);

  const dispatch = useAppDispatch();

  const changeOpr = (_operator: ACTION_CONDITION_OPR) => {
    dispatch(updateActionStatementCondition({ name: 'operator', value: _operator, index }));
  };

  const removeCondition = () => {
    dispatch(removeActionStatementCondition(index));
  };

  const onUpdate = (e: ChangeEvent<HTMLSelectElement>) => {
    const update = getFieldNameValue(e);
    if (update) {
      dispatch(updateActionStatementCondition({ ...update, index }));
    }
  };

  return (
    <tr>
      <td className='fw-bold'>
        {index !== 0 && (
          <ButtonGroup>
            <Button type='button' variant='outline-primary' className={operator === ACTION_CONDITION_OPR.OR ? 'active' : ''} onClick={() => changeOpr(ACTION_CONDITION_OPR.OR)}>
              OR
            </Button>
            <Button type='button' variant='outline-primary' className={operator === ACTION_CONDITION_OPR.AND ? 'active' : ''} onClick={() => changeOpr(ACTION_CONDITION_OPR.AND)}>
              AND
            </Button>
          </ButtonGroup>
        )}
      </td>
      <td>
        <Form.Select value={actionIndex} onChange={onUpdate} name='actionIndex' required className='flex-grow-1 me-1'>
          <option value=''>~~ SELECT ACTION ~~</option>
          {actions.map((_action, index) => (
            <option key={index} value={index}>
              {index + 1} . {_action.name || _action.elementFinder}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Select value={status} onChange={onUpdate} name='status' required style={{ flexShrink: 2 }}>
          {Object.entries(ACTION_STATUS).map((_status, index) => (
            <option key={index} value={_status[1]}>
              {_status[0]}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Button type='button' variant='link' className='ms-1 mt-2 p-0 text-danger' aria-label='Close' hidden={index === 0} onClick={removeCondition}>
          <X />
        </Button>
      </td>
    </tr>
  );
}

ActionStatementCondition.propTypes = {
  condition: PropTypes.shape({
    actionIndex: PropTypes.number,
    operator: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
export { ActionStatementCondition };
