import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { auth } from '../firebase';

export const protectedLoader = async ({ request }: LoaderFunctionArgs) => {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication

  await auth.authStateReady();
  if (!auth.currentUser) {
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    return redirect('/login?' + params.toString());
  }
  return auth.currentUser;
};

export const loginLoader = async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return redirect('/');
  }
  return null;
};
