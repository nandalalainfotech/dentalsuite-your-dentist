
const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// --- TOKEN HELPERS ---
export const saveToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

// --- REFRESH TOKEN HELPERS ---
export const saveRefreshToken = (token: string) => {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

// --- USER HELPERS ---
export const saveUser = (user: any) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  sessionStorage.removeItem(USER_KEY);
};

// --- CLEAR ALL AUTH DATA ---
export const clearAuthStorage = () => {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

// --- AUTH CHECK ---
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// --- ROLE HELPERS (IMPORTANT FOR YOUR DASHBOARD ROUTING) ---
export const getUserType = (): string | null => {
  const user = getUser();
  return user?.type || null;
};

export const isPracticeAdmin = (): boolean => {
  return getUserType() === "PRACTICE_ADMIN";
};

export const isPractitioner = (): boolean => {
  return getUserType() === "PRACTITIONER";
};

export const isSuperAdmin = (): boolean => {
  return getUserType() === "SUPER_ADMIN";
};

// --- DASHBOARD ROUTE HELPER (VERY IMPORTANT FOR YOUR NEXT STEP) ---
export const getDashboardRoute = (): string => {
  const type = getUserType();

  switch (type) {
    case "PRACTICE_ADMIN":
      return "/practice/dashboard";

    case "PRACTITIONER":
      return "/practitioner/dashboard";

    case "SUPER_ADMIN":
      return "/admin/dashboard";

    default:
      return "/auth/login";
  }
};