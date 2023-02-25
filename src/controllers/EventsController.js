import { EVENT_TYPE, TOKEN_KEY } from "../constants/constants";
import { EventDao } from "../daos/EventDao";
import { api } from "../services/api";
import crashlytics from "@react-native-firebase/crashlytics";
import { TravelMissionDao } from "../daos/TravelMissionDao";
import { TravelLocalDao } from "../daos/TravelLocalDao";
import reactotron from "reactotron-react-native";
import { TravelDao } from "../daos/TravelDao";
import StorageController from "./StorageController";
import { TravelDocumentDao } from "../daos/TravelDocumentDao";
import { TravelContactDao } from "../daos/TravelContactDao";

export class EventsController {
  static async postEvent(eventType, token, url, request, id) {
    reactotron.log('postEvent',eventType, token, url, request, id);
    let response = null;
    // try {
    //   if(eventType == EVENT_TYPE.MISSION_CONFIRMED) {
    //     response = await api.put(url,
    //       request,
    //       {headers: { Authorization: `bearer ${token}`}},
    //     );
    //   }
    //   else {
    //     response = await api.post(url,
    //       request,
    //       {headers: { Authorization: `bearer ${token}`}},
    //     );
    //   }
    // } catch (error) {
      // console.log(`postEvent error: ${error}`);
      // crashlytics().recordError(error, "EventsController.postEvent error");

      if(eventType != EVENT_TYPE.NEXT_STEP) {
        await EventDao.save(url, JSON.stringify(request));
      }

      response = await this.handleAction(eventType, request, id, url);
    // }
    
    if(response) {
      return response;
    }
    
    return {data: {success: true}};
  }

  static async handleAction(eventType, request, id) {
    let response = null;
    try {
      switch (eventType) {
        case EVENT_TYPE.LOCAL_CHANGE_STATUS:
          await this.localChangeStatus(id, request);
          break;
        case EVENT_TYPE.MISSION_CHANGE_STATUS:
          await this.missionChangeStatus(id, request);
          break;
        case EVENT_TYPE.TRAVEL_CHANGE_STATUS:
          await this.travelChangeStatus(id, request);
          break;
        case EVENT_TYPE.NEXT_STEP:
          response = await this.nextStep(id);
          break;
        case EVENT_TYPE.MISSION_CONFIRMED:
          this.confirmedMission(id);
          break;
        case EVENT_TYPE.NO_ACTION:
        default:
          break;
      }
    } catch (error) {
      console.log(`EventsController.handleAction error: ${error}`);
      crashlytics().recordError(error, "EventsController.handleAction error");
    }

    return response;
  }

  static async localChangeStatus(id, request) {
    let local = await TravelLocalDao.findById(id);
    local = JSON.parse(JSON.stringify(local));

    if (local && request) {
      local.status = request.status ?? local.status;

      await TravelLocalDao.createOrUpdate(local);

      console.log(`local ${id} changeStatus to ${request.status}`);
    }
  }

  static async missionChangeStatus(id, request) {
    let mission = await TravelMissionDao.findById(id);
    mission = JSON.parse(JSON.stringify(mission));
    
    if (mission && request.data.length > 0) {
      reactotron.log('missionChangeStatus Into', request.data[0]);
      mission.status = request.data[0].status ?? mission.status;
      mission.failure_reasons_id =
        request.data[0].failure_reasons_id ?? mission.failure_reasons_id;
      mission.failure_reason =
        request.data[0].failure_reason ?? mission.failure_reason;

      await TravelMissionDao.createOrUpdate(mission);

      console.log(`mission ${mission.id} changeStatus to ${mission.status}`);
    }
  }

  static async travelChangeStatus(id, request) {
    let travel = await TravelDao.findById(id);
    travel = JSON.parse(JSON.stringify(travel));

    if (travel && request) {
      travel.status = request.status ?? travel.status;

      await TravelDao.createOrUpdate(travel);

      console.log(`travel ${id} changeStatus to ${request.status}`);
    }
  }

  static async nextStep(missionId) {
    let output = {
      data: {data: {}},
      success: true
    }

    //Procura Missões pendentes no mesmo local da missão atual
    let mission = await TravelMissionDao.findById(missionId);
    mission = JSON.parse(JSON.stringify(mission));

    let local = await TravelLocalDao.findById(mission.travel_local_id);
    local = JSON.parse(JSON.stringify(local));

    const missionPending = await TravelMissionDao.getNextMissionPending(mission.id, local.merged.split(','))
    
    if(missionPending.length > 0) {
      output.data.data = {
        nextAction: 'mission',
        mission: missionPending[0]
      };

      console.log('saindo em missoes pendentes');
      return JSON.parse(JSON.stringify(output));
    }
    
    //se nao tiver, atualiza local para concluido
    await this.updateLocalToDone(local.id);
    
    //Pega locais pendentes
    const localsPending = await TravelLocalDao.getPendentsByTravel(local.travel_id);

    if(localsPending.length > 0) {
      output.data.data = {
        nextAction: 'local',
        local: localsPending[0]
      };

      console.log('saindo em locais pendentes');
      return JSON.parse(JSON.stringify(output));
    }

    //Pega missoes que falharam
    let locals = await TravelLocalDao.getAllByTravel(local.travel_id);
    locals = JSON.parse(JSON.stringify(locals));
    let failedMissions = [];
    for (let localInto of locals) {

      let failedMission = await TravelMissionDao.getMissionFailed(local.merged.split(','));
      failedMission = JSON.parse(JSON.stringify(failedMission));
      if(failedMission.length > 0) {
        localInto.missions_failed_with_contacts = [];
        for(let missionFailed of failedMission) {
          missionFailed.document = await TravelDocumentDao.getAllByMission(missionFailed.id);
          missionFailed.contact = await TravelContactDao.findFirstByLocal(localInto.location_owner_id);

          localInto.missions_failed_with_contacts.push(missionFailed);
        }
      }
      failedMissions.push(localInto);
    }
    
    if(failedMissions.length > 0) {
      output.data.data = {
        nextAction: 'missionFailed',
        travel: {
          id: local.travel_id,
          locals: failedMissions
        }
      };

      console.log('saindo em missionFailed');
      return JSON.parse(JSON.stringify(output));
    }

    //Destino
    const destiny = await TravelLocalDao.getPendingDestiny(local.travel_id);
    if(destiny && destiny.length > 0) {
      output.data.data = {
        nextAction: 'destiny',
        local: destiny[0]
      };

      console.log('saindo em destiny');
      return JSON.parse(JSON.stringify(output));
    }

    output.data.data = {
      nextAction: 'travel'
    };

    console.log('saindo em travel');
    return JSON.parse(JSON.stringify(output));
  }

  static async syncEvents() {
    let eventList = await EventDao.getTop(50);
    eventList = JSON.parse(JSON.stringify(eventList));
    console.log(`EventsController.syncEvents: ${eventList.length}`);
    const token = await StorageController.buscarPorChave(TOKEN_KEY);

    for (const event of eventList) {
      try {
        const header = { authorization: `bearer ${token}` };
        const data = JSON.parse(event.request);
        console.log(`event url - ${event.url}`);
        console.log(`event header - ${header}`);
        console.log(`event data - ${data}`);

        if(event.url.contains('/confirmed')) {
          const response = await api.put(event.url,
            data,
            {headers: header},
          );  
        }else {
          const response = await api.post(event.url,
            data,
            {headers: header},
          );
        }

        console.log(`EventsController.syncEvents: idEvent ${event.id}`)
        if (response.data.success) await EventDao.deleteList([event]);
      } catch (error) {
        console.log(`syncEvents error: ${error}`);
        crashlytics().recordError(error, "EventsController.syncEvents error");
      }
    }
  }

  static async updateLocalToDone(id) {
    const token = await StorageController.buscarPorChave(TOKEN_KEY);
    const response = await this.postEvent(
      EVENT_TYPE.LOCAL_CHANGE_STATUS,
      token,
      `/local/${id}/change-status`,
      { status: "CONCLUIDO", uuid_group: true },
      id
    );

    return response;
  }

  static async confirmedMission(id) {
    let mission = await TravelMissionDao.findById(id);
    mission = JSON.parse(JSON.stringify(mission));
    
    if (mission) {
      mission.confirmed = 1;
      await TravelMissionDao.createOrUpdate(mission);
      console.log(`mission ${mission.id} confirmedMission`);
    }
  }
}
