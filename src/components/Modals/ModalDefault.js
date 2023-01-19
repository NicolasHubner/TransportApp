import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import AuthContext from "../../contexts/auth";

export default function ModalDefault({ hideModal, logoff, titleText, warningText, verifyText, buttonText, buttonText2, pendencys, nextPage }) {

  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={[styles.textModal, { fontWeight: "bold" }]}>{titleText}</Text>
          <Text style={styles.textModal}>
            <Text style={[{ fontWeight: "bold" }]}>Atenção: </Text>
            <Text>{warningText}</Text>
          </Text>

          {verifyText && <Text style={styles.textModal}>{verifyText}</Text>}
          {pendencys && <Text style={[styles.textModal, { fontWeight: "bold" }]}>{pendencys} pendências</Text>}
        </View>
        <View style={styles.buttonModal}>
          <Button
            contentStyle={styles.button}
            mode="contained"
            labelStyle={{ color: "white" }}
            onPress={() => hideModal()}
          >
            {buttonText}
          </Button>
          
          {buttonText2 && <Button
            contentStyle={[styles.button, { marginTop: 10 }]}
            mode="text"
            onPress={() => {
              hideModal();
            }}
          >
            {buttonText2}
          </Button>}

          {logoff && <Button
            contentStyle={[styles.button, { marginTop: 10 }]}
            mode="text"
            onPress={() => {
              signOut();
            }}
          >
            sair do aplicativo
          </Button>}
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
    marginBottom: "10%"
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
