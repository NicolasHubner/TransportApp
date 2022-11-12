import { StyleSheet, Dimensions } from "react-native";
import { windowHeight, windowWidth, statusBar } from "../../utils/metrics";
import colors from "../../utils/colors";

export default StyleSheet.create({
  dash: {
    width: windowWidth,
    height: windowHeight+statusBar,
    backgroundColor: colors.primary,
  },

  header: {
    height: "11%",
    width: "100%",
  },

  container_assinatura: {
    width: '100%',
    height: '89%',
    alignItems: "center",
    justifyContent: "center"
  },

  loading: {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },

  text_loading: {
    textAlign: "center",
    fontSize: 18,
    color: colors.primary,
  },

  icone: {
    marginLeft: 10,
    marginTop: 40,
    marginBottom: 15,
    color: "white",
  },
});
