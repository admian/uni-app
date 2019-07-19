
import Vue from 'vue'
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n'


//本地
//Vue.prototype.baseUrl="http://192.168.18.102:8080"
Vue.prototype.warehouseCode="ULHKG"
Vue.prototype.baseUrl="http://192.168.18.147:8080"
Vue.prototype.milestoneUrl="https://tracking-d01.icil.net"

//dev
// Vue.prototype.warehouseCode="ULHKG"
// Vue.prototype.baseUrl="https://eplusss-d01.icil.net"
// Vue.prototype.milestoneUrl="https://tracking-d01.icil.net"

//test
// Vue.prototype.warehouseCode="TWOS4"
// Vue.prototype.baseUrl="https://eplusss-t01.icil.net"
// Vue.prototype.milestoneUrl="https://tracking-t01.icil.net"

//prodution
// Vue.prototype.warehouseCode="UFHCK"
// Vue.prototype.baseUrl="https://member.eplusss.com"
// Vue.prototype.milestoneUrl="https://tracking.ufreight.com"

Vue.use(VueI18n)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.regNumber=/^[1-9]\d*$|^0$/

const i18n = new VueI18n({
	locale : 'zh_HK', //语言标识
	messages: {	
		'zh_HK' : require('./common/lang/zh'),	//中文繁体语言包
		'en_US' : require('./common/lang/en')  //英文语言包
	}
})
Vue.prototype._i18n = i18n
Vue.prototype.$i18nMsg = function(){
	return i18n.messages[i18n.locale]
}


Vue.prototype.$eventHub = new Vue(); 
App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
