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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },

  card: {
    width: '90%',
    padding: 20,
    // height: '70%',
    // flexDirection: "row",
    // justifyContent: "space-between",
    // paddingHorizontal: '5%',
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

  title: {
    fontSize: 16,
    color: "#000000",
    marginVertical: 10
  },

  line:{
    height: 1,
    width: '90%',
    marginVertical: 10,
    backgroundColor: "#BFBEBE"
  },

  input: {
    height: 40,
    marginVertical: 10,
    // borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    width: '100%',
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

  styleButton: {
    width: '100%',
    marginVertical: 10
  },

  button: {
    flexDirection: "row-reverse",
    height: 40,
    width: "100%",
  },

  footer: {
    flex: 1,
    width: "100%",
  },
});