import Pusher from "pusher-js/react-native";
import environment from "../environment";
import { NetworkService } from "./NetworkService";
import { store } from "../stores/store";
import * as Notifications from "expo-notifications";

export default class ChatService {
  constructor() {
    this.network = new NetworkService();
  }

  getChatMessages(match_id) {
    return this.network.get(
      `${this.network.endpoints.messages}?match_id=${match_id}`,
      true
    );
  }

  sendMessage(params) {
    return this.network.postMultipart(
      `${this.network.endpoints.messages}`,
      params,
      true
    );
  }
  readChatMessages(match_id) {
    return this.network.post(
      `${this.network.endpoints.readMessages}`,
      { match_id },
      true
    );
  }

  getMatches() {
    return this.network.get(`${this.network.endpoints.matches}`);
  }
  getMatch(id) {
    return this.network.get(`${this.network.endpoints.matches}/${id}`);
  }

  updateBadgeCount(badgeCount = 0) {
    // Notifications.setBadgeCountAsync(badgeCount);
    store.dispatch({ type: "UPDATE_CHAT_INFO", params: { badge: badgeCount } });
  }
}
