window.wx = window.wx || {}

wx.previewImage = function(URL, urlArr) {
    // 去创建一个区域
    var pI = wx.previewImage
    if (!pI.isLoad) {
        $('head').append(`<style>${pI.STYLE}</style>`)
        $('body').append(wx.previewImage.TEMPLATE)
        pI.isLoad = true
        pI.$ele = $('#wx-previewImage')

        pI.$ele.on('click', '.prev', function() {
            pI.current--
                if (pI.current < 0) {
                    pI.current = urlArr.length - 1
                }
            $ele.find('.img-item').eq(pI.current).addClass('show').siblings().removeClass('show')
            $ele.find('.status').text(`${pI.current+1}/${urlArr.length}`)
        }).on('click', '.next', function() {
            pI.current++
                if (pI.current >= urlArr.length) {
                    pI.current = 0
                }
            $ele.find('.img-item').eq(pI.current).addClass('show').siblings().removeClass('show')
            $ele.find('.status').text(`${pI.current+1}/${urlArr.length}`)
        }).on('mousemove', '.img-list', function(event){
            // console.log(event);
            var cursor = event.pageX/$('body').width() > .5 ? 'url(http://img.t.sinajs.cn/t6/style/images/common/pic_next.cur), pointer' : 'url(http://img.t.sinajs.cn/t6/style/images/common/pic_prev.cur), pointer'
            $(this).css('cursor', cursor)
        }).on('click', '.img-list', function(event){
            // console.log(event);
            event.pageX/$('body').width() > .5 ? pI.$ele.find('.next').click() : pI.$ele.find('.prev').click()
        }).on('click', '.close', function(event){
            // console.log(event);
            $ele.hide()
        })

        $(window).on('keyup', function(event){
            if(!pI.open) return

            var keycode = event.keyCode

            if(keycode == 37){
                $ele.find('.prev').click()
            }else if(keycode == 39){
                $ele.find('.next').click()
            }else if(keycode == 27){
                $ele.hide()
            }
        })
    }

    $ele = pI.$ele
    pI.render(urlArr)
    $ele.show()
    pI.open = true
}

// 元素
wx.previewImage.$ele = null
// 窗口是否打开
wx.previewImage.open = false
// 当前位置
wx.previewImage.current = 0
// 占位元素等是否已经加载过
wx.previewImage.isLoad = false
// 渲染
wx.previewImage.render = function( urlArr){
    var html = urlArr.map(function(url, index) {
        if (url === URL) {
            pI.current = index - 1
        }
        return `<div class="img-item">
            <img src="${url}" alt="" />
        </div>`
    }).join('')

    this.$ele.find('.img-list').html(html)

    this.$ele.find('.next').click()
}

// 样式
wx.previewImage.STYLE = `
    .wx-pI-layer {
        position: fixed; top:0; left:0; width:100%; height: 100%; z-index: 900; background: rgba(0,0,0,.5);
    }

    .wx-pI-main {
        overflow: hidden;
        height: 100%;
    }

    .wx-pI-main button {
        position: absolute;
        top: 50%;
        left: 10%;
        z-index: 1;
        border: none;
        outline: none;
        height: 50px;
        width: 50px;
        margin-top: -25px;
        display: none;
    }
    .wx-pI-main button.next {
        right: 10%;
        left: auto;
    }

    .img-list {
        height: 90%;
        width: 80%;
        margin: 0 auto;
        background: #000;
        cursor: pointer;
        transform: translate(0, 5.55555%);
    }

    .img-item.show {
        display: block;
    }

    .img-item {
        display: none;
        height: 100%;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    .img-list  img {
        max-width: 100%;
        max-height: 100%;
        height: auto;
        width: auto;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .wx-pI-main .status {
        position: absolute;
        bottom: 4%;
        left: 50%;
        transform: translate(-50%, 0);
        color: #fff;
        z-index: 5;
        padding: 10px 20px;
        font-size: 1.2em;
    }

    .wx-pI-main .close {
        position: absolute;
        right: 10%;
        top: 5%;
        margin: -12px -12px 0 0;
        border-radius: 50%;
        background: #000;
        height: 40px;
        width: 40px;
        z-index: 22;
        cursor: pointer;
        background-image: url(./images/close.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
`

// 模板
wx.previewImage.TEMPLATE = `<div id="wx-previewImage">
                                <div class="wx-pI-layer">
                                    <div class="wx-pI-main">
                                        <div class="close"></div>
                                        <button class="prev">上</button>
                                        <div class="img-list"></div>
                                        <button class="next">下</button>
                                        <p class="status"></p>
                                    </div>
                                </div>
                            </div>`

wx.previewImage('http://ww2.sinaimg.cn/mw1024/69b8b46egw1etud17q77zj20rs0r315z.jpg', [
    'http://ww3.sinaimg.cn/mw1024/69b8b46egw1f5h32f4t07j20k00qojwp.jpg',
    'http://ww2.sinaimg.cn/mw1024/69b8b46egw1etud17q77zj20rs0r315z.jpg',
        'http://ww3.sinaimg.cn/mw1024/69b8b46egw1f5h32f4t07j20k00qojwp.jpg',
        `http://ww1.sinaimg.cn/mw1024/d90d1513gw1f71cfayl98j206s06rwel.jpg`,
        `http://ww4.sinaimg.cn/mw690/6aa09e8fjw1f72be9a6ifj20qo14bgvo.jpg`
])
