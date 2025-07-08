export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_go_api,
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
      GET_ANALYSIS: '/records/:recordID',
      GET_INSIGHTS: 'records/insights'
    }
  }
};