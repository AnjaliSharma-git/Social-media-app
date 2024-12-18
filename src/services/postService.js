// src/services/postService.js
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    startAfter, 
    getDocs 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebase';
  
  export const createPost = async (userId, content, files) => {
    try {
      // Upload files
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `posts/${userId}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return await getDownloadURL(snapshot.ref);
        })
      );
  
      // Create post document
      const postData = {
        userId,
        content,
        mediaUrls: fileUrls,
        createdAt: new Date(),
        likes: 0,
        comments: 0
      };
  
      const docRef = await addDoc(collection(db, 'posts'), postData);
      return { id: docRef.id, ...postData };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  export const fetchPosts = async (lastVisible = null, pageSize = 20) => {
    try {
      let q;
      if (lastVisible) {
        q = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
  
      const documentSnapshots = await getDocs(q);
      const posts = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      
      return {
        posts,
        lastVisible: lastVisibleDoc
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };