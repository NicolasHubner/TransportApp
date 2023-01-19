//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - alteração da url da api de redefinção de senha
//
//*************************************************************************** */

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  TextInput,
} from "react-native";
import { Button, Text, HelperText, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import fundo from "../../../assets/images/background.png";
import yupLocale from "../../../validations";
import { api } from "../../../services/api";
import styles from "./styles";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

Yup.setLocale(yupLocale);
const INITIAL_VALUES = { email: [] };

export default function EmailRecover({ navigation }) {
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  // FAZ A MENSAGEM DE ERRO DOS CAMPOS
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("O formato do email é inválido")
      .required("Informe um email")
      .trim(),
  });

  // TESTA SE CHEGOU NA PÁGINA DE EMAILRECOVER
  async function init() {
    try {
      console.log("init EmailRecover");
    } catch (error) {
      crashlytics().recordError(error);
      console.log(e.message);
    }
  }

  // FAZ A FUNÇÃO INIT ASSIM QUE A PÁGINA INICIALIZA
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init();
    });

    return unsubscribe;
  }, [navigation]);

  // SETA O VALOR NA VARIAVEL EMAIL E VERIFICA OS ERROS
  const onChangeEmail = (text) => {
    setEmail(text);
    setErrors(INITIAL_VALUES);
  };

  // VALIDA O EMAIL INSERIDO, FAZ A REQUISIÇÃO E REDIRECIONA PARA A PÁGINA CODERECOVER
  const nextPage = async () => {
    try {
      setLoading(true);
      const validEmail = { email };
      await schema.validate(validEmail, { abortEarly: false });

      //  23.12.22...
      const res = await api.post("/user/forgot-password", validEmail);
      //  ...23.12.22
      
      if (res.data.success) {
        navigation.navigate("CodeRecover");
      }
    } catch (error) {
      crashlytics().recordError(error);
      const errorMessages = {};
      if (error && error.inner) {
        const errorItems = error.inner.map((i) => {
          const name = i.path;

          if (!errorMessages[name]) {
            errorMessages[name] = [i.message];
          } else {
            errorMessages[name].push(i.message);
          }

          return errorMessages;
        });
        setErrors(errorMessages);
      } else if (error.response.data.errors) {
        let mensagem = error.response.data.errors;
        let array_erro = [];
        mensagem.forEach((element) => {
          array_erro.push(`* ${element} \n`);
        });
        setErro(array_erro);
        setVisible(!visible);
      } else {
        setErro(error.message);
        setVisible(!visible);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.ImageContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.margem}>
          <View style={styles.header}>
            <View style={styles.goBack}>
              <MaterialCommunityIcons
                onPress={() => navigation.navigate("Login")}
                name="arrow-left"
                size={25}
                color="white"
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                style={styles.logo}
                source={require("../../../assets/images/logo.png")}
              />
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            indicatorStyle="white"
          >
            <View style={styles.containerUpper}>
              <Text style={styles.titleText}>Recuperação de senha</Text>
              <Text style={styles.text}>
                Para recuperar sua senha, insira seu e-mail e enviaremos um
                código de confirmação
              </Text>
              <Text style={styles.textInput}>E-mail</Text>
              <TextInput
                allowFontScaling={false}
                importantForAutofill="noExcludeDescendants"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                returnKeyType="next"
                onChangeText={onChangeEmail}
                placeholder="usuario@email.com.br"
              />
              {errors.email &&
                errors.email.map((erro, position) => (
                  <HelperText
                    style={styles.helperText}
                    type="error"
                    visible={true}
                    key={position}
                  >
                    {erro}
                  </HelperText>
                ))}
            </View>
            <View style={styles.containerBotton}>
              <Button
                mode="contained"
                disabled={!email || loading}
                loading={loading}
                contentStyle={!email ? styles.buttonDisabled : styles.button}
                labelStyle={
                  !email
                    ? { color: "rgba(255, 255, 255, 0.4)" }
                    : { color: "white" }
                }
                onPress={() => nextPage()}
              >
                continuar
              </Button>
            </View>
          </ScrollView>
        </View>
        <Snackbar
          style={styles.snackbar}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {erro}
        </Snackbar>
      </SafeAreaView>
    </ImageBackground>
  );
}
