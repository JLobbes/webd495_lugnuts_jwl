import { FaSearch } from 'react-icons/fa'; 
import styles from '../styles/nav.module.css';

const Nav = () => {
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
      </div>
    </nav>
  );
};

export default Nav;
