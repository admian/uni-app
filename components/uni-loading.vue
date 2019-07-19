<template>
	<view class="loading" v-show="showLoad">
		<image src="../../static/gif_L-loading_64px_3x.gif" class="load-img"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			showLoad:{
				type:Boolean,
				default:false
			}
		}
	}
</script>

<style>
.loading{
	width: 100%;	
	position: fixed;
	top:0;
	bottom:0;
	left:0; 
	background: rgba(0, 0, 0, .4);
	display: flex;
	justify-content: center;
	align-items: center;
}
.load-img{
	width: 182upx;
	height: 182upx;
	
	
}
</style>
