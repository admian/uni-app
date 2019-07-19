<template>
	<view>
		<!-- <uni-head :title="i18n.index.CreateNewSKU"  :showDone="true" @click-back="back" @click-done="done"></uni-head> -->
		<view class="info-info">
			<view class="quantity">
				<text>{{i18n.index.SKUNumber}}</text>
				<input type="text" :placeholder="i18n.index.Input" v-model="partNo"  @blur="anviSku($event.target.value)"/><!--  -->
			</view>
			<view class="quantity">
				<text>{{i18n.index.ItemDescription}}</text>
				<input type="text" :placeholder="i18n.index.Input" v-model="itemDes"/>
			</view>
			<view class="quantity">
				<text>{{i18n.index.Quantity}}</text>
				<input type="text" :placeholder="i18n.index.Input" v-model="quantity"/>
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
				partNo:'',
				itemDes:'',
				quantity:'',
				id:''
			};
		},
		computed:{
			i18n() {  
				return this.$i18nMsg()  
			},
			...mapState(['storeInPickCList','pickSkuList','storeInPickSList'])
		},
		methods:{
			...mapMutations(['StoreInpickC','PickSku','StoreInpickS']),
			back(){
				uni.navigateBack({
					delta: 1
				})
			},
			anviSku(e){
				//console.log(e);
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/storeInorder/App/querySKUList',
							method:'POST',
							header:{"content-type":"application/json"},
							data:{
								"customer":customer,
								"warehouseCode":"ULHKG"
							},
							success: (res) => { 
								if(res.data.status==200){ 
									res.data.data.partList.forEach((i)=>{
										if(i.partNo==e){
											uni.showToast({
												icon:'none',
												title:this.i18n.index.repeatSKUError,
												duration:2000
											})
											this.partNo=''
											return
										}
									})
								}
							}
						})
					}
				})
			},
			done(){
				if(this.partNo==''||this.quantity==''){
					uni.showModal({
						title: this.i18n.index.IncompleteError_one,
						content: this.i18n.index.IncompleteError_two,
						cancelText:this.i18n.index.Discard,
						cancelColor:'#007AFF',
						confirmText:this.i18n.index.Edit,
						confirmColor:'#007AFF',
						success:(res)=> {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
								uni.navigateBack();
							}
						}
					});
					return
				}else if(this.regNumber.test(this.quantity)==false){
					uni.showToast({
						title: this.i18n.index.saveNumberError,
						duration: 2000,
						icon:'none'
					});	
					return
				}else{
					let obj={};
					obj={
						"partNo":this.partNo,
						"partDesc":this.itemDes,
						"qtyBook":this.quantity,
						"qtyUnit":"PCS",
						"qtyPerPkg":this.quantity,
						"pkgBook":"1",
						"pkgUnit":"PCS"
					}
					if(this.id==1){
						this.storeInPickCList.push(obj);
						this.StoreInpickC(this.storeInPickCList);
						this.pickSkuList.push(obj);	
						this.PickSku(this.pickSkuList);
					}else{
						this.storeInPickSList.push(obj);
						//console.log(this.storeInPickSList)
						this.StoreInpickS(this.storeInPickSList);
						this.pickSkuList.push(obj);	
						this.PickSku(this.pickSkuList);
						//console.log(this.pickSkuList);
					}
					var pages = getCurrentPages();
					var currPage = pages[pages.length - 1]; //当前页面
					var prevPage = pages[pages.length - 2]; //上一个页面
					//console.log(prevPage);
					prevPage.id=this.id;//修改id的值
					uni.navigateBack();
				}
			}
		},
		/* onBackPress(event){
			//console.log(event);
			// #ifdef APP-PLUS  
			plus.key.hideSoftKeybord();
			// #endif 
			//console.log(len);
			if(this.partNo==''||this.quantity==''){
				uni.showModal({
					title: 'Incomplete Information',
					content: 'There is incomplete information. Click Edit to complete all SKU and Quantity.',
					cancelText:'Discard',
					cancelColor:'#007AFF',
					confirmText:'Edit',
					confirmColor:'#007AFF',
					success:(res)=> {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
							uni.navigateTo({
								url:'pick-sku',
								animationType:'slide-in-left'
							})
						}
					}
				});
				return true;
			}else if(this.regNumber.test(this.quantity)==false){
				uni.showToast({
					title: this.i18n.index.saveNumberError,
					duration: 2000,
					icon:'none'
				});	
				return true
			}else{
				let obj={};
				obj={
					"partNo":this.partNo,
					"partDesc":this.itemDes,
					"qtyBook":this.quantity,
					"qtyUnit":"PCS",
					"qtyPerPkg":this.quantity,
					"pkgBook":"1",
					"pkgUnit":"PCS"
				}
				if(this.id==1){
					this.storeInPickCList.push(obj);
					this.StoreInpickC(this.storeInPickCList);
					this.pickSkuList.push(obj);	
					this.PickSku(this.pickSkuList);
				}else{
					this.storeInPickSList.push(obj);
					//console.log(this.storeInPickSList)
					this.StoreInpickS(this.storeInPickSList);
					this.pickSkuList.push(obj);	
					this.PickSku(this.pickSkuList);
					//console.log(this.pickSkuList);
				}
			}
		}, */
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: this.i18n.index.CreateNewSKU
			})
			this.id=option.id;
		},
		onShow(){
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			//console.log(prevPage);
			currPage.id=this.id;//修改id的值
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
	.uni-input{
		padding: 0;
		background: url(../../static/icon/A0302_right_b6b6b6_16px_3x.png) no-repeat right;
		background-size: 40upx 40upx;
	}
	.info-info{
		padding: 0 0 40upx 40upx;	
		opacity:1;
	}
	.quantity text{
		color: #EA8C1B;
		font-size: 28upx;
		font-family: Arial;
		font-weight: bold;
	}
	.quantity input{
		margin-top: 10upx;
		color: #333333;
	}
	.quantity{
		padding-top: 40upx;
		padding-bottom: 20upx;
		border-bottom: 1upx solid #E5E5E5;
		padding-right: 40upx;
		font-size: 28upx;
	}
	.right-icon{
		width: 32upx;
		height: 32upx;
		margin-right: 40upx;
	}
  
	
</style>
