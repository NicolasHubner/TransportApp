// Alterações:
//
//   Tiaki - 20.12.2022
//         - adição de parametros (accuracy, altitude, altitudeAccuracy, direction)

import { LocationsSchema } from "../schemas/LocationSchema";
import { Dao } from "./Dao";

export class LocationDao extends Dao {
    static tableName = LocationsSchema.name;

    static async save(lat, lng, speed, batteryStatus, gpsStatus, networkStatus, appStatus, date, accuracy, altitude, altitudeAccuracy, direction) {
        const realmContext = await this.getContext();
        realmContext.write(() => {
            realmContext.create(this.tableName, {
                lat: lat,
                lng: lng,
                speed: speed,
                batteryStatus: batteryStatus,
                gpsStatus: gpsStatus,
                networkStatus: networkStatus,
                appStatus: appStatus,
                date: date,
                accuracy: accuracy,
                altitude: altitude,
                altitudeAccuracy: altitudeAccuracy,
                direction:direction
            })
        });

        realmContext.close();
    }

}