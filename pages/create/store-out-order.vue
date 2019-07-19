<template>
	<view class="bottom-margin">
		<view v-show="!loadingShow">
		<view class="content-container" v-show="successShow==false">
			<wuc-tab :tab-list="tabList" :textFlex="true" :tabCur.sync="TabCur" tab-class="text-center text-black bg-white" select-class="text-orange"></wuc-tab>
			<swiper class="swiper-box" :current="TabCur" duration="300" :circular="false" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
				<swiper-item class="scroll-view">
					<view class="order-container">
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0201_e_order_number_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
									{{i18n.index.OrderNumber}}
								</view>
							</view>
							<view class="context">
								<input type="text" :placeholder="i18n.index.Input" placeholder-style="color:#999999;" v-model="CourierInfo.OrderNumber"  @blur="number($event.target.value)"/>
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top-i">
								<view class="title-i">
									<image src="../../static/order/A0202_sku_info_16px_3x.png" class="card-dp-top-icon"></image>
									<view class="card-dp-top-title">
									   {{i18n.index.SKUInformation}}
									</view>	
								</view>	
								<view class="edit" v-if="CourierList.length!=0 && CourierList[0].partNo!==''">
									<navigator url="so-add-skuinfo?id=1">
										<image src="../../static/icon/A0308_edit_b6b6b6_16px_3x.png" class="edit-img"></image>
									</navigator>		
								</view>
							</view>
							<view class="context" @tap="addSkuinfo(1)" v-if="CourierList.length==0 ||CourierList[0].partNo==''">
								<view class="one">
									<image src="../../static/icon/A0305_add_b6b6b6_16px_3x.png" class="right-icon"></image>
								</view>
								<view class="two">{{i18n.index.PickSKUfromSKULists}}</view>
							</view>
							<view class="sku-list" v-if="CourierList.length!=0 && CourierList[0].partNo!==''">
								<view  v-for="(item,index) in picklist" :key="index">
									<view class="item-skuinfo" v-if="index!=picklist.length-1">
										<view class="sku-i">
											<view class="sku-n">{{item.partNo}}</view>
											<view class="sku-q">{{item.partQty}} <text>Pcs.</text></view>
										</view>
										<view class="sku-d">{{item.partDescription ? item.partDescription :''}}</view>
										<view class="sku-r">{{item.reference1}}</view>
									</view>
									<view class="item-skuinfos" v-if="index==picklist.length-1">
										<view class="sku-i">
											<view class="sku-n">{{item.partNo}}</view>
											<view class="sku-q">{{item.partQty}} <text>Pcs.</text></view>
										</view>
										<view class="sku-d">{{item.partDescription  ? item.partDescription :''}}</view>
										<view class="sku-r">{{item.reference1}}</view>
									</view>
									
								</view>
							</view>
							<view class="more" v-show="courierMore">
								<image class="down-icon" @tap="downMore(1)"
								:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
								
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0203_consignee_info_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
								   {{i18n.index.Consignee}}
								</view>
							</view>
							<view class="context">
								<navigator url="../home/address-book?id=1">
									<view class="consignee">
											<view class="brul" v-if="CourierInfo.BuyerName==''">
												{{i18n.index.SelectConsignee}}
											</view> 
											<view class="mess" v-else>
												<view>
													<text class="info-mess">{{CourierInfo.BuyerName}}</text>
													<text class="number">{{CourierInfo.BuyerPhone}}</text>
												</view>
												<view class="address">{{CourierInfo.BuyerAddress}}</view>
											</view> 
											<view>
												<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
											</view>
										<!-- <navigator url="../home/address-book?backTitle=storeout">
											<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
										</navigator> -->
									</view>
								</navigator>
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0204_courier_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
								   {{i18n.index.Courier}}
								</view>
							</view>
							<view class="context">
								<navigator url="../courier/so-courier">
									<view class="company" >
										<view class="brul" v-show="CourierInfo.Courier==''">
											{{i18n.index.SelectCompanyandService}}
										</view> 
										<view class="service-company" v-show="CourierInfo.Courier!=''">
											{{CourierInfo.Courier}}
											<view>{{CourierInfo.CourierService}}</view>
										</view>
										<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
									</view>
								</navigator>
								<view class="pay"  @tap="showOnePicker">
									<view class="orderNum">
										{{i18n.index[storeOutorderInfo.CourierFee]}}
									</view>
									<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
								</view>
								<view class="money">
									<view class="value">{{i18n.index.OrderValue}}</view>
									<input type="number" :placeholder="i18n.index.Input" placeholder-style="color:#999999;"  v-model="storeOutorderInfo.OrderValue" class="moenyValue"  @blur="money($event.target.value)"/>
								</view>
							</view>
						</view>
						<view class="bottom-btn">
							<button :class="isCreate ? 'btn-create yes':'btn-create no'" :disabled="!isCreate" @tap="createtoHKClick">{{i18n.index.Create}}</button>
						</view>
					</view>
				</swiper-item>
				<swiper-item class="scroll-view">
					<view class="order-container">
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0206_address_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
									{{i18n.index.SelfPickupAddress}}
								</view>
							</view>
							<view class="self-address">
								<text>{{i18n.index.address1}}</text>
								<view>{{i18n.index.address2}}</view>
								<text>{{i18n.index.address3}}</text>
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0201_e_order_number_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
									{{i18n.index.OrderNumber}}
								</view>
							</view>
							<view class="context">
								<input type="text" :placeholder="i18n.index.Input" placeholder-style="color:#999999;"  v-model="SelfInfo.OrderNumber"  @blur="number($event.target.value)"/>
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top-i">
								<view class="title-i">
									<image src="../../static/order/A0202_sku_info_16px_3x.png" class="card-dp-top-icon"></image>
									<view class="card-dp-top-title">
									   {{i18n.index.SKUInformation}}
									</view>	
								</view>	
								<view class="edit" v-if="SelfList.length!=0 && SelfList[0].partNo!==''">
									<navigator url="so-add-skuinfo?id=2">
										<image src="../../static/icon/A0308_edit_b6b6b6_16px_3x.png" class="edit-img"></image>
									</navigator>		
								</view>
							</view>
							<view class="context" @tap="addSkuinfo(2)" v-if="SelfList.length==0 || SelfList[0].partNo==''">
								<view class="one">
									<image src="../../static/icon/A0305_add_b6b6b6_16px_3x.png" class="right-icon"></image>
								</view>
								<view class="two">{{i18n.index.PickSKUfromSKULists}}</view>
							</view>
							<view class="sku-list" v-if="SelfList.length!=0 && SelfList[0].partNo!==''">
								<view v-for="(item,index) in picklist" :key="index">
									<view class="item-skuinfo" v-if="index!=picklist.length-1">
										<view class="sku-i">
											<view class="sku-n">{{item.partNo}}</view>
											<view class="sku-q">{{item.partQty}} <text>Pcs.</text></view>
										</view>
										<view class="sku-d">{{item.partDescription}}</view>
										<view class="sku-r">{{item.reference1}}</view>
									</view>
									<view class="item-skuinfos" v-if="index==picklist.length-1">
										<view class="sku-i">
											<view class="sku-n">{{item.partNo}}</view>
											<view class="sku-q">{{item.partQty}} <text>Pcs.</text></view>
										</view>
										<view class="sku-d">{{item.partDescription}}</view>
										<view class="sku-r">{{item.reference1}}</view>
									</view>
								</view>
							</view>
							<view class="more" v-show="selfMore">
								<image class="down-icon" @tap="downMore(2)"
								:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
							</view>
						</view>
						<view class="card-item">
							<view class="card-dp-top">
								<image src="../../static/order/A0203_consignee_info_16px_3x.png" class="card-dp-top-icon"></image>
								<view class="card-dp-top-title">
								   {{i18n.index.Consignee}}
								</view>
							</view>
							<view class="context">
								<view class="consignee">
									<view class="brul" v-show="SelfInfo.BuyerName==''" @tap="consigneeClick(1)">
										{{i18n.index.InputConsignee}}
									</view> 
									<view class="mess" v-show="SelfInfo.BuyerName!=''" @tap="consigneeClick(1)">
										<view>
											<text class="info-mess">{{SelfInfo.BuyerName}}</text>
											<text class="number">{{SelfInfo.BuyerPhone}}</text>
										</view>
									</view> 
									<view @tap="consigneeClick(2)">
										<image src="../../static/icon/A0326_address_book_b6b6b6_16px_3x.png" class="right-icon"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="bottom-btn">
							<button :class="disCreate ? 'btn-create yes':'btn-create no'" :disabled="!disCreate" @tap="createSelfClick">{{i18n.index.Create}}</button>
						</view>
					</view>					
				</swiper-item>
			</swiper>
		</view>
		</view>
		<view class="ok_again" v-show="successShow">
			<view class="center-img">
				<image src="../../static/order/pic_page_successful_140px_3x.png" class="ok_again_img"></image>
			</view>
			<view class="font-view">{{i18n.index.CreateOrderSuccessfully}}</view>
			<view class="btn-again">
				<view class="btn1" @tap="createMore">{{i18n.index['Create More']}}</view>
				<view class="btn2" @tap="checkOrder">{{i18n.index['Check Order']}}</view>
			</view>
		</view>
		<wzp-picker ref="wzpPicker" :mode="mode" :pickerList="pickerList" :defaultIndex="defaultIndex"  @onConfirm="onConfirm"></wzp-picker><!-- :equalModeId="equalModeId" -->
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import wzpPicker from "../../components/wzpPicker.vue";
	import uniLoading from '../../components/uni-loading.vue';
	import WucTab from '../../components/wuc-tab.vue';
	import {mapState, mapMutations } from "vuex";
	export default {
		components:{wzpPicker,uniLoading,WucTab},
		data() {
			return {
				id:0,//id=1
				tabList: [{ name:'byCourier' }, { name:'bySelfpickup'}],
				TabCur: 0,
				mode: "one",
				pickerList: [{label: "Prepaid"},{label: "Collect"}],
				defaultIndex: [0],
				successShow:false,
				loadingShow:false,
				indexShow:true,
				showMore:false,
				page:1,
				pageSize:5,
				picklist:[],
				CourierList:[],
				CourierInfo:{OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''},
				SelfList:[],
				SelfInfo:{OrderNumber:'',Courier:'Self pickup',CourierService:'Self pickup',BuyerName:'',BuyerPhone:''}
			};
		},
		computed:{
			...mapState([
			  'storeOutPickList','storeOutorderInfo'
			]),
			isCreate(){
				return this.CourierInfo.OrderNumber&&this.CourierInfo.Courier&&
				this.CourierInfo.BuyerName&&this.CourierInfo.BuyerPhone&&this.CourierInfo.BuyerAddress
				&&this.CourierInfo.CourierFee && this.CourierInfo.OrderValue&&this.CourierList[0].partNo!=''
			},
			disCreate(){
				return this.SelfInfo.OrderNumber&&this.SelfInfo.BuyerName&&this.SelfInfo.BuyerPhone&&this.SelfList[0].partNo!=''
			},
			courierMore(){
				return this.CourierList.length > 5
			},
			selfMore(){
				return this.SelfList.length > 5
			},
			i18n() {  
			    return this.$i18nMsg()  
			}
		},
		methods:{
			...mapMutations(['StoreOutToHKInfo','StoreOutPick']),
			backNav(){
				this.StoreOutToHKInfo({OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''});
				this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
				uni.switchTab({
					url:"../taber/home"
				})
			},
			addSkuinfo(id){
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				uni.navigateTo({
					url:"so-add-skuinfo?id="+id
				})
			},
			consigneeClick(i){
				//console.log(i)
				if(i==1){
					uni.navigateTo({
						url: "consignee",
					});
				}else if(i==2){
					uni.navigateTo({
						url: '../home/address-book?id=2',
					});
				}
			},
			swiperChange(e) {
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
			    let { current } = e.target;
			    this.TabCur = current;
			},
			showOnePicker() {
				this.mode = 'one';
				this.pickerList = [{
						label: "Prepaid"
					},
					{
						label: "Collect"
					}
					
				];
				this.defaultIndex = [0];
				this.$refs.wzpPicker.showPicker();
			},
			onConfirm(e) {
				let CourierFee = this.pickerList[e[0]].label;
				this.StoreOutToHKInfo({
					OrderNumber:this.storeOutorderInfo.OrderNumber,
					Courier:this.storeOutorderInfo.Courier,
					CourierService:this.storeOutorderInfo.CourierService,
					BuyerName:this.storeOutorderInfo.BuyerName,
					BuyerPhone:this.storeOutorderInfo.BuyerPhone,
					BuyerAddress:this.storeOutorderInfo.BuyerAddress,
					CourierFee:CourierFee,
					OrderValue:this.storeOutorderInfo.OrderValue
				})
			},
			number(OrderNumber){
				this.StoreOutToHKInfo({
					OrderNumber:OrderNumber,
					Courier:this.storeOutorderInfo.Courier,
					CourierService:this.storeOutorderInfo.CourierService,
					BuyerName:this.storeOutorderInfo.BuyerName,
					BuyerPhone:this.storeOutorderInfo.BuyerPhone,
					BuyerAddress:this.storeOutorderInfo.BuyerAddress,
					CourierFee:this.storeOutorderInfo.CourierFee,
					OrderValue:this.storeOutorderInfo.OrderValue
				})
			},
			money(OrderValue){
				if(OrderValue>0){
					this.StoreOutToHKInfo({
						OrderNumber:this.storeOutorderInfo.OrderNumber,
						Courier:this.storeOutorderInfo.Courier,
						CourierService:this.storeOutorderInfo.CourierService,
						BuyerName:this.storeOutorderInfo.BuyerName,
						BuyerPhone:this.storeOutorderInfo.BuyerPhone,
						BuyerAddress:this.storeOutorderInfo.BuyerAddress,
						CourierFee:this.storeOutorderInfo.CourierFee,
						OrderValue:OrderValue
					})
				}else{
					uni.showToast({
						icon:'none',
						title:this.i18n.index.moenyError
					})
				}
				
			},
			createMore(){
				this.successShow=false;
				this.StoreOutToHKInfo({OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''});
				this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
				
			},
			checkOrder(){
				uni.redirectTo({
					url:'../order/so-order-information?refOrderNo='+this.storeOutorderInfo.OrderNumber,
					success: () => {
						this.StoreOutToHKInfo({OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''});
						
					}
				})
			},
			downMore(id){
				let _this=this;
				if(id==1){
					if(this.showMore==false){
						if(this.CourierList.length==this.picklist.length){
							return
						}else{
							this.picklist=this.CourierList;	
						}
						this.showMore=true
					}else{
						this.picklist=[];//归零追加
						this.page=1;//初始情况下
						for(let i=0;i<5;i++){
							this.picklist.push(this.CourierList[i])
						}
						this.showMore=false
					}
				}else{
					if(this.showMore==false){
						if(this.SelfList.length==this.picklist.length){
							return
						}else{
							this.picklist=this.SelfList;
						}
						this.showMore=true
					}else{
						this.picklist=[];//归零追加
						this.page=1;//初始情况下
						for(let i=0;i<5;i++){
							this.picklist.push(this.SelfList[i])
						}
						this.showMore=false
					}
					
				}
			},
			createtoHKClick(){
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				this.loadingShow=true;
				//处理parts的数据
				let list=[],CourierService='';
				//处理快递服务信息
					if(this.storeOutorderInfo.Courier=='SF Express' || this.storeOutorderInfo.Courier=='Other HK Delivery' ){
					CourierService=this.storeOutorderInfo.Courier
				}else if(this.storeOutorderInfo.Courier=='Yamato'){
					CourierService=this.storeOutorderInfo.CourierService
				}else{
					CourierService=this.storeOutorderInfo.Courier+' '+this.storeOutorderInfo.CourierService
				}
				uni.getStorage({
					key: 'uerInfo',
					success: (res) =>{	
						let customer=res.data.customer;
						this.storeOutPickList.forEach((i)=>{
							let obj={
								partNo:i.partNo,
								partDescription:i.partDescription,
								partQty:i.partQty,
								reference1:i.reference1
							}
							list.push(obj);
						})
						let data={"customer":customer,
								"orderService":"Normal",
								"orders":[{
									"warehouseCode":this.warehouseCode,
									"orderNo":this.storeOutorderInfo.OrderNumber,
									"orderConsigneeName":this.storeOutorderInfo.BuyerName,
									"orderConsigneePhone":this.storeOutorderInfo.BuyerPhone,
									"orderConsigneeAddr1":this.storeOutorderInfo.BuyerAddress,
									"courierName":this.storeOutorderInfo.Courier,
									"courierService":CourierService,
									"deliveryNote":this.storeOutorderInfo.CourierFee,
									"orderTotalAmt":this.storeOutorderInfo.OrderValue,
									"parts":list
								}]
							}; 
						uni.request({
							url:this.baseUrl+'/soorder/App/createOrder',
							method:"POST",
							header:{"content-type":"application/json"},
							data:data,
							success:(res)=> {
								this.loadingShow=false;
								if(res.data.status==200){
									this.CourierInfo={OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''};
									this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}]);
									this.CourierList=[];
									this.successShow=true;
								}else if(res.data.status==500){
									uni.showModal({
										title: this.i18n.index.systemError_one,
										content: this.i18n.index.systemError_two,
										showCancel: false,
										confirmText: this.i18n.index.OK
									})
									return
								}else{
									uni.showModal({
										title:this.i18n.index.CreateError_one,
										content:res.data.message,
										showCancel: false,
										confirmText: this.i18n.index.OK
									})
									return
								}
							},
							fail:(res)=> {
								this.loadingShow=false;
								uni.showModal({
									title: this.i18n.index.connrctError_one,
									content: this.i18n.index.connrctError_two,
									showCancel: false,
									confirmText: this.i18n.index.OK
								})
							}
						})
					}
				});
			
			},
			createSelfClick(){
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				this.loadingShow=true;
				//处理parts的数据
				let list=[]
				uni.getStorage({
					key: 'uerInfo',
					success: (res) =>{	
						let customer=res.data.customer;
						this.storeOutPickList.forEach((i)=>{
							let obj={
								partNo:i.partNo,
								partDescription:i.partDescription,
								partQty:i.partQty,
								reference1:i.reference1
							}
							list.push(obj);
						})
						let data={"customer":customer,
								"orderService":"Normal",
								"orders":[{
									"warehouseCode":this.warehouseCode,
									"orderNo":this.SelfInfo.OrderNumber,
									"orderConsigneeName":this.SelfInfo.BuyerName,
									"orderConsigneePhone":this.SelfInfo.BuyerPhone,
									"courierName":this.SelfInfo.Courier,
									"courierService":this.SelfInfo.CourierService,
									"parts":list
								}]
							}; 
						uni.request({
							url:this.baseUrl+'/soorder/App/createOrder',
							method:"POST",
							header:{
								"content-type":"application/json"
							},
							data:data,
							success:(res)=> {
								//console.log(res.data.data);
								//Order SO-HKG-00176969 is successfully created.
								//Order [2018] is already existed in WOS system.
								//console.log(res.data.message)
								this.loadingShow=false;
								if(res.data.status==200){
									this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}]);
									this.SelfList=[];
									this.SelfInfo={OrderNumber:'',Courier:'Self pickup',CourierService:'Self pickup',BuyerName:'',BuyerPhone:''};
									this.successShow=true;
								}else if(res.data.status==500){
									uni.showModal({
										title: this.i18n.index.systemError_one,
										content: this.i18n.index.systemError_two,
										showCancel: false,
										confirmText: this.i18n.index.OK
									})
									return
								}else{
									uni.showModal({
										title:res.data.message,
										content:res.data.data
									})
									return
								}
				
							},
							fail:(res)=> {
								//console.log(res);
								this.loadingShow=false;
								uni.showModal({
									title: this.i18n.index.connrctError_one,
									content: this.i18n.index.connrctError_two,
									showCancel: false,
									confirmText: this.i18n.index.OK
								})
							}
						})
					}
				});
						
			}
		},
		onLoad(){
			uni.setNavigationBarTitle({
				title: this.i18n.index.CreateSOOrder
			})
		},
		onBackPress(event){
			console.log(event)
			this.StoreOutToHKInfo({OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''});
			this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
		},
		onShow() {
			let _this=this;
			this.showMore=false;
			let pages = getCurrentPages();
			var prevPage = pages[pages.length - 2]; //上一个页面 
			let currPage = pages[pages.length-1];//当前页面
			
			//console.log(currPage);
			if(currPage.id){
				if(currPage.id==2){
					_this.TabCur=1
				}else{
					_this.TabCur=0
				}
			}
			//console.log(this.storeOutPickList);
			this.picklist=[];
			if(this.TabCur==0){
				this.CourierList=this.storeOutPickList;
				this.CourierInfo=this.storeOutorderInfo;
				if(this.storeOutPickList.length < 6 ){
					this.picklist=this.storeOutPickList
				}else{
					for(let i=0;i<5;i++){
						this.picklist.push(this.storeOutPickList[i])
					}
				}
			}else if(this.TabCur==1){
				this.SelfList=this.storeOutPickList;
				this.SelfInfo.OrderNumber=this.storeOutorderInfo.OrderNumber;
				this.SelfInfo.BuyerName=this.storeOutorderInfo.BuyerName;
				this.SelfInfo.BuyerPhone=this.storeOutorderInfo.BuyerPhone;
				if(this.storeOutPickList.length < 6 ){
					this.picklist=this.storeOutPickList
				}else{
					for(let i=0;i<5;i++){
						this.picklist.push(this.storeOutPickList[i])
					}
				}
			}
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==0){
				this.backNav();
			}
		}
	}
</script>

<style>
	@import url("../../common/index.css");
	 .bottom-btn{
		height: 160upx;
	 }
	.picker{border-bottom: 1upx solid #E5E5E5;	padding: 30upx 0;font-size: 28upx;color: #333333;}
	uni-picker .uni-input{	padding: 0;}
	.picker-icon{float: right;}
	.tab-empty{/* width: 100%; */}
	.container-empty{windth:100%;height: 500upx;display: flex;justify-content: center;align-items: flex-end;}
	.empty-icon{width: 280upx;height: 280upx;}
	.coming-text{margin-top: 20upx;	text-align: center;	font-size: 26upx;	color: #333333;}
	.moenyValue{max-width: 300upx;color: #333333;min-width: 200upx;}
	.orderNum{font-size: 28upx;color: #333333;}

</style>
