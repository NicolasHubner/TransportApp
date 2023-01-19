import { Realm } from "@realm/react";

export const TravelContactSchema = {
  name: "TravelContact",
  primaryKey: "id",
  properties: {
    id: "int",
    uuid: "string?",
    location_owner_id: "int",
    name: "string?",
    email: "string?",
    cell_phone: "string?",
    telephone_1: "string?",
    telephone_2: "string?",
    telephone_3: "string?",
    observation: "string?",
  },
};
