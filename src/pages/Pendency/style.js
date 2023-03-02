import { StyleSheet } from "react-native";
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
      footer: {
        flex: 1,
        width: "100%",
      },

      body: {
        flex: 15,
        justifyContent: "flex-start",
        width: "100%",
        alignItems: "center",
        // height: "70%",
      },

      bodyRectangleTop: {
        // flex: 1,
        width: "100%",
        height: 106,
        justifyContent: "flex-start",
        paddingLeft: 20,
        paddingTop: 20,
        backgroundColor: colors.primary1,
        },

        viewScroll : {
            flex: 1,
            width: "100%",
            backgroundColor: colors.backgroundHeader,
            // height: "70%",
        },
        scrollViewList: {
            zIndex: -1,
            width: "100%",
            height: "100%",
            // backgroundColor: "red",
        },

        list: {
            width: "100%",
            height: "115%",
            marginTop: '-10%',
            paddingBottom: 45,
        },

    });