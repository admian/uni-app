
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		isLogin:false,
		name:'',
		uerInfo:{},
		storeInPickCList:[],//store-inList by Courier
		storeInObj:{
			CourierBillNumber:'',
			courier:'',
			instruction:''
		},
		selfSIObj:{
			CourierBillNumber:'',
			courier:'Self-delivery',
			instruction:''
		},
		pickSkuList:[],//pick-sku list
		storeInPickSList:[],//store-inList by Self-Delivery
		storeOutPickList:[
			{	init:true,
				partNo:'',
				partDescription:'',
				partQty:'',
				reference1:''
			}
		],//store-outList
		storeOutorderInfo:{
			OrderNumber:'',
			Courier:'',
			CourierService:'',
			BuyerName:'',
			BuyerPhone:'',
			BuyerAddress:'',
			CourierFee:'Prepaid',
			OrderValue:''
		},//store-out to HK
		orderSODetails:{},//information
		orderSOInfo:{
			createdDtLoc:'',
			partSOs:[],
			status:'Q',
			refOrderNo:'',
			shipping:{
				consigneeContactName:'',
				consigneePhoneNo:'',
				consigneeAddr1:'',
				carrierService:'',
				courierBillNo:'',
				deliveryNote:''
			}
		},//Create Infomation
		orderSIDetails:{},//information
		orderSIInfo:{
			orderNo:'',
			createdDtLoc:'',
			deliveryNote:'',
			refOrderNo:'',
			status:'Q',
			remarks3:'',
			orderParts:[]
		}
    },
    mutations: {
		login(state, provider) {//改变登录状态
			state.isLogin = true ; 
			state.uerInfo.username = provider[0];
			state.uerInfo.password = provider[1];
			state.uerInfo.customer = provider[2];
			uni.setStorage({//将用户信息保存在本地  
				key: 'uerInfo',
				data: provider
			})
		},
		// userName(state, provider){//存储login时的用户名
		// 	state.name=provider;
		// },
		StoreInpickC(state,payload){//store-in pick sku by Courier
			//console.log(payload);
			state.storeInPickCList=payload;		
		},
		StoreInpickS(state,payload){//store-in pick sku by self
			state.storeInPickSList=payload;		
		},
		PickSku(state,payload){//pick sku list
			state.pickSkuList=payload;		
		},
		StoreInCourierObj(state,payload){//Courier infomation
			//console.log(payload);
			state.storeInObj.CourierBillNumber=payload.CourierBillNumber;
			state.storeInObj.courier=payload.courier;
			state.storeInObj.instruction=payload.instruction;
		},
		StoreInSelfObj(state,payload){//bY Self 
			state.selfSIObj.CourierBillNumber=payload.CourierBillNumber;
			state.selfSIObj.instruction=payload.instruction;
		},
		StoreOutToHKInfo(state,payload){
			state.storeOutorderInfo.OrderNumber=payload.OrderNumber;
			state.storeOutorderInfo.Courier=payload.Courier;
			state.storeOutorderInfo.CourierService=payload.CourierService;
			state.storeOutorderInfo.BuyerName=payload.BuyerName;
			state.storeOutorderInfo.BuyerPhone=payload.BuyerPhone;
			state.storeOutorderInfo.BuyerAddress=payload.BuyerAddress;
			state.storeOutorderInfo.CourierFee=payload.CourierFee;
			state.storeOutorderInfo.OrderValue=payload.OrderValue;
		},
		StoreOutPick(state,payload){
			//console.log(payload);
			state.storeOutPickList=payload;
		},
		SODetails(state,payload){
			state.orderSODetails=payload;
		},
		SIDetails(state,payload){
			state.orderSIDetails=payload;
		}

    },
	getters:{
		
	},
	actions:{
		
	}
})

export default store