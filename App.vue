<script>

	 export default {
		 onLaunch:function(){
			let _this=this;
			uni.getSystemInfo({
				success: function (res) {	
					if(res.language=='zh'||res.language=='zh_CN'||res.language=='zh_HK'||res.language=='zh_TW'||res.language=='zh_MO' ||res.language=='zh-Hans-CN' ||res.language=='zh-Hant-HK'||res.language=='zh-Hans-MO' ||res.language=='zh-Hant-TW'){
						_this.$i18n.locale = 'zh_HK'
					}else{
						_this.$i18n.locale = 'en_US'  
					}
				}
			});
		} 
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	uni-tabbar .uni-tabbar__label{
		font-size:16upx;
		font-family:Arial;
		font-weight:bold;
	}
</style>
