import { createRef, useEffect, useState } from 'react';

import { Alert, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Config from './config';
import { ExclamationTriangleFill, ThreeDots } from '../../util';
import { Ads, DropdownToggle, Sponsors } from '../../components';
import { ConfigSettingsModal, ReorderConfigsModal, RemoveConfigsModal } from '../../modal';
import { download } from '../../_helpers';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addConfig, configSelector, importAll, selectConfig, switchConfigRemoveModal, switchConfigReorderModal } from '../../store/config';
import { addToast } from '../../store/toast.slice';
import { configGetAllAPI } from '../../store/config/config.api';
import Batch from './batch';
import Action from './action';
import { Configuration } from '@dhruv-techapps/acf-common';

function Configs() {
  const { t, i18n } = useTranslation();

  const [scroll, setScroll] = useState(false);
  const { configs, selectedConfigIndex } = useAppSelector(configSelector);
  const dispatch = useAppDispatch();

  const importFiled = createRef<HTMLInputElement>();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY >= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(configGetAllAPI());
    }
  }, [dispatch]);

  const onChange = (e) => {
    const { value } = e.currentTarget;
    dispatch(selectConfig(value));
  };

  const onAddConfig = () => {
    dispatch(addConfig());
  };

  const onExportAll = () => {
    download('All Configurations', configs);
  };

  const onImportAll = (e) => {
    const { files } = e.currentTarget;
    if (files.length <= 0) {
      return false;
    }
    const fr = new FileReader();
    fr.onload = function ({ target }) {
      try {
        if (target === null || target.result === null) {
          dispatch(addToast({ header: 'File', body: t('error.json'), variant: 'danger' }));
        } else {
          const importedConfigs: Array<Configuration> = JSON.parse(target.result as string);
          if (!Array.isArray(importedConfigs)) {
            dispatch(addToast({ header: 'File', body: t('error.json'), variant: 'danger' }));
          } else {
            dispatch(importAll(importedConfigs));
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch(addToast({ header: 'File', body: error.message, variant: 'danger' }));
        } else if (typeof error === 'string') {
          dispatch(addToast({ header: 'File', body: error, variant: 'danger' }));
        } else {
          dispatch(addToast({ header: 'File', body: JSON.stringify(error), variant: 'danger' }));
        }
      }
    };
    fr.readAsText(files.item(0));
    return false;
  };

  const style = { '--bs-bg-opacity': `.25` } as React.CSSProperties;

  return (
    <div>
      {i18n.language.includes('en') && t('common.translate') && (
        <div className='text-muted text-center my-3'>
          {t('common.translate')}{' '}
          <a href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer'>
            {t('common.clickHere')}
          </a>
        </div>
      )}
      <div id='configs' className={`${scroll ? 'shadow bg-body-tertiary' : ' mb-4 mt-3'} sticky-top`}>
        <Container>
          {process.env.NX_VARIANT === 'DEV' && (
            <Alert variant='warning'>
              <ExclamationTriangleFill className='me-2' />
              We&apos;re introducing a new version in our DEV environment, which may contain breaking changes. To minimize disruptions, we&apos;ve already deployed this version in BETA. Please use
              the&nbsp;
              <Alert.Link href='https://beta.getautoclicker.com/'>BETA</Alert.Link> version for now. Your feedback in identifying any issues is appreciated as we transition to the new version. Thank
              you for your cooperation!
            </Alert>
          )}
          <Row className={`rounded-pill ${!scroll && 'border'}`}>
            <Col>
              <Form>
                <Form.Group controlId='selected' className='mb-0'>
                  <Form.Select onChange={onChange} value={selectedConfigIndex} id='configuration-list' className='ps-4 border-0' data-type='number'>
                    {configs.map((config, index) => (
                      <option key={index} value={index} className={!config.enable ? 'bg-secondary' : ''} style={style}>
                        {`(${config.name || 'configuration - ' + index})`} {config.url}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>
            <Col xs='auto' className='d-flex align-items-center'>
              <Button type='button' variant='outline-primary' onClick={onAddConfig} id='add-configuration' className='border-top-0 border-bottom-0 border'>
                {t('configuration.add')}
              </Button>
              <Dropdown id='configurations-dropdown-wrapper'>
                <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown' aria-label='Configurations more option' data-testid='configurations-more-option'>
                  <ThreeDots width='24' height='24' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onExportAll} data-testid='configurations-export-all'>
                    {t('configuration.exportAll')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => importFiled.current?.click()} data-testid='configurations-import-all'>
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
              <div className='custom-file d-none'>
                <label className='custom-file-label' htmlFor='import-configurations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                  {t('configuration.importAll')}
                  <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configurations' onChange={onImportAll} />
                </label>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <main>
        <Container>
          <Config />
          <Batch />
          <Ads />
          <Action />
        </Container>
        <ConfigSettingsModal />
        <ReorderConfigsModal />
        <RemoveConfigsModal />
        <Sponsors />
      </main>
    </div>
  );
}
export default Configs;
