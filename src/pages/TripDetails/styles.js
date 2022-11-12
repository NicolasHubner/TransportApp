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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary1,
  },

  marginRectangle: {
    width: "92%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  margin: {
    flex: 1,
    margin: "5%",
    justifyContent: "space-between",
  },

  status: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  order: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  title: {
    marginTop: "5%",
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  card: {
    position: "absolute",
    height: "85%",
    width: "92%",
    marginTop: "15%",
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
  },

  place: {
    width: "30%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  statusContainer: {
    width: 85,
    height: 45,
    backgroundColor: "#E2C43E",
    borderRadius: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#C1A836",
    justifyContent: "space-around",
  },

  statusContainerNull: {
    width: 85,
    backgroundColor: "#4FB438",
    borderRadius: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#398827",
    justifyContent: "space-around",
  },

  textStatus: {
    fontSize: 10,
    textAlign: "center"
  },

  line: {
    height: 1,
    width: '100%',
    backgroundColor: "#C4C4C4"
  },

  viewMap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textLight: {
    fontSize: 14,
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

  logo: {
    width: 60,
    height: 60,
    borderRadius: 7,
  },

  button: {
    height: 40,
  },

  buttonReport: {
    borderWidth: 2,
    borderColor: colors.button,
    marginTop: 15,
  },

  footer: {
    flex: 1,
    width: "100%",
  },

  //apartir daqui é para a modal

  modalLocal: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "92%",
    height: "72%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  alignModal: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalContato: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    height: "50%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 20,
  },

  contactContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  closeModal: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContato: {
    fontWeight: "700",
    fontSize: 16,
  },

  contactButtons: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: 'red'
  },

  buttonCard: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
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
  },

  buttonConfirmed: {
    width: "35%",
    height: "85%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
  },

  textConfirmed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#004757",
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

  image: {
    resizeMode: "contain",
    width: 187,
    height: 145,
  },

  buttonModal: {
    width: "100%",
  },
});
