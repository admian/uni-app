<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="container-create">
			<view class="create">
				<view class="item-create">	
					<view class="create-info" @tap="createNav('../create/store-in-order')">
						<view>
							<image src="../../static/order/A0211_Store_in_24px_3x.png" class="create-icon"></image>
						</view>
						
						{{i18n.index.StoreIn}} <br>{{i18n.index.Order}}
					</view>
				</view>
				<view class="item-create">
					<view class="create-info" @tap="createNav('../create/store-out-order')">
						<view>
							<image src="../../static/order/A0212_Store_out_24px_3x.png.png" class="create-icon"></image>
						</view>
						{{i18n.index.StoreOut}} <br>{{i18n.index.Order}}
						
					</view>
				</view>
			</view>
			<view class="close-create" @tap="close">
				<view class="close-border">
					<image src="../../static/icon/A0306_cross_b6b6b6_16px_3x.png" class="close-icon"></image>
				</view>	
			</view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			};   
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    }
		},
		methods:{
			close(){
				uni.switchTab({
					url:"../taber/home"
				})
			},
			createNav(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style>
button{
	width: 183upx;
	height: 183upx;
	border-radius: 50%;
	font-size: 20upx;
	padding-top: 50upx;
	line-height: 30upx;
	text-align: center;	
}
.container-create{	
	width: 100%;
	position: fixed;
	bottom: 60px;
}
.create{	
	display: flex;
	justify-content: center;
}
.item-create{
	width: 180upx;
	height: 180upx;
	margin: 40upx;
	display: flex;
	justify-content: center;
	align-items: center;
	background:#FFFFFF;
	border-radius:50%;
	font-size: 24upx;
	border: 2upx solid #E5E5E5;
}
.create-info{
	text-align: center;
	line-height: 30upx;
}
.close-create{color: #FFFFFF;text-align: center;font-size: 50upx;display: flex;justify-content: center;}
.close-border{
	width: 70upx;
	height: 70upx;
	border: 2upx solid #B6B6B6;
	border-radius: 50%;
}
.close-icon{
	margin: 20upx;
	width: 30upx;
	height: 30upx;
}
.create-icon{
	width: 60upx;
	height: 60upx;
}
</style>
