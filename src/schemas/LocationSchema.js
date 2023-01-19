// Alterações:
//
//   Tiaki - 20.12.2022
//         - adição de parametros (accuracy, altitude, altitudeAccuracy, direction)

import { Realm } from '@realm/react';

export const LocationsSchema = {
  name: "Locations",
  primaryKey: "_id",
  properties: {
    _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
    lat: { type: "double", default: 0.0 },
    lng: { type: "double", default: 0.0 },
    speed: { type: "double", default: 0.0 },
    appStatus: "string",
    gpsStatus: { type: "int", default: 0 },
    batteryStatus: { type: "int", default: 0 },
    networkStatus: "string",
    date: "string",
    accuracy: { type: "double", default: 0.0 },                      //new
    altitude: { type: "double", default: 0.0 },                      //new
    altitudeAccuracy: { type: "double", default: 0.0 },              //new
    direction: { type: "double", default: 0.0 }                      //new
  },
};

