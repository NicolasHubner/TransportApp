import { getRealmContext } from "../contexts/RealmContext";

export class LocationDao {
    static #tableName = "Locations";
    
    static async save(lat,lng, speed, batteryStatus, gpsStatus, networkStatus, appStatus, date){
        const realmContext = await getRealmContext();
        realmContext.write(() => {
            realmContext.create(this.#tableName, {
                lat: lat,
                lng: lng,
                speed: speed,
                batteryStatus: batteryStatus,
                gpsStatus: gpsStatus,
                networkStatus: networkStatus,
                appStatus: appStatus,
                date: date
            })
        });
        
        realmContext.close();
    }

    static async getTop(top) {
        const realmContext = await getRealmContext();
        return realmContext.objects(this.#tableName).slice(0,top);
    }

    static async deleteList(list) {
        const realmContext = await getRealmContext();
        realmContext.write(() => {
            realmContext.delete(list);
        });
        realmContext.close();
    }
}