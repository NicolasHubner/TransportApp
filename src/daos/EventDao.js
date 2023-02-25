import { EventSchema } from "../schemas/EventSchema";
import { Dao } from "./Dao";
import { Realm } from '@realm/react'

export class EventDao extends Dao {
    static tableName = EventSchema.name;

    static async save(url, request) {
        const realmContext = await this.getContext();
        realmContext.write(() => {
            realmContext.create(this.tableName, {
                id: this.generateUUID(),
                url: url,
                request: request,
                datetime: new Date(),
            })
        });
    }

    static async deleteList(array) {
        for(obj of array) {
            console.log("event", obj.id)
            await this.delete(obj.id);
        }
    }
}