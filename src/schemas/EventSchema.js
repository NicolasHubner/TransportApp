import { Realm } from "@realm/react";

export const EventSchema = {
  name: "Event",
  primaryKey: "id",
  properties: {
    id: "string",
    url: "string",
    request: "string",
    datetime: "date",
  },
};