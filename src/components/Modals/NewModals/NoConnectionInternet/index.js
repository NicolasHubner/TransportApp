import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./style";

export default function ModalNoConnectionInternet() {
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
                            A utilização das funcionalidades será limitada!
                    </Text>
                    <Text style={[styles.textModal, {marginTop: '8%'}]}>
                        Verifique sua conexão.
                    </Text>
                </View>

                <View style={{width: "100%"}}>
                    <View style={styles.ViewButtons}>
                        <TouchableOpacity
                        onPress={() => console.log("Ronaldo Fenomeno")}
                        style={styles.buttonBlue}>
                            <Text style={[styles.textButton, { color: "white" }]}>
                                Continuar sem rede
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={() => console.log("Roberto Carlos")}
                        style={{ marginTop: "5%"}}>
                            <Text style={[styles.textButton, { color: "#00557C" }]}>
                                Sair do App
                            </Text>
                        </TouchableOpacity>
                        </View>
                </View>
                </View>
            </View>
    )
}