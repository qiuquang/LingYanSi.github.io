ng-app //定义一个angular应用程序，一个html中，可以含有多个ng-app
ng-init 用来初始化数据
ng-model 
	ng-model="name" //负责提供数据，和ng-bind绑定在一起，ng-bind的数据会跟随ng-model的数据变化【其实现方式就是短时间、高频率的监听数据变化】
ng-bind
	ng-bind="name" //负责展现数据
ng-repeat
	//会重复展现一个HTML元素，很明显就是为json数据提供的啊，应用在类似【评论】
ng-controller //定义应用程序控制器
eg:
	<div ng-app="google" ng-init="comments=['哈哈哈','你大爷','bitch']" ng-controller="woShi">
		<input type="text" ng-model="name">
		<p ng-bind="name"></p>
		<p>{{name}}</p> //也可以使用双大括号{{}}的形式来数据绑定
		<li ng-repeat="x in comments">{{x}}</li>
		<p>{{firstName+''+secName}}</p>
	</div>
	<script type="text/javascript">
		function woShi($scope){
			$scope.firstName = "紫";
			$scop.secName = function(){
				var x = $scope.firstName ;
				return x+'日照香炉'
			}
		}
	</script>
用js操作