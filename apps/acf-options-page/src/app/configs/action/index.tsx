import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ActionTable from './action-table';
import { DropdownToggle } from '../../../components';
import { Filter, Plus, Repeat } from '../../../util';
import { ActionSettingsModal, ActionStatementModal, AddonModal } from '../../../modal';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import { addAction, switchBatchModal } from '@apps/acf-options-page/src/store/config';
import { actionSelector, setActionMessage, setColumnVisibility } from '@apps/acf-options-page/src/store/config/action/action.slice';
import { useTimeout } from '@apps/acf-options-page/src/_hooks/message.hooks';

function Action() {
  const { t } = useTranslation();
  const { message, error, columnVisibility } = useAppSelector(actionSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionMessage());
  }, message);

  const onColumnChange = (e) => {
    const column = e.currentTarget.getAttribute('data-column');
    dispatch(setColumnVisibility(column));
  };

  const onAddAction = () => {
    dispatch(addAction());
  };

  return (
    <>
      <Card className='mt-3 shadow-sm'>
        <Card.Header as='h6'>
          <Row>
            <Col className='d-flex align-items-center'>
              {t('action.title')}
              <small className='text-success ms-3'>{message}</small>
              <small className='text-danger ms-3'>{error}</small>
            </Col>
            <Col xs='auto' className='d-flex align-items-center'>
              <Button size='sm' variant='outline-primary px-3' onClick={() => dispatch(switchBatchModal())} id='batch-model'>
                <Repeat className='me-2' /> {t('batch.title')}
              </Button>
              <Button size='sm' variant='outline-primary px-3 mx-3' onClick={onAddAction} id='add-action'>
                <Plus className='me-2' /> {t('action.add')}
              </Button>
              <Dropdown className='ml-2' id='acton-column-filter'>
                <Dropdown.Toggle as={DropdownToggle} id='column-dropdown' className='pe-0' aria-label='Filter Action Column'>
                  <Filter />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onColumnChange} data-column='name' active={columnVisibility.name}>
                    {t('action.name')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={columnVisibility.initWait}>
                    {t('action.initWait')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={columnVisibility.repeat}>
                    {t('action.repeat')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={columnVisibility.repeatInterval}>
                    {t('action.repeatInterval')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className='p-0'>
          <ActionTable />
        </Card.Body>
      </Card>
      <AddonModal />
      <ActionSettingsModal />
      <ActionStatementModal />
    </>
  );
}
export default Action;
