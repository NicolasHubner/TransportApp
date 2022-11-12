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
    height: "35%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.primary1,
  },

  marginRectangle: {
    width: "100%",
    height: "80%",
    padding: '5%',
    justifyContent: "space-between",
    // flexDirection: "row",
  },

  titleContainer: {
    height: '25%',
    width: '100%',
  },

  infoContainer: {
    flexDirection: "row",
    height: "75%",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 20,
    fontFamily: "OpenSans_Bold",
    color: colors.backgroundHeader,
    // marginBottom: '5%',
  },

  textBold: {
    fontSize: 14,
    fontFamily: "OpenSans_Bold",
    color: colors.backgroundHeader,
  },
  
  textRegular: {
    fontSize: 14,
    fontFamily: "OpenSans_Regular",
    color: colors.backgroundHeader,
  },

  textSemiBold: {
    fontSize: 14,
    fontFamily: "OpenSans_SemiBold",
    color: colors.backgroundHeader,
  },

  logo: {
    width: 60,
    height: 60,
    // resizeMode: "",
    borderRadius: 7
  },

  list: {
    // paddingTop: '45%',
    position: "absolute",
    zIndex: 1,
    height: "100%",
    width: "100%",
    // backgroundColor: 'red'
  },

  background: {
    width: '100%',
    // height: '75%',
    alignItems: "center",
    // marginBottom: 5,
    // backgroundColor: 'red'
  },

  item: {
    width: '95%',
    flexDirection: "row",
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    marginVertical: 10,
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
  },

  shadow: {
    width: '100%',
    height: '100%',
    position: "absolute",
    zIndex: 10,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },

  // margin: {
  //   maxWidth: "100%",
  //   height: 80,
  //   // backgroundColor: "green",
  //   flexDirection: "row",
  // },

 imageContainer: {
    width: "25%",
    // height: '100%',
    // backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3%",
  },

  image: {
    width: 50,
    height: 60,
    // width: '80%',
    // height: '70%',
    resizeMode: "contain"
    // backgroundColor: 'red'
  },

  rightCard: {
    width: '75%',
    // height: '100%',
    flexDirection: "column",
    // backgroundColor: 'purple',
    justifyContent: "space-between"
  },

  nameContainer: {
    width: '70%',
    // height: '100%',
    // backgroundColor: 'yellow',
    justifyContent: "space-between"
  },

  dataContainer: {
    width: '100%',
    // height: '75%',
    // backgroundColor: 'blue',
    flexDirection: "row"
  },

  statusContainer: {
    width: '30%',
    // height: '100%',
    // backgroundColor: 'cyan',
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },

  obsContainer: {
    width: '100%',
    marginTop: 10,
    // height: '25%',
    // backgroundColor: 'red',
    justifyContent: "flex-end"
  },

  text12: {
    fontSize: 12,
  },

  text16: {
    fontSize: 16,
  },

  footer: {
    flex: 1,
    width: "100%",
  },
});
