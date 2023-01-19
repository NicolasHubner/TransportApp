import { TravelContactSchema } from "../schemas/TravelContactSchema";
import { Dao } from "./Dao";

export class TravelContactDao extends Dao {
    static tableName = TravelContactSchema.name;
    
    static async createOrUpdate({
        id,
        uuid,
        location_owner_id,
        name,
        email,
        cell_phone,
        telephone_1,
        telephone_2,
        telephone_3,
        observation,
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            id: id,
            uuid: uuid,
            location_owner_id: location_owner_id,
            name: name,
            email: email,
            cell_phone: cell_phone,
            telephone_1: telephone_1,
            telephone_2: telephone_2,
            telephone_3: telephone_3,
            observation: observation,
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
                myObject.uuid = uuid;
                myObject.location_owner_id = location_owner_id;
                myObject.name = name;
                myObject.email = email;
                myObject.cell_phone = cell_phone;
                myObject.telephone_1 = telephone_1;
                myObject.telephone_2 = telephone_2;
                myObject.telephone_3 = telephone_3;
                myObject.observation = observation;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }

    static async getAllByLocal(id) {
        const context = await this.getContext();
        const result = context.objects(this.tableName).filtered(`location_owner_id = ${id}`);
        return result;
    }

    static async findFirstByLocal(id) {
        const context = await this.getContext();
        const result = context.objects(this.tableName).filtered(`location_owner_id = ${id}`);

        return result[0];
    }
}