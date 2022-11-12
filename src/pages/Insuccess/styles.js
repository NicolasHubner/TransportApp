import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  header: {
    flex: 1,
    width: "100%",
  },

  body: {
    flex: 15,
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },

  rectangle: {
    width: "100%",
    height: "15%",
      flexDirection: "row",
    justifyContent: "space-between",
    padding: '5%',
    backgroundColor: colors.primary1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.backgroundHeader,
  },

  text: {
    fontSize: 10,
    fontWeight: "400",
    color: colors.text,
    margin: 1,
  },

  fundo: {
    height: '85%',
    width: '100%',
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  
  list: {
    top: '-8%',
    position: "absolute",
    zIndex: 1,
    height: "108%",
    width: "95%",
  },

  backgroundCard: {
    width: "95%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: 10,
  },

  card: {
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: 5,
    padding: 5
  },

  image: {
    width: 46,
    height: 34,
  },

  button: {
    height: 30,
  },

  footer: {
    flex: 1,
    width: "100%",
  },

  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  textModal: {
    fontSize: 22,
  },

  imageModal: {
    resizeMode: "contain",
    width: 213,
    height: 127
  },

  buttonModal: {
    width: '100%',
  },

  biggerButton: {
    height: 40,
  },

  footerStyle:{
    width: '90%'
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
});
