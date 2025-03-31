export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};

export const redirectToSignUp = () => {
  if (typeof window === 'undefined') return;
  window.location.href = 'https://dashboard.enterprise.wikimedia.com/signup/';
}; 