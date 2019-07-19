<template>
  <scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x :scroll-left="scrollLeft">
    <div v-if="!textFlex">
      <div class="wuc-tab-item"  v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
		<div class="selectClass">
			<span :class="[index === tabCur ?' cur':'']">{{i18n.index[item.name]}}</span>
		</div>
       
      </div>
    </div>

    <div class="flex text-center" v-if="textFlex">
      <div class="wuc-tab-item flex-sub" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
       <div class="selectClass">
			<span :class="[index === tabCur ?' cur':'']">{{i18n.index[item.name]}}</span>
       </div>
      </div>
    </div>
  </scroll-view>
</template>
<script>
export default {
    name: 'wuc-tab',
    data() {
        return {};
    },
    props: {
        tabList: {
            type: Array,
            default() {
                return [];
            }
        },
        tabCur: {
            type: Number,
            default() {
                return 0;
            }
        },
        tabClass: {
            type: String,
            default() {
                return '';
            }
        },
        tabStyle: {
            type: String,
            default() {
                return '';
            }
        },
        textFlex: {
            type: Boolean,
            default() {
                return false;
            }
        },
        selectClass: {
            type: String,
            default() {
                return 'text-blue';
            }
        }
    },
    methods: {
        tabSelect(index, e) {
            if (this.currentTab === index) return false;
            this.$emit('update:tabCur', index);
            this.$emit('change', index);
        }
    },
    computed: {
        scrollLeft() {
            return (this.tabCur - 1) * 60;
        },
		i18n() {  
		    return this.$i18nMsg()  
		}
    }
};
</script>
<style>
div,
scroll-view,
swiper {
	box-sizing: border-box;
}
.wuc-tab {
    white-space: nowrap;
}
.wuc-tab-item {
    height: 90upx;
    display: inline-block;
    line-height: 55upx;
    margin: 0 10upx;
    padding: 20upx 50upx;
	color: #333333;
}
.cur {
    border-bottom: 4px solid #F5C68D;
}

.wuc-tab.fixed {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 1024;
	box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.flex {
    display: flex;
}
.text-center {
	font-size: 32upx;
    text-align: center;
}
.flex-sub {
    flex: 1;
}
.text-blue{
  color:#0081ff;
}
.text-white{
  color:#ffffff;
}
.bg-white{
    background-color: #F7F7F7;
}
.bg-blue{
    background-color: #0081ff;
}
.text-orange{
  color: #333333;
}

.text-xl {
	font-size: 32upx;
}
</style>
