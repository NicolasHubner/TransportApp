import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contents: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  header: {
    height: "11%",
    width: "100%",
  },

  body: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  trip: {
    position: "absolute",
    zIndex: 1,
    height: "15%",
    width: "100%",
    backgroundColor: "#000000B2",
  },

  align_trip: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  trip_status: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  status: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: "green",
    marginLeft: 25,
    marginRight: 5,
  },

  trip_text: {
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "700",
    color: "#FFFFFF",
  },

  mission: {
    width: '90%',
  },

  align_mission: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  mission_text: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "700",
    color: "#606060",
  },

  container: {
    flex: 1,
    marginTop: "15%",
    marginBottom: "5%",
    zIndex: 2,
    width: "90%",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 6,
  },

  option: {
    width: "90%",
    flexGrow: 0,
    flexBasis: "22%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-around",
  },

  align_option: {
    flex: 1,
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  check_true: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#858585',
    alignItems: "center",
    justifyContent: "center"
  },

  check_false: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'transparent',
    alignItems: "center",
    justifyContent: "center"
  },

  button: {
    width: '90%',
    // backgroundColor: "#000000B2"
  }
});
