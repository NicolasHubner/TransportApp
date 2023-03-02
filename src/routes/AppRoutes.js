import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Trips from "../pages/Trips";
import TripDetails from "../pages/TripDetails";
import Locals from "../pages/Locals";
import LocalDetails from "../pages/LocalDetails";
import Missions from "../pages/Missions";
import Insuccess from "../pages/Insuccess";
import SelectNavigation from "../pages/SelectNavigation";
import NewAddress from "../pages/NewAddress";
import PhotoGallery from "../pages/Gallery/PhotoGallery";
import ReceiptGallery from "../pages/Gallery/ReceiptGallery";
import ExpandedMap from "../pages/ViewMap/ExpandedMap";
import ContainedMap from "../pages/ViewMap/ContainedMap";
import OriginMap from "../pages/ViewMap/OriginMap";
import DeliveryProcess from "../pages/DeliveryProcess";
import ContactLocals from "../pages/ContactLocals";
// import Ocr from "../pages/Ocr";
// import Signature from "../pages/Signature";
// import ControlledTrips from "../pages/ControlledTrips";
// import ControlledRoute from "../pages/ControlledRoute";
import Pendency from "../pages/Pendency";

const AppStack = createStackNavigator();

const AppRoutes = () => (
  // CONFIGURAÇÕES DE ESTILO E FUNÇÃO DAS ROTAS DO USUARIO AUTENTICADO
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
      {/* TELAS DE NAVEGAÇÃO */}
      <AppStack.Screen name="Trips" component={Trips} />
      <AppStack.Screen name="TripDetails" component={TripDetails} />
      <AppStack.Screen name="ContactLocals" component={ContactLocals} />
      <AppStack.Screen name="Locals" component={Locals} />
      <AppStack.Screen name="LocalDetails" component={LocalDetails} />
      <AppStack.Screen name="SelectNavigation" component={SelectNavigation} />
      <AppStack.Screen name="ContainedMap" component={ContainedMap} />
      <AppStack.Screen name="ExpandedMap" component={ExpandedMap} />
      <AppStack.Screen name="OriginMap" component={OriginMap} />
      <AppStack.Screen name="NewAddress" component={NewAddress} />
      <AppStack.Screen name="Missions" component={Missions} />
      <AppStack.Screen name="DeliveryProcess" component={DeliveryProcess} />
      <AppStack.Screen name="PhotoGallery" component={PhotoGallery} />
      <AppStack.Screen name="ReceiptGallery" component={ReceiptGallery} />
      <AppStack.Screen name="Insuccess" component={Insuccess} />
      {/* <AppStack.Screen name="ControlledTrips" component={ControlledTrips} /> */}
      {/* <AppStack.Screen name="ControlledRoute" component={ControlledRoute} /> */}
      {/* <AppStack.Screen name="Ocr" component={Ocr} /> */}
      {/* <AppStack.Screen name="Signature" component={Signature} /> */}
      <AppStack.Screen name="Pendency" component={Pendency} />
  </AppStack.Navigator>
)

export default AppRoutes;
