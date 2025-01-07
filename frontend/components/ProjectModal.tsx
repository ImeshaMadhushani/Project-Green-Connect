import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

const ProjectModalt = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Create Project</Text>
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
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  modalHeading: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProjectModalt;
