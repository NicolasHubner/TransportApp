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
  },

  title: {
    marginTop: "5%",
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  card: {
    position: "absolute",
    height: "55%",
    width: "92%",
    marginVertical: "17%",
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

  margin: {
    flex: 1,
    margin: "5%",
    justifyContent: "space-between",
  },

  middleContainer: {
    flexDirection: "row"
  },

  status: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  statusDelivery: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '65%',
  },

  confirmed: {
    width: '35%',
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8
  },

  dotConfirmed: {
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: '#4FB438'
  },

  dotUnconfirmed: {
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: '#C1344E'
  },

  textConfirmed: {
    fontSize: 12
  },

  line: {
    backgroundColor: "#C4C4C4",
    height: 1,
    width: "100%",
    marginVertical: 10,
  },

  address: {
    width: '70%',
  },

  mapContainer: {
    width: '30%',
    alignItems: "center",
    justifyContent: "center"
  },

  place: {
    alignItems: "center",
    flexDirection: "row",
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

  button: {
    height: 40,
    marginRight: '36%',
    flexDirection: "row-reverse",
    justifyContent: "space-between",
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
});
