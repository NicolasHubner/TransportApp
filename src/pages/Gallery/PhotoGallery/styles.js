import { StyleSheet, Dimensions } from "react-native";
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
    justifyContent: "flex-start",
    width: "100%",
    padding: '5%',
    alignItems: "center",
    backgroundColor: "white",
  },

  nameContainer: {
    width: '100%',
    height: '15%',
    // backgroundColor: 'red'
  },

  name: {
    flexDirection: "row",
    alignItems: "center"
  },

  textName: {
    fontSize: 16,
    fontWeight: "700"
  },

  textData: {
    fontSize: 10,
    marginLeft: 10,
  },

  imageContainer: {
    width: '100%',
    height: '65%',
    // backgroundColor: 'yellow',
    justifyContent: "center",
    alignItems: "center"
  },
  
  card: {
    width: '95%',
    height: '95%',
    alignItems: "center",
    justifyContent: "space-around",
    // flexDirection: "row",
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

  image: {
    resizeMode: "contain",
    width: '95%',
    height: '90%'
  },

  images: {
    width: '95%',
    height: '75%',
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
  },

  listImages: {
    width: '95%',
    height: '25%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  imageEdit: {
    width: '18%',
    height: '70%',
    borderRadius: 5,
    backgroundColor: "#E4E4E4",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },

  imagePosition: {
    // width: '10%',
    // height: '20%',
    position: "absolute",
    zIndex: 10,
    alignItems: "flex-end",
    justifyContent: "flex-start"
  },
  
  preview: {
    resizeMode: "contain",
    width: '100%',
    height: '100%',
    borderRadius: 5
  },

  imageEmpty: {
    width: '18%',
    height: '70%',
    borderRadius: 5,
    backgroundColor: "#E4E4E4",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    width: '100%',
    height: '20%',
    justifyContent: "center"
  },

  button: {
    height: 40,
  },

  buttonReport: {
    borderColor: colors.button,
    marginTop: 15,
  },

  footer: {
    flex: 1,
    width: "100%",
  },
});
