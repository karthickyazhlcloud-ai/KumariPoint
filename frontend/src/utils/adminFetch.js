let adminToken = '';

export const setAdminToken = (token) => {
  adminToken = token || '';
  if (typeof window !== 'undefined') {
    if (adminToken) window.sessionStorage.setItem('admin_api_token', adminToken);
    else window.sessionStorage.removeItem('admin_api_token');
  }
};

export const adminFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${adminToken}` }
  });
};
