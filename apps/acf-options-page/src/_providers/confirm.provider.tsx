import React, { useContext, useRef, useState } from 'react';
import { ConfirmModal } from '../modal';

type ModalRequestType = { title: string; message: JSX.Element | string; headerClass: string };

type ModalContextType = {
  showConfirmation: (request: ModalRequestType) => Promise<boolean>;
};

type ConfirmationModalContextProviderProps = {
  children: React.ReactNode;
};

const ConfirmationModalContext = React.createContext<ModalContextType>({} as ModalContextType);

const ConfirmationModalContextProvider: React.FC<ConfirmationModalContextProviderProps> = (props) => {
  const [show, setShow] = useState<boolean>();
  const [content, setContent] = useState<ModalRequestType>();
  const resolver = useRef<(value: boolean | PromiseLike<boolean>) => void>();

  const handleShow = ({ title, message, headerClass }: ModalRequestType): Promise<boolean> => {
    setContent({
      title,
      message,
      headerClass,
    });
    setShow(true);
    return new Promise(function (resolve) {
      resolver.current = resolve;
    });
  };

  const modalContext: ModalContextType = {
    showConfirmation: handleShow,
  };

  const handleOk = () => {
    resolver.current && resolver.current(true);
    setShow(false);
  };

  const handleCancel = () => {
    resolver.current && resolver.current(false);
    setShow(false);
  };

  return (
    <ConfirmationModalContext.Provider value={modalContext}>
      {props.children}
      {content && <ConfirmModal visible={show} {...content} noClick={handleCancel} yesClick={handleOk} />}
    </ConfirmationModalContext.Provider>
  );
};

const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext);

export { useConfirmationModalContext };

export default ConfirmationModalContextProvider;
