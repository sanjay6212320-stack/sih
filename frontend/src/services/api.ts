// Mock API helper for full-stack Vercel client execution

export const mockDelay = (ms: number = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getStoredToken = (): string | null => {
  return localStorage.getItem("govconnect_token");
};

export const setStoredAuth = (token: string, user: any) => {
  localStorage.setItem("govconnect_token", token);
  localStorage.setItem("govconnect_user", JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem("govconnect_token");
  localStorage.removeItem("govconnect_user");
};

export const getCurrentUserFromStorage = () => {
  const data = localStorage.getItem("govconnect_user");
  return data ? JSON.parse(data) : null;
};
