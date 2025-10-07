export function registerUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username]) {
      return { success: false, message: "User already exists" };
    }
    users[username] = { password };
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "Registration successful" };
  }
  
  export function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username] && users[username].password === password) {
      localStorage.setItem("loggedInUser", username);
      return { success: true };
    }
    return { success: false, message: "Invalid username or password" };
  }
  
  export function logoutUser() {
    localStorage.removeItem("loggedInUser");
  }
  
  export function getLoggedInUser() {
    return localStorage.getItem("loggedInUser");
  }
  
  export function resetPassword(username, newPassword) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[username]) {
      return { success: false, message: "User not found" };
    }
    users[username].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "Password reset successful" };
  }