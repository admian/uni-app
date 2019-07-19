<template>
	<view>
		<view v-show="!loadingShow">
			<view class="content-container" v-show="showCreate==false">
				<wuc-tab :tab-list="tabList" :textFlex="true" :tabCur.sync="TabCur" tab-class="text-center text-black bg-white" select-class="text-orange"></wuc-tab>
				<swiper class="swiper-box" :current="TabCur" duration="300" :circular="false" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">
					<swiper-item class="scroll-view">
						<view class="order-container">
								<view class="card-item">
									<view class="card-dp-top-i">
										<view class="card-dp-top">
											<image src="../../static/order/A0202_sku_info_16px_3x.png" class="card-dp-top-icon"></image>
											<view class="card-dp-top-title">
											   {{i18n.index.SKUInformation}}
											</view>
										</view>
										<view class="edit" v-if="storeInPickCList.length!==0" @tap="pickTo(1)">
											<image src="../../static/icon/A0308_edit_b6b6b6_16px_3x.png" class="edit-img"></image>		
										</view>
									</view>						
									<view class="context" @tap="pickTo(1)" v-if="storeInPickCList.length==0">
										<view class="one"><image src="../../static/icon/A0305_add_b6b6b6_16px_3x.png" class="add-icon"></image></view>
										<view class="two"> {{i18n.index.PickSKUfromSKUList}}</view>
									</view>
									<view class="sku-list" v-if="storeInPickCList.length!==0">
										<view v-for="(i,index) in picklist" :key="index">
											<view class="item-skuinfo" v-if="index!=picklist.length-1">
												<view class="sku-i">
													<view class="sku-n">{{i.partNo}}</view>
													<view class="sku-q">{{i.qtyBook}} <text>Pcs.</text></view>
												</view>
												<view class="sku-d">{{i.partDesc}}</view>
											</view>
											<view class="item-skuinfos" v-if="index==picklist.length-1">
												<view class="sku-i">
													<view class="sku-n">{{i.partNo}}</view>
													<view class="sku-q">{{i.qtyBook}} <text>Pcs.</text></view>
												</view>
												<view class="sku-d">{{i.partDesc}}</view>
											</view>
										</view>
									</view>
									<view class="more" v-if="storeInPickCList.length>5">
										<image class="down-icon" @tap="downMore(1)"
										:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
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
										<view class="company">
											<view class="input-left">
												<input type="text" :placeholder="i18n.index.CourierInput" placeholder-style="color:#999999;" v-model="storeInObj.CourierBillNumber" @blur="number($event.target.value)"/>
											</view>
											<image src="../../static/icon/A0325_scan_b6b6b6_16px_3x.png" class="right-icon" @tap="Scan"></image>
										</view>
										
										<navigator url="../courier/si-courier">
											<view class="companys">
												<view class="input-left">
													<text class="place" v-if="storeInObj.courier==''">{{i18n.index.SelectCompany}}</text>
													<text v-else>{{i18n.index[storeInObj.courier]}}</text>
													<!-- <input type="text" :placeholder="i18n.index.SelectCompany" v-model="i18n.index[storeInObj.courier]" @blur="company($event.target.value)"/> -->
												</view>
												<view>
													<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
												</view>
											</view>
										</navigator>
										
									</view>
								</view>
								<view class="card-item">
									<view class="card-dp-top">
										<image src="../../static/order/A0205_instruction_16px_3x.png" class="card-dp-top-icon"></image>
										<view class="card-dp-top-title">
										   {{i18n.index.Instruction}}
										</view>
									</view>
									<view class="context flex-view" @tap="addInstru(1)">
										<view class="input-left">
											<text class="place" v-if="storeInObj.instruction==''">{{i18n.index.Select}}</text>
											<text v-else>{{storeInObj.instruction}}</text>
											
											<!-- <textarea :placeholder="i18n.index.Select" class="instru-textarea" v-model="storeInObj.instruction" @blur="instText($event.target.value)"></textarea> -->
										</view>
										<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon" ></image>			
									</view>
								</view>
								<view class="view-btn">
									<button class="btn-create" :class="isCreate ? 'yes' :'no'" :disabled="!isCreate" @tap="createCourierClick">{{i18n.index.Create}}</button> 
								</view>
							</view>
					</swiper-item>
					<swiper-item class="scroll-view">
						<view class="order-container">
							<view class="card-item">
								<view class="card-dp-top-i">
									<view class="card-dp-top">
										<image src="../../static/order/A0202_sku_info_16px_3x.png" class="card-dp-top-icon"></image>
										<view class="card-dp-top-title">
										  {{i18n.index.SKUInformation}}
										</view>
									</view>
									<view class="edit" v-if="storeInPickSList.length!==0" @tap="pickTo(2)">
										<image src="../../static/icon/A0308_edit_b6b6b6_16px_3x.png" class="edit-img"></image>		
									</view>
								</view>	
								<view class="context" @tap="pickTo(2)" v-if="storeInPickSList.length==0">
									<view class="one"><image src="../../static/icon/A0305_add_b6b6b6_16px_3x.png" class="add-icon"></image></view>
									<view class="two">{{i18n.index.PickSKUfromSKUList}}</view>
								</view>
								<view class="sku-list" v-else>
									<view v-for="(i,index) in picklist" :key="index">
										<view class="item-skuinfo" v-if="index!=picklist.length-1">
											<view class="sku-i">
												<view class="sku-n">{{i.partNo}}</view>
												<view class="sku-q">{{i.qtyBook}} <text>Pcs.</text></view>
											</view>
											<view class="sku-d">{{i.partDesc}}</view>
										</view>
										<view class="item-skuinfos" v-if="index==picklist.length-1">
											<view class="sku-i">
												<view class="sku-n">{{i.partNo}}</view>
												<view class="sku-q">{{i.qtyBook}} <text>Pcs.</text></view>
											</view>
											<view class="sku-d">{{i.partDesc}}</view>
										</view>
									</view>
								</view>
								<view class="more" v-if="storeInPickSList.length > 5">
									<image class="down-icon" @tap="downMore(2)"
									:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
								</view>
							</view>
							<view class="card-item">
								<view class="card-dp-top">
									<image src="../../static/order/A0204_courier_16px_3x.png" class="card-dp-top-icon"></image>
									<view class="card-dp-top-title">
									   {{i18n.index.Information}}
									</view>
								</view>
								<view class="context">
									<view class="companys">
										<view class="input-phone">
											<input type="text" :placeholder="i18n.index.Inputphone" placeholder-style="color:#999999;"  id="phone" v-model="selfSIObj.CourierBillNumber" @blur="phone($event.target.value)" />
										</view>
										<!-- <image src="../../static/icon/A0324_phone_b6b6b6_16px_3x.png" class="right-icon" @tap="getContacts"></image> -->
									</view>
								</view>
							</view>
							<view class="card-item">
								<view class="card-dp-top">
									<image src="../../static/order/A0205_instruction_16px_3x.png" class="card-dp-top-icon"></image>
									<view class="card-dp-top-title">
									  {{i18n.index.Instruction}}
									</view>
								</view>
								<view class="context flex-view" @tap="addInstru(2)">
									<view class="input-left">
										<text class="place" v-if="selfSIObj.instruction==''">{{i18n.index.Select}}</text>
										<text v-else>{{selfSIObj.instruction}}</text>
										<!-- <textarea class="instru-textarea"  :placeholder="i18n.index.Select" v-model="selfSIObj.instruction" @blur="etxtInst($event.target.value)"></textarea> -->
									</view>
									<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
								</view>
							</view>
							<view class="view-btn">
								<button class="btn-create" :class="disCreate ? 'yes' : 'no'" :disabled="!disCreate"  @tap="createSelfClick">{{i18n.index.Create}}</button>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="ok_again" v-show="showCreate">
			<view class="center-img">
				<image src="../../static/order/pic_page_successful_140px_3x.png" class="ok_again_img"></image>
			</view>
			<view class="font-view">{{i18n.index.CreateOrderSuccessfully}}</view>
			<view class="btn-again">
				<view class="btn1" @tap="createMore">{{i18n.index['Create More']}}</view>
				<view class="btn2" @tap="checkOrder">{{i18n.index['Check Order']}}</view>
			</view>
		</view>
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniLoading from '../../components/uni-loading.vue';
	 import WucTab from '../../components/wuc-tab.vue';
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		components: {
			uniLoading,WucTab
		},
		data() {
			return {
				tabList: [{ name:'byCourier' }, { name:'bySelfDelivery'}],
				TabCur: 0,
				id:'',
				showCreate:false,
				picklist:[],
				page:1,
				pageSize:5,
				CourierBillNumber:'',
				orderNo:'',
				loadingShow:false,
				showMore:false,
				text:'',
				type:'scan-listener'
			};
		},
		computed:{
			...mapState([
				'storeInPickCList',
				'storeInPickSList',
				'storeInObj',
				'selfSIObj',
				'pickSkuList'
			]),
			isCreate(){
				return this.storeInPickCList.length && this.storeInObj.courier && this.storeInObj.CourierBillNumber
			},
			disCreate(){
				return this.storeInPickSList.length && this.selfSIObj.CourierBillNumber
			},
			i18n() {  
				return this.$i18nMsg()  
			}
			
		},
		methods:{
			...mapMutations(['StoreInCourierObj','StoreInpickC','StoreInpickS','PickSku','StoreInSelfObj']),
			getContacts() {  

            },
			backNav(){
				//返回时，清楚缓存数据
				this.StoreInCourierObj({CourierBillNumber:'',courier:'',instruction:''});
				this.StoreInpickC([]);
				this.StoreInpickS([]);
				this.PickSku([]);
				this.StoreInSelfObj({CourierBillNumber:'',courier:'Self-delivery',instruction:''});
				uni.switchTab({url:"../taber/home"})
			},
			pickTo(id){ uni.navigateTo({url:"pick-sku?id="+id}) },
			addInstru(id){uni.navigateTo({url:'si-add-instruction?id='+id }) },
			swiperChange(e) {
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
			    let { current } = e.target;
			    this.TabCur = current;
			},
			//扫码
			Scan(){
				//console.log('点击scan');
				uni.navigateTo({
					url:'scan/scan?text=' + this.text + '&type=' + this.type,
				})
				// uni.scanCode({
				// 	success:(res)=> {
				// 		let CourierBillNumber=res.result;
				// 		this.StoreInCourierObj({courier:this.storeInObj.courier,CourierBillNumber:CourierBillNumber,instruction:this.storeInObj.instruction})
				// 	},
				// 	fail() {
				// 		uni.showToast({
				// 			icon:"none",
				// 			title: i18n.index.scanError,
				// 			duration: 2000
				// 		});
				// 	}
				// });
			},
			company(courier){
				this.StoreInCourierObj({courier:courier,CourierBillNumber:this.storeInObj.CourierBillNumber,instruction:this.storeInObj.instruction})
			},
			number(CourierBillNumber){
				this.CourierBillNumber=CourierBillNumber;
				this.StoreInCourierObj({courier:this.storeInObj.courier,CourierBillNumber:CourierBillNumber,instruction:this.storeInObj.instruction})
			},
			instText(instruction){
				//console.log(instruction);
				this.StoreInCourierObj({courier:this.storeInObj.courier,CourierBillNumber:this.storeInObj.CourierBillNumber,instruction:instruction})
			},
			phone(phoneNum){
				this.StoreInSelfObj({CourierBillNumber:phoneNum,courier:'Self-delivery',instruction:this.selfSIObj.instruction})
			},
			etxtInst(instruction){
				this.StoreInSelfObj({CourierBillNumber:this.selfSIObj.CourierBillNumber,courier:'Self-delivery',instruction:instruction})
			},
			downMore(id){
				let _this=this;
				if(id==1){
					if(this.showMore==false){
						if(this.storeInPickCList.length==this.picklist.length){
							return
						}else{
							this.page++;
							this.picklist=this.storeInPickCList;
						}
						this.showMore=true;
					}else{
						this.picklist=[];//归零追加
						this.page=1;//初始情况下
						for(let i=0;i<5;i++){
							this.picklist.push(this.storeInPickCList[i])
						}
						this.showMore=false
					}
					
				}else{
					if(this.showMore==false){
						if(this.storeInPickSList.length==this.picklist.length){
							return
						}else{
							this.picklist=this.storeInPickSList;
						}
						this.showMore=true
					}else{
						this.picklist=[];//归零追加
						this.page=1;//初始情况下
						for(let i=0;i<5;i++){
							this.picklist.push(this.storeInPickSList[i])
						}
						this.showMore=false
					}
					
				}
				
				
			},
			createMore(){
				this.StoreInCourierObj({CourierBillNumber:'',courier:'',instruction:''});
				this.StoreInSelfObj({CourierBillNumber:'',courier:'Self-delivery',instruction:''});
				this.StoreInpickC([]);
				this.StoreInpickS([]);
				this.showCreate=false;
			},
			checkOrder(){
				uni.navigateTo({
					url:'../order/si-order-information?orderNo='+this.orderNo,
					success: () => {
						this.StoreInpickC([]);
						this.StoreInpickS([]);
						this.StoreInCourierObj({CourierBillNumber:'',courier:'',instruction:''});
						this.StoreInSelfObj({CourierBillNumber:'',courier:'Self-delivery',instruction:''});
					} 
				})
			},
			createCourierClick(){
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				this.loadingShow=true;
				let _this=this,list=[];
				this.storeInPickCList.forEach((i)=>{
					let obj ={
						"skuNo":i.partNo,
						"partDesc":i.partDesc,
						"qtyBook":i.qtyBook,
						"pkgBook":i.pkgBook,
						"qtyUnit":i.qtyUnit,
						"qtyPerPkg":i.qtyPerPkg,
						"pkgUnit":i.pkgUnit
					}
					list.push(obj);
				})
				uni.getStorage({
					key: 'uerInfo',
					success: (res) =>{	
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/storeInorder/createOrder',
							method:"POST",
							header:{
								"content-type":"application/json"
							},
							data:{
								"customer":customer,
								"warehouseCode":this.warehouseCode,
								"courierCompany":this.storeInObj.courier,
								"courierBillNo":this.storeInObj.CourierBillNumber,
								"instruction":this.storeInObj.instruction,
								"SKUs": list
							},
							success:(res)=> {
								this.loadingShow=false;
								if(res.data.status==200){
									this.orderNo=res.data.data;
									this.PickSku([]);
									this.showCreate=true;
								}else if(res.data.status==500){
									uni.showModal({
										title: this.i18n.index.systemError_one,
										content: this.i18n.index.systemError_two,
										showCancel: false,
										confirmText: this.i18n.index.OK
									})
									return
								}else{//203
									uni.showModal({
										title: this.i18n.index.CreateError_one,
										content:res.data.message ,
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
				let _this=this,lists=[];
				this.storeInPickSList.forEach((i)=>{
					let obj ={
						"skuNo":i.partNo,
						"partDesc":i.partDesc,
						"qtyBook":i.qtyBook,
						"pkgBook":i.pkgBook,
						"qtyUnit":i.qtyUnit,
						"qtyPerPkg":i.qtyPerPkg,
						"pkgUnit":i.pkgUnit
					}
					lists.push(obj);
				})
				uni.getStorage({
					key: 'uerInfo',
					success:(res)=> {	
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/storeInorder/createOrder',
							method:"POST",
							header:{
								"content-type":"application/json"
							},
							data:{
								"customer":customer,
								"warehouseCode":this.warehouseCode,
								"courierCompany":"Self-delivery",
								"courierBillNo":this.selfSIObj.CourierBillNumber,
								"instruction":this.selfSIObj.instruction,
								"SKUs":lists
							},
							success:(res)=> {
								this.loadingShow=false;
								//console.log(res.data.data)	
								if(res.data.status==200){
									this.orderNo=res.data.data;
									this.PickSku([]);
									this.showCreate=true;
									return
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
										title: this.i18n.index.CreateError_one,
										content: res.data.message,
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
			}
		},
		onLoad(){ 
			// #ifdef APP-PLUS
			this.$eventHub.$on(this.type, (data)=> {
				console.log("data: " + JSON.stringify(data));
				//console.log(this.type);
				let CourierBillNumber=data.result;
				console.log(CourierBillNumber);
				this.StoreInCourierObj({courier:this.storeInObj.courier,CourierBillNumber:CourierBillNumber,instruction:this.storeInObj.instruction})
			});
			// #endif
			uni.setNavigationBarTitle({
				title: this.i18n.index.CreateSIOrder
			})
		},
		onBackPress() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary')
			// #endif
			this.StoreInCourierObj({CourierBillNumber:'',courier:'',instruction:''});
			this.StoreInpickC([]);
			this.StoreInpickS([]);
			this.PickSku([]);
			this.StoreInSelfObj({CourierBillNumber:'',courier:'Self-delivery',instruction:''});
		},
		onShow(){
			//console.log(this.storeInPickSList);
			//console.log(this.storeInObj);
			this.picklist=[];
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			//console.log(currPage);
			if(currPage.id){
				if(currPage.id==1){
					this.TabCur=0
				}else{
					this.TabCur=1
				}
			}
			if(this.TabCur==0){
				if(this.storeInPickCList.length < 6 ){
					this.picklist=this.storeInPickCList
				}else{
					for(let i=0;i<5;i++){
						this.picklist.push(this.storeInPickCList[i])
					}
				}
			}else{
				if(this.storeInPickSList.length < 6 ){
					this.picklist=this.storeInPickSList
				}else{
					for(let i=0;i<5;i++){
						this.picklist.push(this.storeInPickSList[i])
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
</style>
