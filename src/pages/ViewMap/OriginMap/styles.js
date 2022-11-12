import { StyleSheet } from "react-native";
import colors from "../../../utils/colors";

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
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },

  informations: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 85, 124, 0.9)",
    height: "10%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  textInformation: {
    marginTop: 8,
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  map: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.button,
    justifyContent: "center",
  },
  pinText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 8,
  },

  footer: {
    flex: 1,
    width: "100%",
  },

  atualizar: {
    position: "absolute",
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: colors.button,
    right: 20,
    bottom: 20,
    paddingHorizontal: 10,
  },

  modalLocal: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    height: "70%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
  },

  image: {
    width: 183,
    height: 132,
  },

  button: {
    height: 40,
    width: "100%",
  },

  buttonReport: {
    marginTop: 15,
    backgroundColor: "white",
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

  positionTooltip: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  tooltipModal: {
    alignItems: "center",
    // justifyContent: "flex-start",
    width: "50%",
    position: "absolute",
    backgroundColor: "#2F2F2F",
    // elevation: 5,
    borderRadius: 5,
    bottom: "8%",
    left: "3%",
    padding: 15,
  },

  tooltip: {
    position: "absolute",
    zIndex: 100,
    width: "9%",
    height: "4%",
    bottom: "1%",
    left: "8%",
    borderRadius: 20,
    backgroundColor: "rgba(241, 197, 37, 0.5)",
  },

  arrow: {
    position: "absolute",
    borderStyle: "solid",
    borderTopWidth: 18,
    borderRightWidth: 12,
    borderBottomWidth: 18,
    borderLeftWidth: 12,
    borderTopColor: "#2F2F2F",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    bottom: '4%',
    left: "9%",
  },

  textTooltip: {
    color: "white",
    fontSize: 14,
  },

  mapMarker: {
    width: 30,
    height: 30,
  },

  modalContainer: {
    alignItems: "center",
    justifyContent:"space-around",
    width: '92%',
    height: '72%',
    backgroundColor: "white",
    padding: '5%',
    elevation: 5,
    borderRadius: 5,
  },

  textModal: {
    fontSize: 22,
  },

  imageModal: {
    resizeMode: "contain",
    width: 187,
    height: 145
  },
});
