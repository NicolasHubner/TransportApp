import { TravelMissionSchema } from "../schemas/TravelMissionSchema";
import { Dao } from "./Dao";

export class TravelMissionDao extends Dao {
    static tableName = TravelMissionSchema.name;
    
    static async createOrUpdate({
        id,
        uuid,
        user_id,
        contact_id,
        travel_local_id,
        travel_local_uuid,
        confirmed,
        type,
        complement,
        quantity,
        description,
        status,
        failure_reasons_id,
        failure_reason,
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            id: id,
            uuid: uuid,
            user_id: user_id,
            contact_id: contact_id,
            travel_local_id: travel_local_id,
            travel_local_uuid: travel_local_uuid,
            confirmed: confirmed,
            type: type,
            complement: complement,
            quantity: quantity,
            description: description,
            status: status,
            failure_reasons_id: failure_reasons_id,
            failure_reason: failure_reason,
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
                myObject.uuid = uuid;
                myObject.user_id = user_id;
                myObject.contact_id = contact_id;
                myObject.travel_local_id = travel_local_id;
                myObject.travel_local_uuid = travel_local_uuid;
                myObject.confirmed = confirmed;
                myObject.type = type;
                myObject.complement = complement;
                myObject.quantity = quantity;
                myObject.description = description;
                myObject.status = status;
                myObject.failure_reasons_id = failure_reasons_id;
                myObject.failure_reason = failure_reason;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }

    static async getAllByLocal(ids) {
        console.log(ids);
        const context = await this.getContext();
        //const condition = ids.map((id) => 'travel_local_id == ' + id).join(' OR ');
        const condition = ids.join(',');
        return context.objects(this.tableName).filtered(`travel_local_id in {${condition}}`);
    }

    static async getNextMissionPending(id, localsId) {
        const context = await this.getContext();
        // const condition = localsId.map((id) => 'travel_local_id == ' + id).join(' OR ')
        const condition = localsId.join(',');
        return context.objects(this.tableName).filtered(`status == 'pending' AND id != ${id} AND travel_local_id in {${condition}} `);
    }

    static async getMissionFailed(localsId) {
        const context = await this.getContext();
        // const condition = localsId.map((id) => 'travel_local_id == ' + id).join(' OR ')
        const condition = localsId.join(',');
        return context.objects(this.tableName).filtered(`status == 'failed' AND travel_local_id in {${condition}}`);
    }

    static async getMissionsNotConfirmed(localsId) {
        const context = await this.getContext();
        const condition = localsId.join(',');
        return context.objects(this.tableName).filtered(`confirmed == 0 AND travel_local_id in {${condition}}`);
    }
}