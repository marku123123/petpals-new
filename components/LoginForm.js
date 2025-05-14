import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = ({ onSignUpClick, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For Android emulator use 103.106.67.162, for iOS simulator use localhost
  const API_URL = "http://192.168.1.20:5000/api/login/login";

  const handleLoginSubmit = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        // Store token and user data
        await AsyncStorage.multiSet([
          ["token", response.data.token],
          ["user", JSON.stringify(response.data.user)],
        ]);

        onLoginSuccess();
      }
    } catch (error) {
      let errorMsg = "Login failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        errorMsg = error.response.data.message || errorMsg;
      } else if (error.request) {
        // Request was made but no response
        errorMsg = "Network error. Please check your connection.";
      }

      setErrorMessage(errorMsg);
      Alert.alert("Login Error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.loginFormContainer}>
        <View style={styles.loginLogo}>
          <Image
            source={require("../assets/images/Global-images/Logo-removebg.png")}
            style={styles.logoImage}
          />
        </View>

        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <View style={styles.loginForm}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.passwordIcon}
              disabled={isLoading}
            >
              <Image
                source={
                  passwordVisible
                    ? require("../assets/images/Global-images/hide-eyes-updated.png")
                    : require("../assets/images/Global-images/open-eyes-updated.png")
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLoginSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.loginText}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={onSignUpClick} disabled={isLoading}>
            <Text style={styles.signUpLinkButton}>Signup</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D2B48C",
  },
  loginFormContainer: {
    width: "80%",
    maxWidth: 400,
    minHeight: 350,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 20,
  },
  loginLogo: {
    marginBottom: 10,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    opacity: 0.95,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  loginForm: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff", // Keeping white border for contrast
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: "#fff", // Added white background
  },
  inputWithIcon: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc", // Keeping gray border for password field
    borderRadius: 4,
    fontSize: 16,
    paddingRight: 40,
    backgroundColor: "#fff", // Added white background
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  passwordIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  loginButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#664229",
    borderRadius: 4,
    alignItems: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#888",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  signUpLinkButton: {
    color: "#0066cc",
    textDecorationLine: "underline",
  },
  loadingBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#f1f1f1",
    marginTop: 15,
    borderRadius: 5,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#030303",
    width: "0%",
  },
});

export default LoginForm;
