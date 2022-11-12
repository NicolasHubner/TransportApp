import { StyleSheet } from "react-native";

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  contents: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    margin: 16,
  },

  stretch: {
    height: 33,
    width: 252,
    resizeMode: 'stretch',
  },

  text: {
    color: '#FFFFFF',
    fontWeight: "400",
    fontSize: 16,
    marginTop: 22
  },

  loginInput: {
    width: '100%',
  },

  loginButton: {
    width: '100%'
  },

  input: {
    height: 48,
    padding: 10,
    backgroundColor: 'rgba(224, 224, 224, 0.7)',
    borderRadius: 5
  },

  checkbox: {
    alignSelf: "center",
    margin: 8,
  },

  checkboxView: {
    flexDirection: "row",
  },
});