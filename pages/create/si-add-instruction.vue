<template>
	<view>
		<!-- <uni-head :title="i18n.index.AddInstruction" :showDone="true" @click-back="back" @click-done="done"></uni-head> -->
		<view class="instru">
			<text>{{i18n.index.NewInstruction}}</text>
			<textarea class="instru-textarea" :placeholder="i18n.index.Input" v-model="newInstru"></textarea>
			<!-- <input type="text" :placeholder="i18n.index.Input" v-model="newInstru"/> -->
		</view>
		<view class="quickinstru">
			<view class="quickinstru-title">
				<text>{{i18n.index.QuickInstruction}}</text>
				<!-- <view class="edit-icon" @tap="editInstru">{{i18n.index.Editicon}}</view> -->
			</view> 
			<view class="instru-info">
				<view class="instru-item" v-for="(item,index) in list" :key="index" @tap="selectInstru(index)">{{item.content}}</view>
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
				newInstru:'',
				list:[],
				orderNameid:0
			};
		},
		computed:{
			i18n() {  
				return this.$i18nMsg()  
			},
			...mapState(['storeInObj','selfSIObj'])
		},
		methods:{
			...mapMutations(['StoreInCourierObj','StoreInSelfObj']),
			back(){
				uni.navigateBack({
					delta: 1
				});
				/* uni.navigateTo({
					url:'store-in-order?id='+this.orderNameid
				}) */
			},
			done(){
				let _this=this;
				let change=false;
				if(this.orderNameid==1){
					this.StoreInCourierObj({courier:this.storeInObj.courier,CourierBillNumber:this.storeInObj.CourierBillNumber,instruction:this.newInstru});
				}else{
					this.StoreInSelfObj({courier:this.selfSIObj.courier,CourierBillNumber:this.selfSIObj.CourierBillNumber,instruction:this.newInstru});
				}
				let objInstru={};
				objInstru={content:this.newInstru};
				if(this.list.length==0){
					this.list.unshift(objInstru);
				}else{
					this.list.forEach((i)=>{
						if(i.content==this.newInstru){
							change=true;
						}
					})
					if(change==false){
						if(this.list.length<6){
							this.list.unshift(objInstru);
						}else{
							this.list.splice(0,1);
							this.list.unshift(objInstru);
						}
					}
				}
				if(this.newInstru==''){
					uni.navigateBack({
						delta: 1
					})
					return
					/* uni.showToast({
						icon:'none',
						title:_this.i18n.index.newInstru
					})
					return */
				}
				uni.setStorage({
					key:'InstruList',
					data:this.list
				})
				/* uni.navigateTo({
					url:"store-in-order?id="+this.orderNameid
				}) */
				uni.navigateBack({
					delta: 1
				})
			},
			/* editInstru(){
				uni.removeStorage({
					key:'InstruList',
					success:()=> {
						//console.log('清除');
						this.list=[];
					}
				})
			}, */
			selectInstru(index){
				//console.log(index);
				this.newInstru=this.list[index].content;
			}
		},
		onLoad(option) {
			
			uni.setNavigationBarTitle({
				title: this.i18n.index.AddInstruction
			})
			this.orderNameid=option.id;
			//console.log(this.orderNameid);
			if(this.orderNameid==1){
				this.newInstru=this.storeInObj.instruction
			}else{
				this.newInstru=this.selfSIObj.instruction
			}
			uni.getStorage({
				key:'InstruList',
				success: (res) => {
					if(res.data){
						this.list=res.data;
					}
				}
				
			})
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
.instru{
	margin-left: 40upx;
	padding: 40upx 0 40upx 0;
	border-bottom: 2upx solid #E5E5E5;
}
.instru text,.quickinstru-title text{
	color: #EA8C1B;
	font-size:28upx;
	font-family:Arial;
	font-weight:bold;
}
.quickinstru{
	padding-top: 40upx;
	/* margin:0 40upx; */
}
.quickinstru-title{
	padding: 0 40upx;
	display: flex;
	justify-content: space-between;
}
.edit-icon{
	width: 146upx;
	height: 32upx;
	line-height: 32upx;
	font-size: 28upx;
	border: 2upx solid #E5E5E5;
	color: #E5E5E5;
	text-align: center;
}
.instru-info{
	margin-top: 30upx;
	padding: 0 10upx;
	display: flex;
	flex-wrap: wrap; 
}
.instru-item{
	background:rgba(255,255,255,.75);
	border: 2upx solid #E5E5E5;
	padding: 10upx 32upx 10upx 32upx;
	border-radius: 6upx;
	white-space:normal;
	word-break:break-all;
	word-wrap:break-word;
	margin: 0 20upx 20upx 20upx;
	font-size: 28upx;
	color: #333333;
}
.instru-textarea{
	width: 670upx;
	font-size: 28upx;
	max-height: 140upx;
	margin-top: 20upx;
	color: #333333;
}
</style>
