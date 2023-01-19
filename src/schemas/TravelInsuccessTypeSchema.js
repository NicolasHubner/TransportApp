import { Realm } from '@realm/react';

export const TravelInsuccessTypeSchema = {
  name: "TravelInsuccessType",
  primaryKey: "value",
  properties: {
    value: "int",
    label: "string?"
  },
};