import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, signInWithEmailAndPassword } from '../lib/firebase';
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/signin.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // sign in user with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      alert('Sign In Successful');
      router.push('/'); // redirect to homepage
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Sign In</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignIn} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
