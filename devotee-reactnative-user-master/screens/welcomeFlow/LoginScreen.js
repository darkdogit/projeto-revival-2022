import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  PhButton,
  PhGradientButton,
  PhLinkButton,
} from "../../phTemplates/buttons";
import { PhDivider } from "../../phTemplates/components";
import { PhScrollView } from "../../phTemplates/containers";
import { PhTextInput } from "../../phTemplates/inputs";
import { colors, measures } from "../../phTemplates/PhStyles";
import {
  PhPageTitle,
  PhParagraph,
  PhSubtitle,
} from "../../phTemplates/typography";
import * as RootNavigation from "../../routeStacks/RootNavigation";
import PushNotificationService from "../../services/PushNotificationService";
import { SessionService } from "../../services/SessionService";
import * as Google from "expo-auth-session/providers/google";
import UserService from "../../services/UserService";
import environment from "../../environment";
import i18n from "../../localization/AppLocalization";

export default function LoginScreen(props) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    environment.googleSettings.loginCredentials
  );
  const screenTitle = i18n.t("login");
  const userService = new UserService();
  const sessionService = new SessionService();
  const [isSubmitting, setSubmitting] = useState(false);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [submittingApple, setSubmittingApple] = useState(false);
  const dispatch = useDispatch();
  const pushService = new PushNotificationService();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(i18n.t("email_error"))
      .email(i18n.t("email_error")),
    password: Yup.string().required(i18n.t("password_error")),
  });

  const refs = {};

  useEffect(() => {
    if (response?.type === "success") {
      getGoogleUserInfo(response.params.id_token);
    } else {
      // nao foi possivel fazer login
    }
  }, [response]);

  async function getGoogleUserInfo(idToken) {
    try {
      const res = await userService.getGoogleUserInfo(idToken);
      handleLogin({
        email: res.email,
        token: idToken,
        type: "google",
      });
    } catch (e) {
      setSubmittingGoogle(false);
      console.log(e);
    }
  }

  async function handleLogin(values) {
    if (!values.type) {
      setSubmitting(true);
    }
    try {
      Keyboard.dismiss();
      var login = await userService.login(values);
      let token = "";
      if (login.account_type != "curious") {
        token = await pushService.registerForPushNotificationsAsync(false);
        await userService.update(
          { notification_token: token, ...userService.getDeviceInfo() },
          false,
          login.id
        );
      }
      await userService.registerActivity();
      if (
        (!login.lat || !login.lng) &&
        login.account_type &&
        login.account_type != "curious"
      ) {
        props.navigation.navigate("LocationFix", { login });
      } else {
        sessionService.saveSession(login);
      }
    } catch (e) {
      console.log("erro", e);
    } finally {
      setSubmitting(false);
      setSubmittingGoogle(false);
      setSubmittingApple(false);
    }
  }

  setupUser = async () => {
    try {
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  function handleGoogle() {
    // LOGIN É FEITO NO APPJS PELO DEEPLINK
    promptAsync();
  }
  async function handleApple() {
    setSubmittingApple(true);
    try {
      const res = await userService.loginWithApple();
      handleLogin(res);
    } catch (e) {
      DeviceEventEmitter.emit("alertMessage", {
        title: i18n.t("error"),
        message: e.message,
      });
    } finally {
      setSubmittingApple(false);
    }
  }

  return (
    <PhScrollView
      {...props}
      screenTitle={screenTitle}
      setHeaderOptions={{
        headerRight: () => (
          <PhLinkButton
            onPress={() => props.navigation.navigate("PasswordRecovery")}
            textStyle={{ color: colors.secondary, padding: 0, margin: 0 }}
          >
            {i18n.t("forgot_password")}
          </PhLinkButton>
        ),
      }}
    >
      <Formik
        validationSchema={validationSchema}
        validateOnMount={true}
        initialValues={
          __DEV__
            ? {
                email: "testandrews@gmail.com",
                password: "12345678",
                // email: 'daisyjhonny2@gmail.com',
                // password: '12345678'
                // email: 'ricardoalonsojorge@gmail.com',
                // password: '83845678'
              }
            : {}
        }
      >
        {(formProps) => (
          <>
            <View
              style={{
                paddingHorizontal: measures.xSpace,
                paddingBottom: measures.ySpace,
              }}
            >
              <PhPageTitle>{screenTitle}</PhPageTitle>
            </View>
            <PhTextInput
              onRef={(r) => {
                refs.email = r;
              }}
              labelTitle={i18n.t("email")}
              required
              placeholder={i18n.t("email_placeholder")}
              keyboardType={"email-address"}
              autoCapitalize={"none"}
              returnKeyType="next"
              onSubmitEditing={() => refs.password.focus()}
              fieldHasError={{
                show: formProps.errors.email && formProps.touched.email,
                message: formProps.errors.email,
              }}
              onBlur={formProps.handleBlur("email")}
              blurOnSubmit={false}
              onChangeText={(text) => formProps.setFieldValue("email", text)}
            />
            <PhTextInput
              required
              onRef={(r) => {
                refs.password = r;
              }}
              labelTitle={i18n.t("password")}
              placeholder={i18n.t("password_placeholder")}
              autoCapitalize={"none"}
              secureTextEntry={true}
              textContentType={"oneTimeCode"}
              fieldHasError={{
                show: formProps.errors.password && formProps.touched.password,
                message: formProps.errors.password,
              }}
              onBlur={formProps.handleBlur("password")}
              onChangeText={(text) => formProps.setFieldValue("password", text)}
            />

            <PhGradientButton
              onPressDisabled={() => {}}
              onPress={() => handleLogin(formProps.values)}
              containerStyle={{ marginVertical: measures.ySpace }}
              disabled={!formProps.isValid}
              loading={isSubmitting}
            >
              {i18n.t("continue")}
            </PhGradientButton>
            <PhDivider
              style={{ marginHorizontal: measures.xSpace }}
            ></PhDivider>
            <PhParagraph
              style={{ textAlign: "center", paddingVertical: measures.ySpace }}
            >
              {i18n.t("login_other_accounts")}
            </PhParagraph>
            <PhButton
              loading={submittingGoogle}
              onPress={() => handleGoogle()}
              containerStyle={{
                backgroundColor: colors.white,
                borderColor: colors.disabled,
                borderWidth: 2,
              }}
              textStyle={{ color: colors.primary }}
              leftIcon={
                <Image
                  source={require("../../assets/img/google_icon.png")}
                  style={{ height: 16, width: 16 }}
                />
              }
            >{` ${i18n.t("login_google")} `}</PhButton>

            {Platform.OS == "ios" ? (
              <PhButton
                loading={submittingApple}
                onPress={() => handleApple()}
                containerStyle={{
                  marginTop: measures.ySpace,
                  backgroundColor: colors.black,
                }}
                textStyle={{ color: colors.white }}
                leftIcon={
                  <FontAwesome name={"apple"} color={colors.white} size={15} />
                }
              >{` ${i18n.t("login_apple")} `}</PhButton>
            ) : null}

            <View
              style={{
                paddingTop: measures.ySpace,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <PhParagraph style={{ paddingTop: 0, lineHeight: null }}>
                {i18n.t("create_account_message")}
              </PhParagraph>
              <TouchableOpacity
                activeOpacity={1}
                style={{}}
                onPress={() =>
                  RootNavigation.navigate("WebView", { type: "terms" })
                }
              >
                <PhSubtitle>{` ${i18n.t("terms_of_use")} `}</PhSubtitle>
              </TouchableOpacity>
              <PhParagraph style={{ lineHeight: null }}>
                {i18n.t("and")}
              </PhParagraph>
              <TouchableOpacity
                activeOpacity={1}
                style={{}}
                onPress={() =>
                  RootNavigation.navigate("WebView", { type: "privacy" })
                }
              >
                <PhSubtitle>{` ${i18n.t("privacy_policy")} `}</PhSubtitle>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </PhScrollView>
  );
}
