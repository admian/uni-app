<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="status_bar">
			<view class="top_view"></view>
		</view> -->
		<!-- #endif -->
		<!-- <view class="home-title"><text>e+ Solutions</text></view> -->
		<view class="home-banner">
			<view class="banner">
				<swiper class="swiper" :indicator-dots="indicatorDots" 
				 :autoplay="autoplay" :interval="interval" :duration="duration" 
				 indicator-active-color="#F5C68D" indicator-color="#CCCCCC">
					<swiper-item>
						<view class="swiper-item">
							<image class="swiper-img" src="../../static/Image_Home/Storage.jpg"></image>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<image class="swiper-img" src="../../static/Image_Home/Inventory.jpg"></image>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<image class="swiper-img" src="../../static/Image_Home/PickPack.jpg"></image>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<image class="swiper-img" src="../../static/Image_Home/Delivery.jpg"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>	
		<view class="index-container">		
			<view class="item-index" v-for="(i,key) in list" :key="key" @tap="onClick(key)">	
			
				<view class="content-index">
					<view class="icon-index">
						<image :src="i.icon" class="icon"></image>
					</view>
					{{ i18n.index[i.text] }} 
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
				list:[
					/* {text: 'Statistics',url:'../home/statistics',icon:'../../static/tab/A0301_Statistics_48px_3x.png'},
					{text: 'Message',url:'../home/message',icon:'../../static/tab/A0302_Message_48px_3x.png'}, */
					{text: 'Address Book',url:'../home/address-book',icon:'../../static/tab/A0303_Address_Book_48px_3x.png'},
					{text: 'Inventory',url:'../home/inventory',icon:'../../static/tab/A0304_Inventory_48px_3x.png'},
					{text: 'Create Order',url:'../home/create',icon:'../../static/tab/A0305_Create_Order_48px_3x.png'},
					{text: 'Check Order',url:'../home/order',icon:'../../static/tab/A0306_check_order_48px_3x.png'}				
				],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				backTitle:'Home'
				
			};
		},
		computed:{
			...mapState([
			  'baseUrl','isLogin'
			]),
            i18n() {  
                return this.$i18nMsg()  
            }
		},
		methods:{
			onClick(i) {
				uni.navigateTo({
					url:this.list[i].url
				})
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: 'e+ Solutions'
			})
			//console.log(this.$i18n.locale);
			if(this.$i18n.locale == 'en_US'){

				uni.setTabBarItem({
				  index: 0,
				  text: 'HOME',
				})
				uni.setTabBarItem({
				  index: 1,
				  text: 'INVENTORY',
				})
				uni.setTabBarItem({
				  index: 2,
				  text: 'CREATE',
				})
				uni.setTabBarItem({
				  index: 3,
				  text: 'ORDER',
				})
				uni.setTabBarItem({
				  index: 4,
				  text: 'PROFILE',
				})
				
			} 
		}
		
	}
</script>

<style>
	@import '../../common/home.css';
	
</style>
