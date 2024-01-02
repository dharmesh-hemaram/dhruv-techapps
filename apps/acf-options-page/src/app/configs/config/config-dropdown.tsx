import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import { addConfig, configSelector, selectConfig, switchConfigRemoveModal, switchConfigReorderModal } from '@apps/acf-options-page/src/store/config';
import { ThreeDots } from '@apps/acf-options-page/src/util';
import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, DropdownToggle, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const ConfigDropdown = (props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY >= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onChange = (e) => {
    const { value } = e.currentTarget;
    dispatch(selectConfig(value));
  };

  const onAddConfig = () => {
    dispatch(addConfig());
  };

  const { configs, selectedConfigIndex } = useAppSelector(configSelector);

  const style = { '--bs-bg-opacity': `.25` } as React.CSSProperties;

  return (
    <div id='configs' className={`${scroll ? 'shadow bg-body-tertiary' : ' mb-4 mt-3'} d-md-none sticky-top`}>
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
        </Col>
      </Row>
    </div>
  );
};
