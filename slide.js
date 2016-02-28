

(function(factory){

    if(typeof($)!=='function'){
        return ;
    }

    if(module&&typeof(module.exports)==='object'){
        // commonJs
        module.exports=factory();
    }else{
        // 普通模式
        window.Slide=factory();
    }

}(function(){

    // 默认配置
    var defaultConf={
        width:'16rem',
        height:'8rem',
        during:500
    };

    // 初始化组件容器
    var initDom=function(dom,option){
        var $dom=$(dom);
        var wrap=$('<div></div>').css({
            'overflow':'hidden',
            width:option.width,
            height:option.height,
            'position':'relative'
        });
        var slidePot=$('<div></div>').css({
            height:'inherit',
            'white-space':'nowrap',
            "transform":'translateX(0)',
            "-webkit-transform":'translateX(0)'
        });
        wrap.append(slidePot);
        $dom.html('').append(wrap);
        return slidePot;
    };

    // 宽度乘积函数
    // muli('15px',3) => '45px'
    // muli('1rem',3) => '3rem'
    var muli=function(width,length){
        if(typeof(width)==='string'){
            return width.replace(/(\d+)(px|rem)/,function(s,$1,$2){
                return parseFloat($1)*length+$2
            });
        }
        return width*length;
    };

    // 元素立即移动
    var translateQuick=function(dom,width,idx){
        var translateXProp='translateX(-'+muli(width,idx)+') translateZ(0)';
        return dom.css({
            'transform':+translateXProp,
            '-webkit-transform':translateXProp,
        });
    };

    // 元素使用transition移动
    var translateX=function(dom,width,idx,cb){

        var onTransition='transform '+defaultConf.during/1000+'s ease-in-out 0s';
        var offTransition='none';

        window.setTimeout(function(){

            // 元素transition移动结束 清除transition
            dom.css({
                'transition':offTransition,
                'webkit-transition':offTransition
            });
            // 执行回调
            typeof(cb)==='function'&&cb();
        },defaultConf.during);

        // 元素设置transition 然后移动
        return translateQuick(dom,width,idx).css({
            '-webkit-transition':'-webkit-'+onTransition,
            'transition':onTransition
        });

    };

    // 移动Slide函数
    var move=function(){
        var self=this;
        // 移动Slide到当前的画面
        translateX(self.dom,self.width,self.cur,function(){
            if(self.cur===self.length){
                // 假如是最后一屏 还原到第一屏
                // 为了支持最后一屏右滑后回到第一屏
                self.cur=0;
                translateQuick(self.dom,self.width,self.cur);
            }
            // 设置点
            self.setPoint();
        });
    };

    var Slide=function(dom,option){
        // 参数修正
        if(typeof(dom)==='string'){
            dom=$(dom);
        }
        option=option||{};

        var self=this;
        this.width=option.width||defaultConf.width;
        this.height=option.height||defaultConf.height;

        this.dom=initDom(dom,{
            width:self.width,
            height:self.height
        });
        this.interval=null;
        this.cur=0;
        this.length=0;
    };

    // 设置Slide自动滑动
    Slide.prototype.setInterval=function(){
        var self=this;
        var dom=this.dom;

        if(!this.interval){
            this.interval=window.setInterval(function(){
                // 每隔3S 滑到下一屏
                self.cur++;
                move.call(self);
            },3000);
        }
    };

    // 取消Slide自动滑动
    Slide.prototype.clearInterval=function(){
        if(this.interval){
            window.clearInterval(this.interval);
            this.interval=null;
        }
    };

    // 为Slide添加手指滑动事件 touchstart touchmove touchend
    Slide.prototype.attachEvent=function(){
        var self=this;
        var startLeft=0;
        var endLeft=0;

        this.dom.on('touchstart',function(e){
            // 滑动开始时 记录开始值
            startLeft=e.changedTouches[0].clientX;
            // 清除自动滑动
            self.clearInterval();
        });

        this.dom.on('touchmove',function(e){
            // 正在滑动时 计算滑动的距离
            var distance=e.changedTouches[0].clientX-startLeft;
            var nowPosition=self.cur-distance/600;
            // 当前的位置 不能小于0
            if(nowPosition>0){
                // 立即滑动到相应的位置
                translateQuick(self.dom,self.width,nowPosition);
            }
        });

        this.dom.on('touchend',function(e){
            // 获取滑动结束的点 计算出Slide应当去到的位置
            var distance=e.changedTouches[0].clientX-startLeft;
            // 如果当前要的滑动到的屏 不是小于0的
            if(!(self.cur===0&&distance>0)){
                // 左划一格
                if(distance>0){
                    self.cur--;
                // 右划一格
                }else{
                    self.cur++;
                }
                // 开始移动
                move.call(self);
            }
            // 设置自动滑动
            self.setInterval();
        });
    };

    // 设置Slide的点
    Slide.prototype.setPoint=function(initPoint){
        // 初始化点
        if(initPoint){
            var wrap=this.dom.parent();
            var pointsStyle={
                'width':muli(this.width,0.5),
                'margin-left':'-'+muli(this.width,0.25),
                'line-height':'1rem',
                bottom:'.5rem',
                "z-index":1,
                position:"absolute",
                'left':'50%',
                "text-align":'center',
                'border-radius':'10px'
            };
            var pointStyle={
                'display':'inline-block',
                'width':'.35rem',
                'height':'.35rem',
                'border-radius':'50%',
                'background-color':'#eee',
                'margin':'0 .125rem',
                'vertical-align':'10px'
            };
            var pointsWrap=$('<div class="w-points"></div>').css(pointsStyle);
            var points=[];
            for(var i=0;i<this.length;i++){
                var point=$('<div class="w-point"></div>').css(pointStyle);
                points.push(point);
                pointsWrap.append(point);
            }
            wrap.append(pointsWrap);
            this.points=points;
        }
        // 选中相应的点
        for(var i=0;i<this.points.length;i++){
            this.points[i].css({
                'background-color':'#eee'
            });
        }
        this.points[this.cur].css({
            'background-color':'#ff4569'
        });

    };

    // 根据list的数据 设置Slide
    // list 的数据格式为 : [
    //    {
    //        href:'http://mp.beibei.com/hms2_page/bbznq/xpfbh.html',
    //        img:'http://b2.hucdn.com//upload/hmp/1602/26/92741826742737_750x300.jpg'
    //    },{
    //        href:'http://mp.beibei.com/hms2_page/bbznq/gjdphzn.html',
    //        img:'http://b2.hucdn.com//upload/hmp/1602/26/92932543242737_750x300.jpg'
    //    },{
    //        href:'http://mp.beibei.com/hms2_page/bbznq/gnzmdphzn.html',
    //        img:'http://b2.hucdn.com//upload/hmp/1602/26/93037438192737_750x300.jpg'
    //    },{
    //        href:'http://mp.beibei.com/hms2_page/bbznq/ycdphzn.html',
    //        img:'http://b2.hucdn.com//upload/hmp/1602/26/93167279732737_750x300.jpg'
    //    }
    //];
    Slide.prototype.set=function(list){
        var dom=this.dom;
        var width=this.width;
        var height=this.height;

        // 代理dom 生成的dom先挂到代理dom下 再将代理dom挂到Slide的dom内
        var fragment=$(document.createDocumentFragment());
        // 根据json生成每一屏
        var createItem=function(json,width){
            var a = $('<a href="'+json.href+'"></a>').css({
                'display':'inline-block',
                'width':width,
                'height':'100%'
            });
            var img=$('<img src="'+json.img+'"/>').css({
                'display':'block',
                'width':'100%',
                'height':'100%'
            });
            a.append(img);
            return a;
        };

        for(var i=0;i<list.length;i++){
            fragment.append(createItem(list[i],width));
        }
        fragment.append(createItem(list[0],width));
        dom.html('').css({
            'width':muli(width,list.length+1),
            'height':height
        });
        dom.append(fragment);

        this.length=list.length;

        // 设置点
        this.setPoint(true);
        // 设置自动滑动
        this.setInterval();
        // 设置手指滑动事件
        this.attachEvent();

    };

    return Slide;

}));
