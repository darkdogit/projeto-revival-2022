import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import i18n from "../../localization/AppLocalization";
import { PhCirclePulseAnimation } from "../../phTemplates/components";
import { PhTextInput } from "../../phTemplates/inputs";
import { colors, measures } from "../../phTemplates/PhStyles";
import { PhAction, PhParagraph } from "../../phTemplates/typography";
import { PhRow } from "../../projectsComponents";
import HelperService from "../../services/HelperService";

const helperService = new HelperService();

export default function InputContainer({
  isRecording,
  recordingDuration,
  stopRecording,
  startAudioRecording,
  sendRecordingMessage,
  handleSend,
  cameraRef,
}) {
  const [textMessage, setTextMessage] = useState("");
  const styles = {
    mainContainer: {
      paddingRight: measures.xSpace,
      paddingBottom: measures.ySpace,
      minHeight: 70,
      paddingTop: 10,
    },
    inputView: {
      flex: 5,
      position: "relative",
      justifyContent: "center",
    },
    inputContainer: {
      width: null,
      borderWidth: 1,
      borderColor: colors.lineGray,
      borderRadius: 20,
      paddingBottom: 0,
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: measures.xSpace * 3,
    },
    input: {
      marginTop: 0,
      // minHeight: 45,
    },
    sendButton: {
      position: "absolute",
      right: measures.xSpace + 10,
      paddingHorizontal: 8,
    },
    actionButtons: {
      paddingHorizontal: 8,
    },
  };
  function handleSendMessage() {
    handleSend(textMessage);
    setTextMessage("");
  }
  function handleCamera() {
    Keyboard.dismiss();
    cameraRef.current.openSheet();
  }
  return (
    <PhRow noFlex justifyEnd style={styles.mainContainer}>
      {!isRecording ? (
        <>
          <View style={styles.inputView}>
            <PhTextInput
              multiline
              border={false}
              placeholder={i18n.t("type_message")}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={textMessage}
              blurOnSubmit={false}
              autoComplete={"off"}
              onChangeText={(text) => {
                if (text.trim().length == 0) {
                  setTextMessage("");
                } else {
                  setTextMessage(text);
                }
              }}
            />
            <Pressable
              onPress={handleSendMessage}
              style={styles.sendButton}
              disabled={!textMessage}
            >
              <PhAction
                style={{
                  color: textMessage ? colors.secondary : colors.disabled,
                }}
              >
                {i18n.t("send")}
              </PhAction>
            </Pressable>
          </View>
          <PhRow justifyEnd style={styles.actionButtonsView}>
            <Pressable
              onPress={() => startAudioRecording()}
              style={styles.actionButtons}
            >
              <FontAwesome
                name={"microphone"}
                color={colors.secondary}
                size={23}
              />
            </Pressable>
            <Pressable onPress={handleCamera} style={styles.actionButtons}>
              <FontAwesome name={"camera"} color={colors.secondary} size={20} />
            </Pressable>
          </PhRow>
        </>
      ) : (
        <>
          <View style={styles.inputView}>
            <PhRow justifyBetween style={{ paddingLeft: 10 }}>
              <PhRow justifyStart>
                <PhCirclePulseAnimation color={colors.red} size={30} />
                <PhParagraph style={{ paddingLeft: 10, color: colors.gray }}>
                  {helperService.getFormattedTimer(recordingDuration)}
                </PhParagraph>
              </PhRow>
              <PhRow noFlex justifyCenter>
                <Pressable
                  onPress={() => stopRecording()}
                  style={styles.actionButtons}
                >
                  <PhAction style={{ color: colors.primary }}>
                    {i18n.t("cancel")}
                  </PhAction>
                </Pressable>
              </PhRow>
              <View style={{ flex: 0.7 }}></View>
            </PhRow>
          </View>
          <Pressable
            onPress={() => sendRecordingMessage()}
            style={{ ...styles.actionButtons, zIndex: 99 }}
          >
            <PhRow justifyEnd noFlex>
              <FontAwesome name={"send"} color={colors.secondary} size={20} />
            </PhRow>
          </Pressable>
        </>
      )}
    </PhRow>
  );
}
