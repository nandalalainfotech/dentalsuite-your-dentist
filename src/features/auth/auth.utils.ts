export const saveToken = (token: string) => {
  sessionStorage.setItem("token", token);
};