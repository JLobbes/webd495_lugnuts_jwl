import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, createUserWithEmailAndPassword } from '../lib/firebase';
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/signup.module.css';
import axios from 'axios'; 

export default function SignUp() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // save the data to MariaDB
      if (step === 3) {
        const userData = {
          FIREBASE_UID: user.uid, // these keys need to match the backend API
          USER_EMAIL: email,
          USER_FIRST_NAME: firstName,
          USER_LAST_NAME: lastName,
          USER_ADDRESS: address,
          USER_PHONE_NUMBER: phoneNumber,
        };
        
        console.log('Sending user data:', userData);
        
        // send data via POST to backend API
        await axios.post('/api/users/create', userData);
        
        alert('Sign Up Successful');
        router.push('/'); // redirect to homepage
      }
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
          <div className={styles.imageContainer}>
              {/* the image has been canned for the time being */}
          </div> 
          <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>Create an Account</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSignUp} className={styles.form}>
              {step === 1 && (
                <>
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
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => setStep(2)} 
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.inputLabel}>First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="lastName" className={styles.inputLabel}>Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => setStep(3)} 
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => setStep(1)} 
                  >
                    Back
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="address" className={styles.inputLabel}>Address</label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber" className={styles.inputLabel}>Phone Number</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => setStep(2)} 
                  >
                    Back
                  </button>
                </>
              )}
            </form>
          </div>
      </main>
      <Footer />
    </>
  );
}
