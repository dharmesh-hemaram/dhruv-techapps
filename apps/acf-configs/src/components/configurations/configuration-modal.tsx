import { Configuration } from '@dhruv-techapps/acf-common';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import JsonView from 'react18-json-view';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';

export const ConfigurationModal = forwardRef<{ show: (configId: string) => void }>((_, ref) => {
  const [show, setShow] = useState(false);
  const [configId, setConfigId] = useState<string>();
  const [config, setConfig] = useState<ConfigType>();
  const [file, setFile] = useState<Configuration>();
  const [loading, setLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    show: (_configId: string) => {
      if (_configId !== configId) {
        setConfig(undefined);
        setFile(undefined);
        setLoading(true);
        setConfigId(_configId);
      }
      setShow(true);
    },
  }));

  useEffect(() => {
    // Fetch the configuration
    if (configId) {
      getConfig(configId).then(async (_config) => {
        setConfig(_config);
        const configuration = await downloadFile(`users/${_config?.userId}/${configId}.json`);
        setFile(configuration);
        setLoading(false);
      });
    }
  }, [configId]);

  return (
    <Modal show={show} size='lg' centered backdrop='static' keyboard={false} onHide={() => setShow(false)} data-testid='configuration-modal' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {config?.name || 'Configuration'}
          <small className='d-block fs-5 text-muted'>{config?.url}</small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        {loading ? (
          <h1>Loading Configuration...</h1>
        ) : (
          config &&
          configId &&
          file && (
            <div className='d-flex flex-column'>
              <JsonView src={file} enableClipboard={false} />
            </div>
          )
        )}
      </Modal.Body>
      <Modal.Footer>{file && configId && <Button onClick={console.log}>Download</Button>}</Modal.Footer>
    </Modal>
  );
});
