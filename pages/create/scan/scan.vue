<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	let _statusbarHeight = plus.navigator.getStatusbarHeight(); // 获取系统状态栏高度
	// #endif
	var barcode = null;
	export default {
		data() {
			return {
				name: '', //要在扫码界面自定义的内容
				flash: false, //是否打开摄像头
				type: ''
	
			};
		},
		onLoad(d) {
			var n = d.text;
			this.type = d.type;
			if (n) {
				this.name = n;
			}
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			// #ifdef APP-PLUS
			//plus.navigator.setFullscreen(true); //全屏
			var currentWebview = page.$getAppWebview();
			this.createBarcode(currentWebview); //创建二维码窗口
			this.createView(currentWebview); //创建操作按钮及tips界面
			// #endif
		},
		computed:{
			i18n() {  
				return this.$i18nMsg()  
			}
		},
		methods: {
			// 扫码成功回调
			onmarked(type, result) {
				var text = '未知: ';
				switch (type) {
					case plus.barcode.QR:
						text = 'QR: ';
						break;
					case plus.barcode.EAN13:
						text = 'EAN13: ';
						break;
					case plus.barcode.EAN8:
						text = 'EAN8: ';
						break;
					case plus.barcode.AZTEC:
						text = 'AZTEC: ';
						break;
					case plus.barcode.DATAMATRIX:
						text = 'DATAMATRIX: ';
						break;
					case plus.barcode.UPCA:
						text = 'UPCA: ';
						break;
					case plus.barcode.UPCE:
						text = 'UPCE: ';
						break;
					case plus.barcode.CODABAR:
						text = 'CODABAR: ';
						break;
					case plus.barcode.CODE39:
						text = 'CODE39: ';
						break;
					case plus.barcode.CODE128:
						text = 'CODE128: ';
						break;
					/* case plus.barcode.ITF:
						text = 'ITF: ';
						break;
					case plus.barcode.MAXICODE:
						text = 'MAXICODE: ';
						break;
					case plus.barcode.PDF417:
						text = 'PDF417: ';
						break;
					case plus.barcode.RSS14:
						text = 'RSS14: ';
						break;
					case plus.barcode.RSSEXPANDED:
						text = 'RSSEXPANDED: ';
						break; */
					
				}
				plus.navigator.setFullscreen(false);
				uni.navigateBack({
					delta: 1
				});
				this.$eventHub.$emit(this.type, {
					result: result
				});
				barcode.close();
			},
			// 创建二维码窗口
			createBarcode(currentWebview) {
				barcode = plus.barcode.create('barcode', [plus.barcode.QR,plus.barcode.EAN13,plus.barcode.EAN8,plus.barcode.CODABAR,plus.barcode.DATAMATRIX,plus.barcode.AZTEC,plus.barcode.CODE39,plus.barcode.CODE128,plus.barcode.UPCA,plus.barcode.UPCE], {
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					scanbarColor: '#1DA7FF',
					position: 'static',
					frameColor: '#1DA7FF'
				});
				barcode.onmarked = this.onmarked;
				barcode.setFlash(this.flash);
				currentWebview.append(barcode);
				barcode.start();
			},
			// 创建操作按钮及tips
			createView(currentWebview) {
				// 创建返回原生按钮
				var backVew = new plus.nativeObj.View('backVew', {
						top: _statusbarHeight,
						left: '0px',
						height: '40px',
						width: '100%'
					},
					[{
						tag: 'img',
						id: 'backBar',
						src: 'static/backBar.png',
						position: {
							top: '2px',
							left: '3px',
							width: '35px',
							height: '35px'
						}
					}]);
				// 创建打开手电筒的按钮
				var scanBarVew = new plus.nativeObj.View('scanBarVew', {
						top: '60%',
						left: '40%',
						height: '10%',
						width: '20%'
	
					},
					[{
							tag: 'img',
							id: 'scanBar',
							src: 'static/scanBar.png',
							position: {
								width: '28%',
								left: '36%',
								height: '30%'
							}
						},
						{
							tag: 'font',
							id: 'font',
							text: this.i18n.index.light,
							textStyles: {
								size: '10px',
								color: '#ffffff'
							},
							position: {
								width: '80%',
								left: '10%'
							}
						}
					]);
				// 创建展示类内容组件
				var content = new plus.nativeObj.View('content', {
						top:_statusbarHeight,
						left: '0px',
						height: '100%',
						width: '100%'
	
					},
					[{
							tag: 'font',
							id: 'scanTitle',
							text: this.i18n.index.scan,
							textStyles: {
								size: '18px',
								color: '#ffffff'
							},
							position: {
								top: '0px',
								left: '0px',
								width: '100%',
								height: '40px'
							}
						},
						{
							tag: 'font',
							id: 'scanTips',
							text: this.name,
							textStyles: {
								size: '14px',
								color: '#ffffff',
								whiteSpace: 'normal'
							},
							position: {
								top: '90px',
								left: '10%',
								width: '80%',
								height: 'wrap_content'
	
							}
						}
	
					]);
				backVew.interceptTouchEvent(true);
				scanBarVew.interceptTouchEvent(true);
				currentWebview.append(content);
				currentWebview.append(scanBarVew);
				currentWebview.append(backVew);
				backVew.addEventListener("click", function(e) { //返回按钮
					uni.navigateBack({
						delta: 1
					});
					barcode.close();
					plus.navigator.setFullscreen(false);
	
				}, false);
				var temp = this;
				scanBarVew.addEventListener("click", function(e) { //点亮手电筒
					temp.flash = !temp.flash;
					if (temp.flash) {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/yellow-scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: temp.i18n.index.light,
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						]);
					} else {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: temp.i18n.index.light,
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						])
					}
					if (barcode) {
						barcode.setFlash(temp.flash);
					}
				}, false)
	
			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			// 返回时退出全屏
			barcode.close();
			plus.navigator.setFullscreen(false);
			// #endif
		},
		onUnload() {
			plus.navigator.setFullscreen(false);
		}
	
	
	};
</script>

<style>

</style>
