import { useState } from 'react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';  // Import FaCaretDown icon
import styles from '../styles/nav.module.css';
import { useRouter } from 'next/router';
import checkAuth from '../hooks/checkAuth';  
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';



const Nav = () => {
  const user = checkAuth();  
  const router = useRouter();
  const [searchText, setSearchText] = useState('');


  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

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

  const handleSearchRedirect = () => {
    if (searchText.trim()) {
      router.push(`/product_search?query=${encodeURIComponent(searchText)}`);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <a href='/'>
          <img src="lugnuts_logo.png" alt="Lugnuts Company" />
        </a>
      </div>

      <div className={styles.navElements}>
        <div className={styles.searchBarWrapper}>
          <button onClick={handleSearchRedirect} className={styles.searchButton}>
            <FaSearch className={styles.searchIcon} />
          </button>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className={styles.cart}>
          <a href='/user_cart'>
            <img src="cart_icon.png" alt="Cart Icon" />
          </a>
        </div>

        <button onClick={toggleDropdown} className={styles.dropdownButton}>
          More
          <FaCaretDown /> {/* Using FaCaretDown from react-icons */}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <a href='/product_search'>
              Catelog
              &#128269; 
            </a>

            {user ? (
              <>
                <a href='/user_cart'>My Cart</a>
                <a href='/user_orders'>My Orders</a>
                <a href='/user_profile'>My Profile</a>
                <a href='#' onClick={handleSignOut}>Sign Out</a>
              </>
            ) : (
              <>
                <a href='/signin_ui'>Sign In</a>
                <a href='/signup_ui'>Sign Up</a>
              </>
            )}

            <a href='/'>Back Home</a>
          </div>
        )}

        {/* <span>{user.displayName || 'User'}</span> */}
      </div>
    </nav>
  );
};

export default Nav;