import { useContext, useEffect, useState } from 'react';
import { auth, db } from './utils/firebase';
import { UserContext } from './contexts/UserContext';
import UnauthenticatedApp from './Unauthenticated-app';
import AuthenticatedApp from './Authenticated-app';
import { onAuthStateChanged } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';
import { get, ref } from 'firebase/database';
import ShopSetup from './components/ShopSetup';  // Ensure this is imported

function App() {
  const { user, setUser } = useContext(UserContext);
  const [appLoading, setAppLoading] = useState(true);
  const [shopExist, setShopExist] = useState(false);
  const [checkingShop, setCheckingShop] = useState(false); // New state for shop check

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAppLoading(true);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setAppLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkShop = async () => {
      if (!user) return;  // Ensure user is authenticated
      
      setCheckingShop(true); // Set checkingShop to true before fetching
      const shopRef = ref(db, `shops/${user.uid}`);
      const shopSnap = await get(shopRef);
      if (shopSnap.exists()) {
        setShopExist(true);
      } else {
        setShopExist(false);
      }
      setCheckingShop(false); // Reset checkingShop once fetch completes
    };
    
    checkShop();
  }, [user]);

  // If still loading auth or checking shop existence
  if (appLoading || checkingShop) {
    return (
      <div className='w-screen h-screen flex justify-center items-center text-primary animate-spin'>
        <LoaderCircle className='h-12 w-12' />
      </div>
    );
  }
  
  if (user && shopExist) {
    return <AuthenticatedApp />;
  }
  
  if (user && !shopExist) {
    return <ShopSetup setShopExist={setShopExist} />;
  }

  return <UnauthenticatedApp />;
}

export default App;
