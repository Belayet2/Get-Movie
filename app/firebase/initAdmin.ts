import { saveAdminCredentials } from './adminAuth';

// Initialize admin credentials
export const initializeAdmin = async () => {
  try {
    await saveAdminCredentials('Belayet', 'Bel@12345');
    console.log('Admin credentials saved successfully');
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}; 