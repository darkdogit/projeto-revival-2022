import React, { useEffect, useMemo, useRef, useState } from "react";
import { DeviceEventEmitter, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import environment from "../../environment";
import { PhLinkButton } from "../../phTemplates/buttons";
import { PhDivider, PhRawListItem, PhSelectItem } from "../../phTemplates/components";
import { PhCameraContainer, PhSafeAreaContainer } from "../../phTemplates/containers";
import { PhSelectInput, PhSwitchInput, PhTextAreaInput, PhTextInput } from "../../phTemplates/inputs";
import { colors, measures } from "../../phTemplates/PhStyles";
import { PhAction, PhHeader, PhParagraph } from "../../phTemplates/typography";
import { Badge, PhRow, PictureContainer, SwipeCard } from "../../projectsComponents";
import * as RootNavigation from "../../routeStacks/RootNavigation";
import HelperService from "../../services/HelperService";
import { SessionService } from "../../services/SessionService";
import UserService from "../../services/UserService";
import i18n from "../../localization/AppLocalization";
export default function MyProfileScreen(props) {
  const SEARCH_LIST_RESPONSE_ID = "PH_SEARCH_LIST_RESPONSE_MYPROFILE";
  const SEARCH_LIST_PAGINATION_RESPONSE_ID = "SEARCH_LIST_PAGINATION_RESPONSE_ID";

  const sessionService = new SessionService();
  const session = sessionService.getSession();
  const helperService = new HelperService();
  const userService = new UserService();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState({ ...session });
  const [imageIndex, setImageIndex] = useState();
  const [isSubmitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({})
  const cameraRef = useRef();
  const refs = {};
  const [routes] = React.useState([
    { key: "first", title: i18n.t("edit") },
    { key: "second", title: i18n.t("view") },
  ]);

  const validationSchema = Yup.object().shape({});

  const styles = {
    indicatorStyle: {
      backgroundColor: colors.secondary,
      height: 4,
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
    },
    tabBarStyle: {
      elevation: 0,
      marginHorizontal: measures.xSpace,
      backgroundColor: colors.white,
    },
    tabStyle: {
      width: "auto",
      paddingHorizontal: measures.xSpace,
    },
  };
  const renderLabel = ({ route, focused, color }) => (
    <PhAction
      style={ {
        textAlign: "left",
        color: focused ? colors.secondary : colors.disabled,
      } }
    >
      { route.title }
    </PhAction>
  );
  const renderTabBar = (props) => (
    <TabBar
      { ...props }
      indicatorStyle={ styles.indicatorStyle }
      style={ styles.tabBarStyle }
      renderLabel={ renderLabel }
      tabStyle={ styles.tabStyle }
      scrollEnabled={ false }
    />
  );


  useEffect(() => {
    if (!Object.keys(formValues).length) {
      getInitialValues()
    }
    const searchListEmmiterListener = DeviceEventEmitter.addListener(
      SEARCH_LIST_RESPONSE_ID,
      ({ type, item }) => {
        var val = {};
        if (type == "gender") {
          setFormValues((formValues) => ({ ...formValues, gender: item.name, gender_id: item.id }));
        } else if (type == "orientation") {
          setFormValues((formValues) => ({ ...formValues, sexual_orientation: item.id }));
        } else if (type == "user_type") {
          setFormValues((formValues) => ({ ...formValues, account_type: item.id }));
        }
      }
    );
    const searchListPaginationEmmiterListener = DeviceEventEmitter.addListener(
      SEARCH_LIST_PAGINATION_RESPONSE_ID,
      ({ type, item }) => {
        console.log(type, item)
        var val = {};
        val[`${type}_values`] = item
        val[`${type}`] = item.map((r) => r.id);
        val[`${type}_text`] = item
          .map((r) => r.name)
          .join(", ");

        setFormValues((formValues) => ({ ...formValues, ...val }));
      }
    );

    return () => {
      searchListEmmiterListener.remove()
      searchListPaginationEmmiterListener.remove()
    }
  }, [])

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: i18n.t("profile"),
      headerRight: () =>
        index == 0 ? (
          <PhLinkButton
            loading={ isSubmitting }
            onPress={ () => handleSave() }
            textStyle={ { color: colors.secondary, padding: 0, margin: 0 } }
          >
            { i18n.t("save") }
          </PhLinkButton>
        ) : null,
    });
  }, [index, isSubmitting, formValues]);

  function ItemContainer({ item, imageStyle }) {
    const styles = {
      image: {
        resizeMode: "contain",
        minWidth: 30,
        ...imageStyle,
      },
    };
    return useMemo(() => (
      <PhRawListItem divider chevron onPress={ () => item.onPress() }>
        <View style={ { flexDirection: "row", alignItems: "center" } }>
          <View style={ { paddingRight: 12 } }>
            <Image style={ styles.image } source={ item.image } />
          </View>
          <View>
            <PhAction>{ item.title }</PhAction>
            <PhParagraph>{ item.subtitle }</PhParagraph>
          </View>
        </View>
      </PhRawListItem>
    ));
  }

  function handlePlus() {
    RootNavigation.navigate("Plus");
  }

  function handleImagePressed(index) {
    setImageIndex(index);
    cameraRef.current.openSheet();
  }

  function goToSearch(options) {
    RootNavigation.navigate("SelectListStack", {
      screen: "SelectListScreen",
      params: { options, SEARCH_LIST_RESPONSE_ID },
    });
  }

  function goToSearchPagination(options) {
    RootNavigation.navigate('SelectListStack', { screen: 'SelectListPaginationScreen', params: { options, SEARCH_LIST_RESPONSE_ID: SEARCH_LIST_PAGINATION_RESPONSE_ID } })
  }

  function getInitialValues() {

    const hospital = {
      names: item.my_hospitals?.map((r) => r.hospital.name).join(", "),
      ids: item.my_hospitals?.map((r) => r.hospital.id),
      values: item.my_hospitals?.map((r) => {
        return {
          id: r.hospital.id,
          name: r.hospital.name
        }
      }),
    };


    const medicament = {
      names: item.my_drugs
        ?.map((r) =>
          userService.loc == "pt-BR" ? r.drug.name : r.drug.name_en
        )
        .join(", "),
      ids: item.my_drugs?.map((r) => r.drug.id),
      values: item.my_drugs?.map((r) => {
        return {
          id: r.drug.id,
          name: userService.loc == "pt-BR" ? r.drug.name : r.drug.name_en
        }
      }),
    };

    const things_i_use = {
      names: item.my_things
        ?.map((r) =>
          userService.loc == "pt-BR" ? r.thing.name : r.thing.name_en
        )
        .join(", "),
      ids: item.my_things?.map((r) => r.thing.id),
      values: item.my_things?.map((r) => {
        return {
          id: r.thing.id,
          name: userService.loc == "pt-BR" ? r.thing.name : r.thing.name_en
        }
      }),
    };


    const medical_procedures = {
      names: item.medical_procedures
        ?.map((r) =>
          userService.loc == "pt-BR"
            ? r.medical_procedures.name
            : r.medical_procedures.name_en
        )
        .join(", "),
      ids: item.medical_procedures?.map((r) => r.medical_procedures.id),
      values: item.medical_procedures?.map((r) => {
        return {
          id: r.medical_procedures.id,
          name: userService.loc == "pt-BR"
            ? r.medical_procedures.name
            : r.medical_procedures.name_en
        }
      }),
    };

    const cid = {
      names: item.my_cids
        ?.map((r) =>
          userService.loc == "pt-BR" ? r.cid.description : r.cid.description_en
        )
        .join(", "),
      ids: item.my_cids?.map((r) => r.cid.id),
      values: item.my_cids?.map((r) => {
        return {
          id: r.cid.id,
          name: userService.loc == "pt-BR" ? r.cid.description : r.cid.description_en
        }
      }),
    };

    var gender = session?.gender;
    var includes = session?.show_as_gender;

    if(gender) {
      if (gender.toLowerCase() == "male" || gender.toLowerCase() == "masculino") {
        gender = i18n.t("male");
        includes = "male";
      } else {
        if (
          gender.toLowerCase() == "female" ||
          gender.toLowerCase() == "feminino"
        ) {
          gender = i18n.t("female");
          includes = "female";
        } 
      }
    }

    const initialValues = {
      about: session?.about || "",
      occupation: session?.occupation || "",
      disability_description: session?.disability_description || "",

      gender: gender,
      includes: includes,
      sexual_orientation: session?.sexual_orientation,
      illicit_drugs: session?.illicit_drugs || "",
      tiic: session?.tiic || false,
      account_type: session.account_type,

      hospital_text: hospital.names,
      hospital: hospital.ids,
      hospital_values: hospital.values,

      things_i_use_text: things_i_use.names,
      things_i_use: things_i_use.ids,
      things_i_use_values: things_i_use.values,

      medicament_text: medicament.names,
      medicament: medicament.ids,
      medicament_values: medicament.values,

      medical_procedures_text: medical_procedures.names,
      medical_procedures: medical_procedures.ids,
      medical_procedures_values: medical_procedures.values,

      cid_text: cid.names,
      cid: cid.ids,
      cid_values: cid.values,

      show_me: session?.show_me,
      prejudice: session?.prejudice,
      images: [],
      show_distance: session?.show_distance,
      show_age: session?.show_age,
    };
    setFormValues(initialValues)
  }

  async function handleSave() {
    try {
      Keyboard.dismiss();
      setSubmitting(true);
      await userService.updateProfile(formValues)
      await userService.syncUserWithApi();
      helperService.showToast({
        text1: i18n.t("success"),
        text2: i18n.t("info_saved"),
      });
      DeviceEventEmitter.emit("filtersChanged");
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  }

  function profilePressed() {
    RootNavigation.navigate("ProfileDetailStack", {
      screen: "ProfileDetailScreen",
      params: { item: item },
    });
  }

  function CardPreview() {
    const s = useSelector((state) => state.sessionReducer);
    return (
      <View style={ { padding: measures.xSpace } }>
        {/* passar a session aqui */ }
        <SwipeCard
          card={ { ...s, images: s?.profile_picture } }
          buttonsContainerStyle={ { bottom: measures.ySpace } }
          style={ {
            height: measures.screenHeight * 0.75 - measures.statusBarHeight,
          } }
          profilePressed={ profilePressed }
        />
      </View>
    );
  }

  return (
    <PhSafeAreaContainer mode={'onlyHorizontal'}>
      <TabView
        navigationState={ { index, routes } }
        renderScene={ ({ route }) => {
          switch (route.key) {
            case "first":
              return (
                <KeyboardAvoidingView
                  behavior={ Platform.OS == "ios" ? "padding" : null }
                  keyboardVerticalOffset={
                    Platform.OS == "ios" ? measures.statusBarHeight + 40 : null
                  }
                  style={ { flex: 1 } }
                >
                  <ScrollView
                    contentContainerStyle={ {
                      paddingBottom: measures.bottomSpace,
                    } }
                  >
                    <View style={ { flex: 1 } }>
                      {

                        formValues.account_type != 'curious' ?
                          <View>

                            <PhHeader style={ { padding: measures.xSpace } }>
                              { i18n.t("pictures") }
                            </PhHeader>
                            <View
                              style={ {
                                flexWrap: "wrap",
                                flex: 1,
                                flexDirection: "row",
                                paddingHorizontal: measures.xSpace / 2,
                              } }
                            >
                              { Array(6)
                                .fill("")
                                .map((r, i) => (
                                  <PictureContainer
                                    key={ `${i}` }
                                    image={
                                      (formValues.images && formValues.images[i])
                                        ? formValues.images[i]
                                        : item.profile_picture[i]
                                          ? {
                                            uri: `${environment.baseImgUrl}${item.profile_picture[i].path}`,
                                          }
                                          : null
                                    }
                                    onPress={ () => handleImagePressed(i) }
                                  />
                                )) }
                            </View>
                            <PhDivider
                              style={ { marginTop: measures.ySpace } }
                            />
                          </View> : null
                      }
                      <PhHeader style={ { padding: measures.xSpace } }>
                        { i18n.t("about") }
                      </PhHeader>

                      { formValues.account_type != "curious" ? (
                        <PhSelectInput
                          onRef={ (r) => {
                            refs.accounType = r;
                          } }
                          value={ i18n.t(formValues.account_type) }
                          onPress={ () =>
                            goToSearch({
                              title: i18n.t("select_account_type"),
                              type: "user_type",
                              preSelectedItems: [
                                formValues.account_type,
                              ],
                              removeLast: true,
                            })
                          }
                          labelTitle={ i18n.t("account_type") }
                          placeholder={ i18n.t("select") }
                        />
                      ) : null }

                      <PhTextAreaInput
                        onRef={ (r) => {
                          refs.about = r;
                        } }
                        labelTitle={ i18n.t("about_me") }
                        placeholder={ i18n.t("about_me") }
                        value={ formValues.about }
                        autoComplete={ 'off' }
                        onChangeText={ (text) =>
                          setFormValues({
                            ...formValues,
                            "about": text
                          })
                        }
                      />
                      <PhTextInput
                        onRef={ (r) => {
                          refs.occupation = r;
                        } }
                        labelTitle={ i18n.t("profession") }
                        placeholder={ i18n.t("profession") }
                        value={ formValues.occupation }
                        maxLength={ 35 }
                        autoComplete={ 'off' }
                        onChangeText={ (text) =>
                          setFormValues({
                            ...formValues,
                            "occupation": text
                          })
                        }
                      />

                      <PhSelectInput
                        onRef={ (r) => {
                          refs.gender = r;
                        } }
                        value={ formValues.gender }
                        onPress={ () =>
                          goToSearch({
                            title: i18n.t("select_gender"),
                            type: "gender",
                            preSelectedItems: [formValues.gender],
                          })
                        }
                        labelTitle={ i18n.t("iam") }
                        placeholder={ i18n.t("select") }
                      />

                      { formValues.gender_id &&
                        formValues.gender_id != "male" &&
                        formValues.gender_id != "female" ? (
                        <>
                          { formValues.gender_id == "other" ? (
                            <PhTextInput
                              required
                              onRef={ (r) => {
                                refs.gender_other = r;
                              } }
                              labelTitle={ i18n.t("gender") }
                              placeholder={ i18n.t("gender_placeholder") }
                              autoCapitalize={ "words" }
                              value={ formValues.gender_other }
                              autoComplete={ 'off' }
                              onChangeText={ (text) => {
                                // console.log('text', text)
                                setFormValues({
                                  ...formValues,
                                  "gender_other": text
                                });
                              } }
                            />
                          ) : null }

                          <View
                            style={ { paddingVertical: measures.ySpace } }
                          >
                            <PhHeader
                              style={ {
                                paddingHorizontal: measures.xSpace,
                              } }
                            >
                              { i18n.t("include_me_as") }
                            </PhHeader>
                            <PhSelectItem
                              selected={
                                formValues.includes == "female"
                              }
                              onPress={ () =>
                                setFormValues({
                                  ...formValues,
                                  includes: 'female'
                                })
                              }
                            >
                              <PhParagraph>
                                { i18n.t("female") }
                              </PhParagraph>
                            </PhSelectItem>
                            <PhSelectItem
                              selected={
                                formValues.includes == "male"
                              }
                              onPress={ () =>
                                setFormValues({
                                  ...formValues,
                                  includes: 'male'
                                })
                              }
                            >
                              <PhParagraph>
                                { i18n.t("male") }
                              </PhParagraph>
                            </PhSelectItem>
                          </View>
                        </>
                      ) : null }

                      <PhSelectInput
                        value={ formValues.sexual_orientation ? i18n.t(formValues.sexual_orientation) : '' }
                        onPress={ () =>
                          goToSearch({
                            title: i18n.t("sexual_orientation"),
                            type: "orientation",
                            preSelectedItems: [
                              formValues.sexual_orientation,
                            ],
                          })
                        }
                        labelTitle={ i18n.t("sexual_orientation") }
                        placeholder={ i18n.t("sexual_orientation") }
                      />
                      <PhSwitchInput
                        label={ i18n.t("have_tiic") }
                        value={ formValues.tiic }
                        onValueChange={ (v) =>
                          setFormValues({
                            ...formValues,
                            "tiic": v
                          })
                        }
                      />


                      { formValues.account_type != "curious" ? (
                        <PhSwitchInput
                          label={ i18n.t("show_me_devotee") }
                          value={ formValues.show_me }
                          onValueChange={ (v) =>
                            setFormValues({
                              ...formValues,
                              "show_me": v
                            })
                          }
                          border={ false }
                        />
                      ) : null }

                      <PhDivider />

                      { formValues.account_type == "special" ? (
                        <>
                          <PhHeader
                            style={ {
                              paddingTop: measures.ySpace + 12,
                              paddingHorizontal: measures.xSpace,
                              paddingRight: 8,
                            } }
                          >
                            { i18n.t("disability") }
                          </PhHeader>
                          <PhTextAreaInput
                            scrollEnabled={ false }
                            onRef={ (r) => {
                              refs.about_disability = r;
                            } }
                            labelTitle={ i18n.t("what_disability") }
                            placeholder={ i18n.t("what_disability") }
                            value={
                              formValues.disability_description
                            }
                            autoComplete={ 'off' }
                            multiline={ true }
                            onChangeText={ (text) =>
                              setFormValues({
                                ...formValues,
                                "disability_description": text
                              })
                            }
                          />
                          <PhSelectInput
                            value={ formValues.cid_text }
                            onPress={ () =>
                              goToSearchPagination({
                                title: i18n.t("select_cid"),
                                type: "cid",
                                allowMultiple: true,
                                preSelectedItems: formValues.cid_values,
                              })
                            }
                            labelTitle={ i18n.t("cid_label") }
                            placeholder={ i18n.t("cid_placeholder") }
                          />

                          <PhSelectInput
                            value={
                              formValues.medical_procedures_text
                            }
                            onPress={ () =>
                              goToSearchPagination({
                                title: i18n.t(
                                  "select_medical_procedures"
                                ),
                                type: "medical_procedures",
                                allowMultiple: true,
                                preSelectedItems:
                                  formValues.medical_procedures_values,
                              })
                            }
                            labelTitle={ i18n.t(
                              "medical_procedures_label"
                            ) }
                            placeholder={ i18n.t(
                              "medical_procedures_placeholder"
                            ) }
                          />
                          <PhSelectInput
                            value={ formValues.medicament_text }
                            onPress={ () =>
                              goToSearchPagination({
                                title: i18n.t("select_medications"),
                                type: "medicament",
                                allowMultiple: true,
                                preSelectedItems:
                                  formValues.medicament_values,
                              })
                            }
                            labelTitle={ i18n.t("medications_label") }
                            placeholder={ i18n.t(
                              "medications_placeholder"
                            ) }
                          />
                          <PhSelectInput
                            value={ formValues.hospital_text }
                            onPress={ () =>
                              goToSearchPagination({
                                title: i18n.t("select_hospitals"),
                                type: "hospital",
                                allowMultiple: true,
                                showDescription: true,
                                preSelectedItems:
                                  formValues.hospital_values,
                              })
                            }
                            labelTitle={ i18n.t("hospitals_label") }
                            placeholder={ i18n.t(
                              "hospitals_placeholder"
                            ) }
                          />

                          <PhSelectInput
                            value={ formValues.things_i_use_text }
                            onPress={ () =>
                              goToSearchPagination({
                                title: i18n.t("things_i_use_label"),
                                type: "things_i_use",
                                allowMultiple: true,
                                showDescription: false,
                                preSelectedItems:
                                  formValues.things_i_use_values,
                              })
                            }
                            labelTitle={ i18n.t("things_i_use_label") }
                            placeholder={ i18n.t(
                              "things_i_use_placeholder"
                            ) }
                          />
                          <PhSwitchInput
                            label={ i18n.t("suffer_prejudice") }
                            value={ formValues.prejudice }
                            onValueChange={ (v) =>
                              setFormValues({
                                ...formValues,
                                "prejudice": v
                              })
                            }
                          />
                        </>
                      ) : null }

                      { session?.premiumAccount ? (
                        <>
                          <PhRow
                            justifyStart
                            style={ {
                              paddingHorizontal: measures.ySpace,
                              paddingTop: measures.ySpace + 12,
                            } }
                          >
                            <PhHeader style={ { paddingRight: 8 } }>
                              { i18n.t("preferences") }
                            </PhHeader>
                            <Badge
                              type={ "special" }
                              style={ { maxWidth: 200 } }
                              title={ "Devotee +" }
                            />
                          </PhRow>

                          <PhSwitchInput
                            label={ i18n.t("show_age") }
                            value={ formValues.show_age }
                            onValueChange={ (v) =>
                              setFormValues({
                                ...formValues,
                                "show_age": v
                              })
                            }
                          />

                          <PhSwitchInput
                            label={ i18n.t("show_distance") }
                            value={ formValues.show_distance }
                            onValueChange={ (v) =>
                              setFormValues({
                                ...formValues,
                                "show_distance": v
                              })
                            }
                          />
                        </>
                      ) : null }

                      <PhCameraContainer
                        cancelTitle={ i18n.t("cancel") }
                        libraryTitle={ i18n.t("select_library") }
                        cameraTitle={ i18n.t("take_pic") }
                        ref={ cameraRef }
                        onImageInfoReturned={ (image) => {
                          var p = formValues.images;
                          p[imageIndex] = {
                            ...image,
                          };
                          setFormValues({
                            ...formValues,
                            "images": p
                          });
                        } }
                      />
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              );
              break;

            case "second":
              return <CardPreview />;
              break;
          }
        } }
        onIndexChange={ setIndex }
        renderTabBar={ renderTabBar }
        initialLayout={ { width: layout.width } }
      />
    </PhSafeAreaContainer>
  );
}
