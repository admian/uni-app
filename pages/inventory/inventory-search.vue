<template>
	<view>
		<view class="search-info">
			<view class="po-eye">
				<input  placeholder="SKU No./Part Description" v-model="key" />
				<image src="../../static/storage/search_s.png" class="icon-left" @tap="search"></image>
			</view>
			<view class="cancel">
				<text @tap="backPath">Cancel</text>
			</view>
		</view>
		<view class="content" v-if="none">
			<view class="pic-position">
				<view class="pic-img">
					<image src="../../static/storage/none_data.png" class="pic"></image>	
				</view>
				<p class="text">Oops...There is nothing here.</p>	
			</view>
		</view>
		<view class="list-info" v-if="!none">
			<view class="list-item clearfix" v-for="(item,index) in searchList"  :key="index">
				<view v-if="pageKey=='inventory'">
					<view class="item-pro fl">
						<view class="in-name">{{item.partNo}}</view>
						<view class="in-description">{{description(item.partDesc)}}</view>
					</view>
					<view class="item-sum fr">
						<view class="in-number">x{{item.qtyInv}}台</view>
						<view class="in-time">{{item.storeInDtLoc}}</view>
					</view>
				</view>
				<view v-if="pageKey=='storeIn'">
					<view class="item-pro fl">
						<view class="in-name">{{item.orderNo}}</view>
						<view class="in-description">{{item.orderService}}</view>
					</view>
					<view class="item-sum fr">
						<view class="in-number">x{{item.deliveryNote}}</view>
						<view class="in-time">{{item.createdDtLoc}}</view>
					</view>
				</view>
				<view v-if="pageKey=='storeOut'">
					<view class="item-pro fl">
						<view class="in-name">{{item.refOrderNo}}</view>
						<view class="in-description">{{item.shipping.carrierService}}</view>
					</view>
					<view class="item-sum fr">
						<view class="in-number">{{item.shipping.courierBillNo}}</view>
						<view class="in-time">{{item.createdDtLoc}}</view>
					</view>
				</view>
			</view>			
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex";
	export default {
		data() {
			return {
				none:true,
				key:'',
				searchList:[],
				pageKey:''
			};
		},
		computed:{
			 ...mapState([
			  'baseUrl'
			]),
			
		},
		methods:{
			description(text){
				if(text==null){
					return ' ';
				}else if(text.length<20){
					return text;
				}else{
					return text;
				}			
			},
			backPath(){
				uni.switchTab({
					url:'../taber/inventory'
				});
			},
			search(){
				let url='',date={};
				uni.getStorage({
					key: 'e_customer',
					success:(res)=> {
						if(this.pageKey=='inventory'){
							url=this.baseUrl+'/inventory/queryByCriteria';
							date={
								"customer":res.data,
								"warehouseCode":"ULHKG",
								"skuNo":this.key,
								"partDesc":this.key
							}
						}else if(this.pageKey=='storeIn'){
							url=this.baseUrl+'/storeInorder/queryByCriteria';
							date={
								"customer":res.data,
								"warehouseCode":"ULHKG",
								"orderNo":this.key				
							}
						}else if(this.pageKey=='storeOut'){
							url=this.baseUrl+'/soorder/querySOByCriteria';
							date={
								"customer":res.data,
								"warehouseCode":"ULHKG",
								"refOrderNo":this.key				
							}
						}
						uni.request({
							url:url,
							method:"POST",
							header:{
								"content-type":"application/json"
							},
							data:date,
							success:(res)=>{
								console.log(res.data.data);
								if(res.data.data){
									this.none=false;
									this.searchList=res.data.data
								}else{
									this.none=true;
								}							
							},
							fail(res) {
								console.log(res);
							}
						})
					}
				});
			}
		},
		onLoad(option){
			console.log(option.pageKey);
			this.pageKey=option.pageKey
		}
	}
</script>

<style>
	.search-info{
		padding-top: 70upx;
		padding-bottom: 20upx;
		padding-left: 40upx;
		background: #EA8C1B;
		position: relative;
		border: 1px solid red;
	}
	input {	
		height: 72upx;	
		font-size:28upx;
		background:#FFFFFF; 
		border-radius: 46upx;
		padding-left: 84upx;	
	}
	.po-eye{
		width: 550upx;
		position: relative;
	}
	.icon-left{
		width: 32upx;
		height: 32upx;
		position: absolute;
		top: 25upx;
		left: 32upx;
		z-index: 99;
	}
	.cancel{position: absolute;right: 30upx; top: 60upx; color: #FFFFFF;height: 92upx;line-height: 92upx;}
	.pic-position{
		width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-80%);	
	}	
	.pic-img{
		text-align: center;
	}
	.pic{
		width: 280upx;
		height: 280upx;
		
	}
	.text{
		text-align: center;
	}
	/* ---------------------------------------------------------------- */
	.list-info{
		padding-left: 29upx;
	}
	.list-item{
		padding: 29upx 29upx 29upx 0;
		border-bottom: 1upx solid #CCCCCC;
	}
	.in-name{
		font-size: 30upx;
		font-weight: 700;
	}
	.in-description{
		color: #999999;
		font-size: 18upx;
	}
	.in-number{
		color: #EA8C1B;
		text-align: right;
	}
	.in-time{
		color: #999999;
		font-size: 18upx;
		/* background: url(../../static/storage/store_in.png) no-repeat left center; */		
		background-size: 24upx 24upx;
		padding-left: 34upx;
	}
</style>
