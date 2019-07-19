# uni-app
uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可编译到iOS、Android、H5、小程序等多个平台。
**与WEB开发/VUE开发的异同**

​相比web平台，vue在uni-app中使用差异主要是

- 新增：uni-app除了支持Vue实例的生命周期，还支持应用启动（应用生命周期）、页面显示（页面生命周期）。
- 受限：相比web平台，在App端和小程序部分功能受限，如生命周期，事件处理器等。具体[查看](https://uniapp.dcloud.io/use)
- 路由方式，一个是vue router，一个是页面栈。
- 请求方式，一个是封装Axios，一个是调用uni.request()。

**开发过程中问题与解决方案**

- app多语言化

  uni-app社区提供了vue-i18n解决app应用内容的多语言化

  底部tabbar和顶部原生 导航栏的title,提供了api,在对应的页面生命周期onShow()中动态设置。[uni-app在App端动态修改原生导航栏](https://ask.dcloud.net.cn/article/35374)

  如果没有使用原生导航栏，自定义组件可以用i18n插件，但是渲染速度没有原生的快，而且在App端存在UI问题。

- 原生导航栏与自定义导航栏

  最初考虑原生存在局限性，对于导航栏icon及icon点击事件没有自定义的方便省事。但是在真机测试时，在存在input输入框输入时，键盘弹起会将自定义导航栏顶出窗口区域，fixed定位在app端无效。自定义fixed无效暂无解决方法。

  选择原生解决键盘弹起时导航栏会被顶出窗口区域的问题。从而在pages.json中配置导航栏所需属性。关于自定义按钮，如果是icon需要用到IconFont。[buttons](https://uniapp.dcloud.io/collocation/pages?id=app-titlenview-buttons)

- 页面间切换动画

  当发生路由切换的时候，页面会化分为入栈（新页面从右进入）和出栈（从左进入）。

  打开新页面：调用api uni.navigateTo,新页面入栈

  页面返回：调用api uni.navigateback,页面不断出栈，直到目标返回页，通常返回参数为1.

  页面之间传参：[使用uni.navigateBack修改上一个页面值，多页面传参通信解决方案](https://ask.dcloud.net.cn/article/35037)

- 登录时保存用户信息，再次打开App时不需要登录

  - 利用应用生命周期[onLaunch()](https://uniapp.dcloud.io/frame?id=%e5%ba%94%e7%94%a8%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f):当`uni-app` 初始化完成时触发(全局只触发一次)，在初次登录时用uni.setStorage()存储user信息。

    登出时，移除user信息；再次打开时，判断是否存在储存信息。

  - 在启动页完成后，打开login登录之前，加上一个加载页，做为一个中间点。登录成功则进入主页，否则去登录。

  

**框架现存的问题与官方修改计划**

- HBuilderX编译的app，GooglePlay提示：此版本不符合GooglePlay 关于提供64位版本应用的规定

  计划：暂无

  

**框架的优点与缺点**

优点：

- 一套代码，多端运行。
- 代码实现简单，开发快速。
- uniapp开发体验对前端人员十分友好,和微信小程序的开发方式类似。
- 突破了系统对H5调用原生功能的限制，比如使用uniapp结合HTML5plus能调用系统相册图片选择和拍照等。

缺点：

- 兼容性问题，在Android平台上表现较微信小程序和iOS上差。
- 文件命名等受限。
- 官方反馈信息不及时。
