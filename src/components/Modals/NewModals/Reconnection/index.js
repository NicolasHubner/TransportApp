import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./style";

export default function ModalReconnection() {
    const [pendencies, setPendencies] = useState(2)
    return (
        <View style={styles.modal}>
            <View style={styles.modalContainer}>

                <View style={styles.ViewTexts}>
                    <Text style={[styles.textModal]}>
                        Rede reestabelecida!
                    </Text>
                    </View>

                    <View style={[styles.ViewTexts, { marginTop: "7%" }]}>
                    <Text style={[styles.textModal]}>
                            Após a sincronização, identificamos <Text style={{fontWeight: 'bold'}}>{pendencies === 1 ? 'pendência' : 'pendências'}</Text> na autenticação dos canhotos!
                    </Text>
                </View>


                <View style={styles.ViewPendencias}>
                <Text style={[styles.textModal, { textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase'}]}>
                        {pendencies} {pendencies === 1 ? 'pendência' : 'pendências'}
                    </Text>
                </View>


                <View style={{width: "100%"}}>
                    <View style={styles.ViewButtons}>
                        <TouchableOpacity
                        onPress={() => console.log("Ronaldo Fenomeno")}
                        style={styles.buttonBlue}>
                            <Text style={[styles.textButton, { color: "white" }]}>
                                Verificar pendências
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => console.log("Ronaldo Fenomeno")}
                        style={[{ marginTop: "5%" }]}>
                            <Text style={[styles.textButton, { color: "#00557C" }]}>
                                Não verificar
                            </Text>
                        </TouchableOpacity>
                        </View>
                </View>
                </View>
            </View>
    )
}