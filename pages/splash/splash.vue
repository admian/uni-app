<template>
	<view>
		<view class="content">
			<image src="../../static/gif_L-loading_64px_3x.gif" class="logo"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow(){
			uni.getStorage({
				key:'uerInfo',
				success:(res)=> {
					//console.log(res);
					//console.log(res.data.username);
					//console.log(res.data.password);
					uni.request({					
						url:this.baseUrl+"/authentication",
						data:{
							"username":res.data.username,
							"password":res.data.password
						},
						method:"GET",
						success: (res) => {
							uni.reLaunch({
								url: '../taber/home'							
							});
						},
						fail() {
							uni.reLaunch({
								url:'../login/login'
							})
						}
					})
				},
				fail() {
					uni.reLaunch({
						url:"../login/login"
					})
				}
			})
		}
	}
</script>

<style>
page{
	background-color: rgb(37,44,65);
	/* background-image: url("../../static/splash/splash_ios_1242x2208.png");
	background-size: 100% 100%; */
}

.content {
	position: absolute;
	top:50%;
	left:50%;
	width:100%;
	transform:translate(-50%,-50%);
	text-align: center;
}
.logo{
	/* height: 140upx;
	width: 400upx;
	border: 1px solid red; */
	width: 182upx;
	height: 182upx;
}
</style>
