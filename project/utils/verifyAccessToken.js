import { getAuth } from 'firebase-admin/auth';  
import { initializeApp, cert, getApps } from 'firebase-admin/app'; 

export const verifyAccessToken = async (idToken, firebase_uid) => {
  
  // initialize Firebase Admin SDK if not ready
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(credentials),
    });
  }

  try {
    const verifiedToken = await getAuth().verifyIdToken(idToken);

    if (verifiedToken.uid !== firebase_uid) {
      throw new Error('Unauthorized request');
    }

    // Return the decoded token if successful
    return verifiedToken;
  } catch (error) {
    throw new Error(`Error verifying access token: ${error.message}`);
  }
};
