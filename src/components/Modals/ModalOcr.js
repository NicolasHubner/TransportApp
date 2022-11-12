import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ModalOcr({ hideModal, attempt, nf, showReport, tryAgain }) {
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <Text style={[styles.textModal, { fontWeight: "bold" }]}>
            NF {nf.nf}
          </Text>
          <Text style={styles.textModal}>
            Não foi possivel identificar o canhoto da nota fiscal.
          </Text>
          <View style={{ marginTop: 15 }}>
            <Text>Tentativa {attempt[nf.nfId]} de 3</Text>
          </View>
        </View>
        <View style={styles.buttonModal}>
          {attempt[nf.nfId] < 3 && (
            <Button
              contentStyle={styles.button}
              mode="contained"
              labelStyle={{ color: "white" }}
              onPress={() => {hideModal(), tryAgain(nf.nfId, nf.nf)}}
            >
              tentar novamente
            </Button>
          )}
          <Button contentStyle={styles.button2} mode="text" onPress={() => showReport(nf.nfId)}>
            reportar problema
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
    height: "60%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  buttonModal: {
    width: "100%",
  },

  button2: {
    marginTop: 5,
  },
});
