import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Keyboard, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PhButton, PhLinkButton } from '../phTemplates/buttons';
import { PhSelectItem } from '../phTemplates/components';
import { PhLoadingContainer, PhSafeAreaContainer } from '../phTemplates/containers';
import { PhSearchBarInput, PhTextInput } from '../phTemplates/inputs';
import { colors, measures } from '../phTemplates/PhStyles';
import { PhAction, PhHeader, PhParagraph } from '../phTemplates/typography';
import HelperService from '../services/HelperService';
import UserService from '../services/UserService';
import i18n from '../localization/AppLocalization';


// interface SearchPaginationListScreenProps {
//     options: {
//         type: string, // tipo de lista, baseado nisso faz o get
//         title?: String, //titulo da tela 
//         preSelectedItems?: Array, // um array com ids. Se existir, pre seleciona os itens na lista
//         allowEmptySelection?: Boolean, // coloca o primeiro item da lista como opção pra nao selecionar nenhum dos itens (uma selecao vazia)
//         allowMultiple?: Boolean, // se true, deixa selecionar multiplas opcoes na lista, devolvendo um array na resposta. Senao, devolve um objeto só
//         showDescription?: Boolean, // se true, mostra uma linha a mais com a descricao do item (os itens a serem mostrados tem que ter uma key description)
//         hasSearch?: Boolean, // se true, mostra a barrinha de pesquisa
//     },
//     SEARCH_LIST_RESPONSE_ID: String // key pra saber qual callback da resposta chamar (definida em cada tela, separado)
// }

export default function SearchPaginationListScreen(props) {
    console.log('RENDER')
    const EMPTY_OPTION_STRING_KEY = 'EMPTY_OPTION_STRING_KEY'
    const options = props.route.params.options
    const SEARCH_LIST_RESPONSE_ID = `${props.route.params.SEARCH_LIST_RESPONSE_ID}` || 'SEARCH_PAGINATION_LIST_DEFAULT_RESPONSE_ID'
    const [isRefreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [selectedItems, setSelectedItems] = useState({})
    const [responses, setResponses] = useState([])
    const userService = new UserService()
    const helperService = new HelperService()
    const bottomSheetRef = useRef()
    const [filters, setFilters] = useState({
        type: '',
        q: '',
        page: 1,
        loadMore: false
    })

    useEffect(() => {
        props.navigation.setOptions({
            title: options.title,
            headerRight: () => <PhLinkButton containerStyle={ { paddingBottom: 0 } } textStyle={ { color: colors.secondary } } onPress={ () => handleContinue() } >{ i18n.t('done') }</PhLinkButton>
        })
    }, [responses])

    useEffect(() => {
        getItems()
    }, [filters])

    useEffect(() => {
        preSelectItems()
        return () => {
        }
    }, [])


    function handleList(type, params) {
        switch (type) {
            case 'loadMore':
                setLoadingMore(true)
                setFilters((filters) => ({ ...filters, page: filters.page + 1, loadMore: true }))
                break;
            case 'search':
                setLoading(true)
                setFilters((filters) => ({ ...filters, q: params.string, page: 1, loadMore: false }))
                break;
            case 'refresh':
                setRefreshing(true)
                setFilters((filters) => ({ ...filters, page: 1, loadMore: false }))
                break;
            case 'clearSearch':
                setLoading(true)
                setFilters((filters) => ({ ...filters, q: '', page: 1, loadMore: false }))
                break;
        }
    }
    async function getItems() {
        try {
            let res
            switch (options.type) {
                case 'cid':
                    res = await userService.getCids(filters)
                    break;
                case 'things_i_use':
                    res = await userService.getThingsIUse(filters)
                    break;
                case 'medical_procedures':
                    res = await userService.getMedicalProcedures(filters)
                    break;
                case 'medicament':
                    res = await userService.getMedications(filters)
                    break;
                case 'hospital':
                    res = await userService.getHospitals(filters)
                    break;
            }
            if (res.status) {
                setItems(items => filters.loadMore ? [...items, ...res.data] : res.data)
                setHasMore(res.next_page_url)
            }
        } catch (error) {
            console.log(`ERRO NO GET ITEMS DA SEARCH: ${options.type}`, error)
        } finally {
            setLoading(false)
            setRefreshing(false)
            setLoadingMore(false)
        }
    }


    function preSelectItems() {
        if (options.preSelectedItems && options.preSelectedItems.length)
            options.preSelectedItems.map(r => {
                handleItemPressed(r)
            })
    }

    function handleItemPressed(item) {
        const KEY = `${item.id}`
        let selected = selectedItems
        if (selected[`${KEY}`]) {
            delete (selected[`${KEY}`])
        } else {
            selected[`${KEY}`] = item
        }
        setSelectedItems(selected)
        setResponses(Object.keys(selected).map((key) => {
            return selected[key]
        }))
    }

    function handleContinue() {
        try {
            let item = responses
            // if (item[0] && item[0].id == EMPTY_OPTION_STRING_KEY) {
            //     item = []
            // }
            props.navigation.goBack()
            DeviceEventEmitter.emit(SEARCH_LIST_RESPONSE_ID,
                { type: options.type, item: options.allowMultiple ? item : item[0] }
            )
        } catch (e) {
            console.log('erro no continue', e)
        }
    }

    function handleSuggest() {
        Keyboard.dismiss()
        bottomSheetRef.current.open()
    }



    // useEffect(() => {
    //     if (suggestionInputRef) {
    //         suggestionInputRef.focus()
    //     }
    // }, [suggestionInputRef])


    SuggestionSheet = () => {
        const [suggestion, setSuggestion] = useState('')
        function handleSubmitSuggestion() {
            bottomSheetRef.current.close()
            helperService.showToast({
                visibilityTime: 2000,
                text1: i18n.t('suggestion_sent'),
                text2: `${i18n.t('suggestion_sent_success')}`,
            });
            const params = {
                type: options.type,
                text: suggestion
            }
            setSuggestion('')
            userService.sendSuggestion(params).catch(e => { })
        }
        return (
            <RBSheet
                animationType={ 'fade' }
                ref={ bottomSheetRef }
                height={ measures.screenHeight * 0.35 }
                customStyles={ {
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
                <View style={ { flex: 1, paddingVertical: measures.xSpace, paddingRight: measures.xSpace } } >
                    <View style={ { paddingLeft: measures.xSpace } } >
                        <PhHeader style={ { paddingBottom: 12 } } >{ `${i18n.t('suggest')}` }</PhHeader>
                    </View>
                    <PhTextInput
                        labelTitle={ i18n.t('suggestion_label') }
                        placeholder={ i18n.t('suggestion_placeholder') }
                        value={ suggestion }
                        autoComplete={"off"}
                        onChangeText={ (text) => setSuggestion(text) }
                    />
                    <PhButton disabled={ !suggestion } onPress={ () => handleSubmitSuggestion() } containerStyle={ { marginTop: measures.ySpace } } >{ i18n.t('suggest') }</PhButton>
                </View>
            </RBSheet >
        )
    }

    return (

        <PhSafeAreaContainer mode={ 'noTop' } statusBarStyle={ { barStyle: 'dark-content', backgroundColor: colors.white } }  >
            <PhSearchBarInput onSearchChanged={ (string) => handleList('search', { string }) } />
            {
                loading ? <PhLoadingContainer /> :
                    <FlatList
                        contentContainerStyle={ { flexGrow: 1 } }
                        data={ items }
                        keyExtractor={ (item) => String(item.id) }
                        renderItem={ ({ item }) => (
                            <PhSelectItem onPress={ () => handleItemPressed(item) } selected={ selectedItems[`${item.id}`] } >
                                {
                                    options.showDescription ?
                                        <View style={ { flex: 1, paddingRight: measures.xSpace } }>
                                            <PhAction>{ item.name }</PhAction>
                                            <PhParagraph style={ { color: colors.gray } } >{ item.description }</PhParagraph>
                                        </View>
                                        :
                                        <PhParagraph>{ item.name }</PhParagraph>
                                }
                            </PhSelectItem>
                        ) }
                        onEndReached={ () => hasMore ? handleList('loadMore') : null }
                        onEndReachedThreshold={ 0.5 }
                        refreshing={ isRefreshing }
                        onRefresh={ () => handleList('refresh') }
                        scrollEventThrottle={ 16 }
                        // ListEmptyComponent={<PhEmptyStateContainer />}
                        ListFooterComponent={
                            ['hospital', 'medicament', 'medical_procedures', 'cid'].includes(options.type) ? <PhSelectItem onPress={ () => handleSuggest() } divider={ false }>
                                <View style={ { flex: 1, paddingRight: measures.xSpace } }>
                                    <PhAction>{ i18n.t('suggest') }</PhAction>
                                </View>
                            </PhSelectItem> : null
                        }
                        onScroll={ () => Keyboard.dismiss() }

                    >
                    </FlatList>
            }
            <SuggestionSheet />
        </PhSafeAreaContainer>

    )


}
