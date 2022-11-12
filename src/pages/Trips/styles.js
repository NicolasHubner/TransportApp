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
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },

  bodyEmpty: {
    flex: 15,
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.backgroundHeader,
  },

  containerTitle: {
    width: "100%",
    marginTop: 28,
    marginBottom: 30,
    alignItems: "flex-start",
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

  rectangleEmpty: {
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
    width: "100%",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center"
  },

  shadow: {
    width: '100%',
    height: '100%',
    position: "absolute",
    zIndex: 20,
    borderRadius: 6,
    // backgroundColor: "red"
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },

  status: {
    minWidth: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  blocks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  statusContainer: {
    width: 20,
    height: 20,
    backgroundColor: "#E2C43E",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 5,
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

  textBody: {
    fontWeight: "700",
    marginTop: 25,
    fontSize: 16,
  },

  refresh: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
    width: '40%',
    height: '11%',
  },

  circle: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#EFEEED"
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 7,
  },

  image: {
    resizeMode: "contain",
    width: 187,
    height: 145,
  },

  line: {
    marginTop: 5,
    height: 1,
    width: '100%',
    backgroundColor: "#C4C4C4"
  }
});
