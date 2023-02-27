import { TravelSchema } from "../schemas/TravelSchema";
import { Dao } from "./Dao";
import { TravelLocalDao } from "./TravelLocalDao";
import { TravelMissionDao } from "./TravelMissionDao";

export class TravelDao extends Dao {
    static tableName = TravelSchema.name;
    
    static async createOrUpdate({
        id,
        uuid,
        user_id,
        cpf,
        date,
        start_schedule,
        exit_schedule,
        finish_schedule,
        origin_name,
        destiny_name,
        observation,
        qty_local,
        distance,
        completed_locals,
        total_locals,
        origin_id,
        origin_latitude,
        origin_longitude,
        origin_type,
        status,
        not_confirmed,
        icon,
        is_late,
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            id: id,
            uuid: uuid,
            user_id: user_id,
            cpf: cpf,
            date: date,
            start_schedule: start_schedule,
            exit_schedule: exit_schedule,
            finish_schedule: finish_schedule,
            origin_name: origin_name,
            destiny_name: destiny_name,
            observation: observation,
            qty_local: qty_local,
            distance: distance,
            completed_locals: completed_locals,
            total_locals: total_locals,
            origin_id: origin_id,
            origin_latitude: origin_latitude,
            origin_longitude: origin_longitude,
            origin_type: origin_type,
            status: status,
            not_confirmed: not_confirmed,
            icon: icon,
            is_late: is_late,
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
                myObject.uuid = uuid;
                myObject.user_id = user_id;
                myObject.cpf = cpf;
                myObject.date = date;
                myObject.start_schedule = start_schedule;
                myObject.exit_schedule = exit_schedule;
                myObject.finish_schedule = finish_schedule;
                myObject.origin_name = origin_name;
                myObject.destiny_name = destiny_name;
                myObject.observation = observation;
                myObject.qty_local = qty_local;
                myObject.distance = distance;
                myObject.completed_locals = completed_locals;
                myObject.total_locals = total_locals;
                myObject.origin_id = origin_id;
                myObject.origin_latitude = origin_latitude;
                myObject.origin_longitude = origin_longitude;
                myObject.origin_type = origin_type;
                myObject.status = status;
                myObject.not_confirmed = not_confirmed;
                myObject.icon = icon;
                myObject.is_late = is_late;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }

    static async getAll() {
        const realmContext = await this.getContext();
        let result = realmContext.objects(this.tableName);
        result = JSON.parse(JSON.stringify(result));

        for(let travel of result) {
            let locals = await TravelLocalDao.getAllByTravel(travel.id);
            locals = JSON.parse(JSON.stringify(locals));
            travel.not_confirmed = 0;

            for(let local of locals) {
                let missionsNotConfirmed = await TravelMissionDao.getMissionsNotConfirmed(local.merged.split(','));
                travel.not_confirmed += missionsNotConfirmed.length;
            }
        }

        return result;
    }

    static async findById(id) {
        const realmContext = await this.getContext();
        let travel = realmContext.objectForPrimaryKey(this.tableName, id);
        travel = JSON.parse(JSON.stringify(travel));

        let locals = await TravelLocalDao.getAllByTravel(travel.id);
        locals = JSON.parse(JSON.stringify(locals));
        travel.not_confirmed = 0;

        for(let local of locals) {
            let missionsNotConfirmed = await TravelMissionDao.getMissionsNotConfirmed(local.merged.split(','));
            travel.not_confirmed += missionsNotConfirmed.length;
        }

        return travel;
    }
}