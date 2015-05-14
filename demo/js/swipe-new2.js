
		function lunbo(arg){ //以对象形式传递参数
			var hash = location.hash.slice(1) ;
			var hashIndex = 0 ;
			console.log(hash.indexOf('swipe='))
			if (hash.indexOf('swipe=')>=0)
			{
				var hashIndex = $duoju.strToObj(hash).swipe; //获取swipe对应的键值
				console.log(hashIndex)
				hashIndex= hashIndex?hashIndex:0 ;
			}
			var idname = arg.idname,
				top = arg.top,
				autoPlay = !!arg.autoPlay,
				loop = !!arg.loop,
				dianNav =  !!arg.dianNav,
				callback = arg.callback,
				buttPrev = arg.buttPrev,
				buttNext = arg.buttNext,
				keyEvent = arg.keyEvent;
			console.log(autoPlay,loop,dianNav)
			var $id = $('#'+idname);
			var $item = $('#'+idname+'>.item-wrap>div');
			var idWidth = $id.width(),
				idHeight = $id.height();
			var topMin = -idHeight ,
			    topCurrent = 0 ,
			    topMax = idHeight ,
				leftMin = 0 ,
				leftMax = 0 ,
				leftCurrent = 0 ,
				toLeft = false ,
			    len = $item.length ,
			    timeIn , //自动轮播
			    currentPage = parseInt(hashIndex,10) ;
			if (isNaN(currentPage) || currentPage<0 || currentPage>len-1) currentPage=0 ;
			if (top == 'left') //左右滑动
			{
				toLeft = true ,
				topMin = 0 ,
				topMax = 0 ,
				topCureent = 0 ,
				leftMin = -idWidth ,
				leftMax = idWidth ,
				leftCurrent = 0 ;
			}
			$item.not(':eq('+currentPage+')').css({webkitTransform:'translate3d('+leftMax+'px,'+topMax+'px,0)'}); //设置元素初始位置
			if (dianNav)
			{
				appendDian();
				var $dianItem = $('#'+idname+'>.dian>.dian-item');
				dianMove();
			}
			if (autoPlay) start();
			touchMove(idname);//touch事件
			window.addEventListener('keyup',function(event){ // 按键监听
				if(!keyEvent) return
				var index ;
				if (event.keyCode==40 || event.keyCode==39) index = setPage((currentPage+1) ),toWhere(index,'next');
				else if (event.keyCode==38 || event.keyCode==37)  index = setPage((currentPage-1) ),toWhere(index,'prev');
			});
			function touchMove(idname){ //触摸事件
				var id = document.getElementById(idname);
				var xx,XX,$current,currentDom,$prev,prevDom,$next,nextDom,swipeX,swipeY,cha;

				var $item = [].slice.call($('#'+idname+'>.item-wrap')[0].children);
				
				if(!!navigator.userAgent.toLowerCase().match(/android|phone|pad/g)) // 检测设备类型是不是移动端
				{
					id.addEventListener('touchstart',function(event){
						touchStart(event);
					});
					id.addEventListener('touchmove',function(event){
						touchMove(event);
					});
					id.addEventListener('touchend',function(event){
						touchEnd(event);
					});
				}else{
					id.addEventListener('mousedown',function(event){
						touchStart(event);
					});
					id.addEventListener('mousemove',function(event){
						touchMove(event);
					});
					document.addEventListener('mouseup',function(event){
						touchEnd(event);
					});
				}
				function touchStart(event){
					stop();
					xx = event.targetTouches ? event.targetTouches[0].screenX : event.pageX;
					yy = event.targetTouches ? event.targetTouches[0].screenY : event.pageY;
					XX = xx ;
					YY = yy ;
					cha = 0 ;
					prevDom = $item[currentPage-1]?$item[currentPage-1]:$item[len-1];
					nextDom = $item[currentPage+1]?$item[currentPage+1]:$item[0];
					currentDom = $item[currentPage];

					currentDom.classList.remove('change');
					prevDom.classList.remove('change');
					nextDom.classList.remove('change');

					currentDom.style.webkitTransform = 'translate3d(0,0,0)' ;
					prevDom.style.webkitTransform = 'translate3d('+leftMin+'px,'+topMin+'px,0)' ;
					nextDom.style.webkitTransform = 'translate3d('+leftMin+'px,'+topMax+'px,0)' ;
					
					if(!toLeft)
					{
						$item.forEach(function(ele){
							if(ele==currentDom) currentDom.style.zIndex = '1';
							else if(ele==prevDom) prevDom.style.zIndex = '2';
							else if(ele==nextDom) nextDom.style.zIndex = '2';
							else ele.style.zIndex = '0';
						})
					}

					swipeY = true ;
					swipeX = true ;
				}
				function touchMove(event){
					XX = event.targetTouches ? event.targetTouches[0].screenX : event.pageX;
					YY = event.targetTouches ? event.targetTouches[0].screenY : event.pageY;
					
					if (swipeY && (!swipeX || Math.abs(XX-xx)-Math.abs(YY-yy)<0))
					{
						swipeX = false ;
						if (!toLeft)
						{
							event.stopPropagation();
							event.preventDefault();
							cha = YY-yy ;
							if (cha>=0)
							{
								if (!loop && currentPage==0) return swipeY=false; // 循环模块
								currentDom.style.webkitTransformOrigin = 'center bottom';
								currentDom.style.webkitTransform = 'translate3d(0,0,0) scale3d('+(1-cha/topMax/4)+','+(1-cha/topMax/4)+',1)';
								prevDom.style.webkitTransform = 'translate3d(0,'+(cha+topMin)+'px,0)' ;
								if (len>2) nextDom.style.webkitTransform = 'translate3d(0,'+(topMax)+'px,0)' ;// 避免因为滑动过快引起的bug
							}else{
								if (!loop && currentPage==len-1) return swipeY=false; // 循环模块
								currentDom.style.webkitTransformOrigin = 'center top';
								currentDom.style.webkitTransform = 'translate3d(0,0,0) scale3d('+(1+cha/topMax/4)+','+(1+cha/topMax/4)+',1)';
								nextDom.style.webkitTransform = 'translate3d(0,'+(topMax+cha)+'px,0)' ;
								if (len>2) prevDom.style.webkitTransform = 'translate3d(0,'+(topMax)+'px,0)' ;// 避免因为滑动过快引起的bug
							}
						}
					}
					if(swipeX && (!swipeY || Math.abs(XX-xx)-Math.abs(YY-yy)>=0) ){
						swipeY = false ;
						if (toLeft)
						{
							event.stopPropagation();
							event.preventDefault();
							cha = XX-xx ;
							if (cha>=0)
							{
								if (!loop && currentPage==0) return swipeX=false; // 循环模块
								currentDom.style.webkitTransform = 'translate3d('+( XX-xx)+'px,0,0)';
								prevDom.style.webkitTransform = 'translate3d('+(leftMin+cha)+'px,0,0)';
								if (len>2) nextDom.style.webkitTransform = 'translate3d('+leftMax+'px,0,0)';// 避免因为滑动过快引起的bug
							}else{
								if (!loop && currentPage==len-1) return swipeX=false; // 循环模块
								currentDom.style.webkitTransform = 'translate3d('+cha+'px,0,0)';
								nextDom.style.webkitTransform = 'translate3d('+(leftMax+cha)+'px,0,0)';
								if (len>2) prevDom.style.webkitTransform = 'translate3d('+leftMax+'px,0,0)';// 避免因为滑动过快引起的bug
							}
						}
					}
				}
				function touchEnd(event){
					if(cha == 0)
					{
						swipeY = false ;
						swipeX = false ;
						return ;
					}
					currentDom.classList.add('change');
					prevDom.classList.add('change');
					nextDom.classList.add('change');
					if (!toLeft && swipeY )
					{
						if (cha>0)
						{
							if (cha>50)
							{
								currentDom.style.webkitTransform = 'translate3d(0,0,0) scale3d('+(1-cha/topMax/4*1.4)+','+(1-cha/topMax/4*1.4)+',1)';
								prevDom.style.webkitTransform = 'translate3d(0,0,0)';

								currentPage--;
								currentPage = setPage(currentPage);
							}else{
								currentDom.style.webkitTransform = 'translate3d(0,0,0)';
								prevDom.style.webkitTransform = 'translate3d(0,0,0)';
							}
						}else{
							if (cha<-50)
							{
								currentDom.style.webkitTransform = 'translate3d(0,0,0) scale3d('+(1+cha/topMax/4*1.4)+','+(1+cha/topMax/4*1.4)+',1)';
								nextDom.style.webkitTransform = 'translate3d(0,0,0)';
								currentPage++;
								currentPage = setPage(currentPage);
							}else{
								currentDom.style.webkitTransform = 'translate3d(0,0,0)';
								nextDom.style.webkitTransform = 'translate3d(0,'+(topMax)+'px,0)';
							}
						}
					}
					else if ( toLeft && swipeX)
					{
						if (cha>0)
						{
							if (cha>50)
							{
								currentDom.style.webkitTransform = 'translate3d('+leftMax+'px,0,0)';
								prevDom.style.webkitTransform = 'translate3d(0,0,0)';
								currentPage--;
								currentPage = setPage(currentPage);
							}else{
								currentDom.style.webkitTransform = 'translate3d(0,0,0)';
								prevDom.style.webkitTransform = 'translate3d('+leftMin+'px,0,0)';
							}
						}else{
							if (cha<-50)
							{
								currentDom.style.webkitTransform = 'translate3d('+leftMin+'px,0,0)';
								nextDom.style.webkitTransform = 'translate3d(0,0,0)';
								currentPage++;
								currentPage = setPage(currentPage);
							}else{
								currentDom.style.webkitTransform = 'translate3d(0,0,0)';
								nextDom.style.webkitTransform = 'translate3d('+leftMax+'px,0,0)';
							}
						}
					}
					swipeY = false ;
					swipeX = false ;
					if (autoPlay) start();
					if(dianNav) dianMove();
					if (callback)
					{
						setTimeout(function(){
							callback(currentPage);
						},600)
					}
				}
			}
			function setPage(page){ //设置page
				if (page>len-1){ 
					page=0;
					if(!loop) page=len-1 ;
				}
				else if (page<0){
					page=len-1;
					if(!loop) page=0 ;
				}
				return page ;
			}
			function toWhere(index,dir){ //主要是给左右点击事件使用
				if (index === currentPage) return
				stop();
				$item.removeClass('change');
				if (dir=='next') //下一张
				{
					$item.eq(index).css({webkitTransform:'translate3d('+leftMax+'px,'+topMax+'px,0)'});
					$item.show().addClass('change');
					$item.eq(currentPage).css({webkitTransform:'translate3d('+leftMin+'px,'+topMin+'px,0)'});
				}else if(dir=='prev'){   // 上一张
					$item.eq(index).css({webkitTransform:'translate3d('+leftMin+'px,'+topMin+'px,0)'});
					$item.show().addClass('change');
					$item.eq(currentPage).css({webkitTransform:'translate3d('+leftMax+'px,'+topMax+'px,0)'});
				}
				$item.eq(index).css({webkitTransform:'translate3d(0,0,0)'});
				currentPage = index ;
				dianMove();
			}

			if (buttPrev)
			{
				$('#'+buttPrev).click(function(){
					var index = currentPage-1 ;
					index = setPage(index);
					toWhere(index);
				});
			}
			if (buttNext)
			{
				$('#'+buttNext).click(function(){
					var index = currentPage+1 ;
					index = setPage(index);
					toWhere(index);
				});
			}
			function dianMove(){ //下面小点的运动
				$dianItem.eq(currentPage).addClass('dian-item-current').siblings().removeClass('dian-item-current');
			}
			function appendDian(){ //添加点
				var dian = '';
				for (var i=0;i<len ;i++ )
				{
					dian = dian+'<span class="dian-item"></span>';
				}
				$id.append('<div class="dian">'+dian+'</div>');
			}

			function start(){ //自动轮播
				timeIn=setInterval(move,2000);
			}
			function stop(){ //清除自动轮播
				clearInterval(timeIn);
			}
			function move(){ 
				$item.removeClass('change');
				if (currentPage < len-1)
				{
					$item.eq(currentPage+1).css({webkitTransform:'translate('+leftMax+'px,'+topMax+'px)'}); 
					$item.show().addClass('change');
					$item.eq(currentPage).css({webkitTransform:'translate('+leftMin+'px,'+topMin+'px)'});
					$item.eq(currentPage+1).css({webkitTransform:'translate(0,0)'});
					currentPage++;
				}else{
					$item.eq(0).css({webkitTransform:'translate('+leftMax+'px,'+topMax+'px)'});
					$item.show().addClass('change'); //为什么$item.eq(0).css({top:topMax});$item.addClass('change');前一语句不能正常执行
					$item.eq(currentPage).css({webkitTransform:'translate('+leftMin+'px,'+topMin+'px)'});
					$item.eq(0).css({webkitTransform:'translate(0,0)'});
					currentPage=0;
				}
				dianMove()
			}
		}