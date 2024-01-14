import { DropdownToggle } from '@apps/acf-options-page/src/components';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import { addConfig, configSelector, removeConfig, selectConfig, switchConfigRemoveModal, switchConfigReorderModal } from '@apps/acf-options-page/src/store/config';
import { Plus, ThreeDots, Trash } from '@apps/acf-options-page/src/util';
import { Button, Dropdown, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const ConfigSidebar = (props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { configs, selectedConfigIndex } = useAppSelector(configSelector);

  const onRemoveConfig = (e, index) => {
    e.stopPropagation();
    dispatch(removeConfig(index));
  };

  return (
    <div className='bg-body-tertiary rounded sidebar'>
      <div className='d-flex justify-content-between align-items-center border-bottom p-2'>
        <Button size='sm' variant='primary' onClick={() => dispatch(addConfig())} data-testid='configurations-add'>
          <Plus /> {t('configuration.add')}
        </Button>
        <Dropdown id='configurations-dropdown-wrapper'>
          <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown' aria-label='Configurations more option' data-testid='configurations-more-option'>
            <ThreeDots />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => props.onExportAll(configs)} data-testid='configurations-export-all'>
              {t('configuration.exportAll')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => props.importFiled.current?.click()} data-testid='configurations-import-all'>
              {t('configuration.importAll')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              className={configs.length === 1 ? '' : 'text-danger'}
              disabled={configs.length === 1}
              data-testid='configurations-remove-config'
              onClick={() => dispatch(switchConfigRemoveModal(configs))}
            >
              {t('configuration.removeConfigs')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(switchConfigReorderModal(configs))} data-testid='configurations-reorder-config'>
              {t('configuration.reorder')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ListGroup variant='flush' as='ul'>
        {configs.map((config, index) => (
          <ListGroup.Item
            key={index}
            as='li'
            style={{ cursor: 'pointer' }}
            className={`d-flex justify-content-between ps-2 pe-0 ${selectedConfigIndex === index ? 'selected' : ''}`}
            onClick={() => dispatch(selectConfig(index))}
          >
            <div className='d-flex align-items-center' style={{ width: 'calc(100% - 40px)' }}>
              <div className='w-100'>
                <div className='text-truncate'>{`${config.name || 'configuration - ' + index}`}</div>
                <div className='text-truncate text-secondary'>{config.url}</div>
              </div>
              {/*<strong title={config.enable ? config.startType + ' start' : 'Disabled'} className={`me-2 ${config.enable ? 'bg-secondary text-dark' : 'bg-dark text-light'}  px-1 bg-opacity-25`}>
                {config.enable ? (config.startType === START_TYPES.AUTO ? 'A' : 'M') : 'D'}
              </strong>*/}
            </div>
            <Button variant='link' onClick={(e) => onRemoveConfig(e, index)}>
              <Trash className='link-danger' />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};
