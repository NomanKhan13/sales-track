import { useContext, useEffect, useState } from 'react';
import { auth } from './utils/firebase';
import { UserContext } from './contexts/UserContext';
import UnauthenticatedApp from './Unauthenticated-app';
import AuthenticatedApp from './Authenticated-app';
import { onAuthStateChanged } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';

function App() {
  const { user, setUser, userLoading, setUserLoading } = useContext(UserContext);

  // Local state to track the loading of Firebase authentication
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoading(true); // Start loading user data
      if (user) {
        setUser(user); // User is logged in, update context
      } else {
        setUser(null); // User is logged out, update context
      }
      setUserLoading(false); // Stop loading user data
      setAuthLoading(false); // Firebase auth state has been determined
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Ensure we wait for auth state to be determined before rendering
  if (authLoading) {
    return <div className='w-screen h-screen flex justify-center items-center text-primary animate-spin'>
      <LoaderCircle className='h-12 w-12' />
    </div>;
  }

  // Show the appropriate app depending on whether the user is logged in or not
  return (
    <>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </>
  );
}

export default App;
