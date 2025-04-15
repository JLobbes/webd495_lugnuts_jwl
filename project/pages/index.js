import Nav from '../components/nav';
import Footer from '../components/footer';
import checkAuth from '../hooks/checkAuth';
import styles from '../styles/home.module.css';
import { FaSearch, FaReceipt, FaUserPlus } from 'react-icons/fa';

const Home = () => {
  const user = checkAuth();

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1 className={styles.welcome}>Welcome!</h1>
        <div className={styles.tileContainer}>
          {user ? (
            <>
              <a href="/product_search" className={styles.tile}>
                <FaSearch className={styles.icon} />
                Find a Part
              </a>
              <a href="/user_orders" className={styles.tile}>
                <FaReceipt className={styles.icon} />
                My Orders
              </a>
              <a className={`${styles.tile} ${styles.newsTile}`}>
                <span className={styles.newsOverlay}>The Latest News</span>
              </a>
            </>
          ) : (
            <>
              <a href="/signin_ui" className={styles.tile}>
                <FaUserPlus className={styles.icon} />
                Sign In
              </a>
              <a href="/product_search" className={styles.tile}>
                <FaSearch className={styles.icon} />
                Find a Part
              </a>
              <a className={`${styles.tile} ${styles.newsTile}`}>
                <span className={styles.newsOverlay}>The Latest News</span>
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
