//*************************************************************************** */
//  Alterações:
//  
//  14.12.22 - Barbara
//             Criação da função handleButtonClick para redirecionar 
//             o usuario para as configuracoes e mudança no texto.
//  15.12.22 - Márcia
//             Alteração para redirecionar o usuário para a configuração que 
//             habilita o GPS.
//
//*************************************************************************** */

import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Linking, Platform } from "react-native";
import { Button } from "react-native-paper";
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

export default function ModalLocationDisabled({ hideModal }) {
   
  // 15.12.22...
  const handleButtonClick = () => {
    Platform.OS === 'ios'
        ? Linking.openSettings()
        : startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
    hideModal()
  }
  //...15.12.22

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ width: "90%", alignItems: "flex-start" }}>
        <Text style={styles.textModal}>
            Para prosseguir você deve ativar a
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {" "}
              localização{" "}           {/*EDIÇÃO - mudança de GPS para localização */}
            </Text>
            <Text> deste celular.</Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require("../image/gps.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          {/*EDIÇÃO */}
          <Button
            contentStyle={styles.button}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={handleButtonClick}
          >
            Ativar Localização
          </Button>
          {/* FIM EDIÇÃO*/}
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
