import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // will use later for nav?
import { auth } from '../lib/firebase'; // will use later for password email update
import checkAuth from '../hooks/checkAuth';  
import Nav from '../components/nav';
import Footer from '../components/footer';
import styles from '../styles/user_profile.module.css';

export default function UserProfile() {
  const user = checkAuth();  // get our signed in user
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialData, setInitialData] = useState(null);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/read_by_firebase_uid?id=${user.uid}`);
          
          const data = await response.json();

          if (data.error) {
            setError(data.error);
          } else {
            setInitialData(data);

            // populate form fields
            setFirstName(data.USER_FIRST_NAME || '');
            setLastName(data.USER_LAST_NAME || '');
            setEmail(data.USER_EMAIL || '');
            setPhone(data.USER_PHONE_NUMBER || '');
            setAddress(data.USER_ADDRESS || '');
          }
        } catch (err) {
          setError('Failed to fetch user data');
          console.log('Fetch Error:', err.message); // Log any errors during fetch
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleUpdate = async (e, field) => {
    e.preventDefault();
    setLoading(true);
  
    // data to push to DB
    let updateData = {};
  
    // update only the modified fields
    if (field === 'firstName') {
      updateData.USER_FIRST_NAME = firstName;
    } else if (field === 'lastName') {
      updateData.USER_LAST_NAME = lastName;
    } else if (field === 'email') {
      updateData.USER_EMAIL = email;
    } else if (field === 'phone') {
      updateData.USER_PHONE_NUMBER = phone;
    } else if (field === 'address') {
      updateData.USER_ADDRESS = address;
    }
  
    updateData = {
      ...initialData, // keep initial data 
      ...updateData,  // adjust for changes
    };
  
    try {
      // send data to API
      const response = await fetch(`/api/users/update_by_firebase_uid?id=${user.uid}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log('Update response:', data);
  
      if (data.message) {
        alert('Profile updated successfully!');
        // reload the page to reflect changes
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
              onChange={(e) => setFirstName(e.target.value)}  // Allow changes
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'firstName')} disabled={loading}>
              {loading ? 'Updating...' : 'Update First Name'}
            </button>
          </div>

          {/* Last Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.inputLabel}>Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}  // Allow changes
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'lastName')} disabled={loading}>
              {loading ? 'Updating...' : 'Update Last Name'}
            </button>
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Allow changes
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'email')} disabled={loading}>
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </div>

          {/* Phone */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.inputLabel}>Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}  // Allow changes
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'phone')} disabled={loading}>
              {loading ? 'Updating...' : 'Update Phone'}
            </button>
          </div>

          {/* Address */}
          <div className={styles.inputGroup}>
            <label htmlFor="address" className={styles.inputLabel}>Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}  // Allow changes
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={(e) => handleUpdate(e, 'address')} disabled={loading}>
              {loading ? 'Updating...' : 'Update Address'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
