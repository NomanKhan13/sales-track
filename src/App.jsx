import { lazy, useContext, useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './utils/firebase';
import { LoaderCircle } from 'lucide-react';
import { UserContext } from './contexts/UserContext';
const UnauthenticatedApp = lazy(() => import("./Unauthenticated-app"));
const AuthenticatedApp = lazy(() => import("./Authenticated-app"));
const ShopSetup = lazy(() => import("./components/ShopSetup"));  

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
