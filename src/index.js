import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import('./ReactotronConfig');
import { Text } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Splash from "./components/Splash";

import { AuthProvider } from "./contexts/auth";
import Routes from "./routes";


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

//DEFINE AS CORES DO TEMA
const theme = {
  ...DefaultTheme,
  roundness: 30,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00557C",
    accent: "#F8C525",
    background: "rgba(0, 0, 0, 0)",
    surface: "#1C1C1C",
    text: "#000000",
    disabled: "rgba(39, 93, 133, 0.5)",
    placeholder: "#00557C",
    backdrop: "#00557C",
    onSurface: "#00557C",
    notification: "#00557C",
  },
};


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  //PARA USAR AS FONTES DA PASTA
  const [loaded] = useFonts({
    OpenSans_Regular: require("../assets/fonts/OpenSans/OpenSans-Regular.ttf"),
    OpenSans_Medium: require("../assets/fonts/OpenSans/OpenSans-Medium.ttf"),
    OpenSans_SemiBold: require("../assets/fonts/OpenSans/OpenSans-SemiBold.ttf"),
    OpenSans_Bold: require("../assets/fonts/OpenSans/OpenSans-Bold.ttf"),
    OpenSans_ExtraBold: require("../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf"),
  });

  // const saveLocations = async () => {
  //   const status_code = await LocationController.saveLocations();
  // }


  if (!loaded || isLoading) {
    return <Splash setIsLoading={(e) => setIsLoading(e)} opening={true} />; // TELA DE LOADING
  } else {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}
