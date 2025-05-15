import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const TermsModal = ({ visible, onClose, onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleNextButtonClick = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Petpals Registration Terms and Agreements
            </Text>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Introduction</Text>
              <Text style={styles.sectionText}>
                Welcome to Petpals, a mobile application designed to help track
                lost and found pet dogs using an image recognition algorithm. By
                signing up, you agree to the following terms and agreements
                governing our lost and found pet matching service. This
                agreement outlines your responsibilities and our service terms.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By creating an account, you confirm that you have read,
                understood, and accepted these terms. If you do not agree to any
                part of these terms, please refrain from using Petpals. Your
                acceptance is mandatory for using our lost/found pet services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Eligibility</Text>
              <Text style={styles.sectionText}>
                You must be at least 13 years old to create an account. By
                registering, you affirm that you meet this minimum age
                requirement. Users under 18 must have parental consent to report
                lost or found pets.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                4. Account Responsibilities
              </Text>
              <Text style={styles.sectionText}>
                • You are responsible for keeping your login credentials
                confidential{"\n"}• Notify us immediately if you suspect
                unauthorized access to your account{"\n"}• Petpals is not liable
                for any losses resulting from failure to secure your account
                {"\n"}• Maintain accurate contact information for lost/found pet
                notifications
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                5. Lost & Found Procedures
              </Text>
              <Text style={styles.sectionText}>
                • When reporting a lost dog, you must provide recent photos and
                accurate last-seen location{"\n"}• Found dogs should be reported
                immediately with clear photos and location details{"\n"}• False
                reports may result in account suspension{"\n"}• Petpals uses
                image recognition to match lost/found reports but cannot
                guarantee matches{"\n"}• Users must verify ownership through
                secondary methods before pet transfer
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Data Usage</Text>
              <Text style={styles.sectionText}>
                • Location data and pet images will be stored to facilitate
                matches between lost and found reports{"\n"}• User contact
                information will be shared only when a potential match is
                identified{"\n"}• Anonymous data may be used for service
                improvement and research purposes
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Liability</Text>
              <Text style={styles.sectionText}>
                • Petpals is not responsible for the accuracy of user-submitted
                information{"\n"}• We do not guarantee successful pet reunions
                {"\n"}• Users must verify information independently before
                transferring animals{"\n"}• Petpals is not liable for any
                disputes between users regarding pet ownership
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Community Guidelines</Text>
              <Text style={styles.sectionText}>
                • No false claims of pet ownership{"\n"}• Must report found pets
                to local authorities within 24 hours{"\n"}• Harassment of other
                users will not be tolerated{"\n"}• Users must update post status
                when pets are reunited{"\n"}• Commercial use of lost/found
                reports is prohibited
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Amendments</Text>
              <Text style={styles.sectionText}>
                These terms may be updated as our lost/found services evolve.
                Continued use after changes constitutes acceptance of new terms.
                Major changes will be notified via email or in-app
                notifications.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.agreementCheckbox}>
            <TouchableOpacity
              onPress={handleCheckboxChange}
              style={styles.customCheckbox}
            >
              {isChecked ? (
                <Image
                  source={require("../assets/images/Global-images/checked.png")}
                  style={styles.checkboxIcon}
                />
              ) : (
                <Image
                  source={require("../assets/images/Global-images/unchecked.png")}
                  style={styles.checkboxIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCheckboxChange}>
            <Text style={styles.checkboxLabel}>
              I accept and understand the agreement.
            </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !isChecked && styles.nextButtonDisabled]}
            onPress={handleNextButtonClick}
            disabled={!isChecked}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#D2B48C",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 50,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modalHeader: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBody: {
    flexGrow: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  agreementCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  customCheckbox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxIcon: {
    width: 24,
    height: 24,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: "#030303",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TermsModal;
