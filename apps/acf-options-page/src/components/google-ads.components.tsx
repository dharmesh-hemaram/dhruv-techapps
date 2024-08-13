import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

export function GoogleAds({ client, slot, className }) {
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Row>
      <Col xs={12} className='text-center'>
        <ins className={`${className} adsbygoogle`} style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format='auto' data-full-width-responsive='true' />
      </Col>
    </Row>
  );
}
GoogleAds.defaultProps = {
  className: 'mb-3',
  client: process.env.NX_PUBLIC_GOOGLE_ADS_CLIENT,
  slot: process.env.NX_PUBLIC_GOOGLE_ADS_SLOT,
};
GoogleAds.propTypes = {
  client: PropTypes.string,
  slot: PropTypes.string,
  className: PropTypes.string,
};
