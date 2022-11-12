import { StyleSheet } from "react-native";
import { windowHeight } from "../../utils/metrics";

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  header: {
    width: '100%',
    height: '20%',
    // backgroundColor: 'green'
  },

  contents: {
    flex: 1,
    margin: '4%',
    alignItems: "center",
    justifyContent: "space-between",
  },

  goBack: {
    width: '100%',
    alignItems: "flex-start"
  },

  stretch: {
    height: '35%',
    resizeMode: 'contain',
  },

  keyboard: {
    width: '100%',
  },

  text: {
    color: 'white',
    fontWeight: "400",
    fontSize: 16,
    marginBottom: 8,
  },
  
  TextConnected: {
    color: 'white',
    fontWeight: "400",
    fontSize: 16,
  },

  loginInput: {
    height: '60%',
    width: '100%',
  },

  loginButton: {
    // height: '20%',
    width: '100%',
    justifyContent: "space-around",
    // backgroundColor: 'yellow'
  },

  input: {
    height: 48,
    padding: 10,
    backgroundColor: 'rgba(224, 224, 224, 0.7)',
    borderRadius: 5
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