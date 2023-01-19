import { StyleSheet } from "react-native";
import colors from "../../../utils/colors";
import { windowHeight, windowWidth } from "../../../utils/metrics";

  export default StyleSheet.create({
    fixed: {
      flex: 1,
    },

    ImageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    background: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },

    margem: {
      flex: 1,
      marginTop: '15%',
      margin: '4%',
      justifyContent: "space-between",
    },

    containerUpper: {
      height: '85%',
      justifyContent: "space-around"
    },

    containerBotton: {
      height: '15%',
      justifyContent: "flex-end"
    },

    goBack: {
      width: '100%',
      height: '5%',
      alignItems: "flex-start"
    },

    logo: {
      height: 16,
      width: 126,
      resizeMode: 'stretch',
    },

    modal: {
      // marginTop: 16,
      height: '80%',
      borderRadius: 25,
      backgroundColor: "rgba(255, 255, 255, 0.90)",
    },

    modalMargin: {
      margin: 16,
      padding:10
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
      color: "#2E2E2E",
    },

    checkboxView: {
      // marginTop: 15,
      height: '5%',
      alignItems: "center",
      flexDirection: "row",
    },
  
    checkbox: {
      alignSelf: "center",
      marginRight: 10,
    },

    TextConnected: {
      color: 'white',
      fontWeight: "400",
      fontSize: 16,
    },

    term: {
      fontWeight: "400",
      fontSize: 16,
      textDecorationLine: "underline",
      color: "white",
    },

    button: {
      height: 65,
    },

    buttonDisabled: {
      height: 65,
      backgroundColor: 'rgba(39, 93, 133, 0.5)',
    },
});