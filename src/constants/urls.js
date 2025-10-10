export const API_URL = import.meta.env.VITE_API_URL;

export const API = {

  LOGIN: `${API_URL}/auth/login`,
  USERS: `${API_URL}/users`,
  USER_BY_ID: (id) => `${API_URL}/users/${id}`,
  SEARCH_USERS: (query, limit, skip) =>
    `${API_URL}/users/search?q=${query}&limit=${limit}&skip=${skip}`,
  ADD_USER: `${API_URL}/users/add`,
  USER_PROFILE: `${API_URL}/users/`,

};
