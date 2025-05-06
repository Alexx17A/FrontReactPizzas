export const getAuthToken = () => {
    // Get token from cookies
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return cookieValue || localStorage.getItem('token');
  };
  
  export const isAdmin = async () => {
    try {
      const token = getAuthToken();
      if (!token) return false;
  
      // You might want to decode the JWT to check roles
      // or make an API call to verify admin status
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) return false;
      
      const userData = await response.json();
      return userData.roles.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };
  
  export const setAuthToken = (token) => {
    // Set token in cookies and localStorage
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
    localStorage.setItem('token', token);
  };
  
  export const clearAuthToken = () => {
    // Clear token from cookies and localStorage
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('token');
  };