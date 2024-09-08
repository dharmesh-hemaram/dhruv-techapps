import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Configuration from './configuration';

export const ConfigurationModal = forwardRef<{ show: (configId: string) => void }>((_, ref) => {
  const [show, setShow] = useState(false);
  const [configId, setConfig] = useState<string>();

  useImperativeHandle(ref, () => ({
    show: (_configId: string) => {
      setConfig(_configId);
      setShow(true);
    },
  }));

  return (
    <Modal show={show} size='lg' centered backdrop='static' keyboard={false} onHide={() => setShow(false)} data-testid='configuration-modal'>
      <Modal.Header>
        <Modal.Title>Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>{configId && <Configuration configId={configId} />}</Modal.Body>
    </Modal>
  );
});
