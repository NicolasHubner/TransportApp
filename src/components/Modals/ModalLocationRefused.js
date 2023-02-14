//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
//  Alterações:
//  
//  14.12.22 - Barbara
//             Criação da função handleButtonClick para redirecionar 
//             o usuario para as configuracoes e mudança no texto e no botão
//
//  15.12.22 - Márcia
//             Alteração para redirecionar o usuário para a configuração da 
//             localização. 
//
//*************************************************************************** */
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Linking, Platform } from "react-native";
import { Button } from "react-native-paper";
import { startActivityAsync, ActivityAction, Settings } from 'expo-intent-launcher';

export default function ModalLocationRefused({ hideModal }) {

  //edicao
  const handleButtonClick = async() => {
    // 15.12.22...
    Platform.OS === 'ios'
        ? Linking.openSettings()
        : startActivityAsync(ActivityAction.APPLICATION_DETAILS_SETTINGS, {
          data: 'package:' + "com.trouw.mobile",
        });
    //...15.12.22
    hideModal()
  }

 
  //fim

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <Text style={styles.textModal}>
            Para prosseguir, nas configurações deste aplicativo você deve permitir o acesso à sua localização através das opções:
            <Text>{"\n"}</Text>
            <Text style={[styles.textModal, { fontWeight: "bold" }]}>
              {""}
              Permissões -> Local -> "Permitir o tempo todo"{" "}
            </Text>
          </Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require("../image/gps.png")}
          />
        </View>
        <View style={styles.buttonModal}>
          {/*EDIÇÃO*/}
          <Button
            contentStyle={styles.button}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={handleButtonClick}
          >
            Permitir Acesso
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
    fontSize: 20,
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
