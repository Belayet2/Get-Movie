import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  CollectionReference
} from 'firebase/firestore';
import { db } from './config';

// Generic type for Firestore data
export type FirestoreData<T> = T & {
  id: string;
};

// Add a document to a collection
export const addDocument = async <T>(collectionName: string, data: T) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Get all documents from a collection
export const getDocuments = async <T>(collectionName: string): Promise<FirestoreData<T>[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    } as FirestoreData<T>));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Get a document by ID
export const getDocumentById = async <T>(collectionName: string, docId: string): Promise<FirestoreData<T> | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreData<T>;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async <T>(collectionName: string, docId: string, data: Partial<T>) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Query documents with filters
export const queryDocuments = async <T>(
  collectionName: string,
  conditions: { field: string; operator: string; value: any }[] = [],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<FirestoreData<T>[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef);
    
    // Apply filters
    if (conditions.length > 0) {
      q = query(
        q,
        ...conditions.map(condition => 
          where(condition.field, condition.operator as any, condition.value)
        )
      );
    }
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as FirestoreData<T>));
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
}; 