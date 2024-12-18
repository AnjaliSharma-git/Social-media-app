import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL,
    deleteObject
  } from 'firebase/storage';
  import { v4 as uuidv4 } from 'uuid';
  
  const storage = getStorage();
  
  export const uploadFile = async (file, path = 'uploads/') => {
    // Generate a unique filename
    const filename = `${path}${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, filename);
  
    try {
      // Compress image if it's an image
      const compressedFile = await compressImage(file);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, compressedFile);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: filename
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };
  
  export const deleteFile = async (filePath) => {
    const fileRef = ref(storage, filePath);
    
    try {
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  };
  
  // Image Compression Utility
  const compressImage = async (file) => {
    const maxWidth = 1920;
    const maxHeight = 1080;
    const quality = 0.7;
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to blob
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, file.type, quality);
        };
      };
      reader.onerror = error => reject(error);
    });
  };