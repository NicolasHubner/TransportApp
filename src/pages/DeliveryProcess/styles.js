import { StyleSheet, Dimensions } from "react-native";
import colors from "../../utils/colors";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  header: {
    flex: 1,
    width: "100%",
  },

  body: {
    flex: 15,
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },

  rectangle: {
    width: "100%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary1,
  },

  marginRectangle: {
    width: "92%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    marginTop: "5%",
    fontSize: 16,
    fontWeight: "700",
    color: colors.backgroundHeader,
  },
  
  card: {
    position: "absolute",
    height: "80%",
    width: "92%",
    marginVertical: "17%",
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

  margin: {
    flex: 1,
    alignItems: "center",
    marginVertical: "5%",
    justifyContent: "space-between",
  },

  infoContainer: {
    height: '20%',
    width: '90%',
  },

  cardContainer: {
    height: '60%',
    width: '94%',
    alignItems: "center",
    borderColor: "#D0D0D0",
    borderBottomWidth: 1
  },
  
  finishContainer: {
    paddingTop: '3%',
    height: '20%',
    width: '90%',
  },

  nameContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  name: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "700",
    color: colors.text,
  },

  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: '5%',
  },

  contato: {
    width: '35%',
    height: 40,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    flexDirection: "row",
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

  cardButton: {
    width: '96%',
    height: 85,
    alignItems: "center",
    marginHorizontal: '2%',
    marginVertical: 8,
    flexDirection: "row",
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

  contatoImage: {
    width: 23,
    height: 18
  },

  houseImage: {
    width: "50%",
    // height: 40,
    resizeMode: "contain"
  },
  
  cameraImage: {
    width: '50%',
    // height: 60,
    resizeMode: "contain"
  },

  titleCard: {
    fontSize: 16,
    fontWeight: "700"
  },

  button: {
    height: 40,
  },

  buttonReport: {
    borderWidth: 2,
    borderColor: colors.button,
    marginTop: 15,
  },

  footer: {
    flex: 1,
    width: "100%",
  },

  modalLocal: {
    alignItems: "center",
    justifyContent:"space-around",
    width: '92%',
    height: '72%',
    backgroundColor: "white",
    padding: '5%',
    elevation: 5,
    borderRadius: 5,
  },

  modalContato: {
    alignItems: "center",
    justifyContent:"space-between",
    width: '85%',
    height: '50%',
    backgroundColor: "white",
    padding: '5%',
    elevation: 5,
    borderRadius: 20,
  },

  contactContainer: {
    flexDirection: "row",
    alignItems: "flex-start"
  },

  closeModal: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContato: {
    fontWeight: "700",
    fontSize: 16,
  },

  contactButtons: {
    width: '100%',
    height: '30%',
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: 'red'
  },

  buttonCard: {
    width: '30%',
    height: '100%',
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
    width: '35%',
    height: '85%',
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: 'white'
  },

  textConfirmed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#004757"
  },

  textModal: {
    fontSize: 22,
  },

  image: {
    resizeMode: "contain",
    width: 187,
    height: 145
  },

  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalOcr: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    height: "40%",
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  buttonModal: {
    width: '100%',
  },

  informationNull: {
    width: '100%',
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
  },
  
  modalOcrInsuccess: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "92%",
    // height: '72%',
    backgroundColor: "white",
    padding: "5%",
    elevation: 5,
    borderRadius: 5,
  },

  motivoContainer: {
    width: "100%",
    marginTop: "5%",
  },

  textBody: {
    color: colors.icon,
    marginBottom: 5,
  },

  pickerSelect: {
    width: "100%",
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    justifyContent: "center",
  },

  titleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ocrTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.icon,
  },

  descriptionContainer: {
    width: "100%",
    marginTop: "5%",
  },

  textInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 5,
  },

  buttonContainer: {
    width: "100%",
    marginTop: "8%",
  },
});
