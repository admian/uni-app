<template>	
	<view>
		<!-- <uni-head :title="i18n.index.SelectsSKU" :showSearch="true" @click-back="back"></uni-head> -->
		<view class="container-list">
			<view class="item-info" v-for="(item,index) in list" :key="index" @tap="selectSku(index)">
				<view>
					<view class="no-order">{{item.partNo}}</view>
					<view class="no-des">{{item.partDesc?item.partDesc:''}}</view>
				</view>
				<view>
					<view class="numtext">{{i18n.index.Available}}</view>
				</view>
				<view>
					<view class="number">{{item.qtyInv-item.qtyIntent>0?item.qtyInv-item.qtyIntent :0}} <text>{{i18n.index[item.qtyUnit]}}</text></view>
					<!-- <view :class="item.warn?'number-stock':''">{{item.warn}}</view> -->
				</view>
			</view>
		</view>
		<!-- 加载更多 -->
		<view>
			<uni-load-more  :loadingType="loadingType" :contentText="contentText" v-show="list.length!==0"></uni-load-more>
		</view>
		
		<!-- 空白提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image v-if="emptyShow" src="../../static/order/pic_empty_page_140px_3x.png" class="no-img"></image>
				<image v-else-if="errorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
			</view>
			<view class="text-con">
				<view v-if="emptyShow">
					<p>{{i18n.index.SO_SkuEmpty}}</p>
				</view>
				<view v-else-if="errorShow">
					<p>{{i18n.index.pickSKUError_one}}</p>
					<p>{{i18n.index.pickSKUError_two}}</p>
				</view>
			</view>
		</view>
		
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import uniLoadMore from '../../components/uni-load-more.vue';
	import uniLoading from '../../components/uni-loading.vue';
	import {mapState, mapMutations } from "vuex";
	let _self,arr=[];
	export default {
		components:{
			uniHead,uniLoadMore,uniLoading
		},
		data() {
			return {
				index:'',
				id:0,
				list:[],
				messageShow:false,
				errorShow:false,
				loadingShow:false,
				emptyShow:false,
				listShow:false,
				page:1,
				pageSize:10,
				loadingText: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown:'',
					contentrefresh: '',
					contentnomore: '-END-'
				}
			}
		},
		computed:{
			...mapState(['storeOutPickList']),
			i18n() {  
			    return this.$i18nMsg()  
			}
		},
		onReachBottom:(res)=> {
			//触底的时候请求数据，即为上拉加载更多
			_self.getmorenews();
		},
		methods:{
			...mapMutations(['StoreOutPick']),
			back(){
				 uni.navigateBack({
					delta: 1
				})
			},
			selectSku(i){
				let len=this.storeOutPickList.length-1;
				if(this.index){
					this.storeOutPickList[this.index].partNo=this.list[i].partNo;
					this.storeOutPickList[this.index].partDescription=this.list[i].partDesc;
				}else{
					this.storeOutPickList[len].partNo=this.list[i].partNo;
					this.storeOutPickList[len].partDescription=this.list[i].partDesc;
				}
				//console.log(this.storeOutPickList)
				this.StoreOutPick(this.storeOutPickList);
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.id=this.id;//修改TabCur的值
				uni.navigateBack();
			},
			getmorenews:function () {
				let _this=this;
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
							url:this.baseUrl+'/inventory/App/queryByCriteria',
							method:'POST',
							header:{"content-type":"application/json"},
							data:{
								"customer":customer,
								"warehouseCode":this.warehouseCode,
								"page":this.page,
								"pageSize":this.pageSize,
								"groupByParams":"partNoGroup"
							},
							success: (res) => { 
								//console.log(res.data.status);
								if (res.data.status==404) {
									//没有数据 
									_this.loadingType = 2; 
									//uni.hideNavigationBarLoading();//关闭加载动画 
									return false; 
								}
								
								_this.page++;//每触底一次 page +1 
								_this.list.push(...res.data.data.PartInvList);
								_this.loadingType = 0;//将loadingType归0重置 
								//uni.hideNavigationBarLoading();//关闭加载动画 
							}
						})
					}
				})
			},
			
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.i18n.index.SelectsSKU
			})
			this.loadingShow=true;
			this.id=e.id;
			this.index=e.index;
			let _this=this;
			_self=this;
			uni.getStorage({
				key:'uerInfo',
				success: (res) => {
					let customer=res.data.customer;
					uni.request({
						url:this.baseUrl+'/inventory/App/queryByCriteria',
						method:'POST',
						header:{"content-type":"application/json"},
						data:{
							"customer":customer,
							"warehouseCode":this.warehouseCode,
							"page":this.page,
							"pageSize":this.pageSize,
							"groupByParams":"partNoGroup"
						},
						success: (res) => { 
							this.loadingShow=false
							//console.log(res.data.data.PartInvList);
							if(res.data.status==200){ 
								this.page=2;
								this.list=res.data.data.PartInvList
							}else if(res.data.status==404){
								this.messageShow=true;
								this.emptyShow=true;
							}else{
								this.messageShow=true;
								this.errorShow=true;
							}
						},
						fail:(res)=> {
							this.loadingShow=false;
							this.messageShow=true;
							this.errorShow=true;
						}
					})
				}
			})
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			this.back();
		},
		onShow(){
			let pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面 
			currPage.id=prevPage.id;
		}
	}
</script>

<style>
	.container-list{	
		padding-left: 40upx;	
	}
	.item-info{
		padding: 30upx 40upx 30upx 0;
		border-bottom: 1upx  solid #E5E5E5;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: Arial;
	}
	.no-order{
		font-size: 36upx;
		color: #333333;
		font-weight: Regular;
		margin-bottom: 15upx;
	}
	.no-des{
		font-size: 24upx;
		color: #999999;
		font-weight: Regular;
		width: 400upx;
	}
	.numtext{
		text-align: right;
		font-size: 20upx;
		margin-top: 20upx;
	}
	.number{
		color: #EA8C1B;
		text-align: right;
		font-size: 20upx;	
		width: 110upx;
		margin-top: 20upx;
	}
	.number-stock{
		padding: 2upx 28upx 4upx 28upx;
		height:28upx;
		font-family:Arial;
		background: #F85730;		
		font-size: 20upx;
		line-height: 28upx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 18upx;
	}
	
</style>
