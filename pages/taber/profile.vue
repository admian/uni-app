<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="index-container">
			<view class="userInfo">
				<view class="userName">{{userName}}</view>
				<view>
					<image src="../../static/app-icon/AppIcons_Android_144px_xxhdpi.png" class="userlogo"></image>
				</view>
			</view>
			<!-- <view class="numInfo">
				<view class="num-item">
					<view class="item-sum">-</view>
					<view class="item-name">{{i18n.index.SKU}}</view>
				</view>
				<view class="num-item">
					<view class="item-sum">-</view>
					<view class="item-name">{{i18n.index.ORDERS}}</view>
				</view>
				<view>
					<view class="item-sum"><text>-</text></view>
					<view class="item-name">{{i18n.index.BALANCE}}</view>
				</view>
			</view> -->
		</view>
		<!-- <view>
			<view class="item-connect" v-for="(i,index) in list" :key="index" @tap="indexClick(index)">
				<view class="frofileName">{{i18n.index[i.name]}}</view>
				<view class="frofileImg"></view>
				<image></image> 
			</view>
		</view> -->
		<view class="logout-view">
			<!-- <view class="kong" v-for="(i,index) in 7" :key="index"></view> -->
			 <button @tap="comfirm" class="log">{{i18n.index.log}}</button>
		</view>
		<view class="outview" v-show="logout">
			<view class="outBottom">
				<button @tap="logOut" class="out color-l">{{i18n.index.Logout}}</button>
				<button @tap="comfirm" class="out color-c">{{i18n.index.Cancel}}</button>
			</view>
		</view>
		<!-- -->
	</view>
</template>

<script>
	import {mapState, mapMutations } from "vuex";
	export default {
		data() {
			return {
				userName:'',
				list:[
					/* {name:'Settings'} */
					// {name:'Service'},{name:'Payment'},{name:'Profile'},{name:'Settings'},{name:'About us'}
				],
				logout:false
			};
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    }
		},
		methods:{
			...mapMutations(['StoreOutToHKInfo','StoreOutPick','StoreInCourierObj','StoreInpickC','StoreInpickS','PickSku','StoreInSelfObj']),
			/* indexClick(i){
				if(i==0){
					uni.navigateTo({
						url:"../settings/settings"
					})
				}
			} */
			comfirm(){
				this.logout=!this.logout;	
			},
			logOut(){
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						this.$store.state.name=res.data.username;
					}
				})
				uni.removeStorage({
					key:'uerInfo',
					success:(res)=> {
						//console.log('success');
						this.StoreInCourierObj({CourierBillNumber:'',courier:'',instruction:''});
						this.StoreInpickC([]);
						this.StoreInpickS([]);
						this.PickSku([]);
						this.StoreInSelfObj({CourierBillNumber:'',courier:'Self-delivery',instruction:''});
						this.StoreOutToHKInfo({OrderNumber:'',Courier:'',CourierService:'',BuyerName:'',BuyerPhone:'',BuyerAddress:'',CourierFee:'Prepaid',OrderValue:''});
						this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
						uni.reLaunch({
							url:'../login/login'
						})
					}
				})
			}
		},
		onLoad() {
			uni.getStorage({
				key:'uerInfo',
				success: (res) => {
					console.log(res);
					this.userName=res.data.username
				}
			})
		}
	}
</script>

<style>
	.status_bar { height: var(--status-bar-height); width: 100%; background-color: #EA8C1B; } 
	.top_view { height: var(--status-bar-height); width: 100%; position: fixed; background-color: #EA8C1B; top: 0; z-index: 999; }
	.index-container{
		background: #EA8C1B;
		height: 358upx;
	}
	.userInfo{
		padding: 64upx 40upx 0 40upx ;
		display: flex;
		justify-content:  space-between;
		align-items: center;
	}
	.userName{
		font-size:66upx;
		font-family:Arial;
		font-weight:bold;
		color: #FFFFFF;
	}
	.userlogo{
		width: 128upx;
		height: 128upx;
		border-radius: 50%;
		border: 1upx solid #FFFFFF;
	}
	.numInfo{
		padding:45upx 0 0 40upx;
		display: flex;
		justify-content: flex-start;
	}
	.num-item{
		padding-right: 60upx;
	}
	.item-sum{
		font-size: 32upx;
		color: #FFFFFF;
		font-weight:bold;
		
	}
	.item-name{
		color: #F5C68D;
		font-size: 24upx;
		font-weight:bold;
	}
	.item-connect{
		margin: 0 40upx;
		display: flex;
		justify-content: space-between;
		border-bottom:2upx solid rgba(229,229,229,1);
	}
	.frofileName{
		font-size:36upx;
		font-weight:400;
		color: #333333;
		padding: 68upx 0;
	}
	.frofileImg{
		width:96upx;
		height:96upx;
		background:rgba(182,182,182,1);
		opacity:1;
		border-radius:16upx;
		margin: 40upx 0;
	}
	/* ------------------------ */
	@import url("../../common/index.css");
	 .kong{
		height: 146upx;
		margin-left: 40upx;
		border-bottom:2upx solid rgba(229,229,229,1);
	 }
	 .logout-view{
		 position: fixed;
		 bottom: 80upx;
		 width: 100%;
	 }
	 .log{
		margin-left: 60upx;
		margin-right: 60upx;
		margin-top: 40upx;
		color: #333333;
		background: #FFFFFF;
		border: 2upx solid #CCCCCC;
		border-radius:50upx;
		width: 630upx;
		height: 92upx;
	 }
	 .outview{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background:rgba(4,4,15,.4);
	 }
	 .outBottom{
		width: 100%;
		position: fixed;
		bottom:  40upx; 
	 }
	 .out{
		text-align: center;
		font-size: 40upx;
		margin:18upx 16upx;
	 }
	 .color-c{
		color: #007AFF;
	 }
	 .color-l{
		color: #FF3B30;
	 }
</style>
