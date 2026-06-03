export const getPatient = () => {
  const patient =
    localStorage.getItem("patient");

  return patient
    ? JSON.parse(patient)
    : null;
};

export const getToken = () => {
  return localStorage.getItem(
    "patient_access_token"
  );
};

export const logout = () => {
  localStorage.removeItem(
    "patient_access_token"
  );

  localStorage.removeItem(
    "patient"
  );
};