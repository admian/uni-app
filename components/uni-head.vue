<template>
	<view>
		<view class="bg-head">
			<view class="head">			
				<view class="head-left" @tap="backCilck">
					<image src="../../static/icon/A0351_left_ffffff_16px_3x.png" class="btn-icon"  v-show="showBack"></image>
					{{backTitle}}
				</view>
				<view class="head-center">
					<view class="title">
						{{title}}
					</view>
				</view>
				<view class="head-right">
					<image src="../../static/icon/A0355_add_ffffff_16px_3x.png" class="btn-icon" v-show="showAdd" @tap="addClick"></image>
					<image src="../../static/icon/A0360_search_ffffff_16px_3x.png" class="btn-icon" v-show="showSearch" @tap="searchClick"></image>
					<image src="../../static/icon/A0359_export_ffffff_16px_3x.png" class="btn-icon" v-show="showExport" ></image>
					<image src="../../static/icon/A0357_tick_ffffff_16px_3x.png" class="btn-icon" v-show="showDone" @tap="doneClick"></image>				
				</view>
			</view>
		</view>
		<view class="slot"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			title:{
				type:String,
				default:''
			},
			backTitle:{
				type:String,
				default:''
			},
			showBack:{
				type:Boolean,
				default:true
			},
			showExport:{
				type:Boolean,
				default:false
			},
			showSearch:{
				type:Boolean,
				default:false
			},
			searchPage:{
				type:String,
				default:''
			},
			showDone:{
				type:Boolean,
				default:false
			},
			showAdd:{
				type:Boolean,
				default:false
			},
			addUrl:{
				type:String,
				default:''
			}
		},
		methods:{
			backCilck(){
				this.$emit('click-back');
			},
			doneClick(){
				this.$emit('click-done');
			},
			addClick(){
				this.$emit('click-add');
			},
			searchClick(){
				this.$emit('click-search');
			}
		}
	}
</script>

<style>
.bg-head{
	width: 100%;
	background: #EA8C1B;
	padding-top: 70upx;
	font-size: 32upx;
	color: #FFFFFF;
	position: fixed;
	top: 0;
	font-family: Arial;
	z-index: 999;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    box-sizing: border-box;
    -webkit-transition-property: all;
    transition-property: all;
	
}	
.head{
	height: 56upx;/* 70upx */
	width: 100%;
	padding: 0 40upx 15upx 30upx;
	display: flex;
	justify-content:space-between;
}
.head-left,.head-center,.head-right{
	display: flex;
	flex-direction:row;
	align-items:center;
	min-width: 80upx;
}
.head-left{
	
}
.head-center{
	text-align: center;
}
.head-right{
	display: flex;
	justify-content: flex-end;
	height: 54upx;
	opacity: .4;
}
.btn-icon{
	width: 34upx;
	height: 34upx;
	margin: 0 10upx;
}

</style>
