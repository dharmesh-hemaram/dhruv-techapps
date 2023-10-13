import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Discord, Instagram, Twitter, Github, Youtube, ChatFill } from '../util';
import { APP_LINK, APP_NAME, SOCIAL_LINKS } from '../constants';
import { useAppSelector } from '../hooks';
import { appSelector } from '../store/app.slice';

function Footer() {
  const { manifest } = useAppSelector(appSelector);
  const { t } = useTranslation();

  let imageURL = 'https://getautoclicker.com/favicons/favicon48.png';
  if (/(DEV|BETA)/.test(process.env.NX_VARIANT ?? '')) {
    imageURL = `https://getautoclicker.com/favicons/${process.env.NX_VARIANT}/icon48.png`;
  }

  return (
    <footer className='pt-4  mt-3 mt-md-5 pt-md-5 border-top'>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img src={imageURL} width='48' height='48' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
            <div className='d-inline-flex flex-column'>
              <h6 className='text-secondary mb-0'>
                {APP_NAME}
                <span className={`${process.env.NX_VARIANT} ms-2`}>[{process.env.NX_VARIANT}]</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2023</small>
                <br />
                <small>☘ v{manifest?.version}</small>
                <br />
                <small>☯ {process.env.NX_RELEASE_VERSION}</small>
              </div>
            </div>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.resources')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='docs' href={`${APP_LINK.DOCS}getting-started`}>
                  {t('footer.docs')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' href={APP_LINK.BLOG} title='blog'>
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='issues' href={APP_LINK.ISSUES}>
                  {t('footer.issues')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='configuration' href={APP_LINK.CONFIGS}>
                  {t('footer.configuration')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='practice form' href={APP_LINK.TEST}>
                  {t('footer.test')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.about')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='chat' href={SOCIAL_LINKS.GOOGLE_GROUP}>
                  <ChatFill className='me-2' />
                  {t('footer.chat')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='privacy' href='https://getautoclicker.com/policy/'>
                  {t('footer.privacy')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.social')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='youtube' href={SOCIAL_LINKS.YOUTUBE}>
                  <Youtube className='me-2' />
                  {t('footer.youtube')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='instagram' href={SOCIAL_LINKS.INSTAGRAM}>
                  <Instagram className='me-2' />
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' href={SOCIAL_LINKS.DISCORD} title='discord'>
                  <Discord className='me-2' />
                  {t('footer.discord')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='twitter' href={SOCIAL_LINKS.TWITTER}>
                  <Twitter className='me-2' />
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='github' href={SOCIAL_LINKS.GITHUB}>
                  <Github className='me-2' />
                  {t('footer.github')}
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
