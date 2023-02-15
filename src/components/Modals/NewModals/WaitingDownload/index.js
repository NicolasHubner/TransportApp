import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { styles } from "./style";

export default function ModalWaitingDownload() {
    const [data, setData] = useState('4.4')

    const [totalData, setTotalData] = useState('16')

    useEffect(() => {
        //UseEffect para simular o download e atualizar o valor do data
        // Quando for necessário utilizar para simular o valor REAL;


        // const interval = setInterval(() => {
        //     setData((Number(data) + 0.5).toFixed(1))
        // }, 1000);
        // return () => clearInterval(interval);
    }, [data]);

    // FUNÇÃO PARA FECHAR O MODAL

    // const hideModal = () => {
    //     setModalVisible(false)
    // }

    // useEffect(() => {
    //     if (data === totalData) {
    //         hideModal()
    //     }
    // }, [data])


    // USEEFFECT PARA COLOCAR OS DADOS TOTAIS DO DOWNLOAD
    useEffect(() => {
        setTotalData('16')
    }, [])


    return (
        <View style={styles.modal}>
            <View style={styles.modalContainer}>

                <View style={styles.ViewTexts}>
                    <Text style={[styles.textModal, { fontWeight: 'bold'}]}>
                        Aguarde!
                    </Text>
                </View>

                <View style={[styles.ViewTexts, { marginTop: "5%" }]}>
                    <Text style={[styles.textModal]}>
                            Estamos validando as imagens pendentes de confirmação.
                    </Text>
                    <Text style={[styles.textDownload, {marginTop: '7%'}]}>
                        Validando: {data} MB de {totalData} MB({(Number(data)/Number(totalData)*100).toFixed(0)}%)
                    </Text>
                </View>

                </View>
            </View>
    )
}