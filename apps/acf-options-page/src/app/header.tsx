import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { GearFill, Moon, Sun } from '../util';
import { SettingsModal } from '../modal';
import { APP_LANGUAGES, APP_NAME } from '../constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { switchTheme, themeSelector } from '../store/theme.slice';
import { appSelector } from '../store/app.slice';
import { switchSettingsModal } from '../store/settings/settings.slice';

function Header() {
  const theme = useAppSelector(themeSelector);
  const { error } = useAppSelector(appSelector);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const toggleTheme = () => {
    dispatch(switchTheme());
  };

  let imageURL = 'https://getautoclicker.com/favicons/favicon32.png';
  let appName = APP_NAME;

  if (/(DEV|BETA|LOCAL)/.test(process.env.NX_VARIANT || '')) {
    imageURL = `https://getautoclicker.com/favicons/${process.env.NX_VARIANT}/icon32.png`;
    appName += ` [${process.env.NX_VARIANT}]`;
  }

  return (
    <header>
      <nav className='border-bottom navbar navbar-expand-lg'>
        <Container fluid className='px-5 justify-content-center justify-content-md-between'>
          <Navbar.Brand>
            <img src={imageURL} width='32' height='32' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
            <h1 className='h4 d-inline-flex ms-2 my-0 fw-normal'>{appName}</h1>
          </Navbar.Brand>
          <Navbar className='p-0'>
            <Nav className='me-auto' />
            <Nav>
              <Nav.Link onClick={toggleTheme} className='px-4 py-3' data-testid='switch-theme'>
                {theme !== 'light' ? <Sun width='24' height='24' title={t('header.theme.dark')} /> : <Moon width='24' height='24' title={t('header.theme.light')} />}
              </Nav.Link>

              {!error && (
                <>
                  <Nav.Link onClick={() => dispatch(switchSettingsModal())} className='px-4 py-3' data-testid='open-settings'>
                    <GearFill width='24' height='24' title={t('header.settings')} />
                  </Nav.Link>
                  <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase px-2 py-2 fw-bolder' data-testid='switch-language'>
                    {APP_LANGUAGES.map((language) => (
                      <NavDropdown.Item key={language} title={language} onClick={() => changeLanguage(language)} className='text-secondary'>
                        {t(`language.${language}`)}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </>
              )}
              <SettingsModal />
            </Nav>
          </Navbar>
        </Container>
      </nav>
    </header>
  );
}

export default Header;
