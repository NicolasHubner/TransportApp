import { Realm } from "@realm/react";

export const TravelDocumentSchema = {
  name: "TravelDocument",
  primaryKey: "id",
  properties: {
    id: "int",
    travel_local_id: {type: "int", default: 0},
    travels_locals_missions_files_id: {type: "int", default: 0},
    orderId: {type: "int", default: 0},
    orderNumber: "string?",
    invoiceId: {type: "int", default: 0},
    invoiceNumber: "string?",
    failure_reasons_id: {type: "int", default: 0},
    failure_reasons: "string?",
    invoiceObservation: "string?",
    status: "string?",
    quantity: {type: "int", default: 0},
  },
};
