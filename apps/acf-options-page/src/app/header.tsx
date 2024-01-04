import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { GearFill, Github, Moon, Sun, Youtube } from '../util';
import { SettingsModal } from '../modal';
import { APP_LANGUAGES, APP_LINK, APP_NAME, SOCIAL_LINKS } from '../constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { switchTheme, themeSelector } from '../store/theme.slice';
import { appSelector } from '../store/app.slice';
import { switchSettingsModal } from '../store/settings/settings.slice';
import { useTour } from '@reactour/tour';
import { useEffect } from 'react';

function Header() {
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
    <header className='bd-navbar'>
      <Navbar className='p-2'>
        <Container fluid className='px-3 py-1 justify-content-center justify-content-md-between'>
          <Navbar.Brand>
            <h1 className='h5 d-inline-flex my-0'>{appName}</h1>
          </Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='docs' href={`${APP_LINK.DOCS}getting-started`}>
              {t('footer.docs')}
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='blog' href={APP_LINK.BLOG}>
              {t('footer.blog')}
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='issues' href={APP_LINK.ISSUES}>
              {t('footer.issues')}
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='discussion' href={APP_LINK.DISCUSSIONS}>
              {t('footer.discussion')}
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='configuration' href={APP_LINK.CONFIGS}>
              {t('footer.configuration')}
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title='practice form' href={APP_LINK.TEST}>
              {t('footer.test')}
            </Nav.Link>
            <Nav.Link onClick={() => setIsOpen(true)} id='tour'>
              Tour
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link target='_blank' rel='noopener noreferrer' title={t('footer.youtube')} href={SOCIAL_LINKS.YOUTUBE}>
              <Youtube />
            </Nav.Link>
            <Nav.Link target='_blank' rel='noopener noreferrer' title={t('footer.github')} href={SOCIAL_LINKS.GITHUB} className='ps-4'>
              <Github />
            </Nav.Link>
            <Nav.Link onClick={toggleTheme} data-testid='switch-theme' className='ps-4'>
              {theme !== 'light' ? <Sun title={t('header.theme.dark')} /> : <Moon title={t('header.theme.light')} />}
            </Nav.Link>
            {!error && (
              <>
                <Nav.Link onClick={() => dispatch(switchSettingsModal())} className='px-4' data-testid='open-settings'>
                  <GearFill title={t('header.settings')} />
                </Nav.Link>
                <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase fw-bolder' data-testid='switch-language'>
                  {APP_LANGUAGES.map((language) => (
                    <NavDropdown.Item key={language} title={language} onClick={() => changeLanguage(language)} className='text-secondary'>
                      {t(`language.${language}`)}
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Divider />
                  <NavDropdown.Item title={'Add your Language'} href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer' className='text-secondary'>
                    Add your Language
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            <SettingsModal />
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
