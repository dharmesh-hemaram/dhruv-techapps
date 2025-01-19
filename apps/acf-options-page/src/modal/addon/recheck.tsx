import { RECHECK_OPTIONS } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { ChangeEvent } from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { actionAddonSelector, selectedConfigSelector, updateActionAddon, updateActionAddonGoto } from '../../store/config';
import { REGEX } from '../../util';
import { getFieldNameValue } from '../../util/element';

function AddonRecheck() {
  const { t } = useTranslation();
  const { addon } = useAppSelector(actionAddonSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, addon);
    if (update) {
      dispatch(updateActionAddon(update));
      if (update.name === 'recheckOption' && update.value === RECHECK_OPTIONS.GOTO) {
        const actionId = config?.actions[0].id;
        if (actionId) {
          dispatch(updateActionAddonGoto(actionId));
        }
      }
    }
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionAddonGoto(e.currentTarget.value as RANDOM_UUID));
  };

  if (!config || !addon) {
    return null;
  }

  const actions = config.actions;

  return (
    <Row>
      <Col md={6} sm={12}>
        <Form.Group controlId='addon-recheck'>
          <FormControl placeholder='0' onBlur={onUpdate} defaultValue={addon.recheck} type='number' pattern={REGEX.NUMBER} list='recheck' name='recheck' />
          <Form.Label>{t('modal.addon.recheck.title')}</Form.Label>
          <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={6} sm={12}>
        <Form.Group controlId='addon-recheck-interval'>
          <FormControl placeholder='0' onBlur={onUpdate} defaultValue={addon.recheckInterval} list='interval' pattern={REGEX.INTERVAL} name='recheckInterval' />
          <Form.Label>
            {t('modal.addon.recheck.interval')}&nbsp;<small>({t('common.sec')})</small>
          </Form.Label>
          <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col xs={12} className='mb-2'>
        <Form.Text className='text-muted'>{t('modal.addon.recheck.hint')}</Form.Text>
      </Col>
      <Col>
        <Form.Check
          type='radio'
          defaultChecked={addon.recheckOption === RECHECK_OPTIONS.STOP}
          onChange={onUpdate}
          value={RECHECK_OPTIONS.STOP}
          name='recheckOption'
          label={t('modal.addon.recheck.stop')}
        />
      </Col>
      <Col>
        <Form.Check
          type='radio'
          defaultChecked={addon.recheckOption === RECHECK_OPTIONS.SKIP}
          onChange={onUpdate}
          value={RECHECK_OPTIONS.SKIP}
          name='recheckOption'
          label={t('modal.addon.recheck.skip')}
        />
      </Col>
      <Col>
        <Form.Check
          type='radio'
          defaultChecked={addon.recheckOption === RECHECK_OPTIONS.RELOAD}
          onChange={onUpdate}
          value={RECHECK_OPTIONS.RELOAD}
          name='recheckOption'
          label={t('modal.addon.recheck.refresh')}
        />{' '}
      </Col>
      <Col>
        <Form.Check
          type='radio'
          defaultChecked={addon.recheckOption === RECHECK_OPTIONS.GOTO}
          onChange={onUpdate}
          value={RECHECK_OPTIONS.GOTO}
          name='recheckOption'
          label={t('modal.addon.recheck.goto')}
        />
      </Col>
      {addon.recheckOption === RECHECK_OPTIONS.GOTO && (
        <Col xs={{ span: 3, offset: 9 }}>
          <Form.Select value={addon.recheckGoto} onChange={onUpdateGoto} name='goto' required>
            {actions.map((_action, index) => (
              <option key={_action.id} value={_action.id}>
                {index + 1} . {_action.name ?? _action.elementFinder}
              </option>
            ))}
          </Form.Select>
        </Col>
      )}
    </Row>
  );
}
export { AddonRecheck };
