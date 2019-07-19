<template>
	<view id="pick_sku" :class="boolShow?'overDropp':''">
		<!-- <uni-head :title="i18n.index.PickSKU" :showAdd="true" :showSearch="true" addUrl="create-new-sku" @click-back="back" @click-add="add" @click-search="search"></uni-head> -->
		<view v-show="!loadingShow">
			<view class="container-list" v-if="list.length!=0">
				<view class="item-info" v-for="(item,index) in list" :key="index">
					<view>
						<view class="no-order">{{item.partNo}}</view>
						<view class="no-des">{{item.partDesc}}</view>
					</view>
					<view class="number-box">
						<view class="numbox">
							<view :class="item.qtyBook==0?'numbox__minus numbox-disabled':'numbox__minus numbox-abled'" :disabled="disabled" @tap="_calcValue('subtract',index)" >-</view>
							<view class="numbox_input">
								<input class="numbox__value" type="number" v-model="item.qtyBook"  @focus="hideTabbar" @blur="_onBlur($event.target.value,index)">
							</view><!-- @click="hideTabbar" -->
							<view class="numbox__plus" @tap="_calcValue('add',index)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- popup及save按钮 -->
		<view v-show="!loadingShow">
			<!-- <view :class="showPopup?'shopSkuPopup show':'shopSkuPopup hide'" v-show="showPopup">-->
			<popup-layer ref="popupRef" :direction="'top'" v-model="boolShow">
				<view class="skulist">
					<view class="popup-title"><image src="../../static/order/A0202_sku_info_16px_3x.png" class="icon-popup"></image><view class="text">{{i18n.index.SKUInformation}}</view></view>
					<view class="selected-info">
						<view class="letter" v-if="selectedList.length!=0">
							<view class="item-info" v-for="(item,index) in selectedList" :key="index">
								<view>
									<view class="no-order">{{item.partNo}}</view>
									<view class="no-des">{{item.partDesc}}</view>
								</view>
								<view class="number-box">
									<view class="numbox">
										<view :class="item.qtyBook==0?'numbox__minus numbox-disabled':'numbox__minus numbox-abled'" :disabled="disabled" @tap="select_calcValue('subtract',index)">-</view>
										<view class="numbox_input">
											<input class="numbox__value" type="number" v-model="item.qtyBook"    @blur="select_onBlur($event.target.value,index)">
										</view><!--@click="hideTabbar" @focus="hideTabbar" -->
										<view class="numbox__plus" @tap="select_calcValue('add',index)">+</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</popup-layer>
			<!-- </view> -->
			<view class="save-btn" v-show="tabbar">
				
				<button :class="disSelect?'selected_1 selected-selbg':'selected_1 selected-bg'" :disabled="!disSelect" @tap="popupShow">{{i18n.index.SelectedSKU}}:{{totalCount}}</button>

				<!-- <view>
					<button :class="disSelect?'selected selected-selbg':'selected selected-bg'" :disabled="!disSelect" @tap="popupShow">{{i18n.index.SelectedSKU}}:{{totalCount}}</button>
				</view>
				<view>
					<button :class="disSelect?'save save-selbg':'save save-bg'" @tap="save" :disabled="!disSelect">{{i18n.index.Save}}</button>
				</view> -->
			</view>	
			<!-- <view class="disdrop" v-show="showPopup" @tap="popupShow"></view> -->
		</view>
		<!-- 加载更多 -->
		<view>
			<uni-load-more  :loadingType="loadingType" :contentText="contentText" v-show="list.length!==0"></uni-load-more>
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
					<p> {{i18n.index.pickSKUEmpty_one}}</p>
					<p> {{i18n.index.pickSKUEmpty_two}}</p>
				</view>
				<view v-else-if="errorShow">
					<p>{{i18n.index.invenError_one}}</p>
					<p>{{i18n.index.invenError_two}}</p>
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
	import uniNumberBox from '@/components/uni-number-box.vue'
	import uniLoadMore from '@/components/uni-load-more.vue';
	import uniLoading from '@/components/uni-loading.vue';
	import popupLayer from '@/components/popup-layer.vue';
	import {mapState, mapMutations } from "vuex";
	let _self;
	export default {
		components:{
			uniNumberBox,uniLoadMore,uniLoading,popupLayer
		},
		data() {
			return {
				inputValue: 0,
				disabled:false,
				showPopup:false,
				boolShow:false,
				id:'',
				selectedList: [],
				messageShow:false,
				errorShow:false,
				systemerrorShow:false,
				emptyShow:false,
				listShow:false,
				loadingShow:false,
				list:[],
				page:1,
				pageSize:10,
				loadingText: '',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown:' ',
					contentrefresh: ' ',
					contentnomore: ''
				},
				Truescroll:true,
				tabbar: true,
				windowHeight: '',
			};
		},
		computed:{
			totalCount(){
				let _this=this;
				let count=0;
				this.list.map((e)=>{			
					if(e.qtyBook>0&&this.regNumber.test(e.qtyBook)==true){
						count++;
					}
				})
				return count;		
			},
			disSelect(){
				return this.selectedList.length>0
			},
			i18n() {  
				return this.$i18nMsg()  
			},
			...mapState(['storeInPickCList','pickSkuList','storeInPickSList'])
		},
		onReachBottom:(res)=> {
			
			//触底的时候请求数据，即为上拉加载更多
			_self.getmorenews();
		},
		methods:{ 
			// back(){
				//返回时，判断是否清除数据
				/* if(this.selectedList.length>0){
					this.PickSku('');
					this.StoreInpickC('');
					this.StoreInpickS('');
				} */
				/* uni.redirectTo({
					url:'store-in-order?id='+this.id
				}); */
				//uni.navigateBack({
				//	delta: 1
				//}) 
			//}, 
			...mapMutations(['StoreInpickC','PickSku','StoreInpickS']),
			popupShow(){
				//console.log(this.boolShow);
				if(this.boolShow==false){
					this.$refs.popupRef.show();
					this.boolShow=true;
				}else{
					this.$refs.popupRef.close();
					this.boolShow=false;
				}
				// #ifdef APP-PLUS  
				plus.key.hideSoftKeybord();
				// #endif 
			},
			_calcValue(e,index){
				//console.log(e,index);
				// #ifdef APP-PLUS  
				// plus.key.hideSoftKeybord();
				// #endif 
				let _this=this;
				if(e=="subtract"){
					if (this.list[index].qtyBook==0) {
						this.list[index].disabled=true;	
						return
					}
					if(this.list[index].qtyBook==1){
						this.list[index].qtyBook--;
						this.list[index].qtyPerPkg--;
						for(let i=0;i<this.selectedList.length;i++){
							if(this.selectedList[i].seqId==this.list[index].seqId){
								//console.log(i.partDesc)
								this.selectedList.splice(i,1);
							}
						}
						
						return
					}
					this.list[index].qtyBook--;
					this.list[index].qtyPerPkg--;
				}else{
					//判断qtyBook是否>1
					if(this.list[index].qtyBook==0){
						if(this.selectedList.length==30){
							uni.showToast({
								title: this.i18n.index.maxMain,
								duration: 2000,
								icon:'none'
							}); 
							return
						}
						this.selectedList.push(this.list[index])
					}else if(this.list[index].qtyBook>0){
						this.selectedList.forEach((i)=>{
							if(i.seqId==this.list[index].seqId){
								i.qtyBook=this.list[index].qtyBook
								i.qtyPerPkg=this.list[index].qtyPerPkg
							}
						})
					}
					this.list[index].qtyBook++;
					this.list[index].qtyPerPkg++;
				}		 
			},
			_onBlur(e,index){
				//console.log(e);
				this.tabbar = true;
				let _this=this;
				if(e==''){
					this.list[index].qtyBook=0;
					for(let i=0;i<this.selectedList.length;i++){
						if(this.selectedList[i].seqId==this.list[index].seqId){
							//console.log(i.partDesc)
							this.selectedList.splice(i,1);
						}
					}
					return
				}else{
					this.list[index].qtyBook=e;
					this.list[index].qtyPerPkg=e;
				}
				//判断是否为整数
				if(this.regNumber.test(e)==false){
					uni.showToast({
						title: this.i18n.index.numberError,
						duration: 2000,
						icon:'none'
					});	
					return
				}
				let change=false;//用于判断数组是否存在相同的partNo
				if(e==0){
					//从selectedList中移除为0的对象
					for(let i=0;i<this.selectedList.length;i++){
						if(this.selectedList[i].seqId==this.list[index].seqId){
							//console.log(i.partDesc)
							this.selectedList.splice(i,1);
						}
					}
					return
				}
				//如果存在update，不存在push
				if(this.selectedList.length==0){
					this.selectedList.push(this.list[index])//第一次追加
				}else{
					//如果 存在 或者 还是追加
					this.selectedList.forEach((i)=>{
						if(i.seqId==this.list[index].seqId){
							i.qtyBook=this.list[index].qtyBook;
							i.qtyPerPkg=this.list[index].qtyPerPkg
							change=true;
						}		
					})
					if(change==false){
						if(this.selectedList.length==30){
							uni.showToast({
								title: this.i18n.index.maxMain,
								duration: 2000,
								icon:'none'
							});
							this.list[index].qtyBook=0;
							return
						}
						this.selectedList.push(this.list[index])
					}
				}		
			},
			//处理选中selectedList的数据
			select_calcValue(e,index){
				 // #ifdef APP-PLUS  
				//plus.key.hideSoftKeybord();
				// #endif 
				//console.log(e,index);
				if(e=='subtract'){
					if (this.selectedList[index].qtyBook==1){
						this.selectedList[index].qtyBook--;
						this.selectedList[index].qtyPerPkg--;
						this.selectedList.splice(index,1);
						return
					}
					this.selectedList[index].qtyBook--;
					this.list.forEach((i)=>{
						if(i.seqId==this.selectedList[index].seqId){
							i.qtyBook=this.selectedList[index].qtyBook;
							i.qtyPerPkg=this.selectedList[index].qtyPerPkg;	
						}		
					})
				}else{
					this.selectedList[index].qtyBook++;
					this.list.forEach((i)=>{
						if(i.seqId==this.selectedList[index].seqId){
							i.qtyBook=this.selectedList[index].qtyBook;
							i.qtyPerPkg=this.selectedList[index].qtyPerPkg;
						}		
					})
				}
				
			},
			select_onBlur(e,index){
				this.tabbar = true;
				if(e==''){
					this.selectedList[index].qtyBook=0;
					this.selectedList.splice(index,1);
					return
				}else{
					this.selectedList[index].qtyBook=e;
					this.selectedList[index].qtyPerPkg=e;
				}
				if(this.regNumber.test(e)==false){
					uni.showToast({
						title: this.i18n.index.numberError,
						duration: 2000,
						icon:'none'
					});	
					return
				}
				
				if(e==0){
					this.selectedList.splice(index,1);
					return
				}
				this.list.forEach((i)=>{
					if(i.seqId==this.selectedList[index].seqId){
						i.qtyBook=this.selectedList[index].qtyBook;
						i.qtyPerPkg=this.selectedList[index].qtyPerPkg;
					}		
				})
			},
			add(){
				if(this.selectedList.length==30){
					uni.showToast({
						title: this.i18n.index.maxMain,
						duration: 2000,
						icon:'none'
					});
					this.list[index].qtyBook=0;
					return
				}
				if(this.id==1){
					this.StoreInpickC(this.selectedList);
					this.PickSku(this.list);
				}else{
					this.StoreInpickS(this.selectedList);
					this.PickSku(this.list);
				}
				uni.navigateTo({
					url:'si-add-skuinfo?id='+this.id
				})
			},
			back(){
				let isSave=true;
				this.selectedList.forEach((i)=>{
					//console.log(i.qtyBook);
					if(this.regNumber.test(i.qtyBook)==false){
						uni.showToast({
							title: this.i18n.index.saveNumberError,
							duration: 2000,
							icon:'none'
						});	
						isSave=false
						return
					}
				})
				if(isSave==false){
					return
				}
				if(this.id==1){
					this.StoreInpickC(this.selectedList);
					this.PickSku(this.list);
				}else{
					this.StoreInpickS(this.selectedList);
					this.PickSku(this.list);
				}
				
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.id=this.id;
				//currPage.id=this.id;//修改TabCur的值
				uni.navigateBack();
			},
			hideTabbar(){
				this.tabbar = false;
			},
			getmorenews:function () {
				if(this.Truescroll==false){
					return
				}
				let _this=this;
				this.page++;
				if (_this.loadingType != 0) {//loadingType!=0;直接返回 
					return false;
				} 
				_this.loadingType = 1; 
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
								"warehouseCode":this.warehouseCode,
								"page":this.page,
								"pageSize":this.pageSize,
							},
							success: (res) => { 
								// #ifdef APP-PLUS  
								plus.key.hideSoftKeybord();
								// #endif 
								//console.log(res.data.status);
								if (res.data.status==404) {
									//没有数据 
									_this.loadingType = 2; 
									return false; 
								}
								_this.loadingType = 0;//将loadingType归0重置 
								res.data.data.partList.forEach((i)=>{
									let obj ={
										"partNo":i.partNo,
										"partDesc":i.partDesc,
										"seqId":i.seqId,
										"qtyBook":"0",
										"pkgBook":"1",
										"qtyUnit":"PCS",
										"qtyPerPkg":"0",
										"pkgUnit":"PCS"
									}
									this.list.push(obj);
								})
							}
						})
					}
				})
			},
		},
		onBackPress(event){
			//console.log(event)
			let isSave=true;
			this.selectedList.forEach((i)=>{
				//console.log(i.qtyBook);
				if(this.regNumber.test(i.qtyBook)==false){
					uni.showToast({
						title: this.i18n.index.saveNumberError,
						duration: 2000,
						icon:'none'
					});	
					isSave=false
					return true
				}
			})
			if(isSave==false){
				return true
			}
			if(this.id==1){
				this.StoreInpickC(this.selectedList);
				this.PickSku(this.list);
			}else{
				this.StoreInpickS(this.selectedList);
				this.PickSku(this.list);
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: this.i18n.index.PickSKU
			})
			let _this=this;
			_self=this;
			this.id=option.id;
			//1.有数据的list，2.选中的list，3.初始化的list
			if(this.id==1){
				//BY Courier
				if(this.storeInPickCList.length>0){
					this.Truescroll=false;
					this.selectedList=this.storeInPickCList;
					this.list=this.pickSkuList;
					this.messageShow=false;
				}else{
					this.loadingShow=true
					this.selectedList=[];
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
									"warehouseCode":this.warehouseCode,
									"page":this.page,
									"pageSize":this.pageSize,
								},
								success: (res) => { 
									this.loadingShow=false;
									//console.log('第一次请求');
									if(res.data.status==404){
										this.messageShow=true;
										this.emptyShow=true; 
									}else if(res.data.status==200){ 
										
										res.data.data.partList.forEach((i)=>{
											let obj ={
												"partNo":i.partNo,
												"partDesc":i.partDesc,
												"seqId":i.seqId,
												"qtyBook":"0",
												"pkgBook":"1",
												"qtyUnit":"PCS",
												"qtyPerPkg":"0",
												"pkgUnit":"PCS"
											}
											this.list.push(obj);
										})
									}else{
										this.messageShow=true;
										this.systemerrorShow=true; 
									}
								},
								fail() {
									this.loadingShow=false;
									this.messageShow=true;
									this.errorShow=true;
								}
							})
						}
					})
				}
			}else{
				//BY Self-Delivery
				if(this.storeInPickSList.length>0){
					this.Truescroll=false;
					this.selectedList=this.storeInPickSList;
					this.list=this.pickSkuList;
					this.messageShow=false;
				}else{
					this.loadingShow=true
					this.selectedList=[];
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
									"warehouseCode":"ULHKG",
									"page":this.page,
									"pageSize":this.pageSize,
								},
								success: (res) => { 
									this.loadingShow=false;
									//console.log('第一次请求');
									if(res.data.status==404){
										this.messageShow=true;
										this.emptyShow=true; 
									}else if(res.data.status==200){ 
										res.data.data.partList.forEach((i)=>{
											let obj ={
												"partNo":i.partNo,
												"partDesc":i.partDesc,
												"seqId":i.seqId,
												"qtyBook":"0",
												"pkgBook":"1",
												"qtyUnit":"PCS",
												"qtyPerPkg":"0",
												"pkgUnit":"PCS"
											}
											this.list.push(obj);
										})
									}else{
										this.messageShow=true;
										this.systemerrorShow=true; 
									}
									
								},
								fail() {
									this.loadingShow=false;
									this.messageShow=true;
									this.errorShow=true;
								}
							})
						}
					})
				}
			}
			//键盘弹起
			 uni.getSystemInfo({
				success: (res)=> {
					this.windowHeight = res.windowHeight;
				}
			});
			 //底部btn的显示与隐藏
			uni.onWindowResize((res) => {
				if(res.size.windowHeight < this.windowHeight){
					this.tabbar = false
				}else{
					this.tabbar = true
				}
			})
		},
		onShow(){
			if(this.pickSkuList.length!=0){
				this.messageShow=false;
			}
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			currPage.id=this.id;
			//console.log(currPage);
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==0){
				this.back();
			}else {
				this.add();
			}
		}
	}
</script>

<style>
	.overDropp{
		position:fixed;
		top:0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#pick_sku uni-input div{
		min-height: 0rem !important;
	}
	#pick_sku uni-input,#pick_sku uni-input input{
		min-height:0rem !important;
	}
	.container-list{
		padding-left: 40upx;
		padding-bottom: 160upx;
	}
	.item-info{
		padding: 30upx 40upx 30upx 0;
		border-bottom: 2upx  solid #E5E5E5;
		display: flex;
		justify-content: space-between;
		font-family: Arial;
	}
	.no-order{
		font-size: 36upx;
		color: #333333;
		font-weight: Regular;
		padding-bottom: 20upx;
	}
	.no-des{
		font-size: 24upx;
		color: #999999;
		font-weight: Regular;
	}
	.number{
		color: #EA8C1B;
		text-align: right;
		font-size: 36upx;	
	}
	.number-stock{
		width:154upx;
		height:28upx;
		font-family:Arial;
		background: #F85730;		
		font-size: 20upx;
		line-height: 28upx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 16upx;
	}
	/* ----购物车------ */
	.text{font-size: 28upx;}
	.shopSkuPopup{
		position: fixed;
		width: 100%;
		z-index: 9;
		
	}
	.show{
		transform: translateY(0upx);
		animation: showbottom 0.5s;
		bottom: 0;
	}
	.hide{
		transform: translateY(-1000upx);
		animation: hidebottom 0.5s;
		
	}
	@keyframes showbottom{
	  from {
	    transform: translateY(100%);
	  }
	  to {
	    transform: translateY(0);
	  }
	}
	@keyframes hidebottom{
	  from {
	    transform: translateY(0);
	  }
	  to {
	    transform: translateY(100%);
	  }
	}
	@keyframes  hide{
		0% {transform: translateY(0%); opacity: 1;}	
		100% {transform: translateY(100%); opacity: 1;}
	}
	@keyframes  show{
		0% {transform: translateY(100%); opacity: 1;}	
		100% {transform: translateY(0%); opacity: 1;}
	}
	.skulist{
		padding: 40upx 0 40upx 40upx;
		margin: 0 20upx;		
		background: #FFFFFF;
		min-height: 304upx;
		max-height: 994upx;	
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
	}
	.selected-info{
		max-height: 758upx;
		overflow:scroll;
		margin-bottom: 130upx;	
	}
	.letter{
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}
	.icon-popup{
		width: 32upx;
		height: 31upx;
		margin-right: 10upx;
		margin-top: 5upx;
	}
	.popup-title{
		color: #EA8C1B;
		display: flex;
		font-size:28px;
		font-family:Arial;
		font-weight:bold;		
	}
	.disdrop{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		background:rgba(0,0,0,0.5);
		
	}
	/* ----------------------- */
	.save-btn{
		position: fixed;
		bottom: 0;	
		width: 100%;
		height: 160upx;
		display: flex;
		justify-content: center;
		z-index: 99;
		text-align: center;
		font-family: Arial;
	}
	uni-button[disabled]:not([type]), uni-button[disabled][type=default]{
		background:transparent;
		color: #FFFFFF !important;
	}
	uni-button:after{
		border: none;
	}
	.selected_1{
		width: 630upx;
		height: 92upx;
		color: #FFFFFF !important;
		border-radius: 60upx;
		line-height: 92upx;
		font-size: 28upx;
	}
	.selected{
		width: 456upx;
		height: 102upx;
		color: #FFFFFF !important;
		border-top-left-radius: 60upx;
		border-bottom-left-radius:60upx;
		border-top-right-radius:0;
		border-bottom-right-radius:0;
		line-height: 102upx;
		font-size: 28upx;
	}
	.selected-bg{
		background: #91959F !important;
	}
	.selected-selbg{
		background: #252C41 !important;
	}
	.save{
		width: 174upx;
		height: 102upx;
		color: #FFFFFF !important;
		border-top-right-radius: 60upx;
		border-bottom-right-radius:60upx;
		border-top-left-radius: 0;
		border-bottom-left-radius:0;
		line-height: 102upx;
		font-size: 36upx;
	}
	.save-bg{
		background: #F5C68D !important;
	}
	.save-selbg{
		background: #EA8C1B !important;
	}
	/* --------------------------------------------------- */
	.number-box{
		display: flex;
		align-items: center;	
		margin-left: 40upx;
	}
	.numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 54upx;/* 40 */
		width: 170upx;
		position: relative;
		border-radius: 14upx;
		border:2upx solid rgba(229,229,229,1);
	}
	.numbox__minus{
		margin: 0;
		width: 50upx;/* 40 */
		font-size: 40upx;
		height: 100%;
		line-height: 54upx;/* 40 */
		text-align: center;
		color: #FFFFFF;
		position: relative;
		border-top-left-radius: 10upx;
		border-bottom-left-radius:10upx;
	
	}
	.numbox-disabled{
		background-color: #E5E5E5;
	}
	.numbox-abled{
		background-color: #F5C68D;
	}
	.numbox__plus {
		margin: 0;
		background-color: #F5C68D;
		width: 50upx;/* 40 */
		font-size: 40upx;
		height: 100%;
		line-height: 54upx;/* 40 */
		text-align: center;
		color: #FFFFFF;
		position: relative;
		border-top-right-radius: 10upx;
		border-bottom-right-radius:10upx;
	}	
	.numbox_input{
		width: 60upx;
		height: 54upx;/* 40 */
		padding: 0 10upx;
	}
	.numbox__value{
		position: relative;
		background-color: #FFFFFF;
		width: 60upx;
		height: 54upx;/* 40 */
		text-align: center;
		padding: 0;
		font-size: 28upx;
		border: none;
	
	}
	.numbox__value:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		/* border-style: solid;
		border-color: #c8c7cc; */
		border-left-width: 0;
		border-right-width: 0;
		border-top-width: 0;
		border-bottom-width: 0;
		transform: scale(.5);
	}
	
</style>
