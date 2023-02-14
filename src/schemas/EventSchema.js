import { Realm } from "@realm/react";

export const EventSchema = {
  name: "Event",
  primaryKey: "id",
  properties: {
    id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
    url: "string?",
    request: "string?",
    datetime: "date",
  },
};