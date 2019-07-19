<template>
	<view>
		<!-- <uni-head :title="i18n.index.CourierCompany" @click-back="back"></uni-head> -->
		<view class="container">
			<view class="item-company" v-for="(item,index) in list" :key="index" @tap="clickCourier(item.key)">
				<image :src="item.icon" class="item-icon"></image> 
				{{i18n.index[item.name]}}
			</view>
		</view>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		components:{
			uniHead
		},
		data() {
			return {
				list:[
					{icon:'../../static/courier/logo_SF_Express_48px_3x.png',name:'SF Express',key:'SF-Express'},
					{icon:'../../static/courier/logo_HongKong_Post_48px_3x.png',name:'Hong Kong Post',key:'HKBAM'},
					{icon:'../../static/courier/pic_Other_HK_Delivery_48px_3x.png',name:'Other HK Delivery',key:'Other Courier Company'}
				]
			};
		},
		computed:{
			i18n() {  
			    return this.$i18nMsg()  
			},
			...mapState(['storeInObj'])
		},
		methods:{
			...mapMutations(['StoreInCourierObj']),
			back(){
				uni.navigateBack({
					delta: 1
				}) 
			},
			clickCourier(name){
				//console.log(name);
				this.StoreInCourierObj({courier:name,CourierBillNumber:this.storeInObj.CourierBillNumber,instruction:this.storeInObj.instruction});
				uni.navigateBack({
					delta: 1
				}) 
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.i18n.index.CourierCompany
			})
		},
		onNavigationBarButtonTap:function(e){
			//console.log(e.index)
			if(e.index==0){
				this.back();
			}
		}
	}
</script>

<style>
	.container{
		padding-left: 40upx;
		font-size: 32upx;
		font-weight: 400;
	}
	.item-company{
		height: 164upx;
		align-items: center;
		display: flex;
		border-bottom: 1upx solid #E5E5E5;
		font-size: 28upx;
		color: #333333;
	}
	.item-icon{
		width: 164upx;
		height: 164upx;
		margin-right: 50upx;
	}
</style>
