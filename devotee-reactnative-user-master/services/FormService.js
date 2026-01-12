import moment from "moment";

export default class FormService {
    isCPFValid(strCPF) {

        if (!strCPF) return false
        var Soma;
        var Resto;
        var i;

        strCPF = strCPF.replace(/[^\w\s]/gi, '').replace(' ', '')

        Soma = 0;
        if (strCPF == "00000000000" || !strCPF) return false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;

    }

    fullName(value) {
        var ok = true
        var pattern = new RegExp('^(?=.*[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF])([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)$');
        try {
            const fullName = value.trim().split(' ')
            if (fullName.length < 2) {
                return false
            }
            if (fullName[0].length < 2) return false
            fullName.map(r => {
                if (!pattern.test(r)) {
                    ok = false
                }
            })
            return ok
        } catch (e) {
            return false
        }

    }

    validateHours(value) {
        try {
            if (!value) {
                return false
            }
            let split = value.split(':')
            if (parseInt(split[0]) > 23) {
                return false
            }
            if (parseInt(split[1]) > 59) {
                return false
            }
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    isPeriodValid(startDate, endDate) {
        try {
            // if(!startDate || !endDate){
            //     return false
            // }
            const st = startDate.split(':')
            const end = endDate.split(':')


            if (parseInt(st[0]) > parseInt(end[0])) {
                return false
            }
            if (parseInt(st[0]) == parseInt(end[0])) {
                if (parseInt(st[1]) >= parseInt(end[1])) {
                    return false
                }
            }

            return true

        } catch (e) {
            console.log(e)
            return false
        }

    }

    checkExpirationDate(value) {
        return moment(value, 'MM/YY', true).isValid()
    }


    getAddressFromCep(cep) {
        return fetch(`https://viacep.com.br/ws/${cep}/json`).then(r => r.json())
    }

    getDateDifferenceFromNow(date, unity = 'seconds') {
        const a = moment(date);
		var b = moment();
		const r = a.diff(b, unity)
        console.log(r)
        return r
    }

    



}



