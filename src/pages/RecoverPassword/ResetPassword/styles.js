import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../../utils/metrics";

export default StyleSheet.create({
  ImageContainer: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  margem: {
    flex: 1,
    margin: windowHeight * 0.02,
    justifyContent: "space-between",
  },

  header: {
    // height: windowHeight * 0.13,
    height: '15%',
  },

  goBack: {
    width: "100%",
    alignItems: "flex-start",
  },
  
  logo: {
    height: 16,
    width: 126,
    resizeMode: "stretch",
  },

  containerUpper: {
    // height: windowHeight * 0.68,
    justifyContent: "flex-start",
  },

  titleText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  
  text: {
    marginTop: 16,
    color: "white",
    fontWeight: "400",
    fontSize: 16,
  },

  textInput: {
    color: "white",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  
  input: {
    height: 48,
    padding: 10,
    backgroundColor: "rgba(224, 224, 224, 0.7)",
    borderRadius: 5,
  },

  containerBotton: {
    // height: windowHeight * 0.15,
    justifyContent: "flex-end",
    marginTop: 20,
  },

  button: {
    height: 65,
  },

  buttonDisabled: {
    height: 65,
    backgroundColor: "rgba(39, 93, 133, 0.5)",
  },

  snackbar: {
    backgroundColor: "#FF7F7F",
    borderRadius: 6,
    alignItems: "center",
  },
});
