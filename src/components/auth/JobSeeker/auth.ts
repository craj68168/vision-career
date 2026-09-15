export const getJobSeekerAuth = () => {
  if (typeof window === "undefined") {
    return {
      token: null,
      role: null,
      isAuthenticated: false,
    };
  }

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  return {
    token,
    role,
    isAuthenticated: Boolean(token && role === "seeker"),
  };
};

export const clearJobSeekerAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("user_role");
};
