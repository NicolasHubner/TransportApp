import React, { useState, useRef, useEffect } from "react";
import { View, Alert, Text } from "react-native";
// import StorageController from "../../controllers/StorageController";
import SignatureScreen from "react-native-signature-canvas";
// import NetInfo from "@react-native-community/netinfo";
// import { DASHBOARD } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../utils/colors";
import Header from "../../components/Header";
import { format } from "date-fns";
import styles from "./styles";

const Signature = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState();
  const [token, setToken] = useState();
  const [assinatura, setAssinatura] = useState();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const ref = useRef("");
  let data_atual = format(new Date(), "yyyy-MM-dd");

  // COMENTAR PARA FICAR OFFLINE
  // const unsubscribe = NetInfo.addEventListener((state) => {
  //   if (isConnected !== state.isInternetReachable) {
  //     setIsConnected(state.isInternetReachable);
  //   }
  // });

  // FUNÇÃO PADRÃO PARA A REDENRIZAÇÃO DAS INFORMAÇÕES NA TELA
  async function init() {
    try {
      const token = await StorageController.buscarToken();
      setToken(token);
      if (!token) {
        return;
      }
      await StorageController.transmitirAjustes(token);
      let conectado = await StorageController.verificarToken(token);
      if (conectado) {
        navigation.navigate("Home");
      }
      let dashboardStorage = await StorageController.buscarPorChave(DASHBOARD);
      if (dashboardStorage) {
        dashboardStorage = JSON.parse(dashboardStorage);
        if (dashboardStorage.assinatura) {
          setAssinatura(dashboardStorage.assinatura);
        }
      }
    } catch (e) {
      Alert.alert("AVISO", e.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   init();
  // }, []);

  // SETA A ASSINATURA COMO VERDADEIRA
  const handleSignature = (signature) => {
    setSending(true);
    // enviarAssinatura(signature);
  };

  // ALERTA SE CASO A ASSINATURA ESTIVER VAZIA
  const handleEmpty = () => {
    Alert.alert("AVISO", "O campo deve ter uma assinatura", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const handleClear = () => {
    // console.log("clear success!");
  };

  // ENVIA A ASSINATURA
  async function enviarAssinatura(assinaturaBase64) {
    if (!assinatura.data_recebimento) {
      assinatura.data_recebimento = format(new Date(), "yyyy-MM-dd");
    }
    let signat = {
      id: assinatura.id,
      status: "ASSINADO",
      data_recebimento: assinatura.data_recebimento,
      data_assinatura: data_atual,
      imagem: assinaturaBase64,
    };
    try {
      if (!token) {
        navigation.navigate("Home");
      }
      const response = await api.post(
        `/humanresources/dashboard`,
        signat, {headers: { Authorization: `bearer ${token}` }}
      );
      if (response.data.status !== 1) {
        Alert.alert("AVISO", response.data.mensagem, [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("", "Assinatura enviada com sucesso", [{ text: "OK" }], {
          cancelable: false,
        });
        navigation.navigate("Home");
      }
    } catch (e) {
      Alert.alert("AVISO", e.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.dash}>
      {loading && (
        <View style={styles.loading}>
          <Text style={styles.text_loading}>
            Carregando tela de assinatura...
          </Text>
        </View>
      )}
      {sending && (
        <View style={styles.loading}>
          <Text style={styles.text_loading}>Enviando assinatura...</Text>
        </View>
      )}
      {!loading && (
        <>
          <View style={styles.header}>
            <Header navigation={navigation} rota="Ocr"/>
          </View>
          <View style={styles.container_assinatura}>
            <SignatureScreen
              ref={ref}
              webStyle={`
                .m-signature-pad--body {height: ${'85%'}}
                .m-signature-pad--footer
                .button {
                  background-color: ${colors.primary};
                  color: #FFF;
                }`
              }
              onOK={handleSignature}
              onEmpty={handleEmpty}
              onClear={handleClear}
              autoClear={false}
              trimWhitespace={true}
              rotated={true}
              descriptionText={"Assinar no sentido horizontal do aparelho"}
              clearText={"Apagar"}
              confirmText={"Confirmar"}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Signature;
