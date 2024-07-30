import { useTimeout } from '@apps/acf-options-page/src/_hooks/message.hooks';
import { addToast } from '@apps/acf-options-page/src/store/toast.slice';
import { Configuration } from '@dhruv-techapps/acf-common';
import { createRef } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { download } from '../../../_helpers';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { configSelector, duplicateConfig, importAll, importConfig, selectedConfigSelector, setConfigMessage, switchConfigSettingsModal, updateConfig } from '../../../store/config';
import { Copy, Download, Gear, Upload } from '../../../util';
import { getFieldNameValue } from '../../../util/element';
import ConfigBody from './config-body';

function Config() {
  const { message, error } = useAppSelector(configSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const importFiled = createRef<HTMLInputElement>();

  useTimeout(() => {
    dispatch(setConfigMessage());
  }, message);

  if (!config) {
    return <Alert variant='secondary'>Please select configuration from left</Alert>;
  }

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfig(update));
    }
  };

  const onExportConfig = () => {
    const url = config.url.split('/')[2] || 'default';
    const name = config.name || url;
    download(name, config);
  };

  const onImportConfig = ({ currentTarget: { files } }) => {
    if (files.length <= 0) {
      return false;
    }
    const fr = new FileReader();
    fr.onload = function ({ target }) {
      try {
        if (target === null || target.result === null) {
          dispatch(addToast({ header: 'File', body: t('error.json'), variant: 'danger' }));
        } else {
          const importedConfig: Configuration = JSON.parse(target.result as string);
          if (Array.isArray(importedConfig)) {
            dispatch(importAll(importedConfig));
          } else {
            dispatch(importConfig(importedConfig));
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

  const showSettings = () => {
    dispatch(switchConfigSettingsModal());
  };

  const onDuplicateConfig = () => {
    dispatch(duplicateConfig());
  };

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Header as='h6'>
        <Row>
          <Col className='d-flex align-items-center'>
            {t('configuration.title')}
            <div className='d-flex align-items-center'>
              {!config.enable && (
                <Badge pill bg='secondary' className='ms-2 d-none d-md-block'>
                  {t('common.disabled')}
                </Badge>
              )}
            </div>
            <small className='text-danger ms-3'>{error}</small>
            <small className='text-success ms-3'>{message}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Form className='me-3'>
              <Form.Check type='switch' name='enable' id='config-enable' label={t('configuration.enable')} checked={config.enable} onChange={onUpdate} />
            </Form>
            <ButtonGroup>
              <Button variant='link' title={t('configuration.export')} onClick={onExportConfig} data-testid='export-configuration' className='fs-5'>
                <Upload />
              </Button>
              <Button variant='link' title={t('configuration.import')} onClick={() => importFiled.current?.click()} data-testid='import-configuration' className='fs-5'>
                <Download />
              </Button>
              <Button variant='link' title={t('configuration.duplicate')} onClick={onDuplicateConfig} data-testid='duplicate-configuration' className='fs-5'>
                <Copy />
              </Button>
              <Button variant='link' title={t('configuration.settings')} onClick={showSettings} data-testid='configuration-settings' className='fs-5'>
                <Gear />
              </Button>
            </ButtonGroup>
            <div className='custom-file d-none'>
              <label className='custom-file-label' htmlFor='import-configuration' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                {t('configuration.import')}
                <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configuration' onChange={onImportConfig} />
              </label>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <ConfigBody />
    </Card>
  );
}
export default Config;
