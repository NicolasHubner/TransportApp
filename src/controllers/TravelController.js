import reactotron from "reactotron-react-native";
import { Dao } from "../daos/Dao";
import { EventDao } from "../daos/EventDao";
import { TravelContactDao } from "../daos/TravelContactDao";
import { TravelDao } from "../daos/TravelDao";
import { TravelDocumentDao } from "../daos/TravelDocumentDao";
import { TravelInsuccessTypeDao } from "../daos/TravelInsuccessTypeDao";
import { TravelLocalDao } from "../daos/TravelLocalDao";
import { TravelMissionDao } from "../daos/TravelMissionDao";
import { api } from "../services/api";

export class TravelController {
  static async getTravels(token) {
    let outError = null;
    const testEvent = await EventDao.getTop(1);

    if (testEvent.length == 0) {
      try {
        const response = await api.get("/travels", {
          headers: { Authorization: `bearer ${token}` },
        });

        if (response.data.success && response.data.data.length > 0) {
          const context = await Dao.getContext();
          context.beginTransaction();
          context.deleteAll();
          context.commitTransaction();

          for (element of response.data.data) {
            await TravelController.getTravel(token, element.id);
          }
        }
      } catch (error) {
        console.log("getTravels", error);
        outError = error;
      }

      await this.getInsuccessType(token, 1);
      await this.getInsuccessType(token, 2);
    }

    const output = await TravelDao.getAll();

    if (output.length == 0 && outError != null) {
      throw outError;
    }

    return JSON.parse(JSON.stringify(output));
  }

  static async getTravel(token, id) {
    const testEvent = await EventDao.getTop(1);

    if (testEvent.length == 0) {
      const response = await api.get(`/travel/${id}`, {
        headers: { Authorization: `bearer ${token}` },
      });

      if (response.data.success && response.data.data) {
        const travel = response.data.data;
        await TravelDao.createOrUpdate(travel);

        console.log(travel.locals.length);

        for (const local of travel.locals) {
          local.merged = local.merged?.toString();
          local.icon = travel.icon;
          await TravelLocalDao.createOrUpdate(local);

          for (const mission of local.missions) {
            await TravelMissionDao.createOrUpdate(mission);
          }

          for (const document of local.documents) {
            await TravelDocumentDao.createOrUpdate(document);
          }

          for (const contact of local.contacts) {
            await TravelContactDao.createOrUpdate(contact);
          }
        }
      }
    }
  }

  static async getTravelsDetails(token, id) {
    console.log("getTravelsDetails");
    let outError = null;
    try {
      await this.getTravel(token, id);
    } catch (error) {
      console.log(error);
      outError = error;
    } finally {
      const output = await TravelDao.findById(id);
      if (output.length == 0 && outError != null) {
        throw outError;
      }

      return JSON.parse(JSON.stringify(output));
    }
  }

  static async getTravelNavigation(token, id) {
    console.log("getTravelNavigation");
    let result = {
      sucess: true,
      totalEstimatedTime: 0,
      totalCollect: 0,
      totalDelivery: 0,
      travel: {},
      travelsLocal: [],
    };

    try {
      await this.getTravel(token, id);
    } catch (error) {
      console.log(error);
      outError = error;
    }

    result.travel = await TravelDao.findById(id);
    result.travelsLocal = await TravelLocalDao.getAllByTravel(id);

    if (result.travelsLocal.length > 0) {
      result.travelsLocal.forEach((local) => {
        result.totalCollect =
          local.qty_collect > 0
            ? result.totalCollect + local.qty_collect
            : result.totalCollect;
        result.totalDelivery =
          local.qty_delivery > 0
            ? result.totalDelivery + local.qty_delivery
            : result.totalDelivery;
      });
    }

    reactotron.log(result);

    return JSON.parse(JSON.stringify(result));
  }

  static async getLocalNavigation(token, id) {
    console.log("getLocalNavigation", token, id);
    let result = {
      sucess: true,
      has_mission: true,
      data: {},
    };

    try {
      const local = await TravelLocalDao.findById(id);
      await this.getTravel(token, local.travel_id);
    } catch (error) {
      console.log(error);
      outError = error;
    }

    result.data = await TravelLocalDao.findById(id);
    const idsMerged = result.data.merged.split(",");

    if (result.data.type == "ORIGEM" || result.data.type == "DESTINO") {
      result.has_mission = false;
    } else {
      result.has_mission =
        (await TravelMissionDao.getAllByLocal(idsMerged))?.length > 0;
    }

    return JSON.parse(JSON.stringify(result));
  }

  static async getLocalMissions(token, id) {
    console.log("getLocalMissions");
    let result = {
      travel_id: 0,
      local: {},
      missions: [],
    };

    try {
      const local = await TravelLocalDao.findById(id);
      if (local) {
        await this.getTravel(token, local.travel_id);
      }
    } catch (error) {
      console.log(error);
      outError = error;
    }

    result.local = await TravelLocalDao.findById(id);
    result.travel_id = result.local.travel_id;
    const idsMerged = result.local.merged.split(",");
    const missions = await TravelMissionDao.getAllByLocal(idsMerged);

    for (const mission of missions) {
      mission.contact = await TravelContactDao.findFirstByLocal(
        result.local.location_owner_id
      );
      mission.document = await TravelDocumentDao.getAllByMission(mission.id);
      result.missions.push(mission);
    }

    reactotron.log(result);
    return JSON.parse(JSON.stringify(result));
  }

  static async checkLocalsPendent(id) {
    console.log("checkLocalsPendent");
    const result = await TravelLocalDao.checkPendentByTravel(id);
    return JSON.parse(JSON.stringify(result));
  }

  static async getTravelLocalsMerged(token, id) {
    console.log("getTravelLocalsMerged");
    try {
      await this.getTravel(token, id);
    } catch (error) {
      console.log(error);
      outError = error;
    }

    const result = await TravelLocalDao.getAllByTravel(id);
    reactotron.log(result);

    return JSON.parse(JSON.stringify(result));
  }

  static async getMission(token, id) {
    console.log("getMission");
    try {
      const mission = await TravelMissionDao.findById(id);
      const local = await TravelLocalDao.findById(mission.travel_local_id);
      await this.getTravel(token, local.travel_id);
    } catch (error) {
      console.log(error);
    }

    let mission = await TravelMissionDao.findById(id);
    const local = await TravelLocalDao.findById(mission.travel_local_id);
    const documents = await TravelDocumentDao.getAllByMission(mission.id);
    mission.contact = await TravelContactDao.findFirstByLocal(
      local.location_owner_id
    );

    const result = {
      travel_id: local.travel_id,
      travel_documents: documents,
      address: local.address,
      latitud: local.location_latitud,
      longitud: local.location_longitud,
      mission: mission,
    };

    reactotron.log(result);
    return JSON.parse(JSON.stringify(result));
  }

  static async getInsuccessType(token, type) {
    console.log("getInsuccessType");
    let outError = null;
    try {
      const responseReason = await api.get(`/insuccess/types`, {
        params: { type: type },
        headers: { Authorization: `bearer ${token}` },
      });
      if (responseReason) {
        responseReason.data.forEach((reason) => {
          TravelInsuccessTypeDao.createOrUpdate(reason);
        });
      }
    } catch (error) {
      console.log(error);
      outError = error;
    }

    const result = await TravelInsuccessTypeDao.getAll();

    if (result.length == 0 && outError != null) {
      throw outError;
    }

    return JSON.parse(JSON.stringify(result));
  }

  static async getLocalsNotConfirmed(travelId) {
    let response = {
      data: {data: []},
      code: 200,
      success: true,
      errors: [],
      message: "",
      request_id: ""
    }
    let locals = await TravelLocalDao.getAllByTravel(travelId);
    locals = JSON.parse(JSON.stringify(locals));

    for(let local of locals) {
      local.contact = [];
      local.missions_not_confirmed_with_contacts = [];

      let missionsNotConfirmed = await TravelMissionDao.getMissionsNotConfirmed(local.merged.split(','));
      missionsNotConfirmed = JSON.parse(JSON.stringify(missionsNotConfirmed));
      if(missionsNotConfirmed.length > 0) {
        for(let mission of missionsNotConfirmed) {
          mission.contact = [];
          mission.document = [];

          mission.contact.push(await TravelContactDao.findFirstByLocal(local.location_owner_id));
          mission.document.push(await TravelDocumentDao.getAllByMission(mission.id));

          local.missions_not_confirmed_with_contacts.push(mission);
        }

        response.data.data.push(local);
      }
    }

    return response;
  }
}
