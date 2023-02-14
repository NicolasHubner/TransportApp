import { EventSchema } from "../schemas/EventSchema";
import { LocationsSchema } from "../schemas/LocationSchema";
import { TravelContactSchema } from "../schemas/TravelContactSchema";
import { TravelDocumentSchema } from "../schemas/TravelDocumentSchema";
import { TravelInsuccessTypeSchema } from "../schemas/TravelInsuccessTypeSchema";
import { TravelLocalSchema } from "../schemas/TravelLocalSchema";
import { TravelMissionSchema } from "../schemas/TravelMissionSchema";
import { TravelSchema } from "../schemas/TravelSchema";

export const getRealmContext = async() => await Realm.open({
    path: "myrealm",
    schema: [
      LocationsSchema, 
      TravelContactSchema,
      TravelDocumentSchema,
      TravelLocalSchema,
      TravelMissionSchema,
      TravelSchema,
      TravelInsuccessTypeSchema,
      EventSchema 
    ],
  });