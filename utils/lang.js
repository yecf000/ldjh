import lang from '@/utils/lang.json' //引入拦截

export const getlang = (font) => {
	if(!font){
		return ''
	}else{
		if(lang[font]){
			return lang[font][localStorage.getItem('lang')||'ru']
		}
		else{
			return "???"
		}
		
	}
}