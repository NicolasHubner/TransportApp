import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalArrivedDestine({ hideModal, navigation }) {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.textModal}>
            <Text>Você chegou ao seu </Text>
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              destino!{" "}
            </Text>
          </Text>
        </View>
        <View>
          <Image
            style={styles.imageModal}
            source={require("../image/arrived_destine.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button2}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={() => {hideModal(), navigation.navigate("Trips")}}
          >
            ir para lista de viagens
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
