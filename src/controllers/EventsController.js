import { EVENT_TYPE } from "../constants/constants";
import { EventDao } from "../daos/EventDao";
import { api } from "../services/api";
import crashlytics from "@react-native-firebase/crashlytics";

export class EventsController {
  static async postEvent(eventType, token, url, request, id) {
    try {
      const response = await api.post(url, {
        data: request,
        headers: { Authorization: `bearer ${token}` },
      });
    } catch (error) {
      console.log(`postEvent error: ${error}`);
      crashlytics().recordError(error, "EventsController.postEvent error");
      EventDao.save(url, request);
      this.handleAction(eventType, request, id);
    }
  }

  static async handleAction(eventType, request, id) {
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
        break;
      case EVENT_TYPE.NO_ACTION:
      default:
        break;
    }
  }

  static async localChangeStatus(id, request) {}
  static async missionChangeStatus(id, request) {}
  static async travelChangeStatus(id, request) {}

  static async syncEvents() {
    const eventList = await EventDao.getTop(10);

    for (const event of eventList) {
      try {
        const response = await api.post(url, {
          data: request,
          headers: { Authorization: `bearer ${token}` },
        });

        if (response.data.success) await EventDao.deleteList([event]);
      } catch (error) {
        console.log(`syncEvents error: ${error}`);
        crashlytics().recordError(error, "EventsController.syncEvents error");
      }
    }
  }
}
