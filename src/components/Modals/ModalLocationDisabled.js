import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalLocationDisabled({ hideModal }) {

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <Text style={styles.textModal}>
            Para iniciar a viagem, você deverá ativar seu
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {" "}
              GPS{" "}
            </Text>
            <Text>e mante-lo ativo durante a utilização do aplicativo!</Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require("../image/gps.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={hideModal}
          >
            Retornar a lista de viagens
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
