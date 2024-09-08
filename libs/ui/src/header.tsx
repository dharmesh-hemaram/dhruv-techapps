import { ThemeContext } from '@dhruv-techapps/context';
import { FC, PropsWithChildren, useContext, useState } from 'react';
import { Container, Nav, NavDropdown, Navbar, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Github, Moon, Sun, ThreeDots, Youtube } from './assets/svg';
import { APP_LANGUAGES, APP_LINK, SOCIAL_LINKS } from './constants';

type HeaderProps = {
  onHomeClick?: (e: React.MouseEvent<HTMLLinkElement>) => void;
} & PropsWithChildren;

export const Header: FC<HeaderProps> = ({ children, onHomeClick }) => {
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { t, i18n } = useTranslation();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <Navbar expand='lg' as='header' className='bd-navbar' sticky='top'>
      <Container fluid className='bd-gutter flex-wrap flex-lg-nowrap' as='nav'>
        <div className='d-lg-none' style={{ width: '4.25rem' }}></div>
        <Navbar.Brand onClick={onHomeClick} href='/' className='p-0 me-0 me-lg-2'>
          {t('common.appName')}
        </Navbar.Brand>
        <div className='d-flex'>
          <Navbar.Toggle aria-controls='basic-navbar-nav' onClick={handleShow}>
            <ThreeDots />
          </Navbar.Toggle>
        </div>
        <Offcanvas show={show} onHide={handleClose} responsive='lg' placement='end' className='flex-grow-1 bd-header'>
          <Offcanvas.Header closeButton className='px-4 pb-0' closeVariant='white'>
            <Offcanvas.Title className='text-white'>{t('common.appName')}</Offcanvas.Title>
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
                <Nav.Link target='_blank' rel='noopener noreferrer' title='practice form' href={APP_LINK.TEST}>
                  {t('footer.test')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <hr className='d-lg-none text-white-50'></hr>
            <Nav className='flex-row flex-wrap ms-md-auto' as='ul'>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='youtube' href={SOCIAL_LINKS.YOUTUBE}>
                  <Youtube />
                  <small className='d-lg-none ms-2'>{t('footer.youtube')}</small>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <Nav.Link target='_blank' rel='noopener noreferrer' title='github' href={SOCIAL_LINKS.GITHUB}>
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

              <Nav.Item as='li' className='col-6 col-lg-auto'>
                <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase fw-bolder' data-testid='switch-language'>
                  {APP_LANGUAGES.map((language) => (
                    <NavDropdown.Item key={language} title={language} onClick={() => changeLanguage(language)} active={i18n.language === language}>
                      {t(`language.${language}`)}
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Divider />
                  <NavDropdown.Item title='Add your Language' href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer'>
                    Add your Language
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
              {children}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};
