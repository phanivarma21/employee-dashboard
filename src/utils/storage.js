const EMP_KEY = "employees";
const AUTH_KEY = "isAuth";

export const setAuth = () => {
  localStorage.setItem(AUTH_KEY, "true");
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  // localStorage.removeItem(EMP_KEY); 
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};

export const getEmployees = () => {
  const data = localStorage.getItem(EMP_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEmployees = (data) => {
  localStorage.setItem(EMP_KEY, JSON.stringify(data));
};