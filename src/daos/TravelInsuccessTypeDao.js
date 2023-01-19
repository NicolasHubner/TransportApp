import { TravelInsuccessTypeSchema } from "../schemas/TravelInsuccessTypeSchema";
import { Dao } from "./Dao";

export class TravelInsuccessTypeDao extends Dao {
    static tableName = TravelInsuccessTypeSchema.name;

    static async createOrUpdate({
        value,
        label,
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            value: value,
            label: label,
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.value);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.value);
                myObject.label = label;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }
}