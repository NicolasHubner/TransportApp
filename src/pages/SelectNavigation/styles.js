import { StyleSheet } from "react-native";
import colors from "../../utils/colors";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },

  header: {
    flex: 1,
    width: "100%",
  },

  body: {
    flex: 15,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },

  margin: {
    height: '100%',
    width: '100%',
    padding: '5%',
    // justifyContent: "space-between",
    // backgroundColor: 'red',
  },

  order: {
    height: '8%',
    // backgroundColor: 'red'
  },

  textOrder: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text
  },
  
  image: {
    height: '10%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'green',
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 7,
    // resizeMode: "contain",
    // borderRadius: 20,
  },

  address: {
    height: '7%',
    paddingTop: '2%',
    // backgroundColor: "yellow",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  textAddress: {
    width: '65%',
    fontSize: 14,
    fontWeight: "700",
    color: "#606060"
  },

  textBold: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  maps: {
    height: '63%',
    // backgroundColor: "blue"
  },

  card: {
    marginVertical: '4%',
    height: "25%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: '5%',
    alignItems: "center",
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

  fontLocation: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.text
  },
  
  logoNavigation: {
    height: 60,
    width: 60,
    // resizeMode: 'contain',
  },

  checkboxView: {
    alignItems: "center",
    justifyContent: "center"
  },

  checkbox: {
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 10,
  },

  noNavigation: {
    height: '12%',
    width: '100%',
    justifyContent: "center",
    // backgroundColor: "grey"
  },

  footer: {
    flex: 1,
    width: "100%",
  },
});