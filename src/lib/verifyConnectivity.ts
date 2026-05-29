import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';

export async function verifyFirestoreConnectivity() {
  try {
    console.log('Verifying Firestore connectivity...');
    // Attempt to fetch a document that probably doesn't exist, but forces a network roundtrip
    // without using cache if possible (getDocFromServer)
    const testDoc = doc(db, '_internal_', 'connectivity_check');
    await getDocFromServer(testDoc).catch(() => {
        // We expect it might not exist, that's fine. 
        // If we get here without a "network" error, we are connected.
    });
    console.log('✅ Firestore connected successfully.');
  } catch (error: any) {
    if (error.code === 'unavailable') {
      console.error('❌ Firestore is unavailable. Please check your internet connection or Firebase setup.');
    } else {
      console.error('❌ Firestore connectivity error:', error.message);
    }
  }
}
