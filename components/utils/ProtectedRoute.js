import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginPage from "../LoginPage";
const ProtectedRoute = ({
  component: Component,
  onSignUpClick,
  onLoginSuccess,
  ...props
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(token !== null);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? (
    <Component {...props} />
  ) : (
    <LoginPage onSignUpClick={onSignUpClick} onLoginSuccess={onLoginSuccess} />
  );
};

export default ProtectedRoute;
