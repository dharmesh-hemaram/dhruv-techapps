import { Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

export const User = () => {
  const user = auth.currentUser;

  const navigate = useNavigate();
  const onSignOut = async () => {
    await auth.signOut();
    navigate('/login', { replace: true });
  };

  if (!user) return null;
  return (
    <>
      <Nav.Item as='li' className='py-2 py-lg-1 col-12 col-lg-auto'>
        <div className='vr d-none d-lg-flex h-100 mx-lg-2 text-white'></div>
        <hr className='d-lg-none my-2 text-white-50'></hr>
      </Nav.Item>
      <NavDropdown title={user.displayName} id='subscription-nav-dropdown' align='end'>
        <NavDropdown.Item title='logout' onClick={onSignOut}>
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};
