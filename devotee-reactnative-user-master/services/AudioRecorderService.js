import Pusher from "pusher-js/react-native";
import environment from "../environment";
import { NetworkService } from "./NetworkService";
import { store } from "../stores/store";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import mime from "mime";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from "expo-av/build/Audio";

export default class AudioRecorderService {
  MAX_AUDIO_RECORDING_LENGTH = 120000;
  constructor() {
    this.recording = new Audio.Recording();
  }

  setUpdateCallback(callback) {
    this.recording.setOnRecordingStatusUpdate(callback);
  }
  async startAudioRecording() {
    try {
      console.log("Requesting permissions..");
      recording = new Audio.Recording();
      const permission = await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      await this.recording.prepareToRecordAsync({
        isMeteringEnabled: true,
        durationMillis: this.MAX_AUDIO_RECORDING_LENGTH,
        android: {
          extension: ".m4a",
          outputFormat: AndroidOutputFormat.MPEG_4,
          // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: AndroidAudioEncoder.AAC,
          // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: IOSOutputFormat.MPEG4AAC,
          // audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
          audioQuality: IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await this.recording.startAsync();
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async stopRecording() {
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (e) {
      console.log(e);
    }
  }

  async finishRecording() {
    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const tp = mime.getType(uri);
      var audioItem = {
        uri,
        type: tp,
        name: `chat-audio.${tp.split("/")[1]}`,
      };
      const { sound, status } =
        await this.recording.createNewLoadedSoundAsync();
      var params = {
        audio: audioItem,
        audioDuration: status.durationMillis || 0,
      };
      return params;
    } catch (e) {
      console.log("finishRecording", e);
      return null;
    }
  }
}
