import { lazy, useContext, useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './utils/firebase';
import { LoaderCircle } from 'lucide-react';
import { UserContext } from './contexts/UserContext';
const PhoneAuth = lazy(() => import("../src/components/PhoneAuth"));
const AuthenticatedApp = lazy(() => import("./Authenticated-app"));
const ShopSetup = lazy(() => import("./components/ShopSetup"));  

function App() {
  const { user, setUser } = useContext(UserContext);
  const [appLoading, setAppLoading] = useState(true);
  const [shopExist, setShopExist] = useState(null); // Initially null to show loading state
  const [checkingShop, setCheckingShop] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAppLoading(true);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setAppLoading(false); // Once auth check is complete, stop loading
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkShop = async () => {
      if (!user) return;
      
      setCheckingShop(true); // Start checking for shop existence
      const shopRef = ref(db, `shops/${user.uid}`);
      const shopSnap = await get(shopRef);
      if (shopSnap.exists()) {
        setShopExist(true);
      } else {
        setShopExist(false);
      }
      setCheckingShop(false); // Stop checking after result is fetched
    };

    if (user) {
      checkShop(); // Only check if user is authenticated
    } else {
      setShopExist(null); // Reset if no user is authenticated
    }
  }, [user]);

  // Handle loading states (authentication + shop existence)
  if (appLoading || checkingShop ) {
    console.log(appLoading, checkingShop, !shopExist)
    return (
      <div className='w-screen h-screen flex justify-center items-center text-purple-600'>
        <LoaderCircle className='h-12 w-12 animate-spin' />
      </div>
    );
  }

  // Render the appropriate component based on authentication and shop existence
  if (user && shopExist) {
    return <AuthenticatedApp />;
  }
  
  if (user && !shopExist) {
    return <ShopSetup setShopExist={setShopExist} />;
  }

  return <PhoneAuth />;
}

export default App;
