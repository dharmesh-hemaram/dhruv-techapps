import { Accordion } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BatchBody from './batch-body';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { batchSelector, setBatchMessage } from '@apps/acf-options-page/src/store/config/batch';
import { useTimeout } from '@apps/acf-options-page/src/_hooks/message.hooks';

function Batch() {
  const { message, error } = useAppSelector(batchSelector);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  useTimeout(() => {
    dispatch(setBatchMessage());
  }, message);

  return (
    <Accordion aria-label='batch' className='mb-3 shadow-sm'>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>
          {t('batch.title')}
          <small className='text-danger ms-3'>{error}</small>
          <small className='text-success ms-3'>{message}</small>
        </Accordion.Header>
        <Accordion.Body>
          <BatchBody />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
export default Batch;
