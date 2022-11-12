import { StyleSheet } from "react-native";
import { windowHeight } from "../../../utils/metrics";

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
    // margin: windowHeight * 0.02,
    padding: "4%",
    justifyContent: "space-between",
  },

  goBack: {
    width: "100%",
    // height: '20%',
    alignItems: "flex-start",
  },

  logo: {
    // height: "45%",
    // width:  '35%',
    // resizeMode: "contain",
    height: 16,
    width: 124,
    resizeMode: "contain",
  },

  header: {
    // flex: 1,
    // height: "10%",
    // height: '15%',
  },

  containerUpper: {
    // flex: 5,
    // height: "80%",
    // height: '60%',
    // justifyContent: "flex-start",
  },

  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 16,
    margin: 5,
  },

  input: {
    height: 48,
    padding: 10,
    backgroundColor: "rgba(224, 224, 224, 0.7)",
    borderRadius: 5,
  },

  textInput: {
    color: "white",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },

  containerBotton: {
    // flex: 1,
    // height: "20%",
    // height: '30%',
    marginTop: 20,
    // justifyContent: "flex-end",
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
