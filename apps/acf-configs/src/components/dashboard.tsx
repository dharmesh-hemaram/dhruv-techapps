import { Footer, Header } from '@dhruv-techapps/ui';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export const Dashboard = () => {
  const navigate = useNavigate();

  const onSignOut = async () => {
    await auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <Header />
      <Button onClick={onSignOut}>Logout</Button>
      <Footer />
    </div>
  );
};
