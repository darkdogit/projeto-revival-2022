import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, Pressable, View } from "react-native";
import { PhProgressBar } from "../../phTemplates/components";
import { colors } from "../../phTemplates/PhStyles";
import { PhLabel } from "../../phTemplates/typography";
import HelperService from "../../services/HelperService";

const DEFAULT_MESSAGE_RADIUS = 20;
const MAX_AUDIO_RECORDING_LENGTH = 120000;

const MessageAudioContainer = ({ currentMessage }) => {
  let barLength = 50; // minimo de tamanho q a barra de audio deve ter.. pra audios pequenos
  const [isPlaying, setIsPlaying] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const [durationString, setDurationString] = useState("");
  const [width, setWidth] = useState(0);
  const helperService = new HelperService();
  const [playBack, setPlayBack] = useState();
  const [soundObj, setSoundObj] = useState();
  const STOP_LISTENER_STRING = "STOP_LISTENER_STRING";
  const PAUSE_ALL_LISTENER_STRING = "PAUSE_ALL_LISTENER_STRING";
  const progressBarRef = useRef();
  // playerService.setUpdateCallback(_onPlaybackStatusUpdate)
  // const [durationProgress, setDurationProgress] = useState()

  useEffect(() => {
    formatDuration();
    if (currentMessage.audioDuration >= MAX_AUDIO_RECORDING_LENGTH) {
      barLength = 200;
    } else if (currentMessage.audioDuration > 30000) {
      barLength =
        (currentMessage.audioDuration * 200) / MAX_AUDIO_RECORDING_LENGTH;
    }
  }, []);

  DeviceEventEmitter.addListener(STOP_LISTENER_STRING, async () => {
    try {
      if (soundObj && soundObj.isLoaded) {
        if (soundObj.isPlaying) {
          const st = await playBack.setStatusAsync({ shouldPlay: false });
        }
      }
      if (playBack && playBack.sound) {
        playBack.sound.unloadAsync();
      }
    } catch (e) {
      console.log(e);
    }
  });
  DeviceEventEmitter.addListener(PAUSE_ALL_LISTENER_STRING, async (msg) => {
    try {
      if (msg._id != currentMessage._id) {
        if (soundObj && soundObj.isLoaded) {
          if (soundObj.isPlaying) {
            const st = await playBack.setStatusAsync({ shouldPlay: false });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  async function playAudio() {
    DeviceEventEmitter.emit(PAUSE_ALL_LISTENER_STRING, currentMessage);
    //primeira vez
    if (!soundObj) {
      console.log("first");
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const pb = new Audio.Sound();

      console.log("AUDIO", JSON.stringify(currentMessage, null, 4));

      await pb.loadAsync({
        uri: currentMessage.audio,
        // playsInSilentModeIOS: true,
        shouldPlay: true,
      });
      pb.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      const st = await pb.playAsync();
      setPlayBack(pb);
      setSoundObj(st);
      return;
    }

    //pause
    if (soundObj.isLoaded && soundObj.isPlaying) {
      console.log("pause");
      const st = await playBack.setStatusAsync({ shouldPlay: false });
      console.log(st);
      setSoundObj(st);
      return;
    }

    //resume
    if (soundObj.isLoaded && !soundObj.isPlaying) {
      console.log("resume");
      let position = soundObj.positionMillis;
      if (soundObj.positionMillis == soundObj.durationMillis) {
        position = 0;
      }
      const st = await playBack.playFromPositionAsync(position);
      console.log(st);
      setSoundObj(st);
      return;
    }
  }

  function _onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      // console.log('status', status)
      setSoundObj(status);

      if (progressBarRef?.current) {
        let progress = status.positionMillis;
        if (status.durationMillis == status.positionMillis) {
          progress = 0;
        }
        progressBarRef.current.setBarProgress(progress);
      }

      if (status.durationMillis == status.positionMillis) {
        formatDuration();
      } else {
        formatDuration(status.durationMillis - status.positionMillis);
      }
    }
  }

  function formatDuration(t = null) {
    const timeInMilis = t ? t : currentMessage.audioDuration;
    setDurationString(helperService.getFormattedTimer(timeInMilis));
  }

  const styles = {
    image: {
      height: 120,
      width: 180,
      borderRadius: DEFAULT_MESSAGE_RADIUS,
      borderBottomRightRadius: 0,
    },
  };
  return (
    <View style={{ padding: 10 }}>
      {
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!soundObj || !soundObj.isPlaying ? (
            <Pressable onPress={() => playAudio()}>
              <MaterialCommunityIcons
                name={"play-circle-outline"}
                color={colors.white}
                size={45}
              />
            </Pressable>
          ) : null}
          {soundObj && soundObj.isPlaying ? (
            <Pressable onPress={() => playAudio()}>
              <MaterialCommunityIcons
                name={"pause-circle-outline"}
                color={colors.white}
                size={45}
              />
            </Pressable>
          ) : null}
          <View>
            <PhProgressBar
              ref={progressBarRef}
              barHeight={2}
              inactiveColor={colors.whiteTransparent}
              activeColor={colors.white}
              style={{ width: barLength }}
              max={currentMessage.audioDuration}
            />
            <PhLabel style={{ paddingTop: 3, color: colors.white }}>
              {durationString}
            </PhLabel>
          </View>

          {/* <View style={{ marginHorizontal: 5 }} >
                        <View style={{ height: 2, width: barLength, backgroundColor: colors.white }} >
                        <View style={{ height: '100%', width: `${width}%`, backgroundColor: colors.secondary }} ></View>
                        </View>
                    </View> */}
        </View>
      }
    </View>
  );
};

export default React.memo(MessageAudioContainer);
