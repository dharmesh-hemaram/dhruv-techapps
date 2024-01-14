import { createRef, useEffect } from 'react';

import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Config from './config';
import { Ads } from '../../components';
import { ConfigSettingsModal, ReorderConfigsModal, RemoveConfigsModal } from '../../modal';
import { download } from '../../_helpers';
import { useAppDispatch } from '../../hooks';
import { importAll } from '../../store/config';
import { addToast } from '../../store/toast.slice';
import { configGetAllAPI } from '../../store/config/config.api';
import Action from './action';
import { Configuration } from '@dhruv-techapps/acf-common';
import { ConfigSidebar } from './config/config-sidebar';
import { ConfigDropdown } from './config/config-dropdown';
import Footer from '../footer';
import { BatchModal } from '../../modal/config-batch.modal';

function Configs(props) {
  const { t } = useTranslation();
  const importFiled = createRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(configGetAllAPI());
    }
  }, [dispatch]);

  const onExportAll = (configs) => {
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

  return (
    <Container fluid id='main'>
      <Row>
        <Col lg='3' className='pt-3'>
          <ConfigSidebar importFiled={importFiled} onExportAll={onExportAll} />
        </Col>
        <Col sm='auto' lg='9' className='pt-3'>
          <div>
            <ConfigDropdown importFiled={importFiled} onExportAll={onExportAll} />
            <main>
              {props.error && (
                <Alert variant='danger'>
                  <p className='m-0'>{props.error}</p>
                </Alert>
              )}
              <Config />
              <Action />
              <Ads />
              <Footer />
              <ConfigSettingsModal />
              <BatchModal />
              <ReorderConfigsModal />
              <RemoveConfigsModal />
            </main>
          </div>
        </Col>
      </Row>
      <div className='custom-file d-none'>
        <label className='custom-file-label' htmlFor='import-configurations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
          {t('configuration.importAll')}
          <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configurations' onChange={onImportAll} />
        </label>
      </div>
    </Container>
  );
}
export default Configs;
