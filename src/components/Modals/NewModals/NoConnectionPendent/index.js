import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./style";

export default function ModalNoConnectionPendent() {
    return (
        <View style={styles.modal}>
            <View style={styles.modalContainer}>

                <View style={styles.ViewTexts}>
                    <Text style={[styles.textModal, { fontWeight: 'bold'}]}>
                        Sem conexão com a rede!
                    </Text>
                    </View>

                    <View style={[styles.ViewTexts, { marginTop: "7%" }]}>
                    <Text style={[styles.textModal]}>
                        <Text style={[styles.textModal, { fontWeight: 'bold'}]}>
                        Atenção!
                            </Text>
                            {" "}
                            Você está sem conexão e a validação deste canhoto ficará pendente.
                    </Text>
                    <Text style={[styles.textModal, {marginTop: '8%'}]}>
                        Assim que possível, verifique sua conexão.
                    </Text>
                </View>

                <View style={{width: "100%"}}>
                    <View style={styles.ViewButtons}>
                        <TouchableOpacity
                        onPress={() => console.log("Ronaldo Fenomeno")}
                        style={styles.buttonBlue}>
                            <Text style={[styles.textButton, { color: "white" }]}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                        </View>
                </View>
                </View>
            </View>
    )
}