// src/utils/validation.js
export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return strongPassword.test(password);
  };