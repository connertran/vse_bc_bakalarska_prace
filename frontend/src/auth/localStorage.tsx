type StoredAuthToken = {
  mail: string;
  alt_email: string;
  token: string;
};

function saveTokenToLocalStorage(
  mail: string,
  alt_email: string,
  token: string,
) {
  try {
    localStorage.setItem(
      "authToken",
      JSON.stringify({ mail, alt_email, token }),
    );
  } catch (error) {
    console.error("Failed to save token to local storage:", error);
  }
}

function getTokenFromLocalStorage(): StoredAuthToken | null {
  try {
    const tokenString = localStorage.getItem("authToken");
    return tokenString ? (JSON.parse(tokenString) as StoredAuthToken) : null;
  } catch (error) {
    console.error("Failed to retrieve token from local storage:", error);
    return null;
  }
}

export { saveTokenToLocalStorage, getTokenFromLocalStorage };
