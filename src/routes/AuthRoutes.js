import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

import Login from "../pages/Login";
import Begin from "../pages/Begin";
import PersonalData from "../pages/Register/PersonalData";
import AccessInformation from "../pages/Register/AccessInformation";
import UseTerms from "../pages/Register/UseTerms";
import EmailRecover from "../pages/RecoverPassword/EmailRecover";
import CodeRecover from "../pages/RecoverPassword/CodeRecover";
import ResetPassword from "../pages/RecoverPassword/ResetPassword";

const AuthStack = createStackNavigator();

const AuthRoutes = () => (
  // CONFIGURAÇÕES DE ESTILO E FUNÇÃO DAS ROTAS DE AUTENTICAÇÃO DO USUARIO
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: "vertical",
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    }}
  >
    {/* TELAS DE AUTENTICAÇÃO */}
    <AuthStack.Screen name="Begin" component={Begin} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="PersonalData" component={PersonalData} />
    <AuthStack.Screen name="AccessInformation" component={AccessInformation} />
    <AuthStack.Screen name="UseTerms" component={UseTerms} />
    <AuthStack.Screen name="EmailRecover" component={EmailRecover} />
    <AuthStack.Screen name="CodeRecover" component={CodeRecover} />
    <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
  </AuthStack.Navigator>
);

export default AuthRoutes;
