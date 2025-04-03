import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { auth } from '../lib/firebase'; 
import checkAuth from '../hooks/checkAuth';  
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/user_profile.module.css';

export default function UserProfile() {
  const user = checkAuth();  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialData, setInitialData] = useState(null);  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/users/read_by_firebase_uid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebase_uid: user.uid, idToken: user.accessToken })
          });

          const data = await response.json();

          if (data.error) {
            setError(data.error);
          } else {
            setInitialData(data);
            setFirstName(data.USER_FIRST_NAME || '');
            setLastName(data.USER_LAST_NAME || '');
            setEmail(data.USER_EMAIL || '');
            setPhone(data.USER_PHONE_NUMBER || '');
            setAddress(data.USER_ADDRESS || '');
          }
        } catch (err) {
          setError('Failed to fetch user data');
          console.log('Fetch Error:', err.message); 
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleUpdate = async (e, field) => {
    e.preventDefault();
    setLoading(true);

    let updateData = {};
    if (field === 'firstName') updateData.USER_FIRST_NAME = firstName;
    else if (field === 'lastName') updateData.USER_LAST_NAME = lastName;
    else if (field === 'email') updateData.USER_EMAIL = email;
    else if (field === 'phone') updateData.USER_PHONE_NUMBER = phone;
    else if (field === 'address') updateData.USER_ADDRESS = address;

    updateData = { ...initialData, ...updateData };

    try {
      const response = await fetch('/api/users/update_by_firebase_uid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_uid: user.uid,
          idToken: user.accessToken,
          USER_EMAIL: updateData.USER_EMAIL,
          USER_FIRST_NAME: updateData.USER_FIRST_NAME,
          USER_LAST_NAME: updateData.USER_LAST_NAME,
          USER_PHONE_NUMBER: updateData.USER_PHONE_NUMBER,
          USER_ADDRESS: updateData.USER_ADDRESS,
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (data.message) {
        alert('Profile updated successfully!');
        window.location.reload();  
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.log('Error updating user:', err.message);
      setError('Failed to update user profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Update Your Profile</h1>
          {error && <p className={styles.error}>{error}</p>}

          {/* First Name */}
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
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'firstName')}>
              Update First Name
            </button>
          </div>

          {/* Last Name */}
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
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'lastName')}>
              Update Last Name
            </button>
          </div>

          {/* Email */}
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
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'email')}>
              Update Email
            </button>
          </div>

          {/* Phone */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.inputLabel}>Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}  
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'phone')}>
              Update Phone
            </button>
          </div>

          {/* Address */}
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
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'address')}>
              Update Address
            </button>
          </div>

        </div>

        {/* Loading overlay */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
