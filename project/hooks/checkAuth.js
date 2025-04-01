// checkAuth only checks Authenticatio state (i.e., is user signed in or not)
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

const checkAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('User is signed in:', user);
        setUser(user);
      } else {
        console.log('User is not signed in');
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [router]);

  // console.log('Current user state:', user);

  return user;
};

export default checkAuth;
