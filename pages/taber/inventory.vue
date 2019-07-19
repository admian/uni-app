<template>	
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="title-position">
			<view class="invertory-title">
				<view class="inven-title-info">
					<view class="head-icon" v-show="scrollTitle"></view>
					<view class="title-text" v-show="scrollTitle">{{ i18n.index.Inventory }} </view>
					<view class="head-icon">
						<!-- <image src="../../static/icon/A0360_search_ffffff_16px_3x.png" class="inven-icon"></image>
						<image src="../../static/icon/A0359_export_ffffff_16px_3x.png" class="inven-icon"></image> -->
					</view>
				</view>
				<view class="init-tittle-text" v-show="!scrollTitle">{{ i18n.index.Inventory }}</view>
			</view>
		</view>
		<view v-show="listShow">
			<view class="container-list" :class="scrollTitle?'scroll':'no-scroll'">
				<view class="item-info" v-for="(item,index) in showList" :key="index">
					<view>
						<view class="no-order">{{item.partNo}}</view>
						<view class="no-des">{{item.partDesc ? item.partDesc:''}}</view>
					</view>
					<view>
						<view class="numtext">{{i18n.index.Total}}</view>
						<view class="numtext">{{i18n.index.Available}}</view>
					</view>
					<view>
						<view class="number">
							{{item.qtyInv-0}} {{ i18n.index[item.qtyUnit] }}
						</view>
						<view class="number">{{item.qtyInv-item.qtyIntent>0?item.qtyInv-item.qtyIntent:0}} {{ i18n.index[item.qtyUnit] }}</view>
						<!-- <view class="number-stock">Zero Stock</view> -->
					</view>
				</view>
			</view> 
			<view class="backTop-icon" v-show="scrollTitle" @tap="backTop">
				<image src="../../static/icon/A0303_up_b6b6b6_16px_3x.png" class="up-icon"></image>
			</view>
		</view>
		
		<!-- 加载更多 -->
		<view>
			<uni-load-more  :loadingType="loadingType" :contentText="contentText" v-show="inventoryList.length>10"></uni-load-more>
		</view>
		
		<!-- 空白提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image v-if="emptyShow" src="../../static/order/pic_empty_page_140px_3x.png" class="no-img"></image>
				<image v-else-if="errorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
				<image v-else-if="systemerrorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
			</view>
			<view class="text-con">
				<view v-if="emptyShow">
					<p>{{i18n.index.invenEmpty_one}}</p>
					<p>{{i18n.index.invenEmpty_two}}</p>
				</view>
				<view v-else-if="errorShow">
					<p>{{i18n.index.invenError_one}}</p>
					<p>{{i18n.index.invenError_two}}</p>
				</view>
				<view v-else-if="systemerrorShow">
					<p>{{i18n.index.systemError_one}}</p>
					<p>{{i18n.index.systemError_two}}</p>
				</view>
			</view>
		</view>
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import uniLoading from '../../components/uni-loading.vue';
	import uniLoadMore from '../../components/uni-load-more.vue';
	var _self,
		page = 1,
		timer = null;
	export default {
		components:{
			uniHead,uniLoadMore,uniLoading
		},
		computed:{
			 i18n() {  
			    return this.$i18nMsg()  
			}
		},
		data() {
			return {
				scrollTitle:false,
				messageShow:false,
				errorShow:false,
				systemerrorShow:false,
				emptyShow:false,
				listShow:false,
				loadingShow:false,
				inventoryList:[],
				showList:[],
				page:1,
				pageSize:10,
				loadingText: ' ',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown:' ',
					contentrefresh: ' ',
					contentnomore: '-END-'
				}
			}
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
			invenSearch(){
				uni.navigateTo({
					url:'../inventory/inventory-search'
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
								if (res.data.status==404) {
									//没有数据 
									_this.loadingType = 2; 
									//uni.hideNavigationBarLoading();//关闭加载动画 
									return  
								}
								_this.page++;//每触底一次 page +1 
								_this.showList.push(...res.data.data.PartInvList);
								_this.loadingType = 0;//将loadingType归0重置 
								//uni.hideNavigationBarLoading();//关闭加载动画 
								
								
							}
						})
					}
				})
			},

		},
		onShow() {
			console.log('show');
			// #ifdef APP-PLUS  
			plus.statistic.eventTrig('load_inventory', new Date());
			// #endif 
			
		},
		onLoad() {
			this.loadingShow=true;
			_self = this;
			let _this=this;
			uni.getStorage({
				key:'uerInfo',
				success: (res) => {
					let customer=res.data.customer;
					uni.request({
						url:_this.baseUrl+'/inventory/App/queryByCriteria',
						method:'POST',
						header:{
							"content-type":"application/json"
						},
						data:{
							"customer":customer,
							"warehouseCode":this.warehouseCode,
							"page":_this.page,
							"pageSize":_this.pageSize,
							"groupByParams":"partNoGroup"
						},
						success: (res) => {
							//console.log(res);
							this.loadingShow=false;
							if(res.data.status==404){
								this.messageShow=true;
								this.emptyShow=true;
							}else if(res.data.status==200){
								this.page=2;
								this.listShow=true;
								this.showList=res.data.data.PartInvList;
							}else if(res.data.status==500){
								this.messageShow=true;
								this.systemerrorShow=true;
							} 
						},
						fail: (res) => {
							this.loadingShow=false;
							this.messageShow=true;
							this.errorShow=true;
						}
					})
				}
			})
		}
		
	}
</script>

<style>
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
	.status_bar { height: var(--status-bar-height); width: 100%; background-color: #EA8C1B; } 
	.top_view { height: var(--status-bar-height); width: 100%; position: fixed; background-color: #EA8C1B; top: 0; z-index: 999; }
	.title-position{
		position: fixed;
		height: 212upx;
		width: 100%;
		top: var(--status-bar-height);
	}
	.invertory-title{
		background: #EA8C1B;
		padding-right: 40upx;
		color: #FFFFFF;		
	}
	.inven-title-info{
		display: flex;
		justify-content: flex-end;	
		align-items: center;
		height: 76upx;
	}
	.title-text{
		width: 400upx;
		font-size: 36upx;
		text-align: center;
	}
	.head-icon{
		width: 140upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		opacity: .4;
		
	}
	.inven-icon{
		margin-left: 30upx;
		width: 32upx;
		height: 32upx;
	}
	.init-tittle-text{
		padding-top: 45upx;
		padding-left: 40upx;
		height: 92upx;
		font-size: 66upx;
		font-weight: bold;
	}
	/* --------------------------------------------------------- */
	.container-list{	
		padding-left: 40upx;	
	}
	.scroll{
		margin-top: 76upx;
	}
	.no-scroll{
		margin-top: 212upx;
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
		width: 380upx;
		
	}
	.numtext{
		width: 146upx;
		text-align: right;
		font-size: 20upx;
		margin-top: 18upx;
		color: #333333;
		
	}
	.number{
		color: #EA8C1B;
		text-align: right;
		font-size: 20upx;	
		width: 130upx;
		margin-top: 20upx;
		
	}
	.number-stock{
		width:154upx;
		height:28upx;
		font-family:Arial;
		background: #F85730;		
		font-size: 20upx;
		line-height: 28upx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 16upx;
	}
	/* ---------------------------------------------------- */
	.backTop-icon{
		width: 84upx;
		height: 84upx;
		position: fixed;
		bottom: 130upx;
		right: 40upx;
		border: 2upx  #B6B6B6 solid;
		border-radius: 50%;
		background: rgba(255,255,255,.4);	
	}
	.up-icon{
		margin: 26upx 26upx;
		width: 32upx;
		height: 32upx;
	}
</style>
