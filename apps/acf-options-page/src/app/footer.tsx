import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SOCIAL_LINKS } from '../constants';
import { useAppSelector } from '../hooks';
import { appSelector } from '../store/app.slice';
import { ChatFill, Facebook, ShieldCheck, Star, Twitter, Whatsapp } from '../util';

function Footer() {
  const { manifest } = useAppSelector(appSelector);
  const { t } = useTranslation();

  let imageURL = 'https://getautoclicker.com/favicons/favicon48.png';
  if (/(DEV|BETA)/.test(process.env.NX_PUBLIC_VARIANT ?? '')) {
    imageURL = `https://getautoclicker.com/favicons/${process.env.NX_PUBLIC_VARIANT}/icon48.png`;
  }

  return (
    <footer className='pt-3 mt-3 mt-md-3 pt-md-3 border-top'>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img src={imageURL} width='48' height='48' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
            <div className='d-inline-flex flex-column'>
              <h6 className='text-secondary mb-0'>
                {t('common.appName')}
                <span className={`${process.env.NX_PUBLIC_VARIANT} ms-2`}>[{process.env.NX_PUBLIC_VARIANT}]</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2024</small>
                <br />
                <small id='extension-version'>☘ v{manifest?.version}</small>
                <br />
                <small id='web-version'>☯ {process.env.NX_PUBLIC_RELEASE_VERSION}</small>
              </div>
            </div>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.connect')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='google group' href={SOCIAL_LINKS.GOOGLE_GROUP}>
                  <ChatFill className='me-2' />
                  {t('footer.google-group')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.about')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='privacy' href='https://getautoclicker.com/policy/'>
                  <ShieldCheck className='me-2' />
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='rate-us' href={SOCIAL_LINKS.RATE_US}>
                  <Star className='me-2' />
                  {t('footer.rate-us')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.social')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='facebook' href={SOCIAL_LINKS.FACEBOOK}>
                  <Facebook className='me-2' />
                  {t('footer.facebook')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='twitter' href={SOCIAL_LINKS.TWITTER}>
                  <Twitter className='me-2' />
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='whatsapp' href={SOCIAL_LINKS.WHATSAPP}>
                  <Whatsapp className='me-2' />
                  {t('footer.whatsapp')}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
export default Footer;
