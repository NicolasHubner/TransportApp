import { EventSchema } from "../schemas/EventSchema";
import { Dao } from "./Dao";

export class EventDao extends Dao {
    static tableName = EventSchema.name;

    static async save({url, request}) {
        const realmContext = await this.getContext();
        realmContext.write(() => {
            realmContext.create(this.tableName, {
                url: url,
                request: request,
                datetime: new Date(),
            })
        });
    }
}