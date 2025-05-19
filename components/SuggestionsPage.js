import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import axios from "axios";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

// Define API URL constants
const BASE_URL = "http://192.168.1.12:5000";
const NEW_POSTS_API_URL = `${BASE_URL}/api/posts/new-posts-count`;
const SUGGESTIONS_API_URL = `${BASE_URL}/api/suggestions`;

const SuggestionsPage = ({
  onNavigateToHome,
  onNavigateToProfile,
  onLogout,
  onNavigateToLostDogPage,
  onNavigateToFoundDogPage,
  onNavigateToChatForum,
  reloadTrigger,
  onNavigateToMatchedPage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionText, setSuggestionText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const newChatsCount = useChatCount();

  useEffect(() => {
    const fetchNewPostsCount = async () => {
      try {
        const response = await fetch(NEW_POSTS_API_URL);
        const data = await response.json();
        if (response.status === 200) setNewPostsCount(data.newPostsCount);
      } catch (error) {
        console.error("Error fetching new posts count:", error);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(SUGGESTIONS_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchNewPostsCount();
    fetchSuggestions();

    const socket = io(BASE_URL, { transports: ["websocket"] });
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("disconnect", () => console.log("Disconnected"));
    socket.on("newSuggestion", (newSuggestion) => {
      setSuggestions((prev) =>
        [newSuggestion, ...prev].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    });

    return () => socket.disconnect();
  }, [reloadTrigger]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleHomeClick = () => {
    onNavigateToHome?.();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    onNavigateToProfile?.();
    setMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await AsyncStorage.removeItem("token");
      onLogout?.();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setMenuOpen(false);
  };

  const handleTabClick = (tab) => {
    if (tab === "HomePageLostDog") onNavigateToLostDogPage?.();
    else if (tab === "HomePageFoundDog") onNavigateToFoundDogPage?.();
    else if (tab === "HomePageMatched") onNavigateToMatchedPage?.();
  };

  const handleMessageClick = () => onNavigateToChatForum?.();
  const handleNotificationClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitSuggestion = async () => {
    
    if (!suggestionText.trim()) {
      setSuccessMessage("Please enter a suggestion.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
    
    if (rating === 0) {
      setSuccessMessage("Please select a rating.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setSuccessMessage("You must be logged in to submit a suggestion!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        SUGGESTIONS_API_URL,
        {
          suggestion: suggestionText,
          rating: rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuggestionText("");
        setRating(0);
        setSuccessMessage("Suggestion submitted!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      setSuccessMessage("Failed to submit suggestion. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarPress = (starIndex) => {
    setRating(starIndex);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PETPALS</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleHomeClick}>
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleProfileClick}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogoutClick}
            >
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageLostDog")}
          >
            <Text style={styles.navText}>Lost Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageFoundDog")}
          >
            <Text style={styles.navText}>Found Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageMatched")}
          >
            <Text style={styles.navText}>Match Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageSuggestions")}
          >
            <Text style={styles.navTextActive}>View Suggestions</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ------------------------------------------- Main container ----------------------------------------*/}
      <View style={styles.suggestionInputContainer}>
        {/* ------------------------------------------- second container ----------------------------------------*/}
        <View style={styles.ratingInputContainer}>
          <Text style={styles.ratingLabel}>Rate our app: </Text>
          {[1, 2, 3, 4, 5, 6].map((starIndex) => (
            <TouchableOpacity
              key={starIndex}
              onPress={() => handleStarPress(starIndex)}
            >
              <Text
                style={[
                  styles.star,
                  starIndex <= rating && styles.starSelected,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
           
        <View style={styles.suggestionInputWrapper}>
       
          <TextInput
            style={styles.suggestionInput}
            placeholder="Comment suggestions here."
            placeholderTextColor="#808080"
            value={suggestionText}
            onChangeText={setSuggestionText}
            multiline
            maxLength={200}
          />

          {successMessage && (
            <Text
              style={[
                styles.successMessage,
                successMessage.includes("Please") ||
                  successMessage.includes("Failed") ||
                  successMessage.includes("logged in")
                  ? styles.errorMessage
                  : null,
              ]}
            >
              {successMessage}
            </Text>
          )}
          {/* -------------------------------------------- Submit Button -----------------------------------------*/}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitSuggestion}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Processing..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {suggestions.length === 0 ? (
          <Text style={styles.noDataText}>No posted suggestions yet.</Text>
        ) : (
          suggestions.map((suggestion, index) => {
            const createdAt = new Date(suggestion.createdAt);
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();

            return (
              <View key={index} style={styles.suggestionCard}>
                <Text style={styles.suggestionUser}>
                  Suggested by:{" "}
                  <Text style={styles.suggestionUserName}>
                    {suggestion.userId?.fullName || "Anonymous"}
                  </Text>
                </Text>
                <Text style={styles.suggestionText}>
                  {suggestion.suggestion}
                </Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5, 6].map((starIndex) => (
                    <Text
                      key={starIndex}
                      style={[
                        styles.star,
                        starIndex <= suggestion.rating && styles.starSelected,
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
                <Text style={styles.suggestionDate}>
                  Posted on: {formattedDate} at {formattedTime}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleHomeClick}>
          <Image
            source={require("../assets/images/Global-images/home-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleMessageClick}
        >
          {newChatsCount > 0 && (
            <Text style={styles.notificationCount}>{newChatsCount}</Text>
          )}
          <Image
            source={require("../assets/images/Global-images/message-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleNotificationClick}
        >
          {newPostsCount > 0 && (
            <Text style={styles.notificationCount}>{newPostsCount}</Text>
          )}
          <Image
            source={require("../assets/images/Global-images/notification-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>

      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D2B48C" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D2B48C",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  hamburgerButton: { padding: 10 },
  hamburger: { width: 30, height: 20, justifyContent: "space-between" },
  hamburgerLine: {
    width: 30,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",
    maxHeight: "50%",
  },
  menuItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: { fontSize: 18, color: "#000" },
 // ------------------------- Navbar --------------------
  navBar: {
    backgroundColor: "#664229",
    padding: 8,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
  navTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  // ----------------------------------------------------
  suggestionInputContainer: {
    // ------------------------- Main box ---------------------
    padding: 15,
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
    width: 380,
    height: 250,
  },
  suggestionInputWrapper: {
    // ------------------------- Second box ---------------------
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  suggestionInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 5,
  },
  ratingInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  star: { fontSize: 24, color: "#ccc" },
  starSelected: { color: "#FFD700" },
  submitButton: {
    backgroundColor: "#664229",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 5,
    width: 200,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#cccccc",
  },

  successMessage: {
    fontSize: 14,
    color: "#006600",
    textAlign: "center",
    marginTop: 0,
  },
  errorMessage: {
    color: "#FF0000",
  },
  content: { flexGrow: 1, padding: 15 },
  noDataText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  suggestionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  suggestionUser: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  suggestionUserName: { color: "#0066cc" },
  suggestionText: { fontSize: 16, color: "#666", marginBottom: 10 },
  ratingContainer: { flexDirection: "row", marginBottom: 10 },
  suggestionDate: { fontSize: 12, color: "#999" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#D2B48C",
    elevation: 5,
  },
  footerButton: { padding: 10, position: "relative" },
  footerIcon: { width: 28, height: 28, tintColor: "#000" },
  notificationCount: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF0000",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SuggestionsPage;
