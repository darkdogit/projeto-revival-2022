import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as Localization from "expo-localization";
import * as Location from "expo-location";
import { jwtDecode } from "jwt-decode";
import qs from "qs";
import { Platform } from "react-native";
import environment from "../environment";
import { store } from "../stores/store";
import HelperService from "./HelperService";
import { NetworkService } from "./NetworkService";
import { SessionService } from "./SessionService";
import i18n from "../localization/AppLocalization";
import JWT, { SupportedAlgorithms } from "expo-jwt";
import { Buffer } from "buffer";

const pkg = require("../app.json");
export default class UserService {
  pAccount = true;

  sexOrientation = [
    {
      id: "hetero",
      name: i18n.t("hetero"),
    },
    {
      id: "homo",
      name: i18n.t("homo"),
    },
    {
      id: "bisexual",
      name: i18n.t("bisexual"),
    },
  ];

  constructor() {
    this.network = new NetworkService();
    this.helperService = new HelperService();
    this.sessionService = new SessionService();
    this.loc = Localization.locale;
    this.nationalities = [
      {
        id: "BR",
        name: i18n.t("brazil"),
      },
      {
        id: "US",
        name: i18n.t("usa"),
      },
      {
        id: "OTHER",
        name: i18n.t("other"),
      },
    ];
  }

  async login(params) {
    return new Promise((resolve, reject) => {
      try {
        this.network
          .post(`${this.network.endpoints.login}`, params)
          .then((login) => {
            if (login.status) {
              if (login.data.type != "user") {
                reject({
                  status: false,
                  message: "Usuário ou senha inválidos",
                });
              }
              this.sessionService.saveAuthToken(login.access_token);
              this.getUserData(login.data.id)
                .then((user) => {
                  resolve(user);
                })
                .catch((e) => reject(e));
            } else {
              reject(login);
            }
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async loginWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const parts = credential.identityToken
        .split(".")
        .map((part) =>
          Buffer.from(
            part.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString()
        );
      const userInfo = JSON.parse(parts[1]);

      var email = credential.email || userInfo.email;
      if (!email) {
        throw { message: i18n.t("apple_login_error") };
      } else {
        return {
          email: email,
          token: credential.identityToken,
          type: "apple",
        };
      }
    } catch (e) {
      throw e;
    }
  }

  async register(params) {
    const res = await this.network.post(this.network.endpoints.users, params);
    console.log("RES REGISTER", res);
    this.sessionService.saveAuthToken(res.access_token);
    this.update(this.getDeviceInfo(), false, res.data.id);
    return res;
  }
  update(params, handleError = false, userId) {
    let id = userId;
    if (!userId) {
      id = store.getState().sessionReducer.id;
    }
    return this.network
      .post(`${this.network.endpoints.usersUpdate}/${id}`, params, handleError)
      .catch((e) => {});
  }

  updateProfile(v) {
    let values = v;
    let images = values.images;
    delete values.images;
    var gender = "";
    var show_as_gender = "";

    if (values.gender_id != "male" && values.gender_id != "female") {
      if (values.gender_id == "other") {
        gender = values.gender_other;
      } else {
        gender = values.gender;
      }
      show_as_gender = values.includes;
    } else {
      show_as_gender = values.gender_id;
      gender = i18n.t(values.gender_id);
    }

    values.gender = gender;
    values.show_as_gender = show_as_gender;

    if (values.account_type != "special") {
      values.disability_description = "";
    }

    values.disability =
      values.account_type == "special"
        ? {
            medical_procedures: values.medical_procedures?.map((r) => {
              return { id: r };
            }),
            hospitals: values.hospitals?.map((r) => {
              return { id: r };
            }),
            cid: values.cid?.map((r) => {
              return { id: r };
            }),
            drugs: values.medicament?.map((r) => {
              return { id: r };
            }),
            things_i_use: values.things_i_use?.map((r) => {
              return { id: r };
            }),
          }
        : {
            medical_procedures: [],
            hospitals: [],
            cid: [],
            drugs: [],
            things_i_use: [],
          };

    if (images?.length > 0) {
      this.updateImages(
        images,
        images.map((r) => r.order)
      );
    }
    return this.update(values);
  }

  updateImages(images) {
    if (images?.length == 0) {
      return { status: true };
    } else {
      var order = [];
      var image = [];
      images.map((r, index) => {
        if (r) {
          order.push(index);
          image.push(r);
        }
      });
      const params = {
        order,
        image,
      };
      return this.network.postMultipart(
        this.network.endpoints.updateImages,
        params,
        true
      );
    }
  }

  async completeRegistration(params) {
    let promises;
    if (params.account_type == "special") {
      params.disability_description = params.disability_name;
      params.disability = {
        hospitals: params.hospital?.map((r) => {
          return { id: r };
        }),
        medical_procedures: params.medical_procedures?.map((r) => {
          return { id: r };
        }),
        drugs: params.medicament?.map((r) => {
          return { id: r };
        }),
        cid: params.cid?.map((r) => {
          return { id: r };
        }),
      };
    }
    params.age_min = 18;
    params.age_max = 50;
    params.max_distance = 10;

    const imgs = params.image;
    delete params.image;

    if (params.account_type != "curious") {
      promises = [this.updateImages(imgs), this.update(params)];
    } else {
      // tive q fazer essa gambi da primeira promise senao ia ter qu ver se o cara é tipo curioso em todas as telas que faz cadastro
      promises = [
        new Promise((resolve, reject) => {
          resolve({ status: true });
        }),
        this.update(params),
      ];
    }

    const responses = await Promise.all(promises);

    if (responses[0].status && responses[1].status) {
      return true;
      this.clearRegisterInfo();
    } else {
      throw {
        error: !responses[0]?.status ? responses[0] : responses[1],
        message: "Erro ao comletar cadastro",
      };
    }
  }

  sendRecoveryPasswordEmail(params) {
    return this.network.post(this.network.endpoints.recoveryPassword, params);
  }

  getCards() {
    return this.network.get(this.network.endpoints.cards);
  }

  formatAddress(address) {
    return `${address.street} ${address.number}, ${address.neighborhood} ${
      address.complement || ""
    }`;
  }

  getPaymentId() {
    const session = store.getState().sessionReducer;
    if (session?.selected_payment == "balance") {
      return { use_balance: true };
    } else if (session?.favorite_card) {
      return { card_id: session?.favorite_card.card_id };
    } else {
      return null;
    }
  }

  async getUserData(id) {
    let r = await this.network.get(
      `${this.network.endpoints.users}/${id}`,
      false
    );
    if (r.status) {
      const session = {
        ...r.data,
        premiumAccount:
          r.data.plan_type == "premium" || r.data.country === "BR",
        version: pkg.expo.version,
        ...this.getDeviceInfo(),
      };
      return session;
    }
    throw { message: "Erro ao pegar user" };
  }

  getNotifications() {
    return this.network.get(this.network.endpoints.notifications);
  }

  googleLogin = () => {
    try {
      Linking.openURL(
        `${environment.baseUrl}${this.network.endpoints.google_login}`
      );
    } catch (e) {
      console.log(e);
    }
  };

  completeSocialLogin = async (url) => {
    let { hostname, path, queryParams } = Linking.parse(url);
    if (hostname == "google-login" && queryParams && queryParams.data) {
      const userData = JSON.parse(queryParams.data);
      this.sessionService.saveAuthToken(userData.access_token);
      const login = await this.getUserData(userData.data.id);
      return login;
    }
  };

  syncUserWithApi(saveToSession = true) {
    if (store.getState().sessionReducer) {
      const id = store.getState().sessionReducer.id;
      return new Promise((resolve, reject) => {
        this.getUserData(id)
          .then((r) => {
            const session = {
              ...store.getState().sessionReducer.data,
              ...r,
            };
            if (saveToSession) {
              console.log("---------- SESSION UPDATED ----------");
              this.updateSession(session);
            }
            resolve(session);
          })
          .catch((e) => {
            console.log("erro de sync", e);
            reject(e);
          });
      });
    } else {
      return true;
    }
  }

  updatePassowrd(params) {
    return this.network.post(this.network.endpoints.password_update, params);
  }

  getUser(id) {
    return this.network.get(`${this.network.endpoints.users}/${id}`);
  }

  setRegisterInfo(info) {
    const i = store.getState()?.infoReducer?.registerInfo;
    store.dispatch({
      type: "UPDATE_INFO",
      params: { registerInfo: { ...i, ...info } },
    });
  }
  clearRegisterInfo() {
    store.dispatch({ type: "DESTROY_USER_INFO" });
  }

  setFakeCardSwiped() {
    store.dispatch({ type: "UPDATE_INFO", params: { swipedFake: true } });
  }

  checkEmailExist(params) {
    return this.network.post(this.network.endpoints.checkEmailExist, params);
  }

  getDeviceInfo() {
    var info = { os: Platform.OS };
    try {
      var manufacturer = Device.manufacturer;
      if (manufacturer) {
        manufacturer = manufacturer.toUpperCase();
      }
      if (Platform.OS == "ios") {
        const deviceInfo = Constants.platform[Platform.OS];
        info = {
          ...info,
          model: `${manufacturer} ${Device.modelName}`,
          os_version: deviceInfo.systemVersion,
        };
      } else {
        info = {
          ...info,
          model: `${manufacturer} ${Device.modelName}`,
          os_version: Constants.systemVersion,
        };
      }
    } catch (e) {
      console.log("erro info", e);
    }

    return info;
  }

  updateSession(params) {
    store.dispatch({ type: "UPDATE_SESSION", params: params });
  }
  // logout() {
  // 	store.dispatch({ type: 'DESTROY_SESSION' })
  // }

  logout(clearToken = true) {
    this.network.post(
      `${this.network.endpoints.logout}/${store.getState().sessionReducer.id}`,
      {}
    );
    this.sessionService.clearSession();
  }

  getSession() {
    return store.getState().sessionReducer;
  }

  async getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("LOCATION error");
      return {};
    }
    // Location.setGoogleApiKey(environment.googleApiKey)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    });
    const address = await Location.reverseGeocodeAsync(location.coords, {
      useGoogleMaps: true,
    });

    const first = address[0].subregion
      ? `${address[0].subregion} - `
      : address[0].district
      ? `${address[0].district} - `
      : "";
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      address_description: `${first}${address[0].region}`,
    };
  }

  reportUser(id, reason) {
    return this.network.post(`${this.network.endpoints.reports}`, {
      denounced_user_id: id,
      description: reason,
      type: "foto inapropriada",
    });
  }

  getGoogleUserInfo(accessToken) {
    return this.network.getExternal(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
    );
  }

  async getCids(filters) {
    const field = this.loc == "pt-BR" ? "description" : "description_en";
    try {
      const res = await this.network.get(
        `${this.network.endpoints.cid}?${qs.stringify(filters)}`
      );
      if (res.status) {
        res.data = res.data
          .filter((r) => r.description && r.description_en)
          .map((r) => {
            return { id: r.id, name: r[field] };
          });
        return res;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
  async getMedicalProcedures(filters) {
    const field = this.loc == "pt-BR" ? "name" : "name_en";
    try {
      const res = await this.network.get(
        `${this.network.endpoints.medicalProcedures}?${qs.stringify(filters)}`
      );
      if (res.status) {
        res.data = res.data
          .filter((r) => r.name && r.name_en)
          .map((r) => {
            return { id: r.id, name: r[field] };
          });
        return res;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
  async getThingsIUse(filters) {
    const field = this.loc == "pt-BR" ? "name" : "name_en";
    try {
      const res = await this.network.get(
        `${this.network.endpoints.thingsIUse}?${qs.stringify(filters)}`
      );
      if (res.status) {
        res.data = res.data
          .filter((r) => r.name && r.name_en)
          .map((r) => {
            return { id: r.id, name: r[field] };
          });
        return res;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
  async getMedications(filters) {
    try {
      let res = await this.network.get(
        `${this.network.endpoints.drugs}?${qs.stringify(filters)}`
      );
      if (res.status) {
        res.data = res.data
          .filter((r) => r.name)
          .map((r) => {
            return { id: r.id, name: `${r.name} - ${r.country || ""}` };
          });
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  async getHospitals(filters) {
    const s = store.getState().sessionReducer;
    const hasLoc = s && s.lat && s.lng;
    var url = `${this.network.endpoints.hospitals}?${qs.stringify(filters)}`;
    if (hasLoc) {
      url = `${url}&lat=${s.lat}&lng=${s.lng}`;
    }
    try {
      const res = await this.network.get(url);
      if (res.status) {
        res.data = res.data.map((r) => {
          return {
            id: r.id,
            name: r.name,
            description: hasLoc ? `${parseInt(r.distance)}km` : "",
          };
        });
        return res;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
    }
  }

  getLikes() {
    return this.network.get(`${this.network.endpoints.likedMe}`);
  }
  like(userId) {
    return this.network.post(`${this.network.endpoints.likes}`, {
      user_id: userId,
      type: "like",
    });
  }
  dislike(userId) {
    return this.network.post(`${this.network.endpoints.likes}`, {
      user_id: userId,
      type: "dislike",
    });
  }
  superMatch(userId) {
    return this.network.post(`${this.network.endpoints.likes}`, {
      user_id: userId,
      type: "super-match",
    });
  }
  subscribeToPremium() {
    return this.network.post(`${this.network.endpoints.subscribe}`, {}, true);
  }
  cancelSubscription(reason) {
    return this.network.post(
      `${this.network.endpoints.cancelSubscription}`,
      { reason_cancel_plan: reason },
      true
    );
  }
  registerActivity() {
    return this.network.post(`${this.network.endpoints.activity}`, {}, true);
  }
  deleteAccount(reason) {
    return this.network.delete(
      `${this.network.endpoints.users}/${store.getState().sessionReducer.id}`,
      { reason_cancel_account: reason }
    );
    // await this.update({ reason_cancel_account: reason })
    // this.network.delete(`${this.network.endpoints.users}`)
  }
  addPaymentMethod(paymentId) {
    return this.network.post(
      `${this.network.endpoints.addPaymentMethod}`,
      { payment_method_id: paymentId },
      true
    );
  }
  savePlan(plan) {
    const params = {
      type: Platform.select({ ios: "apple", android: "google" }),
      productId: plan.productId,
      purchaseToken: plan.purchaseToken,
      transactionReceipt: plan.transactionReceipt,
    };
    return this.network.post(
      `${this.network.endpoints.saveUserPlan}`,
      params,
      true
    );
    /**
					 * OBJ DE RESPOSTA DO PLAN DA APPLE
					 * {
						"acknowledged": true,
						"orderId": "2000000020288523",
						"originalOrderId": "1000000931563067",
						"originalPurchaseTime": 1639594891000,
						"productId": "devotee_plus_subscription",
						"purchaseState": 3,
						"purchaseToken": "SOMENTE_NO_ANDROID"
						"purchaseTime": 1648248844000,
						"transactionReceipt": "STRING GIGANTE"
						"device": "ios ou andrid"
					}
					 */
  }
  async getSettings(type) {
    let field = `${type}`;
    if (this.loc != "pt-BR") {
      field = `${type}_en`;
    }
    const res = await this.network.get(
      `${this.network.endpoints.settings}/${field}`
    );
    return res.data.value;
  }
  sendSuggestion(params) {
    return this.network.post(
      `${this.network.endpoints.suggestion}`,
      params,
      true
    );
  }
  getAds() {
    return this.network.get(`${this.network.endpoints.ads}?active=1`);
  }
  saveFilters(params) {
    return this.network.post(`${this.network.endpoints.filters}`, params);
  }
  getFilters() {
    return this.network.get(`${this.network.endpoints.filters}`);
  }

  loginHash = (hash) => {
    return this.network.post(`${this.network.endpoints.loginHash}`, { hash });
  };

  getGenders() {
    return [
      { id: "male", name: i18n.t("male") },
      { id: "female", name: i18n.t("female") },
      { id: "other", name: i18n.t("other") },
      { id: "trans", name: i18n.t("gender_trans") },
      { id: "gender_agender", name: i18n.t("gender_agender") },
      { id: "gender_andro", name: i18n.t("gender_andro") },
      { id: "gender_bi", name: i18n.t("gender_bi") },
      { id: "gender_cis", name: i18n.t("gender_cis") },
      { id: "gender_double", name: i18n.t("gender_double") },
      { id: "gender_queer", name: i18n.t("gender_queer") },
      { id: "gender_doubt", name: i18n.t("gender_doubt") },
      { id: "gender_fluid", name: i18n.t("gender_fluid") },
      { id: "gender_vatiant", name: i18n.t("gender_vatiant") },
      { id: "gender_inter", name: i18n.t("gender_inter") },
      { id: "gender_nonbinary", name: i18n.t("gender_nonbinary") },
      { id: "gender_none", name: i18n.t("gender_none") },
      { id: "gender_neutral", name: i18n.t("gender_neutral") },
    ];
  }

  getGenderFilters() {
    return [
      { id: "male", name: i18n.t("male") },
      { id: "female", name: i18n.t("female") },
      { id: "all", name: i18n.t("all") },
    ];
  }
  resetDislikes() {
    return this.network.post(`${this.network.endpoints.resetDislikes}`, {});
  }
}
