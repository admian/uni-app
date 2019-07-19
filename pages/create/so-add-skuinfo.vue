<template>
	<view class="container">
		<!-- <uni-head :title="i18n.index.SKUInformation"  :showDone="true" @click-back="back" @click-done="done"></uni-head> -->
		<view class="info-info" v-for="(item,index) in storeOutPickList" :key="index">
			<view class="sku">
				<text>{{i18n.index.SKU}}</text>
				<navigator :url="'so-selelct-sku?id='+id" v-show="item.init==true"><view class="sku-info" >
					<view class="select-text">{{i18n.index.SelectSKU}}</view>
					<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
				</view>
				</navigator>
				<view class="sku-info" v-show="item.init==false" @tap="againSelect(index)">
					<view>
						<view class="sku-number">{{item.partNo}}</view>
						<view class="sku-des">{{item.partDescription ? item.partDescription : ''}}</view>
					</view>
					<image src="../../static/icon/A0302_right_b6b6b6_16px_3x.png" class="right-icon"></image>
				</view>
			</view>
			<view class="quantity">
				<text>{{i18n.index.Quantity}}</text>
				<input type="number" :placeholder="i18n.index.Input"  v-model="item.partQty"/>
			</view>
			<view class="remark">
				<text>{{i18n.index.OrderRemark}}</text>
				<input type="text" :placeholder="i18n.index.Input"  v-model="item.reference1"/>
			</view>
		</view>
		<view class="info-info">
			<view class="info-add" @tap="addInfomation(storeOutPickList.length)">
				<image src="../../static/icon/A0305_add_b6b6b6_16px_3x.png" class="icon-add"></image>
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
				id:''
			};
		},
		computed:{
			...mapState([
				'storeOutPickList'
			]),
			i18n() {  
			    return this.$i18nMsg()  
			}
		},	
		methods:{
			...mapMutations(['StoreOutPick']),
			/* back(){
				console.log(this.storeOutPickList);
				let len=this.storeOutPickList.length;
				console.log(len);
				
				if(this.storeOutPickList[len-1].partNo==''||this.storeOutPickList[len-1].partQty==''){
					if(len>1){
						this.storeOutPickList.splice(len-1,1);
					}else if(len==1){
						this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
					}
				}
				
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.TabCur=this.id-1;//修改TabCur的值
				uni.navigateBack();
			}, */
			addInfomation(i){
				if(i==30){
					uni.showToast({
						title: this.i18n.index.maxMain,
						duration: 2000,
						icon:'none'
					}); 
					return
				}
				let j=i-1;
				if(this.storeOutPickList[j].partNo==''||this.storeOutPickList[j].partQty==''){
					uni.showToast({
						icon:'none',
						title:this.i18n.index.SKUError,
						duration:2000
					})
					return
				}else if(this.regNumber.test(this.storeOutPickList[j].partQty)==false){
					uni.showToast({
						title: this.i18n.index.numberError,
						duration: 2000,
						icon:'none'
					});	
					return
				}else{
					this.storeOutPickList.push({
						init:true,
						partNo:'',
						partDescription:'',
						partQty:'',
						reference1:''
					})	
				}
			},
			againSelect(i){
				//console.log(i);
				uni.navigateTo({
					url:'so-selelct-sku?index='+i+'&&id='+this.id
				})
			},
			back(){
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
				let len=this.storeOutPickList.length;
				//console.log(len);
				if(this.storeOutPickList[len-1].partNo==''||this.storeOutPickList[len-1].partQty==''){
					uni.showModal({
						title: this.i18n.index.IncompleteError_one,
						content: this.i18n.index.IncompleteError_two,
						cancelText:this.i18n.index.Discard,
						cancelColor:'#007AFF',
						confirmText:this.i18n.index.Edit,
						confirmColor:'#007AFF',
						success:(res)=> {
							if (res.confirm) {
								//console.log('用户点击确定');
								return
							} else if (res.cancel) {
								//console.log('用户点击取消');
								if(len>1){
									this.storeOutPickList.splice(len-1,1);
								}else if(len==1){
									this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
								}
								var pages = getCurrentPages();
								var currPage = pages[pages.length - 1]; //当前页面
								var prevPage = pages[pages.length - 2]; //上一个页面
								//console.log(prevPage.id)
								currPage.id=prevPage.id;//修改TabCur的值
								uni.navigateBack(); 
							}
						}
					});
				}else if(this.regNumber.test(this.storeOutPickList[len-1].partQty)==false){
					uni.showToast({
						title: this.i18n.index.numberError,
						duration: 2000,
						icon:'none'
					});	
					return
				}else{
					var pages = getCurrentPages();
					var currPage = pages[pages.length - 1]; //当前页面
					var prevPage = pages[pages.length - 2]; //上一个页面
					//console.log(prevPage.id)
					currPage.id=prevPage.id;//修改TabCur的值
					uni.navigateBack(); 
				}
			}
		},
		onBackPress(event){
			let _this=this;
			// #ifdef APP-PLUS  
			plus.key.hideSoftKeybord();
			// #endif 
			let len=_this.storeOutPickList.length;
			if(_this.storeOutPickList[len-1].partNo==''||_this.storeOutPickList[len-1].partQty==''){
				uni.showModal({
					title: this.i18n.index.IncompleteError_one,
					content: this.i18n.index.IncompleteError_two,
					cancelText:this.i18n.index.Discard,
					cancelColor:'#007AFF',
					confirmText:this.i18n.index.Edit,
					confirmColor:'#007AFF',
					success:(res)=> {
						if (res.confirm) {
							//console.log('用户点击确定');
						} else if (res.cancel) {
							//console.log('用户点击取消');
							if(len>1){
								_this.storeOutPickList.splice(len-1,1);
							}else if(len==1){
								_this.StoreOutPick([{init:true,partNo:'',partDescription:'',partQty:'',reference1:''}])
							}
							var pages = getCurrentPages();
							var currPage = pages[pages.length - 1]; //当前页面
							var prevPage = pages[pages.length - 2]; //上一个页面
							console.log(prevPage.id)
							currPage.id=prevPage.id;//修改TabCur的值
							//在 onBackPress 中直接调用 uni.navigateBack() 并始终返回 true 会引发死循环。
							uni.navigateBack(); 
							//所以，需要根据 onBackPress 的回调对象中的 from 值来做处理，当来源是 'navigateBack' 时，返回 false
							if (options.from === 'navigateBack') {  
								return false;  
							}
						}
					}
				});	
				return true;
			}else if(_this.regNumber.test(_this.storeOutPickList[len-1].partQty)==false){
				uni.showToast({
					title: _this.i18n.index.numberError,
					duration: 2000,
					icon:'none'
				});	
				return true;
			}
			
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: this.i18n.index.SKUInformation
			})
			if(option.id){
				this.id=option.id;
			}
			this.storeOutPickList.forEach((i)=>{
				if(i.partNo!=''){
					i.init=false
				}
			})
		},
		onNavigationBarButtonTap:function(e){
			//if(e.index==0){
				this.back();
			//}else if(e.index==1){
				//this.done();
			//} 
		},
		onShow(){
			//console.log(this.id);
			let pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面 
			//let currPage = pages[pages.length-1];
			//console.log(prevPage);
			currPage.id=this.id//拿到tabID 1/2
			//console.log('id:'+this.id);
			//console.log(this.storeOutPickList);
			this.storeOutPickList.forEach((i)=>{
				if(i.partNo!=''){
					i.init=false
				}
			})
			
		}
	}
</script>

<style>
	.container{
		padding-bottom: 20upx;
		padding-top: 1upx;
	}
	.info-info{
		margin: 20upx;
		padding: 40upx;
		/* box-shadow:0px 0px 10upx rgba(0,0,0,0.16); */
		border: 2upx solid #E5E5E5;
		opacity:1;
		border-radius:16upx;
	}
	.select-text{
		font-size: 28upx;
		color:grey;
	}
	.sku text,.quantity text,.remark text{
		color: #EA8C1B;
		font-size: 28upx;
		font-family: Arial;
		font-weight: bold;
	}
	.sku-info{
		padding: 30upx 0 36upx 0;
		display: flex;
		justify-content: space-between;		
		align-items: center;
	}
	.sku-info,.quantity{
		border-bottom: 2upx solid #E5E5E5;
	}
	.quantity{
		padding-bottom: 30upx;
	}
	.quantity,.remark{
		padding-top: 40upx;
	}
	.info-add{		
		text-align: center;
	}
	.icon-add{
		width: 40upx;
		height: 40upx;
	}
	.sku-number{
		font-size:36upx;
		font-family:Arial;
		font-weight:400;
		padding-bottom: 20upx;
	}
	.sku-des{
		font-size:24upx;
		font-family:Arial;
		font-weight:400;
	}
	.right-icon{
		width: 32upx;
		height: 32upx;
	
	}
</style>
