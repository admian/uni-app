<template>
	<view>
		<!-- <uni-head :title="i18n.index.CourierCompanywithService" @click-back="back"></uni-head> -->
		<view class="container">
			<view class="nav-left">
				<view class="nav-info" @tap="nav=1">
					<image src="../../static/courier/logo_SF_Express_82px_3x.png" class="nav-img"></image>
					<image src="../../static/courier/pic_triangle_14px_3x.png" class="active-icon" v-show="nav==1"></image>
				</view>
				<view class="nav-info" @tap="nav=2">
					<image src="../../static/courier/logo_HongKong_Post_82px_3x.png" class="nav-img"></image>
					<image src="../../static/courier/pic_triangle_14px_3x.png" class="active-icon" v-show="nav==2"></image>
				</view>
				<view class="nav-info" @tap="nav=3">
					<image src="../../static/courier/logo_Yamato_82px_3x.png" class="nav-img"></image>
					<image src="../../static/courier/pic_triangle_14px_3x.png" class="active-icon" v-show="nav==3"></image>
				</view>
				<view class="nav-info" @tap="nav=4">
					<image src="../../static/courier/pic_Other_HK_Delivery_82px_3x.png" class="nav-img"></image>
					<image src="../../static/courier/pic_triangle_14px_3x.png" class="active-icon" v-show="nav==4"></image>
				</view>
			</view>
			<view class="connect-right">	
				<view class="item-courier one"  v-show="nav==1" @tap="selectCourier('SF Express',0)">{{soSFExpress.name}}</view>
				<view v-show="nav==2">
					<view class="item-courier " v-for="(i,index) in hongkongpost" :key="index" @tap="selectCourier('Hong Kong Post',index)">
						<view class="two">
							Hong Kong Post 
							<view>{{i.name}}</view>
						</view>
					</view>
				</view>
				<view v-show="nav==3">
					<view class="item-courier" v-for="(i,index) in Yamato" :key="index" @tap="selectCourier('Yamato',index)">
						<view class="two">
							Yamato<view>{{i.name}} </view>
						</view>
						
					</view>
				</view>
				<view class="item-courier one"  v-show="nav==4" @tap="selectCourier('Other HK Delivery',0)">{{other.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import {mapState, mapMutations } from "vuex";
	export default {
		components:{
			uniHead
		},
		data() {
			return {
				id:1,
				nav:1,
				soSFExpress:{name:'SF Express'},
				hongkongpost:[
					{name:'Smart Post'},
					{name:'Parcel'},
					{name:'Local CourierPost'},
					{name:'Registered Letter / Packet'},
					{name:'Ordinary Letter / Packet'}
				],
				Yamato:[
					{name:'HK TA-Q-BIN'},
					{name:'International TA-Q-BIN'}
				],
				other:{name:'Other HK Delivery'}
			};
		},
		computed:{
			...mapState(['storeOutorderInfo']),
			i18n() {  
			    return this.$i18nMsg()  
			}
		},
		methods:{
			...mapMutations(['StoreOutToHKInfo']),
			back(){
				uni.navigateBack({
					delta: 1
				}) 
			},
			selectCourier(name,index){
				let Courier='',CourierService='';
				if(name=='SF Express'){
					Courier='SF Express';
					//CourierService='SF Express';
				}else if(name=='Hong Kong Post'){
					Courier='Hong Kong Post';
					CourierService=this.hongkongpost[index].name;
				}else if(name=='Yamato'){
					Courier='Yamato';
					CourierService=this.Yamato[index].name;
				}else{
					Courier='Other HK Delivery';
					//CourierService='Other HK Delivery';
				}
				this.StoreOutToHKInfo({
					OrderNumber:this.storeOutorderInfo.OrderNumber,
					Courier:Courier,
					CourierService:CourierService,
					BuyerName:this.storeOutorderInfo.BuyerName,
					BuyerPhone:this.storeOutorderInfo.BuyerPhone,
					BuyerAddress:this.storeOutorderInfo.BuyerAddress,
					CourierFee:this.storeOutorderInfo.CourierFee,
					OrderValue:this.storeOutorderInfo.OrderValue
				})
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.id=this.id;//修改id的值
				uni.navigateBack();
				/* uni.navigateTo({
					url:'../create/store-out-order?id='+this.id
				})
				uni.navigateBack({
					delta: 1
				}) */
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.index.CourierCompanywithService
			})
		},
		onNavigationBarButtonTap:function(e){
			this.back();
		}
	}
</script>

<style>
	.container{	
		display: flex;
		font-size: 28upx;
		color: #333333;
	}
	.nav-left{
		width: 160upx;
		background: #E5E5E5;	
		position: absolute;
		top: 0upx;
		bottom: 0px;
		left: 0px;		
	}
	.nav-info{
		padding: 32upx;	
		height: 95upx;
		
		position: relative;
	}
	.active-icon{
		position: absolute;
		right: 0;
		top: 66upx;
		width: 32upx;
		height: 32upx;
	}
	.nav-img{
		width: 96upx;
		height: 96upx;
	}
	.nav-img-expo{
		width: 96upx;
		height: 66upx;
	}
	.nav-info-expo{
		padding: 48upx 32upx 46upx 32upx;
		height: 66upx;
	}
	.connect-right{
		width: 100%;
		margin-left:160upx ;
		
	}
	.item-courier{	
		padding-left: 40upx;
		height: 158upx;
		border-bottom: 2upx solid #E5E5E5;
	}
	.one{
		line-height: 160upx;
	}
	.two{
		height: 110upx;
		padding-top: 48upx;
	}
</style>
