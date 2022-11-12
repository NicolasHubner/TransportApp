import { Dimensions, Platform, StatusBar } from "react-native";

export const windowHeight = Dimensions.get("window").height;
export const windowWidth = Dimensions.get("screen").width;
export const heightScreen = Dimensions.get("screen").height;
export const statusBar = StatusBar.currentHeight;

const metrics = {
  navBarHeight: Platform.OS === "ios" ? 64 : 54,
  statusBarHeight: Platform.OS === "ios" ? 20 : 0,
};

export default metrics;
