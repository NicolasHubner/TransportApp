import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalLate({ hideModal }) {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <Text style={styles.textModal}>
            Você está
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {" "}
              atrasado,{" \n"}
            </Text>
            <Text>aconteceu algo?</Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require("../image/late.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button}
            mode="contained"
            disabled={true}
            labelStyle={{ color: "white" }}
            onPress={() => console.log("reportou problema")}
          >
            reportar problema
          </Button>
          <Button
            contentStyle={[styles.button, { marginTop: 10 }]}
            mode="text"
            onPress={hideModal}
          >
            seguir viagem
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
    width: "92%",
    height: "72%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  image: {
    resizeMode: "contain",
    width: 187,
    height: 145,
  },

  buttonModal: {
    width: "100%",
  },
});
