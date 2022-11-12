import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalVisitMission({ func }) {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.textModal}>
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              Contato{" "}
            </Text>
            <Text>realizado com sucesso!</Text>
          </Text>
        </View>
        <View>
          <Image
            style={styles.imageModal}
            source={require("../image/missionReview.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button2}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={() => func()}
          >
            ir até o destino
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    height: "60%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  imageModal: {
    resizeMode: "contain",
    width: 129,
    height: 201,
  },

  buttonModal: {
    width: "100%",
  },

  button2: {
    height: 40,
  },
});
