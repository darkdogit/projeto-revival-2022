import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import ptBr from './ptBr'
import enUs from './enUs'

export class AppLocalization {
	i18n

	static instance;

	constructor() { 
		if (!AppLocalization.instance) {
			this.i18n = new I18n({
				'en': enUs,
				'en-BR': enUs,
				'en-US': enUs,
				'pt-BR': ptBr,
			}, {
				locale: Localization.getLocales()[0].languageTag
			})
		  }
		  return AppLocalization.instance;
	}
	// async start() {
	// 	i18n.fallbacks = true;
	// 	i18n.translations = {
	// 		'en': enUs,
	// 		'en-BR': enUs,
	// 		'pt-BR': ptBr
	// 	};
	// 	i18n.locale = Localization.locale;
	// }
}

export const appLocalization = new AppLocalization()

const i18n = appLocalization.i18n

export default i18n