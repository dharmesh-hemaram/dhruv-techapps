import { Container, Nav, NavDropdown, Navbar, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { GearFill, Github, Moon, Sun, ThreeDots, Youtube } from '../util';
import { SettingsModal } from '../modal';
import { APP_LANGUAGES, APP_LINK, APP_NAME, SOCIAL_LINKS } from '../constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { switchTheme, themeSelector } from '../store/theme.slice';
import { appSelector } from '../store/app.slice';
import { switchSettingsModal } from '../store/settings/settings.slice';
import { useTour } from '@reactour/tour';
import { useEffect, useState } from 'react';

function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { setIsOpen } = useTour();
  const theme = useAppSelector(themeSelector);
  const { error } = useAppSelector(appSelector);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const tour = localStorage.getItem('tour');
    if (!tour) {
      localStorage.setItem('tour', 'true');
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  });

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const toggleTheme = () => {
    dispatch(switchTheme());
  };

  let appName = APP_NAME;

  if (/(DEV|BETA)/.test(process.env.NX_VARIANT || '')) {
    appName += ` [${process.env.NX_VARIANT}]`;
  }

  return (
    <Navbar expand='lg' as='header' className='bd-navbar' sticky='top'>
      <Container fluid className='bd-gutter flex-wrap flex-lg-nowrap' as='nav'>
        <div className='d-lg-none' style={{ width: '4.25rem' }}></div>
        <Navbar.Brand href='/' className='p-0 me-0 me-lg-2'>
          {appName}
        </Navbar.Brand>
        <div className='d-flex'>
          <Navbar.Toggle aria-controls='basic-navbar-nav' onClick={handleShow}>
            <ThreeDots />
          </Navbar.Toggle>
        </div>
        <Offcanvas show={show} onHide={handleClose} responsive='lg' placement='end' className='flex-grow-1 bd-header'>
          <Offcanvas.Header closeButton className='px-4 pb-0' closeVariant='white'>
            <Offcanvas.Title className='text-white'>{appName}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='p-4 pt-0 p-lg-0'>
            <hr className='d-lg-none text-white-50'></hr>
            <hr className='d-lg-none text-white-50'></hr>
            <Nav className='flex-row flex-wrap' as='ul'>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='docs' href={`${APP_LINK.DOCS}getting-started`}>
                  {t('footer.docs')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='blog' href={APP_LINK.BLOG}>
                  {t('footer.blog')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='issues' href={APP_LINK.ISSUES}>
                  {t('footer.issues')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='discussion' href={APP_LINK.DISCUSSIONS}>
                  {t('footer.discussion')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='configuration' href={APP_LINK.CONFIGS}>
                  {t('footer.configuration')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='practice form' href={APP_LINK.TEST}>
                  {t('footer.test')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link onClick={() => setIsOpen(true)} id='tour'>
                  Tour
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <hr className='d-lg-none text-white-50'></hr>
            <Nav className='flex-row flex-wrap ms-md-auto' as='ul'>
              {!error && (
                <>
                  <Nav.Item as='li' className='col-6 col-lg-auto'>
                    <Nav.Link onClick={() => dispatch(switchSettingsModal())} data-testid='open-settings'>
                      <GearFill title={t('header.settings')} />
                      <small className='d-lg-none ms-2'>{t('header.settings')}</small>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as='li' className='py-2 py-lg-1 col-12 col-lg-auto'>
                    <div className='vr d-none d-lg-flex h-100 mx-lg-2 text-white'></div>
                    <hr className='d-lg-none my-2 text-white-50'></hr>
                  </Nav.Item>
                </>
              )}
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title={t('footer.youtube')} href={SOCIAL_LINKS.YOUTUBE}>
                  <Youtube />
                  <small className='d-lg-none ms-2'>{t('footer.youtube')}</small>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title={t('footer.github')} href={SOCIAL_LINKS.GITHUB}>
                  <Github />
                  <small className='d-lg-none ms-2'>{t('footer.github')}</small>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='py-2 py-lg-1 col-12 col-lg-auto'>
                <div className='vr d-none d-lg-flex h-100 mx-lg-2 text-white'></div>
                <hr className='d-lg-none my-2 text-white-50'></hr>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link onClick={toggleTheme} data-testid='switch-theme'>
                  {theme !== 'light' ? <Sun title={t('header.theme.dark')} /> : <Moon title={t('header.theme.light')} />}
                  <small className='d-lg-none ms-2'>Toggle Theme</small>
                </Nav.Link>
              </Nav.Item>
              {!error && (
                <Nav.Item as='li' className='col-6 col-lg-auto'>
                  <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase fw-bolder' data-testid='switch-language'>
                    {APP_LANGUAGES.map((language) => (
                      <NavDropdown.Item key={language} title={language} onClick={() => changeLanguage(language)} active={i18n.language === language}>
                        {t(`language.${language}`)}
                      </NavDropdown.Item>
                    ))}
                    <NavDropdown.Divider />
                    <NavDropdown.Item title={'Add your Language'} href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer'>
                      Add your Language
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
      <SettingsModal />
    </Navbar>
  );
}

export default Header;
