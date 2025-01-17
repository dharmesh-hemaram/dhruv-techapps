import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

type GoogleAdsProps = {
  client?: string;
  slot?: string;
  className?: string;
};

export function GoogleAds({ client = process.env.NX_PUBLIC_GOOGLE_ADS_CLIENT, slot = process.env.NX_PUBLIC_GOOGLE_ADS_SLOT, className = 'mb-3' }: GoogleAdsProps) {
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
