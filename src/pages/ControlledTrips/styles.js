import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";

export default StyleSheet.create({
  contents: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  header: {
    flex: 2,
    width: "100%",
  },

  body: {
    flex: 15,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },

  bodyEmpty: {
    flex: 15,
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.backgroundHeader
  },
  
  containerTitle: {
    width: '100%',
    marginTop: 28,
    marginBottom: 30,
    alignItems: "flex-start"
  },

  image: {
    width: 175,
    height: 175,
  },
  
  footer: {
    flex: 1,
    width: "100%",
  },

  rectangle: {
    flex: 1,
    width: "100%",
    height: 106,
    justifyContent: "center",
    backgroundColor: colors.primary1,
  },

  fundo: {
    flex: 6,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  list: {
    position: "absolute",
    zIndex: 1,
    height: "93%",
    width: "100%",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
    marginBottom: 45,
    marginLeft: "5%",
  },

  background: {
    width: '100%',
    alignItems: "center"
  },

  item: {
    minWidth: "95%",
    maxWidth: "95%",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    marginVertical: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 6,
  },

  status: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timerContainer: {
    backgroundColor: "#4FB438",
    alignItems: "center",
    borderRadius: 10,
    width: 78,
  },

  line: {
    width: '100%',
    height: 1,
    marginVertical: 8,
    backgroundColor: "#C4C4C4",
  },

  textSansRegular: {
    fontSize: 14,
    fontFamily: "OpenSans_Regular",
    color: colors.text,
  },

  textSansBold: {
    fontSize: 14,
    fontFamily: "OpenSans_SemiBold",
    color: colors.text,
  },

  textRegular: {
    fontSize: 14,
    color: colors.text,
  },

  textBold: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  textBody: {
    marginTop: 25,
    fontSize: 16,
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 7
  }
});