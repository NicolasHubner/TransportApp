import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
      justifyContent: "flex-start",
      width: "92%",
      height: "32%",
      backgroundColor: "white",
      paddingTop: "7%",
      paddingHorizontal: "5%",
      elevation: 5,
      borderRadius: 5,
    },
    textModal: {
      fontSize: 22,
    },
    textDownload: {
        fontSize: 16,
        color: "grey",
        opacity: 0.6,
    },
    ViewTexts: {
        width: "100%",
        alignItems: "flex-start",
        paddingHorizontal: "5%",
    },
    ViewButtons: {
        width: "100%",
        alignItems: "center",
        marginTop: "10%",
    },
    buttonBlue: {
        width: "90%",
        height: 40,
        backgroundColor: "#00557C",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        color: "white",
        fontSize: 18,
        textTransform: "uppercase",
    },
  });