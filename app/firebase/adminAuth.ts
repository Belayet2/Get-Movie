import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';

const ADMIN_DOC_ID = 'admin_credentials';
const ADMIN_COLLECTION = 'admin';

export const saveAdminCredentials = async (username: string, password: string) => {
  try {
    await setDoc(doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID), {
      username,
      password,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error saving admin credentials:', error);
    throw error;
  }
};

export const verifyAdminCredentials = async (username: string, password: string) => {
  try {
    const adminDoc = await getDoc(doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID));
    if (!adminDoc.exists()) return false;
    
    const adminData = adminDoc.data();
    return adminData.username === username && adminData.password === password;
  } catch (error) {
    console.error('Error verifying admin credentials:', error);
    throw error;
  }
}; 