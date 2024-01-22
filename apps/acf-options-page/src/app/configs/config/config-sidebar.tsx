import { DropdownToggle } from '@apps/acf-options-page/src/components';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import {
  addConfig,
  configSelector,
  filteredConfigsSelector,
  removeConfig,
  selectConfig,
  setDetailVisibility,
  setSearch,
  switchConfigRemoveModal,
  switchConfigReorderModal,
} from '@apps/acf-options-page/src/store/config';
import { Filter, Plus, ThreeDots, Trash } from '@apps/acf-options-page/src/util';
import { useLayoutEffect, useRef } from 'react';
import { Button, Dropdown, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const ConfigSidebar = (props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedConfigId, detailVisibility } = useAppSelector(configSelector);
  const configs = useAppSelector(filteredConfigsSelector);

  const searchRef = useRef<HTMLInputElement>(null);

  const onRemoveConfig = (e, id) => {
    e.stopPropagation();
    dispatch(removeConfig(id));
  };

  const onSearchChange = (e) => {
    const value = e.currentTarget.value;
    dispatch(setSearch(value));
  };

  const onDetailChange = (e) => {
    const column = e.currentTarget.getAttribute('data-column');
    dispatch(setDetailVisibility(column));
  };

  //create use effect function to focus on search input field on clicking ctrl + f
  useLayoutEffect(() => {
    const searchInputFocus = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', searchInputFocus);
    return () => document.removeEventListener('keydown', searchInputFocus);
  }, []);

  return (
    <div className='rounded sidebar bg-body'>
      <div className='d-flex justify-content-between align-items-center border-bottom p-2 rounded-top'>
        <Button variant='primary' onClick={() => dispatch(addConfig())} data-testid='configurations-add'>
          <Plus /> {t('configuration.add')}
        </Button>
        <Form className='flex-grow-1 mx-2'>
          <Form.Control className='d-flex' ref={searchRef} type='search' onChange={onSearchChange} placeholder='Search' id='search-configuration'></Form.Control>
        </Form>
        <Dropdown className='ml-2' id='config-detail-filter'>
          <Dropdown.Toggle as={DropdownToggle} id='column-dropdown' className='fs-4' aria-label='Filter Action Column'>
            <Filter />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onDetailChange} data-column='name' disabled={!detailVisibility.url} active={detailVisibility.name}>
              {t('configuration.name')}
            </Dropdown.Item>
            <Dropdown.Item onClick={onDetailChange} data-column='url' disabled={!detailVisibility.name} active={detailVisibility.url}>
              {t('configuration.url')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown id='configurations-dropdown-wrapper'>
          <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown' aria-label='Configurations more option' data-testid='configurations-more-option' className='fs-4'>
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
      <ListGroup as='ul'>
        {configs.length === 0 && <ListGroup.Item as='li'>{t('configuration.noConfig')}</ListGroup.Item>}
        {configs.map((config, index) => (
          <ListGroup.Item
            key={config.id}
            as='li'
            style={{ cursor: 'pointer' }}
            action
            className={`d-flex justify-content-between ps-2 pe-0 ${selectedConfigId === config.id ? 'selected' : ''}`}
            onClick={() => dispatch(selectConfig(config.id))}
          >
            <div className='d-flex align-items-center' style={{ width: 'calc(100% - 40px)' }}>
              <div className='w-100'>
                {detailVisibility.name && <div className='text-truncate'>{`${config.name || 'configuration - ' + (index + 1)}`}</div>}
                {detailVisibility.url && <div className='text-truncate text-secondary'>{config.url}</div>}
              </div>
            </div>
            <Button variant='link' onClick={(e) => onRemoveConfig(e, config.id)}>
              <Trash className='link-danger' />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};
