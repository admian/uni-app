<template>
	<view id="neworder">
		<view>
			<!-- <uni-head :title="i18n.index[title]" :showSearch="true" :showExport="true" @click-back="back"></uni-head> -->
			<view v-for="(item,index) in orderList" :key="index">
				<view class="order-item" @tap="orderInfo(item)">
					<view class="order-i"> 
						<view class="order-name">{{item.refOrderNo ? item.refOrderNo :'No OrderNo yet' }}</view>
						<view class="order-time">{{item.createdDtLoc}}</view>
					</view>
					<view  class="order-n">Store-Out</view>
					<view class="order-n">
						<view class="order-username" v-if="item.shipping.consigneeContactName">{{item.shipping.consigneeContactName}}</view>
						<view v-if="item.shipping.consigneePhoneNo">{{item.shipping.consigneePhoneNo}}</view>
					</view>
					<view class="order-b">
						<view class="order-g g-color" v-if="item.status=='Q'">
							{{i18n.index['SO_Q']}}
						</view>
						<view class="order-g n-color" v-else-if="item.status=='N'">
							{{i18n.index[item.status]}}
						</view>
						<view class="order-g l-color" v-else-if="item.status=='C'">
							{{i18n.index['SO_C']}}
						</view>
						<view class="order-g d-color" v-else-if="item.status=='DDL_DL1'">
							{{i18n.index[item.status]}}
						</view>
						<view class="order-g p-color" v-else>
							{{i18n.index[item.status]}}
						</view>
					</view>
				</view>
			</view>
			<view class="backTop-icon" v-show="scrollTitle" @tap="backTop">
				<image src="../../static/icon/A0303_up_b6b6b6_16px_3x.png" class="up-icon"></image>
			</view>
			 <!-- 加载更多 -->
			<view>
				<uni-load-more  :loadingType="loadingType" :contentText="contentText" ></uni-load-more>
			</view>
		</view>
		<!-- 错误提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image  src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
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
			...mapState(['orderSODetails'])
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
			...mapMutations(['SODetails']),
			back(){
				uni.switchTab({
					url:'../taber/order'
				})
			},
			orderInfo(info){
				this.SODetails(info);
				uni.navigateTo({
					url:'so-order-information'
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
				
				if (_this.loadingType !== 0) {//loadingType!=0;直接返回 
					return false;
				} 
				_this.loadingType = 1; 
				//uni.showNavigationBarLoading();//显示加载动画 
				
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/soorder/App/queryByCriteria',
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
									return  
								}
								//console.log(res.data.data.SOOrderList);
								if(res.data.status==200){
									_this.page++;//每触底一次 page +1 
									res.data.data.soorderList.forEach((i)=>{
										//console.log(i.createdDtLoc);
										let arr=i.createdDtLoc.split(' ');
										let	time=arr[0];
									
										let obj={
											createdDtLoc:time,
											status:i.status,
											partSOs:i.partSOs,
											refOrderNo:i.refOrderNo,
											shipping:i.shipping,
											pkgs:i.pkgs
										}
										console.log('111')
										this.orderList.push(obj)
									})
								}
								 console.log(this.orderList.length)
								if(this.orderList.length<10){
									
									
								}
								//_this.orderList.push(...res.data.data.SOOrderList);
								_this.loadingType = 0;//将loadingType归0重置 
								//uni.hideNavigationBarLoading();//关闭加载动画 
								
							}
						})
					}
				})
			},
			orderPush(){
				let _this=this;
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/soorder/App/queryByCriteria',
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
								if(res.data.status==200){
									this.page++;
									res.data.data.soorderList.forEach((i)=>{
										//console.log(i.createdDtLoc);
										let arr=i.createdDtLoc.split(' ');
										let	time=arr[0];
										let obj={
											createdDtLoc:time,
											status:i.status,
											partSOs:i.partSOs,
											refOrderNo:i.refOrderNo,
											shipping:i.shipping,
											pkgs:i.pkgs
										}
										this.orderList.push(obj)
									})
									if(res.data.data.soorderList.length<10){
										if(this.orderList.length>10){
											return
										}
										this.orderPush();
									}
								}
							}
						})
					}
				})
			}
		},
		onLoad(option){
			this.loadingShow=true;
			let _this=this;
			_self=this;
			console.log(option.name);
			if(option.name=='new'){
				_this.status='Q',
				_this.title='NewSOOrder'
			}else if(option.name=='processing'){
				_this.status='A,H,RP,P,RK,K,RS,RL,C,N',
				_this.title='ProcessingSOOrder'
				_this.pageSize=40
			}else if(option.name=='all'){
				_this.status='',
				_this.title='AllSOOrder'
			}
			uni.setNavigationBarTitle({
				title: _this.i18n.index[_this.title]
			})
			uni.getStorage({
				key:'uerInfo',
				success: (res) => {
					let customer=res.data.customer;
					uni.request({
						url:this.baseUrl+'/soorder/App/queryByCriteria',
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
								//list.push(res.data.data.soorderList);
								
								res.data.data.soorderList.forEach((i)=>{
									//console.log(i.createdDtLoc);
									let arr=i.createdDtLoc.split(' ');
									let	time=arr[0];
									let obj={
										createdDtLoc:time,
										status:i.status,
										partSOs:i.partSOs,
										refOrderNo:i.refOrderNo,
										shipping:i.shipping,
										pkgs:i.pkgs
									}
									this.orderList.push(obj)
								})
								if(res.data.data.soorderList.length<10){
								 	this.orderPush();
								}
								//this.orderList=res.data.data.SOOrderList;
							}else if(res.data.status==500){
								this.messageShow=true;
							}
						},
						fail() {
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
