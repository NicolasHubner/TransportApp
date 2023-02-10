export const USE_TERMS = "@Config:termoDeUso";
export const REGISTER = "@Config:registroUsuario";
export const LOGGED = "@Config:manterLogado";
export const USER_DATA = "@Config:dadosUsuario";
export const TOKEN_KEY = "@Config:token";
export const USER_ID = "@Config:usuarioId";
export const APP_NAVIGATION = "@Config:appNavegacao";
export const IMAGE_RECEIPT = "@Config:imageReceipt";
export const IMAGE_PHOTO = "@Config:imagePhoto";
export const CONNECTED = "@Config:keepConnected";
export const LOCAL_COORD = "@Config:localCoords";
export const LAST_LOCATION = "@Config:lastLocation";
export const ARRAY_LOCATION = "@Config:arrayLocation";
export const GPS_STATUS = "@Config:gpsStatus";
export const LOCAL_ID = "@Config:LocalId";
export const TRAVEL_ID = "@Config:TravelId";
export const ARRIVAL_NOTIFICATION = "@Config:ArrivalNotification";
export const MERGED_LOCALS = "@Config:MergedLocals";
export const DESTINY_PAGE = "@Config:DestinyPage";

export const LOCATION_TASK_NAME = "background-location-task";

export const OCR_KEY = "94ed28dd2f88957";

export const REGISTER_STRUCT = (
  {
    "first_name": null,
    "last_name": null,
    "cpf": null,
    "email": null,
    "email_confirmation": null,
    "password": null,
    "password_confirmation": null,
    "terms_of_use": "false",
  }
);

export const TRAVEL_STATUS = {
  0: 'EM ANDAMENTO',
  1: 'PENDENTE',
  2: 'CONCLUIDO',
  3: 'CANCELADO'
}

export const LOCAL_STATUS = {
  0: 'em andamento',
  1: 'pendente',
  2: 'concluido'
};

export const MISSION_STATUS = {
  0: 'pending',
  1: 'success',
  2: 'failed'
};

export const EVENT_TYPE = {
  LOCAL_CHANGE_STATUS: 0,
  MISSION_CHANGE_STATUS: 1,
  TRAVEL_CHANGE_STATUS: 2,
  NEXT_STEP: 3,
  NO_ACTION: 4
};