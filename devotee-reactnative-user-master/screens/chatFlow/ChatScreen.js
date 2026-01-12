import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  DeviceEventEmitter,
  Image,
  Keyboard,
  Platform,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import environment from "../../environment";
import { colors } from "../../phTemplates/PhStyles";
import { PhLinkButton } from "../../phTemplates/buttons";
import { PhCameraContainer, PhFlatList } from "../../phTemplates/containers";
import { PhAction, PhHeader, PhParagraph } from "../../phTemplates/typography";
import * as RootNavigation from "../../routeStacks/RootNavigation";
import AudioRecorderService from "../../services/AudioRecorderService";
import ChatService from "../../services/ChatService";
import SocketService from "../../services/SocketService";
import { LeftChatBubble, RightChatBubble } from "./ChatMessageComponents";
import InputContainer from "./InputContainer";
import i18n from "../../localization/AppLocalization";

var recorderService = new AudioRecorderService();
const chatService = new ChatService();
const socketService = new SocketService();

export default function ChatScreen(props) {
  const item = props.route.params.item;

  const [isRecording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const session = useSelector((state) => state.sessionReducer);

  const cameraRef = useRef();

  var channel;

  const STOP_LISTENER_STRING = "STOP_LISTENER_STRING";

  useEffect(() => {
    const appState = AppState.addEventListener("change", killAudioEvents);
    return () => {
      killAudioEvents();
      stopRecording();
      appState.remove();
    };
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => <PhAction>{item.target_user.name}</PhAction>,
      headerRight: () => (
        <PhLinkButton
          onPress={() => handleProfilePressed()}
          textStyle={{ color: colors.secondary }}
        >
          {i18n.t("see_profile")}
        </PhLinkButton>
      ),
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 1,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        height: Constants.statusBarHeight + 65,
      },
    });
    setupPusher();
    readMessages().then((r) => {
      setLoading(true);
      getChatMessages();
    });

    return () => {
      channel.unsubscribe();
      // socketService.pusher.unsubscribe(`match.${item.match_id}`);
    };
  }, []);

  const killAudioEvents = () => {
    DeviceEventEmitter.emit(STOP_LISTENER_STRING);
  };

  const onRecordingStatusUpdate = (status) => {
    let rd = status ? status.durationMillis : 0;
    setRecordingDuration(rd);
  };

  const startAudioRecording = async () => {
    setRecording(true);
    recorderService = new AudioRecorderService();
    recorderService.startAudioRecording();
    recorderService.setUpdateCallback(onRecordingStatusUpdate);
  };

  const sendRecordingMessage = async () => {
    Keyboard.dismiss();
    setRecording(false);
    setRecordingDuration(0);
    let recordingInfo = await recorderService.finishRecording();
    const params = {
      file: recordingInfo.audio,
      audio_duration: recordingInfo.audioDuration,
      match_id: item.match_id,
      type: "audio",
    };
    chatService.sendMessage(params);
  };

  const stopRecording = async () => {
    try {
      setRecordingDuration(0);
      setRecording(false);
      recorderService.stopRecording();
    } catch (e) {
      console.log(e);
    }
  };

  const readMessages = async () => {
    return chatService.readChatMessages(item.match_id);
  };

  const setupPusher = async () => {
    channel = socketService.subscribe(`match.${item.match_id}`);
    channel.bind("new-message", (e) => {
      const msg = e.payload;
      const m = setupMessageForChat(msg);
      setMessages((messages) => [m, ...messages]);
    });
  };

  const getChatMessages = async () => {
    try {
      const res = await chatService.getChatMessages(item.match_id);
      const msg = res.data.map((r) => {
        return setupMessageForChat(r);
      });
      setMessages(msg);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const setupMessageForChat = (message) => {
    const m = {
      _id: message.id,
      text: message.content,
      image:
        message.type == "image" && message.path
          ? `${environment.baseImgUrl}${message.path}`
          : null,
      audioDuration: message.audio_duration || 1,
      audio:
        message.type == "audio" && message.path
          ? `${environment.baseImgUrl}${message.path}`
          : null,
      read: message.read,
      user: {
        _id: message.user.id,
      },
      time: message.created_at,
    };

    if (m.audio) {
      // console.log(message)
    }

    return m;
  };

  const handleSend = async (message = null, image = null) => {
    try {
      var params = { match_id: item.match_id };
      if (image) {
        params.file = image;
        params.type = "image";
      } else {
        params.type = "text";
      }

      if (message) {
        params.content = message;
      }
      chatService.sendMessage(params);
    } catch (e) {
      console.log(e);
    }
  };

  const handleProfilePressed = () => {
    RootNavigation.navigate("ProfileDetailStack", {
      screen: "ProfileDetailScreen",
      params: { item: item.target_user },
    });
  };

  const EmptyStateChat = () => {
    return (
      <View
        style={{
          transform: [{ scaleY: -1 }, {scaleX: Platform.select({ios: 1, android: -1})}],
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            backgroundColor: colors.disabled,
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
          }}
          source={{
            uri: `${environment.baseImgUrl}${item.target_user.profile_picture[0]?.path}`,
          }}
        ></Image>
        <PhParagraph>{i18n.t("you_matched")}</PhParagraph>
        <PhHeader>{item.target_user.name}</PhHeader>
      </View>
    );
  };

  return (
    <PhFlatList
      {...props}
      loading={loading}
      length={messages?.length}
      safeAreaProps={{ mode: "noTop" }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      flatListProps={{
        inverted: true,
        data: messages,
        scrollToTop: false,
        renderItem: ({ item, index }) => {
          return item.user._id == session?.id ? (
            <RightChatBubble key={String(index)} currentMessage={item} />
          ) : (
            <LeftChatBubble key={String(index)} currentMessage={item} />
          );
        },
        keyExtractor: (item, index) => String(index),
        ListEmptyComponent: <EmptyStateChat />,
      }}
    >
      <InputContainer
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        stopRecording={stopRecording}
        startAudioRecording={startAudioRecording}
        sendRecordingMessage={sendRecordingMessage}
        handleSend={handleSend}
        cameraRef={cameraRef}
      />
      <PhCameraContainer
        cancelTitle={i18n.t("cancel")}
        libraryTitle={i18n.t("select_library")}
        cameraTitle={i18n.t("take_pic")}
        ref={cameraRef}
        onImageInfoReturned={(image) => {
          handleSend(null, image);
        }}
      />
    </PhFlatList>
  );
}
