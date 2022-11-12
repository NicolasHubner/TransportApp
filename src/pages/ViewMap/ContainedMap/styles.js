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
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },

  // overMap: {
  //   // position: "absolute",
  //   height: '98%',
  //   width: '100%',
  //   // zIndex: 10,
  //   justifyContent: "space-between",
  //   alignItems: "flex-end"
  // },
  
  informations: {
    height: '10%',
    alignItems: "center",
    width: '87%',
    flexDirection: "row",
    justifyContent: "space-between"
  },

  textInformation: {
    color: "#3E3E3E",
    fontSize: 16,
    fontWeight: "700"
  },

  mapContainer: {
    alignItems: "center",
    height: '85%',
    // backgroundColor: 'blue',
    width: '92%',
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

  status: {
    height: '15%',
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: 'green'
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: "#E9E9E9"
  },

  place: {
    flexDirection: "row",
    width: '80%',
    alignItems: "center"
  },

  dataContainer: {
    width: '90%',
    height: '15%',
    // backgroundColor: 'yellow',
    alignItems: "center",
    justifyContent: "space-around"
  },

  map: {
    // position: "absolute",
    width: "90%",
    height: "60%",
    // zIndex: 0,
  },

  buttonContainer: {
    height: '10%',
    width: '100%',
    // backgroundColor: 'red',
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  mapMarker: {
    width: 30,
    height: 30,
  },

  pinText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  footer: {
    flex: 1,
    width: "100%",
  },
  
  atualizar: {
    // position: "absolute",
    width: '40%',
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    right: 25,
    bottom: 10,
    paddingHorizontal: 10,
  },
});
