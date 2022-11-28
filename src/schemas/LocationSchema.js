import {Realm} from '@realm/react';

export const LocationsSchema = {
  name: "Locations",
  primaryKey: "_id",
  properties: {
    _id: {type: "objectId", default: () => new Realm.BSON.ObjectId()},
    lat: {type: "double", default: 0.0},
    lng: {type: "double", default: 0.0},
    speed: {type: "int", default: 0.0},
    appStatus: "string",
    gpsStatus: {type: "int", default: 0},
    batteryStatus: {type: "int", default: 0},
    networkStatus: "string",
    date: "string"
  },
};

