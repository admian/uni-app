<template>
	<view>
		<!-- <uni-head :title="i18n.index.AddressBook" :backTitle="i18n.index[backTitle]" @click-back="back" ></uni-head>	 -->
		<!--:showAdd="true" :showSearch="true" @click-add="add"  backTitle="Home" -->
		<!-- <view class="soon-container">
			<view class="soon-img">
				<image src="../../static/order/pic_maintain_140px_3x.png" class="soon-icon"></image>
			</view>	
		</view>
		<view class="soon-text">{{i18n.index.ComingSoon}}</view> -->
		<view class="address-list" v-show="listShow">
			<view v-for="(item,index) in list" :key="index">
				<view class="item-address" v-if="item.id">
					<view class="mess" @tap="address(item)">
						<view>
							<text class="info-mess">{{item.consignee_name}}</text>
							<text class="number">{{item.consignee_phone}}</text>
						</view>
						<view class="address">{{item.consignee_addr1}}</view>
					</view>
					<view class="do-btn">
						<view class="delete-btn" @tap="deleted(index)">
							<image src="../../static/icon/A0306_cross_b6b6b6_16px_3x.png" class="do-icon"></image>
							{{i18n.index.Delete}}
						</view>
						<!-- <view class="edit-btn" >
							<image src="../../static/icon/A0308_edit_b6b6b6_16px_3x.png" class="do-icon"></image>
							{{i18n.index.Edit}}
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 空白提示 -->
		<view v-show="messageShow">
			<view class="no-container">
				<image v-if="emptyShow" src="../../static/order/pic_empty_page_140px_3x.png" class="no-img"></image>
				<image v-else-if="errorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
				<image v-else-if="systemerrorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
			</view>
			<view class="text-con">
				<view v-if="emptyShow">
					<p>{{i18n.index.Noaddress}}</p>
				</view>
				<view v-else-if="errorShow">
					<p>{{i18n.index.pickSKUError_one}}</p>
					<p>{{i18n.index.pickSKUError_two}}</p>
				</view>
				<view v-else-if="systemerrorShow">
					<p>{{i18n.index.systemError_one}}</p>
					<p>{{i18n.index.systemError_two}}</p>
				</view>
			</view>
		</view>
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import uniLoadMore from '../../components/uni-load-more.vue';
	import uniLoading from '../../components/uni-loading.vue';
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		components:{
			uniHead,uniLoadMore,uniLoading
		},
		data() {
			return {
				listShow:true,
				messageShow:false,
				emptyShow:false,
				errorShow:false,
				systemerrorShow:false,
				backTitle:'Home',
				list:[],
				loadingShow:false,
				page:1,
				pageSize:10,
				loadingText: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown:' ',
					contentrefresh: '',
					contentnomore: '-END-'
				},
				title:'',
				id:0
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
			back() {
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.route=="pages/create/store-out-order"){
					prevPage.id=this.id;
					uni.navigateBack();
				}else{
					uni.switchTab({
						url:"../taber/home"
					})
				}
			},
			add(){
				uni.navigateTo({
					url:'add-address'
				})
			},
			deleted(index){
				let _this=this;
				let id=this.list[index].id;
				//console.log(id)
				uni.showModal({
					title: this.i18n.index.message,
					content: this.i18n.index.confirmDelete,
					cancelText: this.i18n.index.Cancel,
					confirmText: this.i18n.index.Comfirm,
					success:(res)=> {
						if (res.confirm) {
							uni.getStorage({
								key:'uerInfo',
								success: (res) => {
									let customer=res.data.customer;
									uni.request({
										url:this.baseUrl+'/address/deleteAddress?id='+id,
										method:'GET',
										header:{"content-type":"application/json"},
										success: (res) => { 
											if(res.data.status==200){ 
												//console.log(_this.list)
												//this.list[index].isDelete=false;
												//console.log(res.data.message);
												_this.list.splice(index,1);
												if(_this.list.length==0){
													this.messageShow=true;
													this.emptyShow=true;
													this.listShow=false;
												}
											}else{
												uni.showToast({
													icon:"none",
													title:_this.i18n.index.DeleteError,
													duration:2000
												})
											}
										},
										fail() {
										}
									})
								}
							})
						} else if (res.cancel) {
							
						}
					}
				});
			},
			address(conect){
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.route=="pages/create/store-out-order"){
					prevPage.id=this.id;
					this.StoreOutToHKInfo({
						OrderNumber:this.storeOutorderInfo.OrderNumber,
						Courier:this.storeOutorderInfo.Courier,
						CourierService:this.storeOutorderInfo.CourierService,
						BuyerName:conect.consignee_name,
						BuyerPhone:conect.consignee_phone,
						BuyerAddress:conect.consignee_addr1,
						CourierFee:this.storeOutorderInfo.CourierFee,
						OrderValue:this.storeOutorderInfo.OrderValue
					})
					uni.navigateBack();
				}
			},
			getInfo(){
				this.loadingShow=true;
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/address/getByCustomerCode?customerCode='+customer,
							method:'GET',
							header:{"content-type":"application/json"},
							success: (res) => { 
								this.loadingShow=false
								if(res.data.status==200){ 
									//console.log(res.data.data);
									this.listShow=true;
									this.messageShow=false;
									this.list=res.data.data
								}else if(res.data.status==404){
									this.messageShow=true;
									this.emptyShow=true;
									this.listShow=false;
								}else{
									this.messageShow=true;
									this.systemerrorShow=true;
									this.listShow=false;
								}
							},
							fail:(res)=> {
								this.loadingShow=false
								this.messageShow=true;
								this.errorShow=true;
								this.listShow=false;
							}
						})
					}
				})
			}
		},
		onLoad(option){
			uni.setNavigationBarTitle({
				title: this.i18n.index.AddressBook
			})
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			let prevPage = pages[pages.length - 2]; //上一个页面
			// #ifdef APP-PLUS  
			let currentWebview = page.$getAppWebview();
			let titleObj = currentWebview.getStyle().titleNView;
			if (!titleObj.buttons) {
				return;
			}
			if(prevPage.route=='pages/create/store-out-order'){
				titleObj.buttons[1].text = '';
			}else{
				titleObj.buttons[1].text = this.i18n.index.Home;
			}
			currentWebview.setStyle({
				titleNView: titleObj
			});
			// #endif 
			if(option.id){
				this.id=option.id;
			}
			
		},
		onShow() {
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			//console.log(prevPage);
			//prevPage.id=this.id;//修改id的值 */
			this.loadingShow=true;
			setTimeout(()=>{
				this.getInfo();
			},300); 
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==1||e.index==0){
				this.back();
			}else{
				this.add();
			}
		},
	}
</script>

<style>
	.no-container{
	 	height: 700upx;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.no-img{	
		width: 280upx;
		height: 280upx;
	}
	.text-con{
		text-align: center;
		font-size: 28upx;
		font-weight: 400;
		padding: 30upx;
	}
	/* ------------------------------- */
	.address-list{
		padding: 20upx;
	}
	.item-address{
		background:rgba(255,255,255,1);
		border: 2upx solid #E5E5E5;
		border-radius: 14upx;
		margin-bottom: 20upx;
	}
	.mess{
		padding: 40upx;
		border-bottom: 2upx solid #E5E5E5;
	}
	.info-mess{
		font-size: 28upx;
		color: #EA8C1B;
		font-weight: 400;
		margin-right: 20upx;
		margin-bottom: 20upx;
		font-family:Arial;
		font-weight:400;
	}
	.number{
		font-size:28upx;	
		color:#333333;
	}
	.address{
		margin-top: 20upx;
		font-size:24upx;
		color:rgba(153,153,153,1);
	}
	.do-btn{
		display: flex;
		justify-content: flex-end;
		padding: 30upx 0;
		
	}
	.delete-btn,.edit-btn{
		display: flex;
		align-items: center;
		margin-right: 40upx;
		color: #999999;
		font-size: 28upx;
		
	}
	.do-icon{
		margin-right: 10upx;
		width: 32upx;
		height: 32upx;
	}
	/* ----------------------------- */
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
