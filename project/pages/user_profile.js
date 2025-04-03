import { useState, useEffect } from 'react';
import { auth, firebaseUpdatePassword } from '../lib/firebase'; 
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';  
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
  const [currentPassword, setCurrentPassword] = useState('');  
  const [newPassword, setNewPassword] = useState('');  
  const [newEmail, setNewEmail] = useState('');  
  const [initialData, setInitialData] = useState(null);  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReAuthModalOpen, setIsReAuthModalOpen] = useState(false);  
  const [requiresReAuthUpdateType, setUpdateType] = useState('');  // track whether it's password or email update

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
            setNewEmail(data.USER_EMAIL || '');
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
          USER_EMAIL: email,
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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // validation
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await firebaseUpdatePassword(auth.currentUser, newPassword);
      alert('Password updated successfully!');

      setCurrentPassword('');
      setNewPassword('');
      setIsReAuthModalOpen(false); // Close the modal after successful update
    } catch (err) {
      setError('Failed to update password. Please check your current password.');
      console.log('Password update error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // close pop-up
      setIsReAuthModalOpen(false);

      // user must click link in email for update to complete
      // no separate call of updateEmail required
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      alert('Verification email sent! Please check your inbox. We will log you out now.');
      
      // redirect to sign-in as verifyBeforeUpdateEmail signs user out
      window.location.href = './signin_ui';

    } catch (err) {
      setError('Failed to update email.');
      console.log('Email update error:', err.message);
    } 
  };

  const openPasswordModal = (type) => {
    setUpdateType(type); // Track the type of update (password or email)
    setIsReAuthModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsReAuthModalOpen(false);
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
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)}  
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={() => openPasswordModal('email')}>
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

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.inputLabel}>New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}  
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} onClick={() => openPasswordModal('password')}>
              Update Password
            </button>
          </div>
        </div>

        {/* Pop-up modal for re-authentication */}
        {isReAuthModalOpen && (
          <div className={styles.modalContainer}>
            <div className={styles.modal}>
              <h2>Re-authenticate to Change {requiresReAuthUpdateType === 'password' ? 'Password' : 'Email'}</h2>
              <label htmlFor="currentPassword" className={styles.inputLabel}>Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}  
                required
                className={styles.input}
              />
              <button className={styles.button} onClick={requiresReAuthUpdateType === 'password' ? handlePasswordUpdate : handleEmailUpdate}>
                Submit
              </button>
              <button className={styles.closeButton} onClick={closePasswordModal}>Close</button>
            </div>
          </div>
        )}

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
