<template>
	<view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logout:false
			}
		},
		computed:{
			i18n() {  
				return this.$i18nMsg()  
			}
		},
		methods: {
			//...mapMutations(['userName']),
			backNav(){
				uni.switchTab({
					url:'../taber/profile'
				})
			},
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
					success: function (res) {
						console.log('success');
						uni.reLaunch({
							url:'../login/login'
						})
					}
				})
			}
			
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.index.Settings
			})
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
 .kong{
	height: 146upx;
	margin-left: 40upx;
	border-bottom:2upx solid rgba(229,229,229,1);
 }
 .logout-view{
	 position: fixed;
	 bottom: 210upx;
	 width: 100%;
 }
 .log{
	margin-left: 60upx;
	margin-right: 60upx;
	margin-top: 40upx;
	color: #999999;
	background: #E5E5E5;
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
	bottom: 40upx; 
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
