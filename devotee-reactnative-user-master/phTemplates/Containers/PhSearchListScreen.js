import React, { useEffect, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, FlatList, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import HelperService from '../../services/HelperService';
import UserService from '../../services/UserService';
import { PhButton, PhLinkButton } from '../buttons';
import { PhSelectItem } from '../components';
import { PhSearchBarInput, PhTextInput } from '../inputs';
import { colors, measures } from '../PhStyles';
import { PhAction, PhHeader, PhParagraph } from '../typography';
import PhEmptyStateContainer from './PhEmptyStateContainer';
import PhLoadingContainer from './PhLoadingContainer';
import PhSafeAreaContainer from './PhSafeAreaContainer';
import i18n from '../../localization/AppLocalization';

// interface PhSearchListScreenRouteParams {
//     options: {
//         type: string, // tipo de lista, baseado nisso faz o get
//         title?: String, //titulo da tela 
//         removeLast?: Boolean, // remove o ultimo objeto ( gambiarra )
//         preSelectedItems?: Array, // um array com ids. Se existir, pre seleciona os itens na lista
//         allowEmptySelection?: Boolean, // coloca o primeiro item da lista como opção pra nao selecionar nenhum dos itens (uma selecao vazia)
//         allowMultiple?: Boolean, // se true, deixa selecionar multiplas opcoes na lista, devolvendo um array na resposta. Senao, devolve um objeto só
//         showDescription?: Boolean, // se true, mostra uma linha a mais com a descricao do item (os itens a serem mostrados tem que ter uma key description)
//         hasSearch?: Boolean, // se true, mostra a barrinha de pesquisa
//     },
//     SEARCH_LIST_RESPONSE_ID: String // key pra saber qual callback da resposta chamar (definida em cada tela, separado)
// }

export default function PhSearchListScreen(props) {
    const EMPTY_OPTION_STRING_KEY = 'EMPTY_OPTION_STRING_KEY'
    const scrollY = new Animated.Value(0)
    const options = props.route.params.options
    const SEARCH_LIST_RESPONSE_ID = props.route.params.SEARCH_LIST_RESPONSE_ID || 'SEARCH_LIST_DEFAULT_RESPONSE_ID'
    const [isRefreshing, setRefreshing] = useState(false)
    const [isVisible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const [suggestion, setSuggestion] = useState('')
    const [suggestionInputRef, setSuggestionInputRef] = useState()
    const [filteredItems, setFilteredItems] = useState([])
    const userService = new UserService()
    const helperService = new HelperService()
    const bottomSheetRef = useRef()

    const styles = {
        viewContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: measures.xSpace

        },

    }

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => filteredItems?.some(s => s.selected) ? <PhLinkButton containerStyle={{ paddingBottom: 0 }} textStyle={{ color: colors.secondary }} onPress={() => handleContinue()} >{i18n.t('done')}</PhLinkButton> : null
        })
    }, [filteredItems])

    useEffect(() => {
        setLoading(true)
        getItems()
    }, [])


    async function getItems() {

        let auxItems = []
        let res
        try {
            switch (options.type) {
                case 'user_type':
                    let types = [
                        { id: 'devotee', name: 'Devotee', description: i18n.t('devotee_text') },
                        { id: 'special', name: i18n.t('special'), description: i18n.t('special_text') },
                        { id: 'all', name: i18n.t('all'), description: '' },
                    ]
                    if (options.removeLast) {
                        types.splice(2, 1)
                    }
                    auxItems = types
                    preSelectItems(options.preSelectedItems, types)
                    break;
                case 'cid':
                    res = await userService.getCids()
                    auxItems = res
                    preSelectItems(options.preSelectedItems, res)
                    break;
                case 'things_i_use':
                    res = await userService.getThingsIUse()
                    auxItems = res
                    preSelectItems(options.preSelectedItems, res)
                    break;
                case 'medical_procedures':
                    res = await userService.getMedicalProcedures()
                    auxItems = res
                    preSelectItems(options.preSelectedItems, res)
                    break;
                case 'medicament':
                    res = await userService.getMedications()
                    auxItems = res
                    preSelectItems(options.preSelectedItems, res)
                    break;
                case 'hospital':
                    res = await userService.getHospitals()
                    auxItems = res
                    preSelectItems(options.preSelectedItems, res)
                    break;
                case 'orientation':
                    const it = userService.sexOrientation
                    auxItems = it
                    preSelectItems(options.preSelectedItems, it)
                    break;
                case 'gender':
                    setTimeout(() => {
                        var r = userService.getGenders()
                        var sIt = options.preSelectedItems
                        var selectedOption = ''
                        if (sIt && sIt[0]) {
                            switch (sIt[0]) {
                                case 'Male':
                                case 'Masculino':
                                    sIt = ['male']
                                    break;
                                case 'Female':
                                case 'Feminino':
                                    sIt = ['female']
                                    break;
                                case 'Other':
                                case 'Outro':
                                    sIt = ['other']
                                    break;
                                default:
                                    const s = r.filter(r => i18n.t(r.id) == sIt[0])
                                    if (s.length) {
                                        sIt[0] = s[0].id
                                    } else {
                                        r.unshift({ id: sIt[0], name: sIt[0] })
                                    }
                            }
                        }
                        auxItems = r
                        preSelectItems(sIt, r)
                    }, 500);
                    break;
                    
                    case 'gender_filter':
                        setTimeout(() => {
                            const r = userService.getGenderFilters()
                            console.log('R', r)
                        
                        auxItems = r
                        preSelectItems(options.preSelectedItems, r)
                    }, 500);
                    break;

                default: return

            }
            if (options.allowEmptySelection) {
                auxItems.unshift({
                    id: EMPTY_OPTION_STRING_KEY,
                    name: i18n.t('none')
                })
            }
            setItems(auxItems)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }

    }


    function preSelectItems(selectedItems, array) {
        const preSelectedItems = selectedItems || []
        if (preSelectedItems.length > 0) {
            array.map(it => {
                it.selected = preSelectedItems.some(y => it.id == y)
            })
        }
        setFilteredItems(array)
    }


    function refreshItems() {
        setRefreshing(true)
        getItems(options)
    }

    function filter(string) {
        let reg = /[\u0300-\u036f]/g
        var f = filteredItems.map(r => ({
            ...r,
            hidden: !(r.name && r.name.toLowerCase().normalize('NFD').replace(reg, '').includes(string.toLowerCase().normalize('NFD').replace(reg, '')) || string == '')
        }))
        setFilteredItems(f)

    }

    function handleItemPressed(item) {
        try {
            if (options.allowMultiple) {
                setFilteredItems(filteredItems.map(it => {
                    if (options.allowEmptySelection) {
                        if (item.id == EMPTY_OPTION_STRING_KEY) {
                            return { ...it, selected: it.id == item.id }
                        } else {
                            return { ...it, selected: it.id == EMPTY_OPTION_STRING_KEY ? false : it.id == item.id ? !it.selected : it.selected }
                        }
                    } else {
                        return { ...it, selected: it.id == item.id ? !it.selected : it.selected }
                    }
                }))
            } else {
                setFilteredItems(filteredItems.map(it => {
                    return { ...it, selected: item.id == it.id }
                }))
            }
        } catch (e) {
            console.log('erro no selected', e)
        }
    }

    function handleContinue() {
        try {
            let item = filteredItems.filter(it => it.selected)

            if (item[0] && item[0].id == EMPTY_OPTION_STRING_KEY) {
                item = []
            }
            props.navigation.goBack()
            DeviceEventEmitter.emit(SEARCH_LIST_RESPONSE_ID,
                { type: options.type, item: options.allowMultiple ? item : item[0] }
            )
        } catch (e) {
            console.log('erro no continue', e)
        }
    }

    function handleSuggest() {
        bottomSheetRef.current.open()
    }

    function handleSubmitSuggestion() {
        bottomSheetRef.current.close()
        helperService.showToast({
            visibilityTime: 2000,
            text1: i18n.t('suggestion_sent'),
            text2: `${i18n.t('user_reported_success')}`,
        });
        const params = {
            type: options.type,
            text: suggestion
        }
        setSuggestion('')
        console.log(params)
        return
        userService.sendSuggestion(params)
    }

    useEffect(() => {
        if (suggestionInputRef) {
            console.log('aqui ref')
            suggestionInputRef.focus()
        }
    }, [suggestionInputRef])

    return (

        <PhSafeAreaContainer statusBarStyle={{ barStyle: 'dark-content', backgroundColor: colors.white }}  >
            {
                loading ? <PhLoadingContainer /> :
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1 }}
                        data={filteredItems}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            !item.hidden ? <PhSelectItem onPress={() => handleItemPressed(item)} selected={item.selected}>

                                {
                                    options.showDescription ?
                                        <View style={{ flex: 1, paddingRight: measures.xSpace }}>
                                            <PhAction>{item.name}</PhAction>
                                            <PhParagraph style={{ color: colors.gray }} >{item.description}</PhParagraph>
                                        </View>
                                        :
                                        <PhParagraph>{item.name}</PhParagraph>

                                }


                            </PhSelectItem> : null
                        )}
                        refreshing={isRefreshing}
                        onRefresh={() => refreshItems()}
                        scrollEventThrottle={16}
                        ListHeaderComponent={
                            <>
                                <PhHeader style={{ paddingHorizontal: measures.ySpace }} >{options.title || i18n.t('search')}</PhHeader>
                                {
                                    options.hasSearch === undefined || props.hasSearch === true ? <PhSearchBarInput onSearchChanged={(string) => filter(string)} /> : null
                                }
                            </>
                        }
                        ListEmptyComponent={<PhEmptyStateContainer />}
                        ListFooterComponent={
                            ['hospital', 'medicament', 'medical_procedures', 'cid'].includes(options.type) ? <PhSelectItem onPress={() => handleSuggest()} divider={false}>
                                <View style={{ flex: 1, paddingRight: measures.xSpace }}>
                                    <PhAction>{i18n.t('suggest')}</PhAction>
                                </View>
                            </PhSelectItem> : null
                        }

                    >
                    </FlatList>
            }
            <RBSheet
                animationType={'fade'}
                ref={bottomSheetRef}
                height={measures.screenHeight * 0.35}
                customStyles={{
                    container: {
                        borderTopRightRadius: 18,
                        borderTopLeftRadius: 18,
                    },
                    draggableIcon: {
                        backgroundColor: colors.gray
                    }
                }
                }
            >
                <View style={{ flex: 1, paddingVertical: measures.xSpace, paddingRight: measures.xSpace }} >
                    <View style={{ paddingLeft: measures.xSpace }} >
                        <PhHeader style={{ paddingBottom: 12 }} >{`${i18n.t('suggest')} ${i18n.t(`${options.type}_label`)}`}</PhHeader>
                    </View>
                    <PhTextInput
                        onRef={(r) => {
                            if (r) {
                                setSuggestionInputRef(r)
                            }
                        }}
                        labelTitle={i18n.t('suggestion_label')}
                        placeholder={i18n.t('suggestion_placeholder')}
                        value={suggestion}
                        autoComplete={"off"}
                        onChangeText={(text) => setSuggestion(text)}
                    />
                    <PhButton disabled={!suggestion} onPress={() => handleSubmitSuggestion()} containerStyle={{ marginTop: measures.ySpace }} >{i18n.t('suggest')}</PhButton>
                </View>
            </RBSheet >
        </PhSafeAreaContainer>

    )


}
