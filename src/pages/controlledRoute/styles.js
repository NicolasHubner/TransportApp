import { StyleSheet, Dimensions } from "react-native";
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
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white"
  },
  
  rectangle: {
    width: "100%",
    height: '15%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary1,
  },
  
  marginRectangle: {
    width: '92%',
    height: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  title: {
    marginTop: '5%',
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },

  card: {
    position: "absolute",
    height: '80%',
    width: '92%',
    marginVertical: '17%',
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
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textLight: {
    fontSize: 14,
    
  },
  
  textMedium: {

  },

  TextBold: {

  },

  footer: {
    flex: 1,
    width: "100%",
  },
});