import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { ChangeEvent, FormEvent } from 'react';
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { configRemoveSelector, configRemoveUpdateAPI, switchConfigRemoveModal, switchConfigRemoveSelection } from '../store/config';

const RemoveConfigsModal = () => {
  const { visible, configs, error } = useAppSelector(configRemoveSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(configRemoveUpdateAPI());
  };

  const handleClose = () => {
    dispatch(switchConfigRemoveModal());
  };

  const remove = (e: ChangeEvent<HTMLInputElement>) => {
    const { dataset } = e.currentTarget;
    if (dataset.id) {
      dispatch(switchConfigRemoveSelection(dataset.id as RANDOM_UUID));
    }
  };

  const checkedConfigLength = () => {
    const length = configs?.filter((config) => config.checked)?.length;
    return length ? length + 1 : 0;
  };

  const onShow = () => {
    //:TODO
  };

  return (
    <Modal show={visible} size='lg' onHide={handleClose} scrollable onShow={onShow} data-testid='remove-configs-modal'>
      <Form onSubmit={onSubmit} id='remove-configs'>
        <Modal.Header>
          <Modal.Title as='h6'>{t('configuration.removeConfigs')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <ErrorAlert error={error} />
          <p className='text-muted'>This action cant be reverted.</p>
          <ListGroup>
            {configs?.map((config) => (
              <ListGroup.Item key={config.id}>
                <Form.Check
                  type='checkbox'
                  checked={config.checked || false}
                  onChange={remove}
                  className={config.checked ? 'text-danger' : ''}
                  data-id={config.id}
                  name={`remove-configs-${config.id}`}
                  disabled={!config.checked && configs.length === checkedConfigLength()}
                  id={`configuration-checkbox-${config.id}`}
                  label={
                    <>
                      {config.name || 'configuration - ' + config.id}
                      {!config.enable && (
                        <Badge pill bg='secondary' className='ms-2'>
                          {t('common.disabled')}
                        </Badge>
                      )}
                    </>
                  }
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-primary px-5' onClick={handleClose} data-testid='configurations-remove-close'>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='danger px-5' className='ml-3' id='remove-configs-button' data-testid='configurations-remove-save'>
            {t('configuration.removeConfigs')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { RemoveConfigsModal };
