import { dbState } from "../mock/dbState";
import { mockDelay, setStoredAuth, getCurrentUserFromStorage } from "./api";

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    await mockDelay(150);
    const user = dbState.getUserByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid credentials");
    }
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    const userWithoutPass = { ...user };
    delete userWithoutPass.password;

    setStoredAuth(token, userWithoutPass);
    return {
      access_token: token,
      token_type: "bearer",
      user: userWithoutPass,
    };
  },

  register: async (userData: any) => {
    await mockDelay(200);
    const existing = dbState.getUserByEmail(userData.email);
    if (existing) {
      throw new Error("User with this email already exists");
    }
    const newUser = dbState.createUser({
      email: userData.email,
      phone: userData.phone || "9876543210",
      full_name: userData.full_name,
      role: userData.role || "CITIZEN",
      password: userData.password || "Password@123",
    });

    if (newUser.role === "CITIZEN") {
      dbState.createOrUpdateProfile(newUser.id, {
        aadhaar_last4: userData.aadhaar_last4 || "1234",
        state: userData.state || "Tamil Nadu",
        district: userData.district || "Chennai",
        annual_income: userData.annual_income ? Number(userData.annual_income) : 120000,
        occupation: userData.occupation || "Student",
        category: userData.category || "General",
      });
    }

    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    const userWithoutPass = { ...newUser };
    delete userWithoutPass.password;
    setStoredAuth(token, userWithoutPass);

    return {
      access_token: token,
      token_type: "bearer",
      user: userWithoutPass,
    };
  },

  getMe: async () => {
    await mockDelay(50);
    const user = getCurrentUserFromStorage();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const freshUser = dbState.getUserById(user.id) || user;
    const userWithoutPass = { ...freshUser };
    delete userWithoutPass.password;
    return userWithoutPass;
  },
};
