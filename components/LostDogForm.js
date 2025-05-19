{/*  --------------------------------------- DI MA CLICK ANG LOCATION PERO WORKING ANG SUBMIT  ---------------------- */ }
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

const LostDogForm = ({
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToLostDogFormConfirmation,
  onLogout,
  onNavigateToChatForum,
  onNavigateToLostDogPage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [otherDetails, setAdditionalDetails] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameError, setNameError] = useState("");
  const [breedError, setBreedError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [imageError, setImageError] = useState("");
  const newChatsCount = useChatCount();

  const locationiqKey = "pk.0ee70983b8d94b132991d9b76b73102e";
  const debounceTimeout = useRef(null);
  const NEW_POSTS_API_URL = "http://192.168.1.12:5000/api/posts/new-posts-count";

  useEffect(() => {
    const fetchNewPostsCount = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found in AsyncStorage");
          return;
        }

        const response = await axios.get(NEW_POSTS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setNewPostsCount(response.data.newPostsCount);
        }
      } catch (error) {
        console.error("Error fetching new posts count:", error);
      }
    };

    fetchNewPostsCount();
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.locationiq.com/v1/autocomplete",
        {
          params: {
            key: locationiqKey,
            q: query,
            format: "json",
            limit: 5,
          },
        }
      );

      const formattedSuggestions = response.data.map((item) => ({
        value: item.display_name,
        data: item,
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const debounceFetchSuggestions = (text) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 1000);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    debounceFetchSuggestions(text);
    setLocationError("");
  };

  const handleSuggestionSelect = (suggestion) => {
    setLocation(suggestion.value);
    setSuggestions([]);
    setLocationError("");
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };

  // ---------------------------------------------- Handle submit button -----------------------------------
  const handleSubmit = () => {
    setNameError("");
    setBreedError("");
    setSizeError("");
    setGenderError("");
    setLocationError("");
    setImageError("");

    if (!selectedImage || !dogName || !dogBreed || !dogSize || !gender || !location) {
      if (!selectedImage) {
        setImageError("Please upload a picture of your dog.");

      }
      if (!dogName) {
        setNameError("Please enter dog's name.");

      }
      if (!dogBreed) {
        setBreedError("Please enter dog's breed.");

      }
      if (!dogSize) {
        setSizeError("Please enter dog's size.");

      }
      if (!gender) {
        setGenderError("Please select dog's gender.");
        //console.log("Gender not selected.");
      } else {
        //console.log("Gender selected:", gender);
      }
      if (!location) {
        setLocationError("Please enter where the dog was last seen.");

      }
      return;
    }

    const formData = {
      name: dogName,
      breed: dogBreed,
      size: dogSize,
      details: otherDetails || "",
      gender,
      location,
      image: selectedImage,
    };

    console.log("Form Data:", formData);

    if (onNavigateToLostDogFormConfirmation) {
      onNavigateToLostDogFormConfirmation(formData);
    }
  };

  // ------------------------------------------------------------ navigate to another page ------------------------------------------------
  const handleMessageClick = () => {
    if (onNavigateToChatForum) onNavigateToChatForum();
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleHomeClick = () => {
    if (onNavigateToHome) onNavigateToHome();
    setMenuOpen(false);
  };
  // ------------------------------------------------------------ navigate to profile page ------------------------------------------------
  const handleProfileClick = () => {
    if (onNavigateToProfile) onNavigateToProfile();
    setMenuOpen(false);
  };
  const handleLogoutClick = () => logout();

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`);
  };


  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to the photos to upload a dog picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setImageError("");
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTexts}>PETPALS</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
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

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleTabClick("HomePageLostDog")}
        >
          {/* <Text style={styles.navText}>Lost Dog</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleTabClick("HomePageFoundDog")}
        >
          {/* <Text style={styles.navText}>Found Dog</Text> */}
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* --------------------------------------------------- Back button ------------------------------------------------ */}
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => navigateToLostDogPage()}
          >
            <Image
              source={require("../assets/images/back-arrow.png")}
              style={styles.arrowIcon}
            />
            <Text style={styles.mainTitle}>Back</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 15 }}>
          </View>
          {/* --------------------------------------------------------------------------------------------------------------------------- */}
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity onPress={handleImageUpload}>
              <View style={styles.uploadContent}>
                {selectedImage ? (
                  <Text style={styles.menuTexts}>Upload image of your dog</Text>
                ) : (
                  <Text style={styles.menuTexts}>Upload image of your dog</Text>
                )}
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage.uri }
                      : require("../assets/images/default-image-upload.png")
                  }
                  style={
                    selectedImage ? styles.selectedImageIcon : styles.imageUploadIcon
                  }
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            {imageError ? (
              <Text style={styles.errorText}>{imageError}</Text>
            ) : null}
          </View>

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dog's name"
            value={dogName}
            onChangeText={(text) => {
              setDogName(text);
              setNameError("");
            }}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.label}>Breed:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dog's breed"
            value={dogBreed}
            onChangeText={(text) => {
              setDogBreed(text);
              setBreedError("");
            }}
          />
          {breedError ? (
            <Text style={styles.errorText}>{breedError}</Text>
          ) : null}

          <Text style={styles.label}>Size: <Text style={styles.textHints}>(Small, Medium, Huge)</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dog's size"
            value={dogSize}
            onChangeText={(text) => {
              setSizeError("");
              setDogSize(text);
            }}
          />
          {sizeError ? <Text style={styles.errorText}>{sizeError}</Text> : null}

          <Text style={styles.label}>Additional details:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter other details (this is optional)"
            value={otherDetails}
            onChangeText={setAdditionalDetails}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.label}>Gender:</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Male" && styles.genderButtonSelected,
              ]}
              onPress={() => {
                setGender("Male");
                setGenderError("");
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Male" && styles.genderTextSelected,
                ]}
              >
                Male
              </Text>
              <Image
                source={require("../assets/images/male-icon.png")}
                style={styles.genderIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Female" && styles.genderButtonSelected,
              ]}
              onPress={() => {
                setGender("Female");
                setGenderError("");
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  setGender === "Female" && styles.genderTextSelected,
                ]}
              >
                Female
              </Text>
              <Image
                source={require("../assets/images/female-icon.png")}
                style={styles.genderIcon}
              />
            </TouchableOpacity>
          </View>
          {genderError ? (
            <Text style={styles.errorText}>{genderError}</Text>
          ) : null}

          <Text style={styles.label}>Location:</Text>
          <View style={styles.locationInputContainer}>
            {/* 
            <Image
              source={require("../assets/images/location-icon.png")}
              style={styles.locationIcon}
            />
            */}
            <TextInput
              style={styles.input}
              placeholder="Enter dog's last seen location"
              value={location}
              onChangeText={handleLocationChange}
            />
          </View>
          {locationError ? (
            // ----------------------------- input validation error message ----------------------
            <Text style={styles.errorText}>{locationError}</Text>
          ) : null}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 5 }}>
            {/* ------------------------------------------ addSpace --------------------------- */}
          </View>
        </ScrollView>
        {location.length > 0 && suggestions.length > 0 && (
          // ----------------------------------- Location suggestions ------------------------ //
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionTextTitle}>Choose location</Text>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.data.osm_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}
                >
                  <Text style={styles.suggestionText}>{item.value}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>


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
    </View >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  headerTexts: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  hamburgerButton: { padding: 5 },
  hamburger: { width: 24, height: 24, justifyContent: "space-between" },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: { fontSize: 16, color: "#000" },
  menuTexts: {
    alignContent: "center",
    textAlign: 'center',
    marginBottom: '5',
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    width: "100%",
  },
  navButton: { paddingHorizontal: 5 },
  formWrapper: {
    flex: 1,
    position: "relative",
  },
  formContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  imageUploadContainer: {
    marginBottom: 20,
    alignItems: 'center',     // centers image and text horizontally
  },
  uploadContent: {
    flexDirection: 'column', // Ensure items are stacked vertically
    alignItems: 'center',     // Center items horizontally
    justifyContent: 'center',  // Center items vertically
  },
  imageUploadIcon: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedImageIcon: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  label: { fontSize: 15, marginBottom: 8, color: "#333" },
  textHints: { fontSize: 14.5, marginBottom: 8, color: "#808080" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    fontSize: 14.5,
    backgroundColor: "#FFF",
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "center",
  },
  genderButtonSelected: { backgroundColor: "#D3D3D3" },
  genderIcon: { width: 22, height: 22, tintColor: "#333", marginLeft: 5 },
  genderText: { fontSize: 15, color: "#333" },
  genderTextSelected: { color: "#000", fontWeight: "bold" },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
    width: "100%",
  },
  //locationIcon: { width: 24, height: 24, marginLeft: 10, tintColor: "#333" },
  // ----------------------------------- Map api suggestions container -----------------------------------
  locationSuggestionContainer: {
    position: "relative",
    //top: 540, // Adjust this based on the layout
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    maxHeight: 188.5,
    zIndex: 1000,
  },

  suggestionsContainer: {
    position: "absolute",
    top: 440, // Adjust based on location input position
    left: 15,
    right: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 1000, // Ensure it appears above other elements
  },
  suggestionTextTitle: { fontSize: 15, textAlign: "center", padding: 5, borderBottomWidth: 1, borderBottomColor: "#eee", width: "100%", color: "#808080", },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: { fontSize: 14, color: "#333", },
  // ------------------------------------------------------------- 
  submitButton: {
    backgroundColor: "#664229",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  submitButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold", },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#D2B48C",
  },
  footerButton: { alignItems: "center", position: "relative" },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  notificationCount: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF0000",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  arrowBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: "#664229",
    borderRadius: 12,
    padding: 5,
  },
});

export default LostDogForm;
