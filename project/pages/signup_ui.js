import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, createUserWithEmailAndPassword } from '../lib/firebase';
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/signup.module.css'; 

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Sign Up Successful');
      router.push('/'); // currently redirects to index.js
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.imageContainer}></div> {/* has image as background */}
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Create an Account</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignUp} className={styles.form}>
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
