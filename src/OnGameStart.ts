import {ui} from "./ui/layaMaxUI";


export default class OnGameStart extends ui.PlayableAdUI{
    
    // 构造函数
    constructor(){
        super(); // 继承？
        
        console.log("进入游戏");
        // 在构造函数中调用加载资源的函数
        // 这个只是小床的颤抖效果
        // ok 现在小床的颤抖效果和生产金币的效果已经全部实现了
        // 下面要实现的是更近一步的游戏机生产闪电的效果和颤抖效果
        // 那现在我想实现每个游戏机、小床和功能设施头上都可以冒生产数据
        // 我该怎么做？
        // 两种方案吧：
        // 方案一：地图中的地块是怎么生成的？
        // 我想到了一个方法就是：
        // 类似于RF.json这个文件，其实就是一个Prefab
        // 我可以把小床、游戏机这些东西都给弄成prefab
        // 然后我可以随意的调用他们了
        // 现在的问题是：弄成prefab没什么问题
        // 但是我该怎么把他们生成到游戏里面的每一个格子里呢？
        // 呃呃 没什么想法啊 因为游戏里的格子摆放的位置是没有办法确定的
        // 那这个就后面再说？
        


        // 扫把攻击的效果

        // 使用Laya.loader.load("") 先把所需要的资源加载进来
        // 然后还需要使用Laya.loader.getRes("") 把资源“提取”到游戏中？

        Laya.loader.load("RF.json");
        
        Laya.timer.loop(1000,this, this.Update);

    }


    // 今天我就试着做一个震颤的效果

    LoadRes(){

    }

    Update(): void {
        this.TremorEffect();
        this.ShowAddGold();
    }

    TremorEffect(){
        Laya.Tween.to(this.bed,{scaleX: 0.8, scaleY: 0.8}, 100,null, Laya.Handler.create(this, () =>{
            Laya.Tween.to(this.bed, {scaleX: 1, scaleY: 1}, 100);
        }))
    }

    // 金币和闪电产出的效果
    ShowAddGold(){
        this.RFEffect("img/gold1.png", 256, this.bed);
    }


    public RFEffect(img: string, num: number, block: Laya.Sprite){

        // GetPR就是为了创建一个可以唰唰唰的View
        var node: Laya.View = this.GetPR();
        
        console.log("看一下名字"+node.name);
        // node 和 block 是兄弟
        block.parent.addChild(node);
        
        (node.getChildAt(0) as Laya.Image).skin = img;
        (node.getChildAt(1) as Laya.Label).text = "+" + num;
        (node.getChildAt(1) as Laya.Label).color = "white";
        node.alpha = 0;
        node.scaleY = 0;
        node.scaleX = 0;
        // 开始做唰唰唰的动画了
        node.pos(block.x, block.y);
        // 为什么要套娃？
        // 其实不是套娃，是同时执行三个动画： 移动、缩放、逐渐透明
        Laya.Tween.to(node, {alpha: 1, scaleX: 1, scaleY: 1, y:node.y - 15},500, null, Laya.Handler.create(this, function(){
            Laya.Tween.to(node, {y: node.y - 45}, 1000, null, Laya.Handler.create(this, function(){
                Laya.Tween.to(node, { y: node.y - 45, alpha: 0, scaleX: 0, scaleY: 0}, 100, null, Laya.Handler.create(this, function(){
                    node.destroy();
                }),0,true);
            }),0,true);
        }), 0, true);
    
    }



    private GetPR(){
        let view: Laya.View = new Laya.View();
        // 这个变量名不够直接 稍后做一下修改
        // 可以看看layaide中有一个RF.prefab的文件
        // 是不是导出之后这个prefab的文件就会变成json文件了？
        // 测试一下
        // 测试结果：没错
        // 每一个prefab都会产生一个json文件
        // 每一个scene也都会产生一个json文件
        // 这个s代表的就是产生金币的效果图片
        let s = Laya.loader.getRes("RF.json");
        //这段代码实现的是在小床上唰唰唰产生金币的效果
        view.createView(s);
        return view;
    }

}