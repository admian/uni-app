<template>
	<view class="container">
		<view class="clearfix">
			<view class="fl info-logo">
				<image class="logo"  src="../../static/login/eplusSolutions_3x140px.png"></image>
			</view>
			<view class="fl info-sgin">
				<text class="sgin">{{i18n.index.sign_in}}</text>
			</view>
		</view><!-- logo标识结束 -->
		<view class="input-info">
			<view class="item-login po-eye">
				<input class="username" :placeholder="i18n.index.username" v-model="username"/>
				<image class="icon-user" src="../../static/login/A0401_username_3x16px_b6b6b6.png"></image>
				<image class="icon_reset" v-show="reset" src="../../static/login/A0323_reset_b6b6b6_16px_3x@3x.png" @tap="ClickReset"></image>
			</view>
			<view class="item-login po-eye">
				<input class="password" :placeholder="i18n.index.password" :password="showPassword" v-model="password"/>
				<image class="icon-pass" src="../../static/login/A0402_password_3x16px_b6b6b6.png"></image>
				<image class="icon-eye" :src="Islook?'../../static/login/A0207_display_3x16px_b6b6b6.png':'../../static/login/A0206_hide_3x16px_b6b6b6.png'" @tap="changePassword"></image>				
			</view>
			<view class="item-login">
				<button class="btn-sign" :class="validation ? 't-choose':'f-choose'" :disabled="!validation" @tap="bindLogin" >{{i18n.index.sign_in}}</button>					
			</view>	
		</view><!-- 表单结束 -->
		<!-- <view class="info-forgot">
			<text class="forgot">Forgot password?</text>
		</view> -->
		<view class="loading" v-show="loadingShow">
			<image src="../../static/gif_L-loading_64px_3x.gif" class="load-img"></image>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex";
	export default {
		data() {
			return {
				showPassword: true,
				Islook:false,
				IsSign:false,
				username:'',
				password:'',
				loadingShow:false,
			};
		},	
		computed:{
			reset(){
				return this.username!=''
			},
			validation() {
				return this.username && this.password;
			},
			i18n() {  
				return this.$i18nMsg()  
			},
			...mapState(['name']),
		},	
		methods:{
			...mapMutations(['login']),
			changePassword() {
				this.Islook=!this.Islook;
				this.showPassword = !this.showPassword;
			},
			ClickReset(){
				this.username='';
			},
			bindLogin() {
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				this.loadingShow=true
				if(this.username=='' || this.password==''){					
					uni.showModal({
						title:  i18n.index.signError_one,
						content: i18n.index.signError_two,
						showCancel: false,
						confirmText:  i18n.index.OK
					})
					return 
				}else{
					let Base64 = require("js-base64").Base64//还是require					
					let pw = Base64.encode(this.password)//还是那些操作
					//console.log(pw);
					uni.request({					
						url:this.baseUrl+"/authentication",
						data:{
							"username":this.username,
							"password":pw
						},
						method:"GET",
						success: (res) => {
							this.loadingShow=false
							if(res.data.code==200){	
								console.log(res.data);
								let userLoginInfo={
									'username':res.data.message.username,
									'password':pw,
									'customer':res.data.message.customer,
									'isLogin':true
								};
								this.login(userLoginInfo);
								uni.switchTab({
									url: '../taber/home'							
								});
							}else if(res.data.code==201 || res.data.code==100){
								uni.showModal({
									title: this.i18n.index.signError_one,
									content: this.i18n.index.signError_two,
									showCancel: false,
									confirmText: this.i18n.index.OK
								})
							}else{
								uni.showModal({
									title: this.i18n.index.systemError_one,
									content: this.i18n.index.systemError_two,
									showCancel: false,
									confirmText: this.i18n.index.OK
								})
							}
						},
						fail: (res) => {
							this.loadingShow=false
							uni.showModal({
								title: this.i18n.index.connrctError_one,
								content: this.i18n.index.connrctError_two,
								showCancel: false,
								confirmText: this.i18n.index.OK
							})
						}
					})
				}
				
			},
			
		},
		onLoad(){
			console.log(this.name);
			this.username=this.name;
			//console.log(this.username);
		},
		
		
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
		z-index: 9999;
	}
	.load-img{
		width: 182upx;
		height: 182upx;
	}
	/* ---------------------------------------------------- */
	page{background-color: rgb(37,44,65);} 
	.container{padding:240upx 60upx;	}
	.info-logo{	margin-right: 20upx;}
	.logo{width: 280upx;height: 96upx;}
	.info-sgin{
		height: 100%;
		border-left: 1upx solid #999999;
		color: #999999;
		padding: 55upx 0 0 30upx;
		font-size: 32upx;
	}
	/* --------------------------------------------- */
	.input-info{margin-top: 120upx;width: 100%;}
	.item-login{margin-bottom: 60upx; height: 92upx; border-radius: 46upx; background:#FFFFFF;position: relative; }
	input {
		margin:20upx 30upx;
		font-size:28upx;
		background:#FFFFFF;
		position: relative;
		top: 25upx;
		padding-left: 54upx;
		caret-color:#EA8C1B;
	}
	.icon-user,.icon-pass{
		width: 32upx;
		height: 32upx;
		position: absolute;
		top: 30upx;
		left: 32upx;
		z-index: 99;
	}
	.icon_reset{
		width: 34upx;
		height: 34upx;
		position: absolute;
		top: 30upx;
		right: 32upx;
		z-index: 99;
	}
	.icon-eye{
		width: 32upx;
		height: 32upx;
		position: absolute;
		top: 30upx;
		right: 32upx;
		z-index: 99;
	}
	.btn-sign{
		height: 92upx;
		color: #FFFFFF !important;
		border-radius: 46upx;	
		font-size: 32upx;
		line-height: 92upx;
	}
	.btn-sign:active{
		color: hsla(0,0%,100%,.6);
		background: rgba(234, 140, 27, .7);
	}
	.t-choose{
		background: rgba(234, 140, 27, 1);
	}
	.f-choose{
		background: rgba(245, 198, 141, 1) !important;
		}
	.info-forgot{	
		color: #FFFFFF;
		text-align: center;
		font-size: 32upx;
	}
</style>
