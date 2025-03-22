import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../styles/nav.module.css';
import { useRouter } from 'next/router';
import checkAuth from '../hooks/checkAuth';  
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Nav = () => {
  const user = checkAuth();  
  const router = useRouter();

  // Sign out logic
  const handleSignOut = async () => {
    try {
      await signOut(auth);  
      alert('Logged out successfully');  
      router.push('/');  
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img src="lugnuts_logo.png" alt="Lugnuts Company" />
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBarWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className={styles.cart}>
          <img src="cart_icon.png" alt="Cart Icon" />
        </div>

        {user ? (
          <div className={styles.userInfo}>
            {/* show user's info in the future */}
            <span>{user.displayName || 'User'}</span>
            <button onClick={handleSignOut}>Sign Out</button> {/* Sign Out button */}
          </div>
        ) : (
          <div className={styles.authButtons}>
            <button onClick={() => router.push('/signin_ui')}>Sign In</button>
            <button onClick={() => router.push('/signup_ui')}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
