<template>
	<view id="neworder">
		<!-- <uni-head :title="i18n.index.SIOrderInformation" @click-back="back"></uni-head> -->
		<view v-show="!loadingShow">
			<view class="order-item" v-show="listShow">
				<view class="order-i"> 
					<view class="order-name">{{orderList.orderNo}}</view>
					<view class="order-time">{{orderList.createdDtLoc}}</view>
				</view>
				<view  class="order-n">Store-In by <text v-if="orderList.refOrderNo">Courier</text><text  v-if="!orderList.refOrderNo">Self-Delivery</text></view>
				<view class="order-n" v-if="orderList.deliveryNote">
					<image v-if="orderList.refOrderNo" src="../../static/order/A0251_courier_bill_number_b6b6b6_16px_3x.png" class="order-icon"></image>
					<image v-if="!orderList.refOrderNo" src="../../static/order/A0252_phone_number_b6b6b6_16px_3x.png" class="order-icon"></image>
					{{orderList.deliveryNote}}
				</view>
				<view class="order-b">
					<view class="order-g" :class="orderList.status=='Q'? 'g-color':(orderList.status=='C'?'d-color':'p-color')">
					{{ i18n.index[orderList.status] }}
					</view>
				</view>
			</view>
			<view style="padding-bottom: 40upx;">
				<view v-if="orderList.orderParts">
					<view class="order-details" v-if="orderList.orderParts.length">
						<view class="info">
							<view class="order-info-title">
								<image src="../../static/order/A0202_sku_info_16px_3x.png" class="title-icon"></image>
								{{i18n.index.SKUInformation}}
							</view>
							<view v-for="(item,index) in orderPartsList" :key="index">
								<view class="orderitem-info" v-if="index!=orderPartsList.length-1">
									<view class="sku-tiem">
										<view class="sku-n">{{item.partNo}}</view>
										<view class="sku-q">{{item.qtyBook-0}}<text>{{item.qtyUnit ? i18n.index[item.qtyUnit] :'Pcs.'}}</text></view>
									</view>
									<view class="sku-d">{{item.partDesc}}</view>
									
								</view>
								<view class="orderitem-infos" v-if="index==orderPartsList.length-1">
									<view class="sku-tiem">
										<view class="sku-n">{{item.partNo}}</view>
										<view class="sku-q">{{item.qtyBook-0}}<text>{{item.qtyUnit ? i18n.index[item.qtyUnit] :'Pcs.'}}</text></view>
									</view>
									<view class="sku-d">{{item.partDesc}}</view>
								</view>
							</view>
							<view class="more" v-show="orderList.orderParts.length>5">
							<image class="down-icon" @tap="downMore"
							:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="order-details" v-if="orderList.remarks3">
					<view class="info">
						<view class="order-info-title">
							<image src="../../static/order/A0205_instruction_16px_3x.png" class="title-icon"></image>
							{{i18n.index.Instruction}}
						</view>
						<view class="text-instru">{{orderList.remarks3}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 错误提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
			</view>
			<view class="text-con">
				<p>{{i18n.index.systemError_one}}</p>
				<p>{{i18n.index.systemError_two}}</p>
			</view>
		</view>
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import uniLoading from '../../components/uni-loading.vue';
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		components:{
			uniHead,uniLoading
		},
		data() {
			return {
				title:'',
				tab:1,
				orderList:{},
				orderPartsList:[],
				page:1,
				pageSize:5,
				loadingShow:false,
				showMore:false,
				listShow:false,
				messageShow:false,
				backid:''
			};
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    },
			...mapState(['orderSIDetails']),
		},
		methods:{
			back(){
				if(this.backid==''){
					uni.navigateBack({delta: 1});
				}else{
					uni.navigateTo({
						url:'../create/store-in-order',
					})
				}
			},
			downMore(){
				let _this=this;
				if(this.showMore==false){
					if(this.orderList.orderParts.length==this.orderPartsList.length){
						return
					}else{
						this.orderPartsList=this.orderList.orderParts;
					}
					this.showMore=true
				}else{
					this.orderPartsList=[];//归零追加
					this.page=1;//初始情况下
					for(let i=0;i<5;i++){
						this.orderPartsList.push(this.orderList.orderParts[i])
					}
					this.showMore=false
				}
				
			}
		},
		onLoad(option){
			uni.setNavigationBarTitle({
				title: this.i18n.index.SIOrderInformation
			})
			if(option.orderNo){
				this.loadingShow=true;
				this.backid=1
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/storeInorder/App/queryByCriteria',
							method:'POST',
							header:{"content-type":"application/json"},
							data:{
								"customer":customer,
								"warehouseCode":this.warehouseCode,
								"orderNo":option.orderNo,
								"page":1,
								"pageSize":1,
							},
							success: (res) => { 
								this.loadingShow=false;
								if(res.data.status==200){
									this.listShow=true;
									let list=res.data.data.SIOrderList[0];
									let arr=list.createdDtLoc.split(' ');
									let	time=arr[0];
									let obj={
										createdDtLoc:time,
										orderNo:list.orderNo,
										status:list.status,
										deliveryNote:list.deliveryNote,
										refOrderNo:list.refOrderNo,
										orderParts:list.orderParts,
										remarks3:list.remarks3
									}
									this.orderList=obj
									//this.orderList=res.data.data.SIOrderList[0];
									if(this.orderList.orderParts.length < 6 ){
										this.orderPartsList=this.orderList.orderParts
									}else{
										for(let i=0;i<5;i++){
											this.orderPartsList.push(this.orderList.orderParts[i])
										}
									}
								}else{
									this.messageShow=true;
								}
								
							},
							fail: () => {
								this.loadingShow=false
							}
						})
					}
				})
			}else if(this.orderSIDetails){
				this.listShow=true;
				this.orderList=this.orderSIDetails;
				if(this.orderList.orderParts.length < 6 ){
					this.orderPartsList=this.orderList.orderParts
				}else{
					for(let i=0;i<5;i++){
						this.orderPartsList.push(this.orderList.orderParts[i])
					}
				}
			}	
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==0){
				this.back();
			}
		}
	}
</script>

<style>
@import '../../common/order.css';
@import '../../common/index.css';
.no-container{
	 	height: 700upx;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.no-img{	
		width: 280upx;
		height: 280upx;
	}
	.text-con{
		text-align: center;
		font-size: 28upx;
		font-weight: 400;
		padding: 60upx;
	}
	/* ----------------------------- */
</style>
