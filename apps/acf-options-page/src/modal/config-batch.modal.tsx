import { Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { getFieldNameValue } from '../util/element';
import { useAppDispatch, useAppSelector } from '../hooks';
import { batchSelector, selectedConfigSelector, setBatchMessage, switchBatchModal, updateBatch } from '../store/config';
import { useTimeout } from '../_hooks/message.hooks';
import { REGEX } from '../util';

const FORM_ID = 'batch-body';

const BatchModal = () => {
  const { t } = useTranslation();

  const config = useAppSelector(selectedConfigSelector);
  const { visible, message } = useAppSelector(batchSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setBatchMessage());
  }, message);

  const handleClose = () => {
    dispatch(switchBatchModal());
  };

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, batch);
    if (update) {
      dispatch(updateBatch(update));
    }
  };

  const onShow = () => {
    //:TODO
  };

  if (!config) {
    return null;
  }

  const { batch } = config;

  return (
    <Modal show={visible} size='lg' onHide={handleClose} onShow={onShow} data-testid='config-batch-modal'>
      <Form id={FORM_ID}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('batch.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Row>
                <Col md='12' sm='12'>
                  <Form.Check type='switch' id='batch-refresh' label={t('batch.refresh')} name='refresh' checked={batch?.refresh || false} onChange={onUpdate} />
                  <Form.Text>
                    <Trans i18nKey='batch.refreshHint' components={{ b: <b /> }} />
                  </Form.Text>
                </Col>
                {!batch?.refresh && (
                  <>
                    <hr className='my-3' />
                    <Col md='6' sm='12'>
                      <Form.Group controlId='batch-repeat'>
                        <FormControl type='number' name='repeat' pattern={REGEX.NUMBER} defaultValue={batch?.repeat} onBlur={onUpdate} autoComplete='off' placeholder='0' list='repeat' />
                        <Form.Label>{t('batch.repeat')}</Form.Label>
                        <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md='6' sm='12'>
                      <Form.Group controlId='batch-repeat-interval'>
                        <FormControl name='repeatInterval' pattern={REGEX.INTERVAL} autoComplete='off' defaultValue={batch?.repeatInterval} onBlur={onUpdate} placeholder='0' list='interval' />
                        <Form.Label>
                          {t('batch.repeatInterval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                        </Form.Label>
                        <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Form.Text>
                      <Trans i18nKey='batch.repeatHint' components={{ b: <b /> }} />
                    </Form.Text>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {message && (
          <Modal.Footer>
            <span className='text-success'>{message}</span>
          </Modal.Footer>
        )}
      </Form>
    </Modal>
  );
};
export { BatchModal };
