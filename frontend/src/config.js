export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      ME: '/me',
      LOGOUT: '/users/logout'
    },
    RECORDS: {
      UPLOAD: '/records/upload',
      GET_ALL: '/users/:userID/records',
      GET_ANALYSIS: '/records/:recordID'
    }
  }
};