<template>
	<view>
		<!-- <uni-head :title="i18n.index.Statistics" :backTitle="i18n.index.Home" @click-back="back"></uni-head> -->
		<view class="soon-container">
			<view class="soon-img">
				<image src="../../static/order/pic_maintain_140px_3x.png" class="soon-icon"></image>
			</view>	
		</view>
		<view class="soon-text">{{i18n.index.ComingSoon}}</view>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	export default {
		components:{
			uniHead
		},
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
			back(){
				uni.switchTab({
					url:'../taber/home'
				})
			}
		},
		onLoad() { 
			
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			
			// #ifdef APP-PLUS  
			let currentWebview = page.$getAppWebview();
			let titleObj = currentWebview.getStyle().titleNView;
			if (!titleObj.buttons) {
				return;
			}
			titleObj.buttons[1].text = this.i18n.index.Home;
			currentWebview.setStyle({
				titleNView: titleObj
			});
			// #endif
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.i18n.index.Statistics
			})
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			this.back();
			
		},
		
	}
	 
</script>

<style>
	.soon-container{
		margin-top: 200upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.soon-img{
		text-align: center;
	}
	.soon-icon{
		width: 280upx;
		height: 280upx;
	}
	.soon-text{
		margin-top: 20upx;
		font-size: 26upx;
		text-align: center;
	}
</style>
