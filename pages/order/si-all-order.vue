<template>
	<view id="neworder">
		<view v-show="!loadingShow">
			<!-- <uni-head :title="i18n.index[title]" :showSearch="true" :showExport="true" @click-back="back"></uni-head> -->
			<view v-for="(item,index) in orderList" :key="index" class="order-container">
				<view class="order-item" @tap="orderInfo(item)">
					<view class="order-i"> 
						<view class="order-name">{{item.orderNo}}</view>
						<view class="order-time">{{item.createdDtLoc}}</view>
					</view>
					<view  class="order-n">Store-In by <text v-if="item.refOrderNo">Courier</text><text  v-if="!item.refOrderNo">Self-Delivery</text></view>
					<view class="order-n" v-if="item.deliveryNote">
						<image v-if="item.refOrderNo" src="../../static/order/A0251_courier_bill_number_b6b6b6_16px_3x.png" class="order-icon"></image>
						<image v-if="!item.refOrderNo" src="../../static/order/A0252_phone_number_b6b6b6_16px_3x.png" class="order-icon"></image>
						{{item.deliveryNote}}
					</view>
					<view class="order-b">
						<view class="order-g" :class="item.status=='Q'? 'g-color':(item.status=='C'?'d-color':'p-color')">
						{{ i18n.index[item.status] }}
						</view>
					</view>
				</view>
			</view>
			<view class="backTop-icon" v-show="scrollTitle" @tap="backTop">
				<image src="../../static/icon/A0303_up_b6b6b6_16px_3x.png" class="up-icon"></image>
			</view>
			<!-- 加载更多 -->
			<view>
				<uni-load-more  :loadingType="loadingType" :contentText="contentText" v-show="orderList.length>15"></uni-load-more>
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
	import uniLoadMore from '../../components/uni-load-more.vue';
	import uniLoading from '../../components/uni-loading.vue';
	import {mapMutations ,mapState } from 'vuex'; 
	let _self;
	export default {
		components:{
			uniHead,uniLoadMore,uniLoading
		},
		data() {
			return {
				title:'',
				messageShow:false,
				loadingShow:false,
				scrollTitle:false,
				orderList:[],
				page:1,
				pageSize:10,
				status:'',
				loadingText: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown:' ',
					contentrefresh: '',
					contentnomore: '-END-'
				}
				
			};
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    },
			...mapState(['orderSIDetails'])
		},
		onPageScroll(e){
			if(e.scrollTop>40){
				this.scrollTitle=true;
			}
			if(e.scrollTop==0){
				this.scrollTitle=false;
			}
		},
		onReachBottom:(res)=> {
			//触底的时候请求数据，即为上拉加载更多
			_self.getmorenews();
		},
		methods:{
			...mapMutations(['SIDetails']),
			back(){
				uni.switchTab({
					url:'../taber/order'
				})
			},
			date(time){
				return this.dateTime(time)
			},
			orderInfo(info){
				this.SIDetails(info);
				uni.navigateTo({
					url:'si-order-information'
				})
			},
			backTop(){
				//回滚顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 400
				});
				this.scrollTitle=false;
			},
			getmorenews:function () {
				let _this=this;
				//console.log(_this.orderList.length); 
				
				if (_this.loadingType != 0) {//loadingType!=0;直接返回 
					return false;
				} 
				_this.loadingType = 1; 
				//uni.showNavigationBarLoading();//显示加载动画 
				
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
								"page":this.page,
								"pageSize":this.pageSize,
								"status":this.status
							},
							success: (res) => { 
								if (res.data.status==404) {
									//没有数据 
									_this.loadingType = 2; 
									//uni.hideNavigationBarLoading();//关闭加载动画 
									return false; 
								}
								_this.page++;//每触底一次 page +1 
								res.data.data.SIOrderList.forEach((i)=>{
									//console.log(i.createdDtLoc);
									let arr=i.createdDtLoc.split(' ');
									let	time=arr[0];
								
									let obj={
										createdDtLoc:time,
										orderNo:i.orderNo,
										status:i.status,
										deliveryNote:i.deliveryNote,
										refOrderNo:i.refOrderNo,
										orderParts:i.orderParts,
										remarks3:i.remarks3
									}
									this.orderList.push(obj)
								}) 
								//_this.orderList.push(...res.data.data.SIOrderList);
								_this.loadingType = 0;//将loadingType归0重置 
								//uni.hideNavigationBarLoading();//关闭加载动画 
							}
						})
					}
				})
			},
		},
		onLoad(option) {
			console.log(2)
			this.loadingShow=true;
			//console.log(option.name);
			_self=this;
			let _this=this;
			if(option.name=='new'){
				_this.status='Q',
				_this.title='NewSIOrder'
			}else if(option.name=='processing'){
				_this.status='R,RD,D',
				_this.title='ProcessingSIOrder'
			}else if(option.name=='all'){
				_this.status=' ',
				_this.title='AllSIOrder'
			}
			uni.setNavigationBarTitle({
				title: _this.i18n.index[_this.title]
			})
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
							"page":this.page,
							"pageSize":this.pageSize,
							"status":this.status
						},
						success: (res) => { 
							this.loadingShow=false;
							if(res.data.status==200){
								this.page=2;
								 res.data.data.SIOrderList.forEach((i)=>{
									//console.log(i.createdDtLoc);
									let arr=i.createdDtLoc.split(' ');
									let	time=arr[0];
									let obj={
										createdDtLoc:time,
										orderNo:i.orderNo,
										status:i.status,
										deliveryNote:i.deliveryNote,
										refOrderNo:i.refOrderNo,
										orderParts:i.orderParts,
										remarks3:i.remarks3
									}
									this.orderList.push(obj)
								}) 
							}else if(res.data.status==500){
								this.messageShow=true;
							}
						},
						fail: (res) => {
							this.messageShow=true;
						}
					})
				}
			})
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			this.back();
			/* if(e.index==0){
				this.back();
			} */
		}
	}
</script>

<style>
@import '../../common/order.css';

</style>
