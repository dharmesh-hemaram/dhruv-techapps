import { useEffect } from 'react';
import { Card, Col, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getFieldNameValue, updateForm } from '../../../util/element';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectedConfigSelector, updateBatch } from '../../../store/config';
import { REGEX } from '@apps/acf-options-page/src/util';

const FORM_ID = 'batch-body';

function BatchBody() {
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (config && config.batch) {
      updateForm(FORM_ID, config.batch);
    }
  }, [config]);

  if (!config) {
    return null;
  }

  const { batch } = config;

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, batch);
    if (update) {
      dispatch(updateBatch(update));
    }
  };

  return (
    <Form id={FORM_ID}>
      <Card.Body>
        <Row>
          <Col md='12' sm='12'>
            <Form.Check type='switch' id='batch-refresh' label={t('batch.refresh')} name='refresh' checked={batch?.refresh || false} onChange={onUpdate} />
          </Col>
          {!batch?.refresh && (
            <>
              <Col md='6' sm='12' className='mt-4'>
                <Form.Group controlId='batch-repeat'>
                  <FormControl type='number' name='repeat' pattern={REGEX.NUMBER} defaultValue={batch?.repeat} onBlur={onUpdate} autoComplete='off' placeholder='0' list='repeat' />
                  <Form.Label>{t('batch.repeat')}</Form.Label>
                  <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md='6' sm='12' className='mt-4'>
                <Form.Group controlId='batch-repeat-interval'>
                  <FormControl name='repeatInterval' pattern={REGEX.INTERVAL} autoComplete='off' defaultValue={batch?.repeatInterval} onBlur={onUpdate} placeholder='0' list='interval' />
                  <Form.Label>
                    {t('batch.repeatInterval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                  </Form.Label>
                  <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
      </Card.Body>
    </Form>
  );
}
export default BatchBody;
