import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import environment from "../../environment";
import { PhGradientIcon, PhRawListItem } from "../../phTemplates/components";
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import {
  PhScrollView
} from "../../phTemplates/containers";
import { colors, measures } from "../../phTemplates/PhStyles";
import {
  PhHeader,
  PhLabel,
  PhPageSubtitle,
  PhPageTitle,
  PhParagraph,
  PhSubtitle
} from "../../phTemplates/typography";
import { NotificationBadge, PhRow } from "../../projectsComponents";
import * as RootNavigation from "../../routeStacks/RootNavigation";
import ChatService from "../../services/ChatService";
import HelperService from "../../services/HelperService";
import SocketService from "../../services/SocketService";
import UserService from "../../services/UserService";
import i18n from "../../localization/AppLocalization";

export const AdView = () => {
  return (
    <View style={ { width: '100%', position: 'absolute', bottom: 0 } } >
      <BannerAd
        unitId={ environment.BANNER_ID }
        size={ BannerAdSize.FULL_BANNER }
        requestOptions={ {
          requestNonPersonalizedAdsOnly: true,
        } }
        onAdFailedToLoad={ (error) => console.log('error banner', error) }
      />
    </View>
  )
}


export default function MessagesScreen(props) {
  const session = useSelector((state) => state.sessionReducer);
  const helperService = new HelperService();
  const userService = new UserService();
  const socketService = new SocketService();
  const chatService = new ChatService();
  const WIDTH = 80;
  const HEIGHT = 100;
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const refresh = props.navigation.addListener("focus", (r) => {
      getItems();
    });
    props.navigation.setOptions({ headerShown: false });
    setLoading(true);
    getItems();
    setupPusher();
    return refresh;
  }, []);

  async function getItems() {
    try {
      const m = await chatService.getMatches();
      if (m.status) {
        const matches = m.data.filter(r => r.target_user != null)
        const msgs = matches
          .filter((r) => r.latest_message != null && r.latest_message.user != null)
          .map((r) => {
            return {
              ...r,
              userId: r.latest_message.user.id,
              userName: r.target_user.name.split(" ")[0],
              picture: r.target_user.profile_picture[0],
              messsage: r.latest_message,
              dateTime: moment(r.latest_message.created_at).valueOf(),
            };
          })
          .sort((a, b) => b.dateTime - a.dateTime);

        setMessages(msgs);
        updateBadgeCount(matches);
        setMatches(matches);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function refresh() {
    setRefreshing(true);
    getItems();
  }

  function setupPusher() {
    const channel = socketService.subscribe(`user_messages.${session?.id}`);
    channel.bind("new-message", (e) => {
      getItems();
    });
  }

  function updateBadgeCount(matches, match = null) {
    var badgeCount = 0;
    if (match) {
      badgeCount = matches
        .filter((r) => r.target_user.id != match.target_user.id)
        .some(
          (r) =>
            !r.latest_message || (r.latest_message && !r.latest_message.read)
        ).length;
    } else {
      badgeCount = matches.filter(
        (r) =>
          !r.latest_message ||
          (r.latest_message &&
            r.latest_message.user &&
            !r.latest_message.read &&
            r.latest_message.user.id != session?.id)
      ).length;
    }
    console.log("count", badgeCount);
    chatService.updateBadgeCount(badgeCount);
  }

  function handleMatchPressed(match) {
    // console.log('AQUIIIIIIIII', match)
    if (match) {
      // updateBadgeCount(matches, match)
      if (!match.target_user.active) {
        return;
      }
      RootNavigation.navigate("Chat", {
        screen: "ChatScreen",
        params: { item: match },
      });
    } else {
      props.navigation.navigate("HomeTab");
    }
  }

  function MatchContainer({ match }) {
    const item = match?.target_user;
    const RADIUS = 10;
    const styles = {
      container: {
        fledx: 1,
        // backgroundColor: colors.lightGray,
        width: WIDTH,
        height: HEIGHT,
        borderRadius: RADIUS,
        marginHorizontal: 5,
        marginTop: 5,
      },
      picture: {
        width: "100%",
        height: "100%",
        borderRadius: RADIUS,
        backgroundColor: colors.lighterGray,
      },

      emptyContainer: {
        width: WIDTH,
        height: HEIGHT,
        borderRadius: RADIUS,
        position: "absolute",
        backgroundColor: `${colors.secondary}4f`,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
        padding: measures.xSpace / 2,
      },
    };

    return item ? (
      <View style={ { opacity: !item.active ? 0.3 : 1 } }>
        <TouchableOpacity
          onPress={ () => handleMatchPressed(match) }
          activeOpacity={ 1 }
          style={ styles.container }
        >
          { !match.latest_message ? (
            <LinearGradient
              colors={ colors.primaryGradient }
              style={ {
                position: "absolute",
                right: 5,
                top: 5,
                borderRadius: 8,
                paddingHorizontal: 4,
                paddingVertical: 2,
                zIndex: 3,
              } }
            >
              <PhLabel style={ { color: colors.white } }>{ i18n.t("new") }</PhLabel>
            </LinearGradient>
          ) : null }
          <Image
            style={ styles.picture }
            source={ {
              uri: `${environment.baseImgUrl}${item.profile_picture[0]?.path}`,
            } }
          ></Image>
        </TouchableOpacity>
        <PhLabel style={ { paddingLeft: 7, paddingTop: 3 } }>
          { `${item.name.split(" ")[0]}` }{ " " }
          { !item.active ? (
            <PhLabel style={ { color: colors.red } }>
              { `(${i18n.t("deactivated")})` }
            </PhLabel>
          ) : null }{ " " }
        </PhLabel>
      </View>
    ) : (
      <View>
        <TouchableOpacity
          onPress={ () => handleMatchPressed() }
          activeOpacity={ 1 }
          style={ styles.container }
        >
          <View style={ styles.emptyContainer }>
            <PhGradientIcon family={ "FontAwesome" } name={ "heart" } size={ 35 } />
          </View>
        </TouchableOpacity>
        <PhLabel style={ { paddingLeft: 7, paddingTop: 3 } }>
          { i18n.t("like_someone") }
        </PhLabel>
      </View>
    );
  }


  function ContainerForAudio(message) {
    return (
      <>
        <FontAwesome
          name={ "microphone" }
          color={ colors.disabled }
          size={ 16 }
        />
        <PhParagraph style={ { color: colors.disabled } }>{ ` ${i18n.t("audio")}` }</PhParagraph>
      </>
    )
  }
  function ContainerForImage(message) {

    return (
      <>
        <FontAwesome5
          name={ "camera" }
          color={ colors.disabled }
          size={ 16 }
        />
        <PhParagraph style={ { color: colors.disabled } }>{ ` ${i18n.t("photo")}` }</PhParagraph>
      </>
    )
  }

  function ContainerForText(message) {

    return (<PhParagraph style={ { color: colors.disabled } }>{ `${helperService.limitString(message.message.content || "", 32)}` }</PhParagraph>)
  }

  function MessageContainer({ item }) {
    const styles = {
      image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.lighterGray,
      },
    };
    return (
      <PhRawListItem divider chevron onPress={ () => handleMatchPressed(item) }>
        <View
          style={ {
            flexDirection: "row",
            opacity: !item.target_user.active ? 0.3 : 1,
          } }
        >
          <View style={ { paddingRight: 12 } }>
            { !item.latest_message?.read && item.userId != session?.id ? (
              <NotificationBadge
                style={ { position: "absolute", right: 8, top: -4, zIndex: 2 } }
              />
            ) : null }
            <Image
              style={ styles.image }
              source={ { uri: `${environment.baseImgUrl}${item.picture?.path}` } }
            />
          </View>
          <View>
            <PhHeader>
              { item.userName }{ " " }
              { !item.target_user.active ? (
                <PhLabel style={ { color: colors.red } }>
                  { `(${i18n.t("deactivated")})` }
                </PhLabel>
              ) : null }{ " " }
            </PhHeader>
            <PhRow justifyStart>
              {
                item.userId == session?.id ? (
                  <PhSubtitle>{ `${i18n.t("you")}: ` }</PhSubtitle>
                ) : null
              }
              {
                (item.latest_message.type == 'image' && item.latest_message.path) ? <ContainerForImage message={ item.latest_message } /> :
                  (item.latest_message.type == 'audio' && item.latest_message.path) ? <ContainerForAudio message={ item.latest_message } /> :
                    <ContainerForText message={ item.latest_message } />
              }
            </PhRow>
          </View>
        </View>
      </PhRawListItem>
    );
  }

  function EmptyEstateMessages() {
    return (
      <View
        style={ {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: measures.xSpace * 2,
        } }
      >
        <Image
          source={ require("../../assets/img/empty_state_messages_icon.png") }
        ></Image>
        <PhSubtitle style={ { paddingTop: 12, textAlign: "center" } }>
          { i18n.t("keep_searching") }
        </PhSubtitle>
        <PhParagraph style={ { textAlign: "center" } }>
          { i18n.t("empty_message_text") }
        </PhParagraph>
      </View>
    );
  }

  function handlePlus() {
    RootNavigation.navigate("Plus");
  }

  return (
    <>
      <PhScrollView
        onRefresh={ () => refresh() }
        refreshing={ refreshing }
        loading={ loading }
        screenTitle={ "" }
        scrollViewProps={ { contentContainerStyle: { flexGrow: 1, paddingBottom: 75 } } }
        safeAreaProps={ { mode: 'noBottom' } }
      >
        <View style={ { padding: measures.xSpace } }>
          <PhPageTitle>{ i18n.t("matches") }</PhPageTitle>
        </View>
        <View>
          {
            <ScrollView
              contentContainerStyle={ { paddingHorizontal: 15 } }
              showsHorizontalScrollIndicator={ false }
              horizontal={ true }
            >
              { matches.length > 0 ? (
                matches.map((r, index) => (
                  <MatchContainer key={ index } match={ r } />
                ))
              ) : (
                <MatchContainer />
              ) }
            </ScrollView>
          }
        </View>
        <View style={ { flex: 1, paddingTop: measures.xSpace } }>
          <PhPageSubtitle style={ { paddingHorizontal: measures.xSpace } }>
            { i18n.t("messages") }
          </PhPageSubtitle>
          { messages.length == 0 ? (
            <EmptyEstateMessages />
          ) : (
            messages.map((r, index) => <MessageContainer key={ index } item={ r } />)
          ) }
        </View>
      </PhScrollView>
      <AdView />
    </>
  );
}
