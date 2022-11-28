import { LocationsSchema } from "../schemas/LocationSchema";

export const getRealmContext = async() => await Realm.open({
    path: "myrealm",
    schema: [LocationsSchema],
  });