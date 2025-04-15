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
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // The user object is returned here

      // Now that the user is signed in, you can sync the user email in MariaDB
      try {
        const response = await fetch('/api/users/update_email_by_firebase_uid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebase_uid: user.uid,
            idToken: user.accessToken,
            USER_EMAIL: email,
          }),
        });

        const data = await response.json();
        console.log('Sync email Response:', data);

        alert('Sign In Successful');
        router.push('/');  // Redirect to homepage after successful sign-in
      } catch (err) {
        console.log('Error syncing email with MariaDB:', err.message);
        setError('Error syncing email with database.');
      }
    } catch (err) {
      console.log('Sign-in error:', err.message);
      setError('Invalid credentials, please try again.');
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
          <p className={styles.signupRedirect}>
            Don’t have an account? <a href="/signup_ui" className={styles.signupLink}>Sign up here</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
