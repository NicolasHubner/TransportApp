import { Realm } from "@realm/react";

export const TravelMissionSchema = {
  name: "TravelMission",
  primaryKey: "id",
  properties: {
    id: "int",
    uuid: "string?",
    user_id: "int",
    contact_id: "int?",
    travel_local_id: "int",
    travel_local_uuid: "string?",
    confirmed: {type: "int", default: 0},
    type: "string?",
    complement: "string?",
    quantity: {type: "int", default: 0},
    description: "string?",
    status: "string?",
    failure_reasons_id: "int?",
    failure_reason: "string?",
  },
};
