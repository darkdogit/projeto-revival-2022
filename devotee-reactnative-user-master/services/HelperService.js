
import NumberFormat from 'react-number-format';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import React from 'react';
import Constants from 'expo-constants';
import { Text, Alert } from 'react-native';
import { sprintf } from 'sprintf-js';
import i18n from '../localization/AppLocalization';

export default class HelperService {
    weekdays = {
        eng: [
            'sunday',
            'monday',
            'tusday',
            'wednesday',
            'thursday',
            'friday',
            'saturday'
        ],
        pt: [
            'Domingo',
            'Segunda-feira',
            'Terça-feira',
            'Quarta-feira',
            'Quinta-feira',
            'Sexta-feira',
            'Sábado',
        ]
    }



    months = {
        short: [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez'

        ],
        long: [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'

        ]
    }

    ufs = [
        { "name": "Acre", "id": "AC" },
        { "name": "Alagoas", "id": "AL" },
        { "name": "Amapá", "id": "AP" },
        { "name": "Amazonas", "id": "AM" },
        { "name": "Bahia", "id": "BA" },
        { "name": "Ceará", "id": "CE" },
        { "name": "Distrito Federal", "id": "DF" },
        { "name": "Espírito Santo", "id": "ES" },
        { "name": "Goiás", "id": "GO" },
        { "name": "Maranhão", "id": "MA" },
        { "name": "Mato Grosso", "id": "MT" },
        { "name": "Mato Grosso do Sul", "id": "MS" },
        { "name": "Minas Gerais", "id": "MG" },
        { "name": "Pará", "id": "PA" },
        { "name": "Paraíba", "id": "PB" },
        { "name": "Paraná", "id": "PR" },
        { "name": "Pernambuco", "id": "PE" },
        { "name": "Piauí", "id": "PI" },
        { "name": "Rio de Janeiro", "id": "RJ" },
        { "name": "Rio Grande do Norte", "id": "RN" },
        { "name": "Rio Grande do Sul", "id": "RS" },
        { "name": "Rondônia", "id": "RO" },
        { "name": "Roraima", "id": "RR" },
        { "name": "Santa Catarina", "id": "SC" },
        { "name": "São Paulo", "id": "SP" },
        { "name": "Sergipe", "id": "SE" },
        { "name": "Tocantins", "id": "TO" }

    ]





    numberToCurrency(amount) {
        return `R$${Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
            .replace(/,/g, '*')
            .replace(/\./g, ',')
            .replace(/\*/g, '.')}`
    };

    generateId(length = 20) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    toCurrency(number) {
        if (number) {
            return <NumberFormat
                value={number}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={'R$'}
                renderText={value => <Text>{value}</Text>} />
        }
        return ''
        // return `R$0,00`
    }

    toPercentage(number, prefix = true) {
        if (number) {
            return <NumberFormat
                value={number}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={prefix ? (number > 0 ? '+' : '') : ''}
                suffix={'%'}
                renderText={value => <Text>{value}</Text>} />
        }
        return ''
        // return '0,00%'
    }

    sqlDateToPtDate(dateString, withHour = false, jsDate = false) {
        try {
            var split = jsDate ? dateString.split('T') : dateString.split(' ')
            if (withHour) {
                var d = split[0]
                var h = split[1]
                var dSplit = d.split('-')
                var hSplit = h.split(':')
                return `${dSplit[2]}/${dSplit[1]}/${dSplit[0]} às ${hSplit[0]}:${hSplit[1]}`
            } else {
                if (split.length == 1) {
                    split = dateString.split('-')
                } else {
                    split = jsDate ? dateString.split('T')[0].split('-') : dateString.split(' ')[0].split('-')
                }
                return `${split[2]}/${split[1]}/${split[0]}`
            }
        } catch (e) {
            return '00/00/00 00:00'
        }


    }

    sqlDateToTime(date, mode = 1, jsDate = false) {
        try {
            let s = jsDate ? date.split('T') : date.split(' ')
            let t = s[1].split(':')
            let d = s[0].split('-')

            switch (mode) {
                case 1:
                    // 14h 30m
                    return `${t[0]}h ${t[1]}m`
                case 2:
                    // Terça-feira 14:30
                    d = new Date(s[0])
                    let today = new Date()
                    // let wd = d.getUTCDay() != today.getUTCDay() ? d.getUTCDay() : false
                    // return `${weekdays.pt[wd] || 'Hoje'} ${t[0]}:${t[1]}`
                    return `${this.weekdays.pt[d.getUTCDay()]} ${t[0]}:${t[1]}`
                case 3:
                    // 14:30
                    return `${t[0]}:${t[1]}`
                case 4:
                    // DEZ
                    let m = new Date(s[0]).getMonth()
                    return `${this.months.short[m]}`
                case 5:
                    // 20
                    return `${d[2]}`
                default:
                    ''
            }
        } catch (e) {
            return ''
        }
    }



    getStringDate(date, mode = 1) {

        try {
            var d = date.replace('T', ' ').split(' ')[0]
            var d = d.split('-')

            switch (mode) {
                case 1:
                    // 12/Jun/2020
                    return `${d[2]}/${this.months.short[d[1] - 1]}/${d[0]}`
                case 2:
                    // 12 de Jun
                    return `${d[2]} de ${this.months.long[d[1] - 1]}`
                case 3:
                    // 12/06
                    return `${d[2]}/${d[1]}`
                case 4:
                    // 12 de Junho
                    return `${d[2]} de ${this.months.long[d[1] - 1]}`
            }
        } catch (e) {
            return ''
        }
    }
    getNextDayOfWeek(dayOfWeek) {
        var date = new Date()
        const currentDay = date.getDay() + 1
        const diff = Math.abs(currentDay - 7) + dayOfWeek
        if (diff == 7) {
            return 'Hoje'
        }
        date.setDate(date.getDate() + diff);
        return `${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}/${this.months.short[date.getMonth()]}`
    }

    pad(number, fillQtd) {
        return sprintf('%02d', number)
    }

    dateToString(date) {
        return {
            date: `${date.getFullYear()}-${sprintf('%02d', date.getMonth())}-${date.getDate()}`,
            time: `${date.getHours()}:${date.getMinutes()}`
        }
    }


    limitString(string, limit) {
        try {
            return string.length >= limit ? `${string.substr(0, limit - 1)}...` : string
        } catch (e) {
            return string
        }

    }
    cleanValue(value) {
        var desired = value.replace(/[^\w\s]/gi, '').replace(' ', '').replace(/[_-]/g, "")
        return desired
    }

    toCurrencyString(value, type = 1) {
        if (!value) return `R$0,00`
        switch (type) {
            case 1:
                const v = value.toFixed(2).replace('.', ',')
                return `R$${v}`
            case 2:
                let val = value.toString()
                let half = val.length - 2
                let res = `${val.substr(0, half)},${val.substr(half)}`;
                return `R$${res}`
        }
    }


    /**
     * 
     * @param {*} i 
     * @property type
     * @property visibilityTime
     * @property text1
     * @property text2
     */
    showToast(i) {
        var info = i
        info.visibilityTime = i.visibilityTime || 2000
        info.type = info.type || 'success'
        Toast.show({ ...info, topOffset: Constants.statusBarHeight + 10 })
    }

    getTimeDifference(date) {
        const now = moment()
        const referenceDate = moment(date)
        const diffHours = now.diff(referenceDate, 'hours')
        const diffDays = parseInt((diffHours / 24))

        if (diffHours == 0) {
            return i18n.t('just_now')
        } else {
            if (diffHours < 24) {
                return `${diffHours}h ${i18n.t('ago')}`
            } else if (diffHours < 48) {
                return i18n.t('yesterday')
            } else if (diffDays > 364) {
                return `+1 ${i18n.t('year')}`
            } else if (diffDays >= 28) {
                return `${parseInt(diffDays / 28)} ${i18n.t('months')} ${i18n.t('ago')}`
            } else {
                return `${diffDays}d ${i18n.t('ago')}`
            }
        }
    }


    calculateDistance(dist) {
        if (!dist) return ''
        //distancia em metros
        const distance = dist * 1000
        const label = distance > 999 ? 'km' : i18n.t('meters')
        var d = 0
        if (distance > 999) {
            d = parseInt(distance / 1000)
        } else if (distance < 5) {
            d = i18n.t('few')
        } else {
            d = parseInt(distance)
        }
        return `${d} ${label}`
    }

    calculateAge(birthdate) {
        const now = moment()
        const diff = now.diff(moment(birthdate), 'years')
        return diff
    }

    getFormattedTimer(timeInMilis) {
        let timer = ''
        try {
            const seconds = timeInMilis / 1000
            const minutes = parseInt(seconds / 60)
            const remainingSeconds = parseInt(seconds % 60)
            timer = `${this.pad(minutes)}:${this.pad(remainingSeconds)}`
        } catch (e) {
            console.log('getFormattedTimer', e)
            timer = ''
        }
        finally {
            return timer
        }
    }


}