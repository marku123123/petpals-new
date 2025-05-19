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
import axios from "axios";
import io from "socket.io-client";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

const FoundDogPage = ({
  onNavigateToHome,
  onNavigateToProfile,
  onLogout,
  onNavigateToMatchedPage,
  onNavigateToFoundDogForm,
  onNavigateToLostDogPage,
  onNavigateToChatForum,
  onNavigateToFoundDogViewUserInfo,
  onNavigateToSuggestionsPage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [foundDogs, setFoundDogs] = useState([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newChatsCount = useChatCount();

  // Define API URL constants
  const FOUND_DOG_API_URL = "http://192.168.1.12:5000/api/founddog";
  const NEW_POSTS_API_URL = "http://192.168.1.12:5000/api/posts/new-posts-count";
  const SOCKET_URL = "http://192.168.1.12:5000";
  const BASE_URL = "http://192.168.1.12:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const foundDogsResponse = await axios.get(FOUND_DOG_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (foundDogsResponse.status === 200) {
          setFoundDogs(
            foundDogsResponse.data.foundDogs.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        }

        const postsResponse = await axios.get(NEW_POSTS_API_URL);
        if (postsResponse.status === 200) {
          setNewPostsCount(postsResponse.data.newPostsCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("newFoundDog", (newDog) =>
      setFoundDogs((prev) => [newDog, ...prev])
    );
    socket.on("dogReunited", ({ petId }) =>
      setFoundDogs((prev) =>
        prev.map((dog) =>
          dog.petId === petId ? { ...dog, reunited: true } : dog
        )
      )
    );
    socket.on("disconnect", () => console.log("Disconnected"));
    return () => socket.disconnect();
  }, []);

  const filteredDogs = foundDogs.filter((dog) => {
    const query = searchQuery.toLowerCase();
    const location = String(dog.location || "").toLowerCase();
    const breed = String(dog.breed || "").toLowerCase();
    const gender = String(dog.gender || "").toLowerCase();
    return (
      location.includes(query) ||
      breed.includes(query) ||
      gender.includes(query)
    );
  });

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
    else if (tab === "HomePageMatched") onNavigateToMatchedPage?.();
    else if (tab === "SuggestionsPage")
      onNavigateToSuggestionsPage?.();
  };

  const handleMessageClick = () => onNavigateToChatForum?.();
  const handleNotificationClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleMoreInfoClick = (dog) => onNavigateToFoundDogViewUserInfo?.(dog);
  const handleAddClick = () => onNavigateToFoundDogForm?.();

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
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuOpen(false)}
        >
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
            <Text style={styles.navTextActive}>Found Dog Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageMatched")}
          >
            <Text style={styles.navText}>Match Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("SuggestionsPage")}
          >
            <Text style={styles.navText}>View Suggestions</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Location, Breed, or Gender"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog, index) => (
            <View
              style={[styles.card, dog.reunited && styles.reunitedCard]}
              key={dog.petId || index}
            >
              <Image
                source={
                  dog.imagePath
                    ? { uri: `${BASE_URL}${dog.imagePath}` }
                    : require("../assets/images/dog-icon.png")
                }
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.petIdText}>Pet ID: {dog.petId}</Text>
                <Text style={styles.cardSubtitle}>
                  {dog.breed}, {dog.gender}
                </Text>
                <View style={styles.cardLocation}>
                  <Image
                    source={require("../assets/images/location-icon.png")}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.cardLocationText}>
                    Found at: {dog.location} 🐶
                  </Text>
                </View>
                <Text style={styles.cardTimestamp}>
                  Found on: {new Date(dog.createdAt).toLocaleString()}
                </Text>
                <Text style={styles.cardCategory}>
                  Category: {dog.category || "Found"}
                </Text>
                {dog.reunited && (
                  <Text style={styles.reunitedText}>Status: Reunited</Text>
                )}
                <TouchableOpacity
                  style={styles.moreInfoButton}
                  onPress={() => handleMoreInfoClick(dog)}
                >
                  <Text style={styles.moreInfoText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            {searchQuery
              ? "No matching dogs found."
              : "No found dogs reported yet."}
          </Text>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerIcons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleHomeClick}
          >
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddClick}>
          <Image
            source={require("../assets/images/add-icon.png")}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>

      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2B48C",
  },
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  hamburgerButton: {
    padding: 10,
  },
  hamburger: {
    width: 30,
    height: 20,
    justifyContent: "space-between",
  },
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
  menuText: {
    fontSize: 18,
    color: "#000",
  },
  navBar: {
    backgroundColor: "#664229",
    padding:8,   
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  navTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
   searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  content: {
    flexGrow: 1,
    padding: 15,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    width: "100%",
    maxWidth: 350,
    flexDirection: "column",
    padding: 15,
  },
  reunitedCard: {
    backgroundColor: "#f0f0f0",
    opacity: 0.8,
  },
  cardImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    flex: 1,
  },
  petIdText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  cardLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: "#666",
  },
  cardLocationText: {
    fontSize: 14,
    color: "#666",
    flexShrink: 1,
  },
  cardTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "bold",
  },
  reunitedText: {
    fontSize: 14,
    color: "#006600",
    fontWeight: "bold",
    marginBottom: 10,
  },
  moreInfoButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  moreInfoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 15,
    color: "#666",
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#D2B48C",
    elevation: 5,
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  footerButton: {
    padding: 10,
    position: "relative",
  },
  footerIcon: {
    width: 28,
    height: 28,
    tintColor: "#000",
  },
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
  addButton: {
    position: "absolute",
    right: 15,
    bottom: 70,
    backgroundColor: "#664229",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});

export default FoundDogPage;
