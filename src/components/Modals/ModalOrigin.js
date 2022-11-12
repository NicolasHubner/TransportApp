import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalOrigin({ hideModal, nextPage, selectNavigation, isLoading }) {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.textModal}>
            Você aceitou a viagem, deseja ir para o
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {" "}
              local de inicio?{" "}
            </Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require("../image/undraw_deliveries.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button}
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            labelStyle={{ color: "white" }}
            onPress={() => selectNavigation()}
          >
            ir para local de inicio
          </Button>
          <Button
            contentStyle={styles.button}
            mode="text"
            disabled={isLoading}
            loading={isLoading}
            onPress={() => nextPage()}
            // onPress={() => console.log('teste botão')}
          >
            não, quero continuar
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
    justifyContent: "space-between",
    height: '15%',
    width: "100%",
  },
});
