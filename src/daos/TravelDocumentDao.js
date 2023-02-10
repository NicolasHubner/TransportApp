import { TravelDocumentSchema } from "../schemas/TravelDocumentSchema";
import { Dao } from "./Dao";

export class TravelDocumentDao extends Dao {
    static tableName = TravelDocumentSchema.name;
    
    static async createOrUpdate({
        id,
        travel_local_id,
        travels_locals_missions_files_id,
        orderId,
        orderNumber,
        invoiceId,
        invoiceNumber,
        failure_reasons_id,
        failure_reasons,
        invoiceObservation,
        status,
        quantity,
        mission_id
    }) {
        const realmContext = await this.getContext();
        const dataObj = {
            id: id,
            travel_local_id: travel_local_id,
            travels_locals_missions_files_id: travels_locals_missions_files_id ?? 0,
            orderId: orderId,
            orderNumber: orderNumber,
            invoiceId: invoiceId,
            invoiceNumber: invoiceNumber,
            failure_reasons_id: failure_reasons_id ?? 0,
            failure_reasons: failure_reasons,
            invoiceObservation: invoiceObservation,
            status: status,
            quantity: quantity,
            mission_id: mission_id
        };
        realmContext.write(() => {
            const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
            if(myObject) {
                const myObject = realmContext.objectForPrimaryKey(this.tableName, dataObj.id);
                myObject.travel_local_id = travel_local_id;
                myObject.travels_locals_missions_files_id = travels_locals_missions_files_id ?? 0;
                myObject.orderId = orderId;
                myObject.orderNumber = orderNumber;
                myObject.invoiceId = invoiceId;
                myObject.invoiceNumber = invoiceNumber;
                myObject.failure_reasons_id = failure_reasons_id ?? 0;
                myObject.failure_reasons = failure_reasons;
                myObject.invoiceObservation = invoiceObservation;
                myObject.status = status;
                myObject.quantity = quantity;
                myObject.mission_id = mission_id;
            }
            else {
                realmContext.create(this.tableName, dataObj);
            }
        });
    }

    static async getAllByLocal(id) {
        const context = await this.getContext();
        return context.objects(this.tableName).filtered(`travel_local_id = ${id}`);
    }

    static async getAllByMission(id) {
        const context = await this.getContext();
        return context.objects(this.tableName).filtered(`mission_id = ${id}`);
    }
}