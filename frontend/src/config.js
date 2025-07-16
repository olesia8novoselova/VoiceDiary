export const API_CONFIG = {
  // BASE_URL: "http://178.205.96.163:8080",
    BASE_URL: "http://localhost:8080",

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      ME: 'users/me',
      LOGOUT: '/users/logout',
      UPDATE_PROFILE: '/users/me'
    },
    RECORDS: {
      UPLOAD: '/records/upload',
      GET_ALL: '/users/:userID/records',
      GET_ANALYSIS: '/records/:recordID',
      GET_INSIGHTS: '/records/insights'
    }
  }
};