import bcrypt from "bcryptjs";

export function registerUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[username]) {
    return { success: false, message: "User already exists" };
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[username] = { password: hashedPassword };
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true, message: "Registration successful" };
}

export function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const user = users[username];
  if (user && bcrypt.compareSync(password, user.password)) {
    sessionStorage.setItem("loggedInUser", username);
    return { success: true };
  }
  return { success: false, message: "Invalid username or password" };
}

export function logoutUser() {
  sessionStorage.removeItem("loggedInUser");
}

export function getLoggedInUser() {
  return sessionStorage.getItem("loggedInUser");
}

export function resetPassword(username, newPassword) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[username]) {
    return { success: false, message: "User not found" };
  }
  users[username].password = bcrypt.hashSync(newPassword, 10);
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true, message: "Password reset successful" };
}
