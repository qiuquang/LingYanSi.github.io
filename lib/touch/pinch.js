
// 图片缩放
/*
    $ele : 事件监听元素，用来监听手势
    $dom : transform元素
*/
function Pinch($ele, $dom = $ele, moveCB, endCB) {
    // 初始矩阵
    var INIT
    var init = INIT = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    Pinch.setMatrix($dom, init)
    // 设定transform-origin为左上角
    $dom.style.cssText += ';transform-origin: 0 0 0;'

    // 状态存储
    let state = {
        // 存储元素的初始状态：坐标、宽高
        dimension : {
            width: window.innerWidth,
            height: window.innerHeight
        },
        origin : $dom.getBoundingClientRect(),
        speed: {
            x: 0,
            y: 0,
            time: 0,
        },
        // 上一个位置
        prev: {
            x: 0,
            y: 0,
            x1: 0,
            y1: 0
        },
        // 当前位置
        current: {
            x: 0,
            y: 0,
            x1: 0,
            y1: 0
        },
        // 当screen resize后，需要重置orign dimension数据
        setOrigin(){
            var dimension = {
                width: window.innerWidth,
                height: window.innerHeight
            }

            state.origin.left += (dimension.width - state.dimension.width)/2
            state.origin.top += (dimension.height - state.dimension.height)/2

            state.dimension = dimension
        },
        // 获取两点间距离
        getLen(prev){
            return Math.pow(prev.x - prev.x1, 2) +  Math.pow(prev.y - prev.y1, 2)
        },
        // 获取缩放比例
        getScale(){
            var len1 = this.getLen(state.prev)
            var len2 = this.getLen(state.current)

            return Math.pow(len2/len1, 1/2)
        },
        // 获取缩放后矩阵
        scale(SCALE, matrix){
            var m = [
                SCALE, 0, 0, 0,
                0, SCALE, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]
            // 计算位移，然后在弄回来
            var current = state.current
            // var prev = state.prev
            // 在这里，我们设置transform-origin: 0 0 0;然后所有的计算以图片的左上角为基准，这样方便计算位置变换后的位移
            // var rect = $ele.getBoundingClientRect()
            // var fuck = {
            //     x: (current.x + current.x1)/2 - rect.left,
            //     y: (current.y + current.y1)/2 - rect.top
            // }

            // 显然我们可以直接获取元素左上角相对原点坐标坐标，如此计算性能更高，不过要注意的是，必须在图片加载完再执行Pinch方法
            var fuck = {
                x: (current.x + current.x1)/2 - (state.origin.left + matrix[12]),
                y: (current.y + current.y1)/2 - (state.origin.top + matrix[13])
            }

            // 计算位移
            var fu = {
                x: - fuck.x * (SCALE - 1),
                y: - fuck.y * (SCALE - 1)
            }

            // 计算缩放后矩阵
            matrix = Pinch.matrix(matrix, m)
            var S = matrix[0]
            var m = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                fu.x/S, fu.y/S, 0, 1,
            ]

            matrix = Pinch.matrix(matrix, m)

            return matrix
        },
        // touchmove时把渲染任务假如队列，等到requestAnimationFrame时候，合并任务，只渲染一次
        queue: [],
        // 执行requestAnimationFrame中的任务
        render(){
            var queue = this.queue
            if(queue.length) {
                queue[queue.length - 1]()
                queue.splice(0, queue.length)
            }
        },
        // 有效触摸点， 是否在滑动中
        num: 0,
        moving: false,
        transitioning : false,
        transitionend(event){
            event && event.stopPropagation()
            // 移除transition
            $dom.style.cssText += `;transition: none;`
            state.transitioning = false
        },
        // 边界校验
        checkBorder(SCALE, TX, TY){
            const data = state.getOverflow(SCALE, TX, TY)
            TX = data.TX
            TY = data.TY

            return {TX, TY}
        },
        // 获取溢出量
        getOverflow(SCALE, TX, TY){
            var OF_X = 0
            var OF_Y = OF_X

            // 边界校验
            var d_width = state.dimension.width
            var d_height = state.dimension.height
            var {width, height, top, left} = state.origin
            // max translateX
            var MAX_TX = width*SCALE - d_width > 0 ? -left : -width*(SCALE - 1)/2
            // min translateX
            var MIN_TX = width*SCALE - d_width > 0 ? -width*(SCALE - 1) +left : -width*(SCALE - 1)/2
            // max translateY
            var MAX_TY =  height*SCALE - d_height > 0 ? -top : -height*(SCALE - 1)/2
            // min translateY
            var MIN_TY =  height*SCALE - d_height > 0 ? -height*(SCALE - 1) + top : -height*(SCALE - 1)/2

            if (TX > MAX_TX) OF_X = TX - MAX_TX
            if (TX < MIN_TX) OF_X = TX - MIN_TX

            if (TY > MAX_TY) OF_Y = TY - MAX_TY
            if (TY < MIN_TY) OF_Y = TY - MIN_TY

            TX = Math.min(TX, MAX_TX)
            TX = Math.max(TX, MIN_TX)

            TY = Math.min(TY, MAX_TY)
            TY = Math.max(TY, MIN_TY)

            return {
                OF_X,
                OF_Y,
                TX,
                TY,
                MAX_TX,
                MIN_TX,
                MAX_TY,
                MIN_TY,
            }
        }
    }

    // 滑动开始
    function touchstart(event){
        event.preventDefault()

        if(state.transitioning) return

        var touches = event.touches
        var touch1 = touches[0]
        var touch2 = touches[1] || {}

        // 确保没transition
        state.transitionend()

        if(!state.moving || state.num < 2){
            state.num = touches.length
            state.current = state.prev = {
                x: touch1.clientX,
                y: touch1.clientY,
                x1: touch2.clientX,
                y1: touch2.clientY
            }
            // 缓存时间
            state.speed.time = new Date().getTime()
        }
    }

    // 滑动中
    function touchmove(event){
        event.preventDefault()
        event.stopPropagation()
        if(state.transitioning) return

        state.moving = true
        var touches = event.touches
        // var [touch1, touch2] = touches
        var touch1 = touches[0]
        var touch2 = touches[1]

        state.queue.push( () => {
            if(state.num == 2 && touches.length==2) {
                state.current =  {
                    x: touch1.clientX,
                    y: touch1.clientY,
                    x1: touch2.clientX,
                    y1: touch2.clientY
                }
                // 双指触摸
                var SCALE = state.getScale()
                // x,y轴缩放

                init = state.scale(SCALE, init)

                // 保存当前信息，用于下次计算缩放比例
                state.prev = state.current

                Pinch.setMatrix($dom, init)

            } else if(state.num == 1 && touches.length == 1) {
                state.current =  {
                    x: touch1.clientX,
                    y: touch1.clientY
                }

                var translateX = state.current.x - state.prev.x
                var translateY = state.current.y - state.prev.y

                // if(Math.abs(translateX) > 14 || Math.abs(translateY) > 14) return
                // 单只触摸
                var SCALE = init[0]
                // x,y轴位移
                var m = [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    translateX/SCALE, translateY/SCALE, 0, 1,
                ]
                // 得到位移后矩阵
                init = Pinch.matrix(init, m)

                // 在这里可以对位移做处理
                const {OF_X, OF_Y, TX, TY} = state.getOverflow(init[0], init[12], init[13])
                window.$log.textContent = `${OF_X} ${OF_Y}`

                if(OF_X != 0) moveCB && moveCB(OF_X, OF_Y, state.dimension)

                // init[12] = TX
                init[13] = TY

                // 保存当前信息
                state.prev = state.current

                Pinch.setMatrix($dom, init)

                // x,y方向，滑动速度
                var speed = state.speed
                var time = new Date().getTime()
                speed.x = translateX/(time - speed.time)
                speed.y = translateY/(time - speed.time)
                speed.time = time
            }

        })
        requestAnimationFrame(function(){
            state.render()
        })
    }

    // 滑动结束
    function touchend(event){
        event.preventDefault()
        if(state.transitioning) return
        // 结束滑动任务
        state.queue.push(()=>{
            if(state.moving){

                // 如果缩放比例小于1，就恢复原状
                var SCALE = init[0]
                if(SCALE <= 1 && state.num == 2){
                    init = state.scale(1/SCALE, init)
                }

                // 缓存当前缩放比例，位移
                SCALE = init[0]
                var TX_CACHE = init[12]
                var TY_CACHE = init[13]

                // 检测是否溢出
                var {OF_X, OF_Y} = state.getOverflow(SCALE, init[12], init[13])

                // 如果溢出，就回掉
                if(endCB && OF_X != 0 && state.num == 1){
                    state.moving = state.num = 0
                    var {OF_X, OF_Y, MAX_TX ,MIN_TX, TX, TY} = state.getOverflow(SCALE, init[12], init[13])

                    // 保证TX不溢出，而是让其父元素溢出
                    init[12] = OF_X > 0 ? MAX_TX : MIN_TX
                    init[13] = TY
                    Pinch.setMatrix($dom, init)
                    endCB(OF_X, OF_Y, state.dimension)

                    return
                }

                // 没有溢出的话，就是内部的一些行为
                // 根据滑动速度，做一个缓冲
                if(state.num == 1){
                    // 速度系数
                    const K = 200
                    var speed = state.speed
                    init[12] += speed.x * K
                    init[13] += speed.y * K

                    // 重置掉
                    state.speed = {
                        x: 0,
                        y: 0,
                        time: 0
                    }
                }

                //

                // 边界校验，返回TX, TY [x轴位移， y轴位移]
                var {OF_X, OF_Y, MIN_TX, TX, TY} = state.getOverflow(SCALE, init[12], init[13])

                state.num == Math.max(--state.num, 0)

                // 如果
                if(TX != TX_CACHE || TY != TY_CACHE){
                    state.moving = false
                    state.num = 0
                    state.transitioning = true

                    init[12] = TX
                    init[13] = TY

                    init = init.map(item => {
                        // 避免过小值的出现 eg: 2e-14无限接近0，但在toString的时候有问题
                        return item==0 ? item : +item.toFixed(10)
                    })

                    Pinch.setMatrix($dom, init, true)
                } else {
                    state.moving = !!state.num
                }


            }
        })
        requestAnimationFrame(()=>{
            state && state.render()
        })

    }

    $ele.addEventListener('touchstart', touchstart)
    $ele.addEventListener('touchmove', touchmove)
    $ele.addEventListener('touchend', touchend)
    $ele.addEventListener('touchcancel', touchend)

    // resize时，修改基础数据
    window.addEventListener('resize', state.setOrigin)
    $dom.addEventListener('transitionend', state.transitionend)

    this.destory = function(){
        $ele.removeEventListener('touchstart', touchstart)
        $ele.removeEventListener('touchmove', touchmove)
        $ele.removeEventListener('touchend', touchend)
        $ele.removeEventListener('touchcancel', touchend)

        $dom.removeEventListener('transitionend', state.transitionend)
        window.removeEventListener('resize', state.setOrigin)

        state = null
        init = null
    }

    // 切换状态
    this.toggle = function(){
        if( init[0] !== 1 || init[12] != 0 || init[13]!=0 ){
            init = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        } else {
            // 放大两倍
            var SCALE = 2
            var translateX = - (SCALE-1)*state.origin.width/2
            var translateY = - (SCALE-1)*state.origin.height/2
            init = [
                SCALE, 0, 0, 0,
                0, SCALE, 0, 0,
                0, 0, 1, 0,
                translateX, translateY, 0, 1
            ]
        }
        Pinch.setMatrix($dom, init, true)
    }
}

// 矩阵连续变换
Pinch.matrix = function(){
    // 反转数组
    return [].slice.call(arguments).reverse().reduce(function(prev, current){
        return Pinch.matrixOnce(prev, current)
    })
}

// 正方形矩阵计算
Pinch.matrixOnce = function(x, y) {
    var xx = Math.sqrt(x.length)
    var yy = Math.sqrt(y.length)

    var m = []
    for (var i = 0; i < xx; i++) {

        for (var j = 0; j < xx; j++) {
            var ele = 0
            for (var z = 0; z < xx; z++) {
                ele += x[i*xx + z] * y[j + z*xx]
            }
            m.push(ele)
        }
    }

    return m
}

// 渲染
/*
    $ele: 目标元素
    matrix: 4x4矩阵
    animation: 是否执行动画
    ANIMATION_TIME: 动画时长
*/
Pinch.setMatrix = function ($ele, matrix, animation, ANIMATION_TIME = .3){
    if (!$ele) return
    var str =';transform: matrix3d(' + matrix.join(',') + ');'

    if(!animation) {
        $ele.style.cssText += str
    } else {
        $ele.style.cssText += `;transition: transform ${ANIMATION_TIME}s;`
        $ele.clientHeight
        $ele.style.cssText += str
    }
}

// z轴旋转
// var w = [
//     Math.cos(-Math.PI/4), Math.sin(-Math.PI/4), 0, 0,
//     -Math.sin(-Math.PI/4), Math.cos(-Math.PI/4), 0, 0,
//     0, 0, 1, 0,
//     0, 0, 0, 1
//     ]

// export default Pinch


// export default Pinch