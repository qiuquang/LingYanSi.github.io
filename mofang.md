## 运营系统构想
运营系统是为了快速搭建出一些页面，或者说经过模块化抽象后，可以快速的根据模块来搭建出页面

模块分为哪些内容？
---js
---css/scss
---schema // 配置文件

关于模块有几个问题
1. 使用传统的zepto还是使用react/vue之类的框架
2. 如果使用现代的框架，如何使用？

现代框架
1. schema当做props被传入
2. 模块库肯定很大，因此会加入搜索功能，而模块也肯定是以下载的方式被加入
3. 每个模块都是通过render的方式被渲染，而不是通过一个统一的App模式，不过应该也有其他方式
4. 每个模块都有唯一的ID，在本地构建的时候，会生成一个div#id
5. 要有一个全局的生命周期管理

---- 代码保存，代码成模块文件
---- 根据页面ID获取到了所有依赖的模块，并根据模块顺序将所有js文件拼接成一个文件，这是不是就够了呢？