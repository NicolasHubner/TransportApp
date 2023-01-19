//*************************************************************************** */
// Aplicativo TROUW Tecnologia
// 
// Alterações
//
//  23.12.22 - TIAKI
//      - alteração da url da api de validacao do token da senha
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
import yupLocale from "../../../validations";
import fundo from "../../../assets/images/background.png";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { api } from "../../../services/api";
import styles from "./styles";
import * as Yup from "yup";
import crashlytics from '@react-native-firebase/crashlytics';

Yup.setLocale(yupLocale);
const INITIAL_VALUES = { code: [] };
const CELL_COUNT = 6;

export default function CodeRecover({ navigation }) {
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [code, setCode] = useState("");
  const [erro, setErro] = useState("");
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // FAZ A MENSAGEM DE ERRO DOS CAMPOS
  const schema = Yup.object().shape({
    value: Yup.string()
      .required("Informe o código de segurança disponível em seu e-mail")
      .min(6, "O código deve conter 6 digitos")
      .trim(),
  });

  // TESTA SE CHEGOU NA PÁGINA
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

  // SETA O VALOR NA VARIAVEL VALUE E VERIFICA OS ERROS
  const onChangeCode = (text) => {
    setValue(text);
    setErrors(INITIAL_VALUES);
  };

  // VALIDA O CODIGO, FAZ A REQUISIÇÃO E REDIRECIONA PARA A TELA DE RESETPASSWORD
  const nextPage = async () => {
    try {
      setLoading(true);
      // console.log(value);
      const validCode = { value };
      await schema.validate(validCode, { abortEarly: false });

      const code = { password_token: validCode.value };

      const res = await api.post("/user/validate-password-token", code); //  23.12.22
      if (res.data.success) {
        console.log(res.data.data.password_token[0]);
        navigation.navigate("ResetPassword", res.data.data.password_token[0]);
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
                onPress={() => navigation.navigate("EmailRecover")}
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
                Insira o código de segurança que chegará no seu e-mail
              </Text>
              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={onChangeCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              {errors.value &&
                errors.value.map((erro, position) => (
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
                disabled={!value || loading}
                loading={loading}
                contentStyle={!value ? styles.buttonDisabled : styles.button}
                labelStyle={
                  !value
                    ? { color: "rgba(255, 255, 255, 0.4)" }
                    : { color: "white" }
                }
                onPress={() => nextPage()}
              >
                enviar código de confirmação
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
