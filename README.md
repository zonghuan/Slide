# 移动端Slider组件

基于zepto或jquery

## 功能

* 支持手势划屏
* 最后一屏和第一屏无缝衔接
* 宽度、高度支持px和rem

## 使用例子


```
var Slide=require('Slide');
var slide=new Slide('#selector',{
    width:'10rem',
    height:'5rem'        
});

slide.set([{
        href:'http://mp.beibei.com/hms2_page/bbznq/xpfbh.html',
        img:'http://b2.hucdn.com//upload/hmp/1602/26/92741826742737_750x300.jpg'
    },{
        href:'http://mp.beibei.com/hms2_page/bbznq/gjdphzn.html',
        img:'http://b2.hucdn.com//upload/hmp/1602/26/92932543242737_750x300.jpg'
    },{
        href:'http://mp.beibei.com/hms2_page/bbznq/gnzmdphzn.html',
        img:'http://b2.hucdn.com//upload/hmp/1602/26/93037438192737_750x300.jpg'
    },{
        href:'http://mp.beibei.com/hms2_page/bbznq/ycdphzn.html',
        img:'http://b2.hucdn.com//upload/hmp/1602/26/93167279732737_750x300.jpg'
    }
]);

```
