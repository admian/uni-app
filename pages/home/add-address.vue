<template>
	<view>
		<!-- <uni-head  :title="i18n.index.AddNewAddress"  @click-back="back" :showDone="true" @click-done="done"></uni-head> -->
		<view>
			<view class="item-address">
				{{i18n.index.Name}}
				<view class="select-item">
					<input type="text" :placeholder="i18n.index.Input" class="input-address" v-model="BuyerName"/>
				</view>	
			</view>
			<view class="item-address">
				{{i18n.index.PhoneNumber}}
				<view class="select-item">
					<input type="text" :placeholder="i18n.index.Input" class="input-address" v-model="BuyerPhone"/>
				</view>
			</view>
			<view class="item-address" >
				{{i18n.index['Country/Region']}}
				<view class="select-item" @tap="HongKong">
					{{i18n.index.HongKong}}
				</view>
			</view>
			<view class="item-address">
				{{i18n.index.Address}}
				<view class="select-item">
					<textarea :placeholder="i18n.index.Input" class="input-address" v-model="BuyerAddress"></textarea>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		data() {
			return {
				BuyerName:'',
				BuyerPhone:'',
				BuyerAddress:'',
				//id:0,
				//type:''
			};
		},
		computed:{
			i18n() {  
				return this.$i18nMsg()  
			},
			...mapState([
			  'storeOutorderInfo'
			]),
		},
		methods:{
			...mapMutations(['StoreOutToHKInfo']),
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			HongKong(){
				uni.showToast({
					icon:'none',
					title:this.i18n.index.HKaddress,
					duration:2000
				})
			},
			done(){
				//if(this.id==1){
					if(this.BuyerName==''||this.BuyerPhone==''||this.BuyerAddress==''){
						uni.showToast({
							icon:'none',
							title:this.i18n.index.addressError,
							duration:2000
						})
						return
					}
				//}
				/* if(this.id==2){
					if(this.BuyerName==''||this.BuyerPhone==''){
						uni.showToast({
							icon:'none',
							title:this.i18n.index.addressError,
							duration:2000
						})
						return
					}
				} */
				/* if(this.type=='Create'){
					this.StoreOutToHKInfo({
						OrderNumber:this.storeOutorderInfo.OrderNumber,
						Courier:this.storeOutorderInfo.Courier,
						CourierService:this.storeOutorderInfo.CourierService,
						BuyerName:this.BuyerName,
						BuyerPhone:this.BuyerPhone,
						BuyerAddress:this.storeOutorderInfo.BuyerAddress,
						CourierFee:this.storeOutorderInfo.CourierFee,
						OrderValue:this.storeOutorderInfo.OrderValue
					})
				}else{ */
					uni.getStorage({
						key:'uerInfo',
						success: (res) => {
							let customer=res.data.customer;
							let username=res.data.username;
							uni.request({
								url:this.baseUrl+'/address/insertAddress',
								method:'POST',
								header:{"content-type":"application/json"},
								data:{
									"customerCode":customer,
									"customer_name":username,
									"consignee_name":this.BuyerName,
									"consignee_phone":this.BuyerPhone,
									"consignee_country":"HK",
									"consignee_state":"",
									"consignee_city":"Hong Kong",
									"consignee_addr1":this.BuyerAddress,
									"consignee_addr2":"",
									"consignee_postal_code":""
								},
								success: (res) => { 
									console.log(res);
									if(res.data.status==200){
					
									}else{
										uni.showModal({
											title: this.i18n.index.systemError_one,
											content: this.i18n.index.systemError_two,
											showCancel: false,
											confirmText: this.i18n.index.OK
										})
										return
									}
									
								},
								fail() {
									uni.showModal({
										title: this.i18n.index.connrctError_one,
										content: this.i18n.index.connrctError_two,
										showCancel: false,
										confirmText: this.i18n.index.OK
									})
									return
								}
							})
						}
					})
				/* } */
				
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				//console.log(prevPage);
				prevPage.id=this.id;//修改id的值
				uni.navigateBack();
			}
		},
		onLoad(option) {
			//console.log(option.id)
			uni.setNavigationBarTitle({
				title: this.i18n.index.Consignee
			})
			/* if(option.id){
				this.id=option.id
			}
			if(option.type){
				this.type=option.type;
				if(this.storeOutorderInfo.BuyerName!==''){
					this.BuyerName=this.storeOutorderInfo.BuyerName
				}
				if(this.storeOutorderInfo.BuyerPhone!==''){
					this.BuyerPhone=this.storeOutorderInfo.BuyerPhone
				}
				console.log(this.type)
			} */
		},
		onShow() {
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			//console.log(prevPage);
			//console.log(prevPage.TabCur);
			//prevPage.id=this.id;//修改TabCur的值
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==0){
				this.back();
			}else if(e.index==1){
				this.done();
			}
		}
	}
</script>

<style>
	.items{
		border-bottom: 2upx solid #E5E5E5;
	}
	.PhotoOrCope{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20upx;
		height: 240upx;
		box-shadow: 0upx 0upx 10upx rgba(0,0,0,.16);
		border-radius: 16upx;
		font-size: 28upx;
		color: #999999;
		padding: 0 56upx;
		
	}
	.line{
		width: 0;
		height: 90upx;
		margin-left: 14upx;
		border:1upx solid rgba(229,229,229,1);
	}
	.photo-item{
		/* padding: 68upx 56upx; */
	}
	.selected-photo{
		
		width: 96upx;
		height: 106upx;
	}
	.phone-icon{
		width: 32upx;
		height: 32upx;
	}
	.right-icon{
		width: 30upx;
		height: 32upx;
	}
	.item-address{
		font-size:28upx;
		font-weight:bold;
		color:rgba(234,140,27,1);
		border-bottom: 2upx solid #E5E5E5;
		padding: 30upx 40upx;
	}
	.select-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 400;
		color: #333333;
		margin-top: 20upx;
	}
	uni-input .input-placeholder{
		color: #999999 !important;
	}
	.input-address{
		width: 100%;
		color: #333333;
		font-size: 28upx;
	}
	uni-button:after{
		border: none;
	}
	.btn-create{
		margin-top: 40upx;
		width: 630upx;
		height: 92upx;
		color: #FFFFFF;
		line-height: 92upx;
		border-radius: 50upx;	
		border: none;
		color: #FFFFFF !important;
		font-size: 36upx;
		margin-bottom: 20upx;
	}
	.no{
		background: #F5C68D !important;/* #EA8C1B *//* F5C68D */
	}
	.yes{
		background: #EA8C1B !important;/* #EA8C1B *//* F5C68D */
	}
	uni-textarea{
		width: 100%;
		max-height: 100upx;
		padding: 0;
		margin: 0;
	}
</style>
