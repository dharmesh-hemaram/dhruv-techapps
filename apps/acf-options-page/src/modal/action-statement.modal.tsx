import { ChangeEvent, FormEvent } from 'react';

import { ACTION_CONDITION_OPR, ACTION_RUNNING, getDefaultActionCondition } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { Alert, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  actionStatementSelector,
  addActionStatementCondition,
  selectedConfigSelector,
  setActionStatementMessage,
  switchActionStatementModal,
  syncActionStatement,
  updateActionStatementGoto,
  updateActionStatementThen,
} from '../store/config';
import { Plus } from '../util/svg';
import { ActionStatementCondition } from './action-statement/action-statement-condition';

const FORM_ID = 'actionCondition';

const ActionStatementModal = () => {
  const { t } = useTranslation();
  const { message, visible, statement, error } = useAppSelector(actionStatementSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionStatementMessage());
  }, message);

  const onUpdateThen = (then: ACTION_RUNNING) => {
    dispatch(updateActionStatementThen(then));
    if (then === ACTION_RUNNING.GOTO) {
      const actionId = config?.actions[0].id;
      if (actionId) {
        dispatch(updateActionStatementGoto(actionId));
      }
    }
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionStatementGoto(e.currentTarget.value as RANDOM_UUID));
  };

  const onReset = () => {
    dispatch(syncActionStatement());
    onHide();
  };

  const addCondition = () => {
    dispatch(addActionStatementCondition(getDefaultActionCondition(ACTION_CONDITION_OPR.AND)));
  };

  const onHide = () => {
    dispatch(switchActionStatementModal());
  };

  const onShow = () => {
    //:TODO
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    dispatch(syncActionStatement(statement));
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <Modal show={visible} size='lg' onHide={onHide} onShow={onShow} data-testid='action-statement-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionCondition.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionCondition.info')}</p>
          <h4 className='text-center mb-3'>IF</h4>
          <Table className='mb-0'>
            <thead>
              <tr>
                <th>OPR</th>
                <th>Action</th>
                <th>Status</th>
                <th>
                  <Button type='button' variant='link' className='mt-2 p-0' aria-label='Add' onClick={() => addCondition()}>
                    <Plus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {statement.conditions.map((condition, index) => (
                <ActionStatementCondition key={condition.id} index={index} condition={condition} />
              ))}
            </tbody>
          </Table>
          <h4 className='text-center mt-3'>THEN</h4>
          <Row className='mt-3'>
            <Col>
              <Form.Check
                type='radio'
                checked={statement.then === ACTION_RUNNING.SKIP}
                value={ACTION_RUNNING.SKIP}
                onChange={() => onUpdateThen(ACTION_RUNNING.SKIP)}
                name='then'
                label={t('modal.actionCondition.skip')}
              />
            </Col>
            <Col>
              <Form.Check
                type='radio'
                checked={statement.then === ACTION_RUNNING.PROCEED}
                value={ACTION_RUNNING.PROCEED}
                onChange={() => onUpdateThen(ACTION_RUNNING.PROCEED)}
                name='then'
                label={t('modal.actionCondition.proceed')}
              />
            </Col>
            <Col>
              <Form.Check
                type='radio'
                checked={statement.then === ACTION_RUNNING.GOTO}
                value={ACTION_RUNNING.GOTO}
                onChange={() => onUpdateThen(ACTION_RUNNING.GOTO)}
                name='then'
                label={t('modal.actionCondition.goto')}
              />
            </Col>
          </Row>
          {statement.then === ACTION_RUNNING.GOTO && (
            <Row>
              <Col xs={{ span: 4, offset: 8 }}>
                <Form.Select value={statement.goto} onChange={onUpdateGoto} name='goto' required>
                  {actions.map((_action, index) => (
                    <option key={_action.id} value={_action.id}>
                      {index + 1} . {_action.name ?? _action.elementFinder}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}
          {error && (
            <Alert className='mt-3' variant='danger'>
              {error}
            </Alert>
          )}
          {message && (
            <Alert className='mt-3' variant='success'>
              {message}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-primary px-5' data-testid='action-statement-reset'>
            {t('common.clear')}
          </Button>{' '}
          <Button type='submit' variant='primary' className='px-5 ml-3' data-testid='action-statement-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionStatementModal };
