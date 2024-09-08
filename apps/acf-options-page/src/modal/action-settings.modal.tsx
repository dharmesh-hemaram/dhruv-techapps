import { ChangeEvent, FormEvent, useEffect } from 'react';

import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { Alert, Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useTimeout } from '../_hooks/message.hooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  actionSettingsSelector,
  configSelector,
  selectedConfigSelector,
  setActionSettingsMessage,
  switchActionSettingsModal,
  syncActionSettings,
  updateActionSettings,
  updateActionSettingsGoto,
} from '../store/config';
import { REGEX } from '../util';
import { getFieldNameValue, updateForm } from '../util/element';

const FORM_ID = 'action-settings';

const ActionSettingsModal = () => {
  const { t } = useTranslation();
  const { message, visible, settings, error } = useAppSelector(actionSettingsSelector);
  const { selectedActionId } = useAppSelector(configSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionSettingsMessage());
  }, message);

  useEffect(() => {
    updateForm(FORM_ID, settings);
  }, [settings]);

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateActionSettings(update));
      if (update.name === 'retryOption' && update.value === RETRY_OPTIONS.GOTO) {
        const index = actions.findIndex((action) => action.id === selectedActionId);
        dispatch(updateActionSettingsGoto(index === 0 ? 1 : 0));
      }
    }
  };

  const onReset = () => {
    dispatch(syncActionSettings());
    onHide();
  };

  const onHide = () => {
    dispatch(switchActionSettingsModal());
  };

  const onShow = () => {
    //:TODO
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionSettingsGoto(Number(e.currentTarget.value)));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    if (Object.keys(settings).length !== 0) {
      dispatch(syncActionSettings(settings));
    }
  };

  if (!config || !selectedActionId) {
    return null;
  }

  const { actions } = config;

  return (
    <Modal show={visible} size='lg' onHide={onHide} onShow={onShow} data-testid='action-settings-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionSettings.info')}</p>
          <Card className='mb-3'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' name='iframeFirst' checked={settings.iframeFirst || false} onChange={onUpdate} label={t('modal.actionSettings.iframeFirst')} />
                  <small className='text-muted'>{t('modal.actionSettings.iframeFirstHint')}</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Row className='mb-2 mb-md-0'>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retry'>
                    <FormControl placeholder={t('modal.actionSettings.retry.title')} name='retry' type='number' onBlur={onUpdate} defaultValue={settings.retry} pattern={REGEX.NUMBER} list='retry' />
                    <Form.Label>{t('modal.actionSettings.retry.title')}</Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retryInterval'>
                    <FormControl
                      placeholder={`${t('modal.actionSettings.retry.interval')} (${t('common.sec')})`}
                      list='interval'
                      onBlur={onUpdate}
                      name='retryInterval'
                      defaultValue={settings.retryInterval}
                      pattern={REGEX.INTERVAL}
                    />
                    <Form.Label>
                      {t('modal.actionSettings.retry.interval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} className='mb-2'>
                  <Form.Text className='text-muted'>{t('modal.actionSettings.retry.hint')}</Form.Text>
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.STOP}
                    checked={settings.retryOption === RETRY_OPTIONS.STOP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.stop')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.SKIP}
                    checked={settings.retryOption === RETRY_OPTIONS.SKIP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.skip')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.RELOAD}
                    checked={settings.retryOption === RETRY_OPTIONS.RELOAD}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.refresh')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.GOTO}
                    checked={settings.retryOption === RETRY_OPTIONS.GOTO}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.goto')}
                  />
                </Col>
                {settings.retryOption === RETRY_OPTIONS.GOTO && (
                  <Col xs={{ span: 3, offset: 9 }}>
                    <Form.Select value={settings.retryGoto} onChange={onUpdateGoto} name='goto' required>
                      {actions.map((_action, index) => (
                        <option key={_action.id} value={index} disabled={_action.id === selectedActionId}>
                          {index + 1} . {_action.name || _action.elementFinder}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
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
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='action-settings-reset'>
            {t('common.clear')}
          </Button>{' '}
          <Button type='submit' variant='primary' className='px-5' data-testid='action-settings-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionSettingsModal };
