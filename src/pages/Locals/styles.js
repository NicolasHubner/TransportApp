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
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary1,
  },

  marginRectangle: {
    width: "92%",
    height: "100%",
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
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
    height: "100%",
    width: "100%",
  },

  title: {
    fontSize: 16,
    marginTop: "5%",
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  background: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: '3%',
    // backgroundColor: 'red'
  },

  item: {
    width: '100%',
    flexDirection: "row",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    // marginVertical: 2,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    borderRadius: 6,
    // backgroundColor: 'green'
  },

  shadow: {
    width: '105%',
    height: '105%',
    position: "absolute",
    zIndex: 20,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },

  endereco: {
    fontSize: 14,
    fontWeight: "700",
    color: "#606060",
  },

  textStatus: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },

  statusGreen: {
    backgroundColor: "#398827",
    padding: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4FB438",
    alignItems: "center"
  },

  statusYellow: {
    backgroundColor: "#E2C43E",
    padding: 7,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C1A836",
  },

  statusRed: {
    backgroundColor: "#E23E5C",
    padding: 7,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C1344E",
  },
});
