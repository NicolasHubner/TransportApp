import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import Splash from "../components/Splash";

import AppRoutes from "./AppRoutes";
import AuthRoutes from "./AuthRoutes";

import AuthContext from "../contexts/auth";

// FUNÇÃO DE ROTEAMENTO DO SISTEMA
const Routes = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Splash opening={false}></Splash> // COMO NÃO É O LOADING DE ABERTURA DO APP O PROPS 'OPENING' VAI COMO 'FALSE'
    );
  }
  if (signed) {
    return <AppRoutes />; // ROTAS DE NAVEGAÇÃO DO APP CASO O USER JÁ ESTEJA AUTENTICADO
  } else if (!signed) {
    return <AuthRoutes />; // ROTAS DE NAVEGAÇÃO DO APP CASO O USER AINDA NÃO ESTEJA AUTENTICADO 
  }
};

export default Routes;
