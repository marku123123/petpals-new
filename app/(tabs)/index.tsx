import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../../components/LoadingScreen";
import LoginPage from "../../components/LoginPage";
import RegisterForm from "../../components/RegisterForm";
import TermsModal from "../../components/TermsCondition";
import HomePage from "../../components/HomePage";
import UserProfile from "../../components/UserProfile";
import LostDogForm from "../../components/LostDogForm";
import LostDogFormConfirmation from "../../components/LostDogFormConfirmation";
import LostDogPage from "../../components/LostDogPage";
import FoundDogForm from "../../components/FoundDogForm";
import FoundDogFormConfirmation from "../../components/FoundDogFormConfirmation";
import FoundDogPage from "../../components/FoundDogPage";
import LostAndFoundDogMatched from "../../components/LostAndFoundDogMatched";
import ChatForum from "../../components/ChatForum";
import PrivateChat from "../../components/PrivateChat";
import LostDogPageMoreInfo from "../../components/LostDogPageMoreInfo";
import FoundDogViewUserInfo from "../../components/FoundDogViewUserInfo";
import LostAndFoundViewMatchedUser from "../../components/LostAndFoundViewMatchedUser";
import LostAndFoundViewMatchedUserS from "../../components/LostAndFoundViewMatchedUserS";
import ViewLostAndFoundSuggestions from "../../components/ViewLostAndFoundSuggestions";
import SuggestionsForm from "../../components/SuggestionsForm";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

interface FormData {
  name?: string;
  breed: string;
  size: string;
  details: string;
  gender: string;
  location: string;
  image: {
    uri: string;
    type?: string;
    name?: string;
  } | null;
}

interface SuggestionData {
  suggestion: string;
  rating: number;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    | "HomePage"
    | "UserProfile"
    | "LostDogForm"
    | "LostDogFormConfirmation"
    | "LostDogPage"
    | "FoundDogForm"
    | "FoundDogFormConfirmation"
    | "FoundDogPage"
    | "LostAndFoundDogMatched"
    | "ChatForum"
    | "PrivateChat"
    | "LostDogPageMoreInfo"
    | "FoundDogViewUserInfo"
    | "LostAndFoundViewMatchedUser"
    | "LostAndFoundViewMatchedUserS"
    | "ViewLostAndFoundSuggestions"
    | "SuggestionsForm"
  >("HomePage");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedDog, setSelectedDog] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newSuggestion, setNewSuggestion] = useState<SuggestionData | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        setCurrentScreen("HomePage");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleFinishLoading = () => {
    setLoading(false);
  };

  const handleSignUpClick = () => {
    setIsTermsModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setIsTermsModalVisible(false);
    setShowRegisterForm(true);
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen("HomePage");
  };

  const navigateToProfile = () => {
    setCurrentScreen("UserProfile");
  };

  const navigateToHome = () => {
    setCurrentScreen("HomePage");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
    setNewSuggestion(null);
  };

  const navigateToLostDogForm = () => {
    setCurrentScreen("LostDogForm");
    setFormData(null);
  };

  const navigateToFoundDogForm = () => {
    setCurrentScreen("FoundDogForm");
    setFormData(null);
  };

  const navigateToLostAndFoundDogMatched = () => {
    setCurrentScreen("LostAndFoundDogMatched");
  };

  const navigateToLostAndFoundViewMatchedUser = (dog: any) => {
    console.log("Setting currentScreen to LostAndFoundViewMatchedUser");
    setSelectedDog(dog);
    setCurrentScreen("LostAndFoundViewMatchedUser");
  };

  const navigateToLostAndFoundViewMatchedUserS = (dog: any) => {
    console.log("Setting currentScreen to LostAndFoundViewMatchedUserS");
    setSelectedDog(dog);
    setCurrentScreen("LostAndFoundViewMatchedUserS");
  };

  const navigateToLostDogFormConfirmation = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("LostDogFormConfirmation");
  };

  const navigateToFoundDogFormConfirmation = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("FoundDogFormConfirmation");
  };

  const navigateToLostDogPage = () => {
    setCurrentScreen("LostDogPage");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToFoundDogPage = () => {
    setCurrentScreen("FoundDogPage");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToMatchedPage = () => {
    setCurrentScreen("LostAndFoundDogMatched");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToChatForum = () => {
    setCurrentScreen("ChatForum");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
  };

  const navigateToPrivateChat = (user: any) => {
    setSelectedUser(user);
    setCurrentScreen("PrivateChat");
  };

  const navigateToFoundDogViewUserInfo = (dog: any) => {
    console.log("Setting currentScreen to FoundDogViewUserInfo");
    setSelectedDog(dog);
    setCurrentScreen("FoundDogViewUserInfo");
  };

  const navigateToLostDogPageMoreInfo = (dog: any) => {
    setSelectedDog(dog);
    setCurrentScreen("LostDogPageMoreInfo");
  };

  const navigateToViewLostAndFoundSuggestions = (data?: SuggestionData) => {
    setNewSuggestion(data || null);
    setCurrentScreen("ViewLostAndFoundSuggestions");
    setFormData(null);
    setSelectedDog(null);
    setReloadTrigger((prev) => prev + 1);
  };

  const navigateToSuggestionsForm = () => {
    setCurrentScreen("SuggestionsForm");
    setFormData(null);
    setSelectedDog(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("HomePage");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
    setNewSuggestion(null);
    setReloadTrigger(0);
    AsyncStorage.removeItem("token");
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <LoadingScreen onFinishLoading={handleFinishLoading} />
      ) : showRegisterForm ? (
        <RegisterForm onLoginClick={handleLoginClick} />
      ) : isLoggedIn ? (
        currentScreen === "HomePage" ? (
          <ProtectedRoute
            component={HomePage}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onBackClick={handleLogout}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogForm={navigateToLostDogForm}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "UserProfile" ? (
          <ProtectedRoute
            component={UserProfile}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "LostDogForm" ? (
          <ProtectedRoute
            component={LostDogForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogFormConfirmation={navigateToLostDogFormConfirmation}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "LostDogFormConfirmation" ? (
          <ProtectedRoute
            component={LostDogFormConfirmation}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogForm={navigateToLostDogForm}
            formData={formData}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "LostDogPage" ? (
          <ProtectedRoute
            component={LostDogPage}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToLostDogForm={navigateToLostDogForm}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToLostDogPageMoreInfo={navigateToLostDogPageMoreInfo}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "FoundDogForm" ? (
          <ProtectedRoute
            component={FoundDogForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToFoundDogFormConfirmation={navigateToFoundDogFormConfirmation}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "FoundDogFormConfirmation" ? (
          <ProtectedRoute
            component={FoundDogFormConfirmation}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            formData={formData}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "FoundDogPage" ? (
          <ProtectedRoute
            component={FoundDogPage}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToFoundDogViewUserInfo={navigateToFoundDogViewUserInfo}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "LostAndFoundDogMatched" ? (
          <ProtectedRoute
            component={LostAndFoundDogMatched}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToLostDogPageMoreInfo={navigateToLostDogPageMoreInfo}
            onNavigateToLostAndFoundViewMatchedUser={navigateToLostAndFoundViewMatchedUser}
            onNavigateToLostAndFoundViewMatchedUserS={navigateToLostAndFoundViewMatchedUserS}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
            onNavigateToSuggestionsForm={navigateToSuggestionsForm}
          />
        ) : currentScreen === "ChatForum" ? (
          <ProtectedRoute
            component={ChatForum}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToPrivateChat={navigateToPrivateChat}
          />
        ) : currentScreen === "PrivateChat" ? (
          <ProtectedRoute
            component={PrivateChat}
            user={selectedUser}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToChatForum={navigateToChatForum}
            onLogout={handleLogout}
          />
        ) : currentScreen === "LostDogPageMoreInfo" ? (
          <ProtectedRoute
            component={LostDogPageMoreInfo}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "FoundDogViewUserInfo" ? (
          <ProtectedRoute
            component={FoundDogViewUserInfo}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "LostAndFoundViewMatchedUser" ? (
          <ProtectedRoute
            component={LostAndFoundViewMatchedUser}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostAndFoundDogMatched={navigateToLostAndFoundDogMatched}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "LostAndFoundViewMatchedUserS" ? (
          <ProtectedRoute
            component={LostAndFoundViewMatchedUserS}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostAndFoundDogMatched={navigateToLostAndFoundDogMatched}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "ViewLostAndFoundSuggestions" ? (
          <ProtectedRoute
            component={ViewLostAndFoundSuggestions}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToChatForum={navigateToChatForum}
            onLogout={handleLogout}
            reloadTrigger={reloadTrigger}
            newSuggestion={newSuggestion}
          />
        ) : currentScreen === "SuggestionsForm" ? (
          <ProtectedRoute
            component={SuggestionsForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
            onBackClick={handleLogout}
          />
        ) : null
      ) : (
        <LoginPage
          onSignUpClick={handleSignUpClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
        onAccept={handleAcceptTerms}
      />
    </View>
  );
};

export default App;