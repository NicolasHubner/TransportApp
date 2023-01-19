import { TravelLocalSchema } from "../schemas/TravelLocalSchema";
import { Dao } from "./Dao";

export class TravelLocalDao extends Dao {
    static tableName = TravelLocalSchema.name;
    
    static async createOrUpdate({
        id,
        travel_id,
        uuid,
        location_sequence,
        location_description,
        location_type_id,
        location_type_description,
        location_latitud,
        location_longitud,
        estimated_time,
        location_owner_id,
        location_owner_name,
        location_arrive_schedule,
        location_depart_schedule,
        address,
        observation,
        status,
        start,
        end,
        date,
        merged,
        qty_delivery,
        qty_collect,
        not_confirmed = 0,
        total_missions,
        confirmed_missions,
        status_missions = "",
        wazer,
        google_maps,
        apple_maps,
        icon,
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            id: id,
            travel_id: travel_id,
            uuid: uuid,
            location_sequence: location_sequence,
            location_description: location_description,
            location_type_id: location_type_id,
            location_type_description: location_type_description,
            location_latitud: location_latitud,
            location_longitud: location_longitud,
            estimated_time: estimated_time,
            location_owner_id: location_owner_id,
            location_owner_name: location_owner_name,
            location_arrive_schedule: location_arrive_schedule,
            location_depart_schedule: location_depart_schedule,
            address: address,
            observation: observation,
            status: status,
            start: start,
            end: end,
            date: date,
            merged: merged,
            qty_delivery: qty_delivery,
            qty_collect: qty_collect,
            not_confirmed: not_confirmed,
            total_missions: total_missions,
            confirmed_missions: confirmed_missions,
            status_missions: status_missions,
            wazer: wazer,
            google_maps: google_maps,
            apple_maps: apple_maps,
            icon: icon,
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
                myObject.travel_id = travel_id;
                myObject.uuid = uuid;
                myObject.location_sequence = location_sequence;
                myObject.location_description = location_description;
                myObject.location_type_id = location_type_id;
                myObject.location_type_description = location_type_description;
                myObject.location_latitud = location_latitud;
                myObject.location_longitud = location_longitud;
                myObject.estimated_time = estimated_time;
                myObject.location_owner_id = location_owner_id;
                myObject.location_owner_name = location_owner_name;
                myObject.location_arrive_schedule = location_arrive_schedule;
                myObject.location_depart_schedule = location_depart_schedule;
                myObject.address = address;
                myObject.observation = observation;
                myObject.status = status;
                myObject.start = start;
                myObject.end = end;
                myObject.date = date;
                myObject.merged = merged;
                myObject.qty_delivery = qty_delivery;
                myObject.qty_collect = qty_collect;
                myObject.not_confirmed = not_confirmed;
                myObject.total_missions = total_missions;
                myObject.confirmed_missions = confirmed_missions;
                myObject.status_missions = status_missions;
                myObject.wazer = wazer;
                myObject.google_maps = google_maps;
                myObject.apple_maps = apple_maps;
                myObject.icon = icon;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }

    static async getAllByTravel(id) {
        const context = await this.getContext();
        return context.objects(this.tableName).filtered(`travel_id = ${id} AND location_type_description != 'ORIGEM' && location_type_description != 'DESTINO'`);
    }

    static async checkPendentByTravel(id) {
        const context = await this.getContext();
        const objects = context.objects(this.tableName).filtered(`travel_id = ${id} AND status = 'PENDENTE'`);

        return objects.length > 0;
    }

    static async findById(id) {
        const context = await this.getContext();
        const objects = context.objects(this.tableName).filtered(`id == ${id} OR merged CONTAINS '${id}'`);
        return objects.length > 0 ? objects[0] : null;
    }
}