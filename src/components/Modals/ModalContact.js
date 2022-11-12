import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import StorageController from "../../controllers/StorageController";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LAST_LOCATION } from "../../constants/constants";
import { Button, RadioButton } from "react-native-paper";
// import apiFormData from "../../services/apiFormData";
import colors from "../../utils/colors";
import { api, apiFormData } from "../../services/api";
import { format } from "date-fns";

export default function ModalContact({
  hideModal,
  insucesso,
  local,
  token,
  func,
  func2,
}) {
  const [checked, setChecked] = useState(0);
  const [saveIsLoading, setSaveIsLoading] = useState(false);

  let contact = null;
  let contactPhones = [];

  if (local?.contact) {
    contact = local?.contact;
  }
  if (
    contact.cell_phone ||
    contact.telephone_1 ||
    contact.telephone_2 ||
    contact.telephone_3
  ) {
    if (contact.cell_phone) {
      contactPhones.push(contact.cell_phone);
    }
    if (contact.telephone_1) {
      contactPhones.push(contact.telephone_1);
    }
    if (contact.telephone_2) {
      contactPhones.push(contact.telephone_2);
    }
    if (contact.telephone_3) {
      contactPhones.push(contact.telephone_3);
    }
  }

  // CONFIGURA O LINK DO WHATSAPP
  async function sendWhatsappMessage(phone) {
    try {
      let supported = Linking.canOpenURL("whatsapp://send?text=oi");
      if (supported) {
        return Linking.openURL(`whatsapp://send?phone=${phone}`);
      } else {
        return Linking.openURL(`https://api.whatsapp.com/send?phone=${phone}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // ATUALIZA O STATUS DA MISSÃO
  async function confirmMission() {
    setSaveIsLoading(true);
    try {
      const response = await api.put(
        `/app/travel/local/${local.id}/confirmed`, {},
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response) {
        if (func) {
          await func();
        }
        await hideModal();
      }
    } catch (error) {
      // console.log(error.response.data);
      if (error.response) {
        Alert.alert("AVISO", error.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("AVISO", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setSaveIsLoading(false);
    }
  }

  // ATUALIZA OS DADOS DA MISSÃO
  async function missionReview() {
    setSaveIsLoading(true);
    try {
      let lastLocation = await StorageController.buscarPorChave(LAST_LOCATION);
      if (lastLocation) {
        lastLocation = JSON.parse(JSON.parse(lastLocation));
      }

      let data = new FormData();
      data.append(`data[0][status]`, "pending");
      data.append(`data[0][haveImg]`, "false");
      data.append(`data[0][lat]`, lastLocation?.lat);
      data.append(`data[0][long]`, lastLocation?.long);
      data.append(
        `data[0][event_at]`,
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      );

      const response = await apiFormData.post(
        `/app/travel/local/${local.id}/changeMission`,
        data,
        { headers: { Authorization: `bearer ${token}` } }
      );

      const responseLocal = await api.post(
        `/app/travel/local/${local.travel_local_id}/change-status`,
        { status: "EM ANDAMENTO", uuid_group: false },
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (response.data.success == "true") {
        if (responseLocal.data.success == "true") {
          if (func2) {
            func2();
          }
          if (func) {
            func();
          }
        } else {
          Alert.alert("AVISO", response.data.data.msg, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      } else {
        console.log(responseLocal.data.data);
        Alert.alert("AVISO", response.data.data.msg, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("AVISO", error.response.data.errors[0], [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert("AVISO", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    } finally {
      setSaveIsLoading(false);
    }
  }

  return (
    <View style={styles.modal}>
      <View style={styles.modalContato}>
        <View style={styles.closeModal}>
          <Text style={styles.textContato}>Contato</Text>
          <Pressable onPress={hideModal}>
            <MaterialCommunityIcons
              name="close"
              size={25}
              color="#000000"
              onPress={hideModal}
            />
          </Pressable>
        </View>
        {saveIsLoading && (
          <View style={styles.informationNull}>
            <ActivityIndicator size="large" color="#2E2E2E" />
            <Text style={styles.textInformationNull}>
              Aguarde, atualizando dados da viagem...
            </Text>
          </View>
        )}
        {!saveIsLoading && (
          <>
            {contactPhones.length == 0 && (
              <View style={styles.informationNull}>
                <Text style={styles.textInformationNull}>
                  Não há informações de contato cadastrado
                </Text>
              </View>
            )}
            {contactPhones.length > 0 && (
              <>
                <View style={{ width: "100%", justifyContent: "flex-start" }}>
                  {contactPhones?.map((value, index) => (
                    <View key={index} style={styles.contactContainer}>
                      <RadioButton
                        value={index}
                        color="#004757"
                        status={checked === index ? "checked" : "unchecked"}
                        onPress={() => setChecked(index)}
                      />
                      <Text style={styles.textConfirmed}>{value}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.contactButtons}>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(`tel:${contactPhones[checked]}`)
                    }
                    style={styles.buttonCard}
                  >
                    <MaterialCommunityIcons
                      name="phone-outline"
                      size={45}
                      color="#275D85"
                    />
                    <Text>Ligar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => sendWhatsappMessage(contactPhones[checked])}
                    style={styles.buttonCard}
                  >
                    <MaterialCommunityIcons
                      name="whatsapp"
                      size={45}
                      color="#275D85"
                    />
                    <Text>Whatsapp</Text>
                  </Pressable>
                </View>
                <View style={styles.contactButtons}>
                  <Pressable
                    disabled={saveIsLoading}
                    onPress={insucesso ? missionReview : confirmMission}
                    style={styles.buttonConfirmed}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={50}
                      color="#4FB438"
                    />
                    <Text style={styles.textConfirmed}>Confirmado</Text>
                  </Pressable>
                  <Pressable onPress={hideModal} style={styles.buttonConfirmed}>
                    <MaterialCommunityIcons
                      name="close"
                      size={50}
                      color="#E23E5C"
                    />
                    <Text style={styles.textConfirmed}>Não confirmado</Text>
                  </Pressable>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContato: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    height: "60%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 20,
  },

  closeModal: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textInformationNull: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },

  informationNull: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  textContato: {
    fontWeight: "700",
    fontSize: 16,
  },

  contactButtons: {
    width: "100%",
    height: "22%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  buttonCard: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  buttonConfirmed: {
    width: "45%",
    height: "85%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
  },

  textConfirmed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#004757",
  },
});
