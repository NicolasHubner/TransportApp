import React, { useState } from "react";
import { View, Text, Image, ImageBackground, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Checkbox } from "react-native-paper";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import colors from "../../utils/colors";

export default function ControlledRoute({ navigation }) {
  const [isBusy, setIsBusy] = useState(false);
  const [hasTrip, setHasTrip] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Header />
      </View>
      <View style={styles.body}>
        <View style={styles.rectangle}>
          <View style={styles.marginRectangle}>
            <Text style={styles.title}>Detalhes da viagem</Text>
            <Text style={styles.title}>Rota Livre</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.status, { marginBottom: 8 }]}>
            <Text style={styles.textSansRegular}>PENDENTE</Text>
            <Text style={styles.textSansBold}>Fev 01, 2022</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
