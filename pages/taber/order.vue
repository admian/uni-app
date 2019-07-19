<template>
	<view id="order">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="order-top">
			<view class="order-title">{{i18n.index.Order}}</view>
		</view>
		<view class="order-container" v-show="listShow">
			<view class="store">
				<view class="store-title">
					<view class="store-t"></view>
					{{i18n.index.StoreInOrder}}
				</view>
				<view class="order-item color5" @tap="OrderNum" v-if="siOrder.SINewOrder==0">
					<view class="item-name">{{i18n.index.NewOrder}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SIOrder('new')" v-else> 
					<view class="item-name">{{i18n.index.NewOrder}}</view>
					<view class="item-num color1">{{siOrder.SINewOrder}}</view>
				</view>
				
				<view class="order-item color5" @tap="OrderNum" v-if="siOrder.SIOrderInProcessing==0">
					<view class="item-name">{{i18n.index.OrderinProcessing}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SIOrder('processing')" v-else>
					<view class="item-name">{{i18n.index.OrderinProcessing}}</view>
					<view class="item-num color2">{{siOrder.SIOrderInProcessing}}</view>
				</view>
				<view class="order-item color5" @tap="OrderNum" v-if="siOrder.SIAll==0">
					<view class="item-name">{{i18n.index.All}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SIOrder('all')" v-else>
					<view class="item-name">{{i18n.index.All}}</view>
					<view class="item-num color3">{{siOrder.SIAll}}</view>
				</view>
			</view>
			<view class="stores">
				<view class="store-title">
					<view class="store-t"></view>
					{{i18n.index.StoreOutOrder}}
				</view>
				<view class="order-item color5" @tap="OrderNum" v-if="soOrder.SONewOrder==0">
					<view class="item-name">{{i18n.index.NewOrder}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SOOrder('new')" v-else>
					<view class="item-name">{{i18n.index.NewOrder}}</view>
					<view class="item-num color1">{{soOrder.SONewOrder}}</view>
				</view>
				<view class="order-item color5" @tap="OrderNum" v-if="soOrder.SOOrderInProcessing==0">
					<view class="item-name">{{i18n.index.OrderinProcessing}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SOOrder('processing')" v-else>
					<view class="item-name">{{i18n.index.OrderinProcessing}}</view>
					<view class="item-num color2">{{soOrder.SOOrderInProcessing}}</view>
				</view>
				<view class="order-item color5" @tap="OrderNum" v-if="soOrder.SOAll==0">
					<view class="item-name">{{i18n.index.All}}</view>
					<view class="item-num color4">0</view>
				</view>
				<view class="order-item" @tap="SOOrder('all')" v-else>
					<view class="item-name">{{i18n.index.All}}</view>
					<view class="item-num color3">{{soOrder.SOAll}}</view>
				</view>
			</view>
		</view>
		
		<!-- 空白提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image v-if="errorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
				<image v-else-if="systemerrorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
			</view>
			<view class="text-con">
				<view v-if="errorShow">
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
	import uniLoading from '../../components/uni-loading.vue';
	export default {
		components: {
			uniLoading
		},
		data() {
			return {
				soOrder:{},
				siOrder:{},
				loadingShow:false,
				messageShow:false,
				errorShow:false,
				systemerrorShow:false,
				listShow:false
			};
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    }
		},
		methods:{
			OrderNum(){
				uni.showToast({
					icon:'none',
					title:this.i18n.index.orderyet
				})
			},
			SIOrder(n){
				uni.navigateTo({
					url:'../order/si-all-order?name='+n
				})
			},
			SOOrder(n){
				uni.navigateTo({
					url:'../order/so-all-order?name='+n
				})
			}
		},
		onShow() {
			this.loadingShow=true
			uni.getStorage({
				key: 'uerInfo',
				success: (res) =>{	
					let customer=res.data.customer;
					uni.request({
						url:this.baseUrl+'/queryGroupList',
						method:"POST",
						header:{
							"content-type":"application/json"
						},
						data:{
							"custCode":customer,
							"warehouseCode":this.warehouseCode
						},
						success:(res)=> {
							if(res.data.status==200){
								this.listShow=true
								this.siOrder=res.data.data[0];
								this.soOrder=res.data.data[1];
								this.loadingShow=false
							}else if(res.data.status==500){
								this.messageShow=true
								this.systemerrorShow=true
								this.loadingShow=false
							}else{
								this.siOrder.SONewOrder==0
								this.soOrder.SONewOrder==0
								this.siOrder.SOOrderInProcessing==0
								this.soOrder.SOOrderInProcessing==0
								this.siOrder.SOAll==0;
								this.soOrder.SOAll==0;
								this.loadingShow=false
							}
						},
						fail() {
							this.messageShow=true
							this.errorShow=true
							this.loadingShow=false
						}
					})
				}
			});
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
	#order{
		font-family:Arial;
	}
	.over{
		overflow: hidden;
	}
	.order-top{
		background: #EA8C1B;
		height: 212upx;
		position: fixed;
		width: 100%;
		top: var(--status-bar-height);
		z-index: 10;
	}
	.order-container{
		padding-top: 212upx;
	}
	.order-title{
		font-size: 66upx;
		color: #FFFFFF;
		font-weight: bold;
		padding-left: 40upx;
		padding-top: 120upx;
	
	}
	.store{
		color: #EA8C1B;
		font-size: 36upx;
		font-weight:bold;
		padding: 58upx 40upx 0 40upx;
	}
	.stores{
		color: #EA8C1B;
		font-size: 36upx;
		font-weight:bold;
		padding: 58upx 40upx 40upx 40upx;
	}
	.store-title{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 30upx;
	}
	.store-t{
		width:12upx;
		height:40upx;
		background:rgba(234,140,27,1);
		margin-right: 28upx;
	}
	.order-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40upx;
		border: 2upx solid #E5E5E5;
		border-radius: 16upx;
		margin-bottom: 20upx;
		
	}
	.item-name{
		font-size: 36upx;
		font-weight: 400;
		color: rgba(0,0,0,1);
	}
	.item-num{
		color: #FFFFFF;
		padding: 10upx 20upx;
		border-radius: 35upx;	
		font-weight: 400;
		font-size: 28upx;
	}
	.color1{
		background: #7DDFFF;
	}
	.color2{
		background: #41AAA8;
	}
	.color3{
		background: #64638F;
	}
	.color4{
		background: #B6B6B6;
	}
	.color5{
		background: #F7F7F7;
	}
</style>

