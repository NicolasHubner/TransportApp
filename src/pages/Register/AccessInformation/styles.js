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
    padding: '4%',
    // margin: windowHeight * 0.02,
    justifyContent: "space-between",
  },

  header: {
    // height: windowHeight * 0.13,
  },

  containerUpper: {
    // height: windowHeight * 0.6,
    // justifyContent: "flex-start"
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

  containerBotton: {
    marginTop: 20,
    // height: windowHeight * 0.23,
    // justifyContent: "flex-end",
  },

  textInput: {
    color: "white",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },

  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 16,
    marginLeft: 5,
  },

  input: {
    height: 48,
    padding: 10,
    backgroundColor: "rgba(224, 224, 224, 0.7)",
    borderRadius: 5,
  },

  checkboxView: {
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
  },

  checkbox: {
    alignSelf: "center",
    marginRight: 10,
  },

  TextConnected: {
    color: "white",
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
    backgroundColor: "rgba(39, 93, 133, 0.5)",
  },

  helperText: {
    fontSize: 14,
  },

  snackbar: {
    backgroundColor: "#FF7F7F",
    borderRadius: 6,
    alignItems: "center",
  },
});
