<template>
	<view id="neworder">
		<view v-show="loadingShow==false">
			<!-- <uni-head :title="i18n.index.SOOrderInformation" @click-back="back"></uni-head> -->
			<view v-show="listShow">
			<view class="order-item">
				<view class="order-i"> 
					<view class="order-name">{{SOOrderInfo.refOrderNo ? SOOrderInfo.refOrderNo :'No OrderNo yet' }}</view>
					<view class="order-time">{{SOOrderInfo.createdDtLoc}}</view>
				</view>
				<view  class="order-n">Store-Out</view>
				<!-- <view  class="order-n">Store-Out to <text>HK Consignee</text></view> -->
				<view class="order-n">
					<view class="order-username" v-if="SOOrderInfo.shipping['consigneeContactName']">{{SOOrderInfo.shipping['consigneeContactName']}}</view>
					<view v-if="SOOrderInfo.shipping['consigneePhoneNo']">{{SOOrderInfo.shipping['consigneePhoneNo']}}</view>
				</view>
				<view class="order-b">
					<view class="order-g g-color" v-if="SOOrderInfo.status=='Q'">
						{{i18n.index['SO_Q']}}
					</view>
					<view class="order-g n-color" v-else-if="SOOrderInfo.status=='N'">
						{{i18n.index[SOOrderInfo.status]}}
					</view>
					<view class="order-g l-color" v-else-if="SOOrderInfo.status=='C'">
						{{i18n.index['SO_C']}}
					</view>
					<view class="order-g d-color" v-else-if="SOOrderInfo.status=='DDL_DL1'">
						{{i18n.index[SOOrderInfo.status]}}
					</view>
					<view class="order-g p-color" v-else>
						{{i18n.index[SOOrderInfo.status]}}
					</view>
				</view>
			</view>
			<view class="tab-container">
				<wuc-tab :tab-list="tabList" :textFlex="true" :tabCur.sync="TabCur" tab-class="text-center text-black bg-white" select-class="text-orange"></wuc-tab>
				<!-- <view class="tab">
					<view @tap="tab=1" class="pos">{{i18n.index.Milestone}}<view :class="tab==1?'bg-tab':''"></view></view>
					<view @tap="tab=2" class="pos">{{i18n.index.OrderDetails}}<view :class="tab==2?'bg-tab':''"></view></view>
				</view> -->
			</view>
			<view v-show="TabCur==0">
				<view v-for="(item,index) in mileList" :key="index" v-show="!loadingShow" style="padding-bottom: 20upx;">
					<!-- 每一组订单 -->
					<view class="milestone">
						<view class="orderInfo">
							<view class="orderCouier">
								<text>{{SOOrderInfo.shipping['carrierService'] ? SOOrderInfo.shipping['carrierService'] :'No courier yet'}}</text>
								<text class="paio">{{index+1}}/{{mileList.length}}</text>
							</view>
							<view class="orderNumber">{{item.number?item.number:'No courier bill number yet'}}</view>
						</view>
						<view class="orderItem">
							<view v-if="item.milestones">
								<view v-for="(i,k) in item.milestones" :key="k" >
									<view v-if="k!=item.milestones.length-1">
										<view class="item-miles color-new" v-if='k==0'>
											<view class="left-mile">
												<view class="date">{{i.date}}</view>
												<view class="time">{{i.time}}</view>
											</view>
											<view class="center-mile">
												<view class="line-circle">
													<image v-if="i.status=='DL1'||i.status=='DDL'" src="../../static/order/A0232_DL1_DDL_ea8c1b_16px_3x.png" class="mile-icon"></image> 
													<image v-else-if="i.status=='OUW'" src="../../static/order/A0231_OUW_ea8c1b_16px_3x.png" class="mile-icon"></image>
													<view v-else class="circle-new"></view>
												</view>
											</view>
											<view class="right-mile">
												<view class="name">{{i18n.index[i.status]?i18n.index[i.status]:i.status}} {{i18n.index[i.description]?i18n.index[i.description]:i.description}}</view>
												<view class="des">{{i.actionPlace ? i.actionPlace :' '}} {{i.otherInfo ?i.otherInfo :' '}}
													<text v-if="i.datasource=='Tracking Website'||i.datasource=='Excel Template'||i.datasource=='AFSA2'"> </text>
													<text class="source" v-else>Source: 3rd party system</text>
												</view>
											</view>
										</view>
										<view class="item-miles" v-if="k!=0" v-show="item.moreShow">
											<view class="left-mile">
												<view class="date">{{i.date}}</view>
												<view class="time">{{i.time}}</view>
											</view>
											<view class="center-mile">
												<view class="line-circle">
													<image v-if="i.status=='DL1'||i.status=='DDL'" src="../../static/order/A0242_DL1_DDL_b6b6b6_16px_3x.png" class="mile-icon"></image> 
													<image v-else-if="i.status=='OUW'" src="../../static/order/A0241_OUW_b6b6b6_16px_3x.png" class="mile-icon"></image>
													<view v-else class="circle"></view>
												</view>
											</view>
											<view class="right-mile">
												<view class="name">{{i18n.index[i.status]?i18n.index[i.status]:i.status}} {{i18n.index[i.description]?i18n.index[i.description]:i.description}}</view>
												<view class="des">{{i.actionPlace ? i.actionPlace :' '}} {{i.otherInfo ?i.otherInfo :' '}}
													<text v-if="i.datasource=='Tracking Website'||i.datasource=='Excel Template'||i.datasource=='AFSA2'"> </text>
													<text class="source" v-else>Source: 3rd party system</text>
												</view>
											</view>
										</view>
									</view>
									<view v-if="k==item.milestones.length-1">
										<view class="item-miles color-new" v-if='k==0'>
											<view class="left-mile">
												<view class="date">{{i.date}}</view>
												<view class="time">{{i.time}}</view>
											</view>
											<view class="center-miles">
												<view class="line-circle">
													<image v-if="i.status=='DL1'||i.status=='DDL'" src="../../static/order/A0232_DL1_DDL_ea8c1b_16px_3x.png" class="mile-icon"></image> 
													<image v-else-if="i.status=='OUW'" src="../../static/order/A0231_OUW_ea8c1b_16px_3x.png" class="mile-icon"></image>
													<view v-else class="circle-new"></view>
												</view>
											</view>
											<view class="right-mile">
												<view class="name">{{i18n.index[i.status]?i18n.index[i.status]:i.status}} {{i18n.index[i.description]?i18n.index[i.description]:i.description}}</view>
												<view class="des">{{i.actionPlace ? i.actionPlace :' '}} {{i.otherInfo ?i.otherInfo :' '}}
													<text v-if="i.datasource=='Tracking Website'||i.datasource=='Excel Template'||i.datasource=='AFSA2'"> </text>
													<text class="source" v-else>Source: 3rd party system</text>
												</view>
											</view>
										</view>
										<view class="item-miles" v-if="k!=0"  v-show="item.moreShow">
											<view class="left-mile">
												<view class="date">{{i.date}}</view>
												<view class="time">{{i.time}}</view>
											</view>
											<view class="center-miles">
												<view class="line-circle">
													<image v-if="i.status=='DL1'||i.status=='DDL'" src="../../static/order/A0242_DL1_DDL_b6b6b6_16px_3x.png" class="mile-icon"></image> 
													<image v-else-if="i.status=='OUW'" src="../../static/order/A0241_OUW_b6b6b6_16px_3x.png" class="mile-icon"></image>
													<view v-else class="circle"></view>
												</view>
											</view>
											<view class="right-mile">
												<view class="name">{{i18n.index[i.status]?i18n.index[i.status]:i.status}} {{i18n.index[i.description]?i18n.index[i.description]:i.description}}</view>
												<view class="des">{{i.actionPlace ? i.actionPlace :' '}} {{i.otherInfo ?i.otherInfo :' '}}
													<text v-if="i.datasource=='Tracking Website'||i.datasource=='Excel Template'||i.datasource=='AFSA2'"> </text>
													<text class="source" v-else>Source: 3rd party system</text>
												</view>
											</view>
										</view>
									</view>
									
								</view>
							</view>
							<view class="noyet" v-else>
								{{i18n.index.Nomilestone}}
							</view>
							<view class="moreCollapse" v-show="showIcon">
								<image :src="item.moreShow?'../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'" class="moreIcon" @tap="moreClick(index)"></image>
							</view>
						</view>
						
					</view>
				</view>
				<view v-show="emptyShow">
					<view class="no-container">
						<image src="../../static/order/pic_empty_page_140px_3x.png" class="no-img"></image>
					</view>
					<view class="text-con">
						<p>{{i18n.index.Nomilestone}}</p>
					</view>
				</view>
			</view>
				<view class="so-order-details" v-show="TabCur==1">
					<view style="padding-bottom: 20upx;">
					<view class="info" v-if="SOOrderInfo.shipping.carrierService=='Self pickup'|| SOOrderInfo.shipping.carrierService=='self pickup'">
						<view class="order-info-title">
							<image src="../../static/order/A0206_address_16px_3x.png" class="title-icon"></image>
							{{i18n.index.SelfPickupAddress}}
						</view>
						<view class="self-address">
							<text>{{i18n.index.address1}}</text>
							<view>{{i18n.index.address2}}</view>
							<text>{{i18n.index.address3}}</text>
						</view>
					</view>
					<view class="info" v-if="SOOrderInfo.partSOs!=undefined && SOOrderInfo.partSOs.length!=0">
						<view class="order-info-title">
							<image src="../../static/order/A0202_sku_info_16px_3x.png" class="title-icon"></image>
							{{i18n.index.SKUInformation}}
						</view>
						<view v-for="(item,index) in orderPartsList" :key="index">
							<view class="orderitem-info" v-if="index!=orderPartsList.length-1">
								<view class="sku-tiem">
									<view class="sku-n">{{item.partNo}}</view>
									<view class="sku-q">{{item.qty-0}}<text>{{i18n.index[item.qtyUnit]}}</text></view>
								</view>
								<view class="sku-d">{{item.partDesc ?item.partDesc :'-'}}</view>
								<view class="sku-r">{{item.reference1?item.reference1:''}}</view>
							</view>
							<view class="orderitem-infos" v-if="index==orderPartsList.length-1">
								<view class="sku-tiem">
									<view class="sku-n">{{item.partNo}}</view>
									<view class="sku-q">{{item.qty-0}}<text>{{i18n.index[item.qtyUnit]}}</text></view>
								</view>
								<view class="sku-d">{{item.partDesc ?item.partDesc :'-'}}</view>
								<view class="sku-r">{{item.reference1?item.reference1:''}}</view>
							</view>
						</view>
						<view class="more" v-show="SOOrderInfo.partSOs.length > 5">
						<image class="down-icon" @tap="downMore"
						:src="showMore ? '../../static/icon/A0303_up_b6b6b6_16px_3x.png':'../../static/icon/A0304_down_b6b6b6_16px_3x.png'"></image>
						</view>
					</view>
					<view class="info" v-if="SOOrderInfo.shipping['consigneeContactName']||SOOrderInfo.shipping['consigneePhoneNo']||SOOrderInfo.shipping['consigneeAddr1']">
						<view class="order-info-title">
							<image src="../../static/order/A0203_consignee_info_16px_3x.png" class="title-icon"></image>
							{{i18n.index.Consignee}}
						</view>
						<view class="mess" v-if="SOOrderInfo.shipping['consigneeContactName']||SOOrderInfo.shipping['consigneePhoneNo']">
							<view>
								<text class="info-mess">{{SOOrderInfo.shipping['consigneeContactName']}}</text>
								<text class="number">{{SOOrderInfo.shipping['consigneePhoneNo']}}</text>
							</view>
							<view class="address" v-if="SOOrderInfo.shipping['consigneeAddr1']&&SOOrderInfo.shipping.carrierService!=='Self pickup' && SOOrderInfo.shipping.carrierService!=='self pickup'">
								{{SOOrderInfo.shipping['consigneeAddr1']}}
							</view>
						</view>
					</view>
					<view class="info" v-if="SOOrderInfo.shipping.carrierService!=='Self pickup' && SOOrderInfo.shipping.carrierService!=='self pickup'">
						<view class="order-info-title">
							<image src="../../static/order/A0204_courier_16px_3x.png" class="title-icon"></image>
							{{i18n.index.Courier}}
						</view>
						<view class="courier-text">
							<text v-if="SOOrderInfo.shipping['carrierService']">{{SOOrderInfo.shipping['carrierService']}}</text>
							<text v-else style="color: #999999;">Courier Company.</text>
						</view>
						<view class="courier-text">
							<view v-if="SOOrderInfo.shipping['courierBillNo'] ||(SOOrderInfo.pkgs&&SOOrderInfo.pkgs.length)">
								<text v-if="SOOrderInfo.shipping['courierBillNo']">{{SOOrderInfo.shipping['courierBillNo']}}</text>
								<view v-if="SOOrderInfo.pkgs&&SOOrderInfo.pkgs.length">
									<view v-for="(i,index) in SOOrderInfo.pkgs" :key="index">
										<view v-if="SOOrderInfo.pkgs.length==1 && i.courierBillNo==null &&SOOrderInfo.shipping['courierBillNo']==null">
											<text style="color: #999999;">Courier Bill No.</text>
										</view>
										<text v-else>{{i.courierBillNo ? i.courierBillNo :''}}</text>
									</view>
								</view>
							</view>
							<text style="color: #999999;" v-else-if="!SOOrderInfo.shipping['courierBillNo'] || !SOOrderInfo.pkgs">Courier Bill No.</text>
						</view>
						<view class="courier-text" v-if="SOOrderInfo.shipping['deliveryNote']">
							<!-- <text  v-if="i18n.index[SOOrderInfo.shipping['deliveryNote']]!==''">{{i18n.index[SOOrderInfo.shipping['deliveryNote']]}}</text>
							<text v-else>{{SOOrderInfo.shipping['deliveryNote']}}</text> -->
							{{SOOrderInfo.shipping['deliveryNote']}}
						</view>
						
					</view>
					</view>	
				</view>
			</view>
			<!-- 错误提示 -->
			<view v-show="messageShow">
				<view class="no-container">
					<image v-if="errorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
					<image v-else-if="systemerrorShow" src="../../static/order/pic_internet_error_140px_3x.png" class="no-img"></image>
				</view>
				<view class="text-con">
					<view v-if="errorShow">
						<p>{{i18n.index.invenError_one}}</p>
						<p>{{i18n.index.invenError_two}}</p>
					</view>
					<view v-else-if="systemerrorShow">
						<p>{{i18n.index.systemError_one}}</p>
						<p>{{i18n.index.systemError_two}}</p>
					</view>
				</view>
			</view>
		</view>
		
		<uni-loading :showLoad="loadingShow"></uni-loading>
	</view>
</template>

<script>
	import uniHead from '../../components/uni-head.vue'
	import uniLoading from '../../components/uni-loading.vue';
	import WucTab from '../../components/wuc-tab.vue';
	import {mapMutations ,mapState } from 'vuex'; 
	export default {
		components:{
			uniHead,uniLoading,WucTab
		},
		data() {
			return {
				title:'',
				
				tabList: [{ name:'Milestone' }, { name:'OrderDetails'}],
				TabCur: 0,
				emptyShow:false,
				showMore:false,
				showIcon:true,
				loadingShow:true,
				listShow:false,
				messageShow:false,
				errorShow:false,
				systemerrorShow:false,
				SOOrderInfo:{
					shipping:{
						consigneeContactName:'',
						consigneePhoneNo:'',
						consigneeAddr1:'',
						carrierService:'',
						deliveryNote:''
					}
				},
				orderPartsList:[],
				page:1,
				pageSize:5,
				statusDecodeList:[],//存第一个api的所有数据
				codeList:[],//放所需要的code数据
				milestoneList:[],//所有物流信息
				splitList:null,//存放展示milestones
				mileList:[],
				refOrderNo:'',
				backid:''
			};
		},
		computed:{
		    i18n() {  
		        return this.$i18nMsg()  
		    },
			...mapState(['orderSODetails'])
		},
		methods:{
			back(){
				/* uni.navigateBack({delta: 1}); */
				if(this.backid==''){
					uni.navigateBack({delta: 1});
				}else{
					uni.navigateTo({
						url:'../create/store-out-order'
					})
				}
			},
			downMore(){
				let _this=this;
				if(this.showMore==false){
					if(this.SOOrderInfo.partSOs.length==this.orderPartsList.length){
						return
					}else{
						this.orderPartsList=this.SOOrderInfo.partSOs;
					}
					this.showMore=true
				}else{
					this.orderPartsList=[];//归零追加
					this.page=1;//初始情况下
					for(let i=0;i<5;i++){
						this.orderPartsList.push(this.SOOrderInfo.partSOs[i])
					}
					this.showMore=false
				}
				
			},
			moreClick(i){
				 //改变的状态=>
				let obj = this.mileList[i];
				obj.moreShow = !obj.moreShow;
				//动态更改的数据，vue
				this.$set(this.mileList, i, obj);
			},
			
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: this.i18n.index.SOOrderInformation
			})
			this.loadingShow=true;
			let _this=this;
			if(option.refOrderNo){
				this.backid=1;
				
				this.refOrderNo=option.refOrderNo;
				uni.getStorage({
					key:'uerInfo',
					success: (res) => {
						let customer=res.data.customer;
						uni.request({
							url:this.baseUrl+'/soorder/App/queryByCriteria',
							method:'POST',
							header:{"content-type":"application/json"},
							data:{
								"customer":customer,
								"warehouseCode":this.warehouseCode,
								"pageSize":1,
								"page":1,
								//"orderNO":option.refOrderNo
								"refOrderNo":this.refOrderNo
							},
							success: (res) => {
								this.loadingShow=false;
								if(res.data.status==200){
									this.listShow=true;
									let info=res.data.data.soorderList[0];
									let arr=info.createdDtLoc.split(' ');
									let	time=arr[0];
									let obj={
										createdDtLoc:time,
										status:info.status,
										partSOs:info.partSOs,
										refOrderNo:info.refOrderNo,
										shipping:info.shipping,
										pkgs:info.pkgs
									}
									this.SOOrderInfo=obj
									//console.log(this.SOOrderInfo);
									if(this.SOOrderInfo.partSOs.length < 6 ){
										this.orderPartsList=this.SOOrderInfo.partSOs
									}else{
										for(let i=0;i<5;i++){
											this.orderPartsList.push(this.SOOrderInfo.partSOs[i])
										}
									}
								}else{
									this.messageShow=true;
									this.systemerrorShow=true;
									
								}
							},
							fail() {
								this.messageShow=true;
								this.errorShow=true;
							}
						})
					}
				})
				//this.emptyShow=true;
			}else{
				this.listShow=true;
				this.SOOrderInfo=this.orderSODetails;
				this.refOrderNo=this.SOOrderInfo.refOrderNo
				if(this.SOOrderInfo.partSOs.length < 6 ){
					this.orderPartsList=this.SOOrderInfo.partSOs
				}else{
					for(let i=0;i<5;i++){
						this.orderPartsList.push(this.SOOrderInfo.partSOs[i])
					}
				}
			}
			//请求数据拿milestone
			uni.request({
				url:_this.milestoneUrl+'/api/init',
				method:"GET",
				success:(res)=>{
					//console.log(res.data.data.statusDecode);
					this.statusDecodeList=res.data.data.statusDecode;
					this.statusDecodeList.forEach((i)=>{
						let obj={
							code:i.code,
							description:i.description
						}
						this.codeList.push(obj);
					})
					//console.log(this.codeList)
					uni.request({
						url:_this.milestoneUrl+'/api/search/type/numbers',
						method:"GET",
						header:{"content-type":"application/json"},
						data:{
							"type":"orderNo",
							"numbers":this.refOrderNo,
							//"numbers":"17a51653-4441-4a8d-9ebc-e271ab0b33e1",
							//"numbers":"96706-7273-74254216",
							//"numbers":"ee1edebf-3786-4b51-ba77-6d97a87c9eff",
							//"numbers":"01c0133f-2e68-41a3-91f1-3138174f8145",
							"status": "RCS,INW,OOS,BKD,PPK,OUW,DEP,SOF,RCF,CIQ,CCD2,RCV,CEH,CCD,TOL,SSO,DBA,INT,DL1,DDL,UND,RER,RTS,CAN,OTH"
						},
						success:(res)=>{
							
							if(res.data.data){//data有milestone message
							
								//1.仅有milestone
								if(res.data.data[0].milestones){//milestones存在
									//console.log('milestones');
									
									_this.milestoneList.push(...res.data.data[0].milestones);
									//console.log(this.milestoneList)
								} 
								if(res.data.data[0].parNumbers){
									//console.log('parNumbers');
									res.data.data[0].parNumbers.forEach((i)=>{
										if(i.milestones){
											_this.milestoneList.push(...i.milestones)
										}
									})
								}
								if(res.data.data[0].subNumbers){
									//存在pkgs
									let obj={},miles=[];
									//console.log('subNumbers');
									res.data.data[0].subNumbers.forEach((i)=>{
										if(i.number){
											//console.log(this.milestoneList)
											if(i.milestones){
												miles=i.milestones
											}
											obj={
												number:i.number,
												moreShow:false,
												milestones:miles
											}
											//console.log(i.milestones);
											//console.log(_this.milestoneList);
											if(_this.milestoneList){
												obj.milestones.push(..._this.milestoneList)
											}
											obj.milestones.sort(function(a,b){
												return a.actionTimeLoc<b.actionTimeLoc ? 1 :-1;
											})
											//console.log(obj);
										}
										_this.mileList.push(obj);
									})
								}else{
									//不存在pkgs
									_this.milestoneList.sort(function(a,b){
										return a.actionTimeLoc<b.actionTimeLoc ? 1 :-1;
									})
									let obj={
										number:null,
										milestones:_this.milestoneList
									}
									_this.mileList.push(obj);
								}
								//获取所有的物流后，再在codeList中取得对应的description
								_this.mileList.forEach((i)=>{
									i.milestones.forEach((n)=>{
										_this.codeList.forEach((j)=>{
											if(n.status==j.code){
												n.description=j.description
											}
										})
									})
									
								})
								//将日期格式拆分
								_this.mileList.forEach((i)=>{
									i.milestones.forEach((n)=>{
										//console.log(n.actionTimeLoc)
										let date1=n.actionTimeLoc.split(' ')[0];
										let time1=n.actionTimeLoc.split(' ')[1];
										let date=date1.split('-')[1]+'-'+date1.split('-')[2];
										let time=time1.split(':')[0]+':'+time1.split(':')[1];
										n.date=date;
										n.time=time;
									})
								})
								//流程的展开与隐藏
								if(_this.mileList.length==1){
									//console.log('一条');
									_this.mileList[0].moreShow=true
									_this.showIcon=false
								}else{
									//console.log('多条');
								} 
							}else{//data没有milestone message
								this.emptyShow=true;
							}
							this.loadingShow=false;
						},
					})
				}
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
	@import '../../common/order.css';
	@import '../../common/index.css';
	.tab{
		background: #F7F7F7;
		height: 96upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 32upx;
		font-weight: 400;
	}
	.bg-tab{
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%,0);
		width: 140upx;
		height:12upx;
		background:rgba(245,198,141,1);
	}
	.pos{
		position: relative;		
	}
	.uni-swiper .uni-swiper-wrapper{
		overflow: visible;
	}
	.uni-swiper-item{
		overflow: visible;
	}
	.noyet{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200upx;
	} 
	.orderCouier{color: #999999;}
	.source{margin-left: 10upx;}
</style>
