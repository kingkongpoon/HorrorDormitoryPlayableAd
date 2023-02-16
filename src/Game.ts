import { ui } from "./ui/layaMaxUI";

export default class Game extends ui.MainSceneUI {
    constructor() {
        super();
        console.log("进入游戏");
        this.LoadRes();
    }

    mg: Laya.Sprite;
    // 猛鬼的骨骼
    mgSk: Laya.Skeleton;

    isOpen: boolean = false;
    isGoodTiem: boolean = true;
    isFly: boolean = false;
    goldList = [];//可以产生金币的建筑
    tremorList = [];//可以震颤的建筑


    // 小手出来的时候要暂停金币生产、武器攻击、猛鬼移动的效果
    isTimeStop = false;
    isAttack = false;
    isHandDown = false;



    Init() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onStartDrag);
        // this.boxGod.on(Laya.Event.CLICK, this, this.BoxGodClick);
        //加入要产生金币的物体
        this.goldList.push(["img/gold1.png", 256, this.bed]);
        this.tremorList.push(this.bed);
        Laya.timer.loop(1000, this, this.UpData);
        this.LoadAni();

    }

    //加载资源
    LoadRes() {

        // 加载猛鬼
        // 猛鬼加载完了之后才会执行Init？
        Laya.loader.load(["RF.json", "spine/mg_5.sk"], Laya.Handler.create(this, this.Init));

    }

    // 加载动画
    // 加载的只是猛鬼的动画
    // 没有别的了
    LoadAni() {
        let templet = new Laya.Templet();


        // 加载猛鬼的动画
        templet.on(Laya.Event.COMPLETE, this, () => {
            this.mgSk = templet.buildArmature(1);
            this.mgSk.showSkinByIndex(0);
            this.mgSk.play(0, true);
            console.log(this.mgSk);
            this.map.addChild(this.mgSk);
            this.Process1();
        });


        templet.on(Laya.Event.ERROR, this, () => {
            console.log("创建动画模板出错");
        })
        templet.loadAni("spine/mg_5.sk");

    }

    onStartDrag(e) {
        this.map.startDrag();
    }

    BoxGodClick(func) {
        // if (!this.isGoodTiem) {
        //     return;
        // }
        // this.isGoodTiem = false;
        this.boxGod.skin = "img/boxgodopen_1.png";
        this.boxGodUI.visible = false;
        this.isFly = true;
        Laya.timer.once(1000, this, () => {
            this.boxGod.skin = "img/boxgod_1.png";
            this.boxGodUI.visible = true;
            this.isFly = false;
            if (this.isOpen) {
                this.isOpen = false;
                this.boxGodUI.skin = "img/BoxGodReady.png";
            } else {
                this.isOpen = true;
                this.boxGodUI.skin = "img/BoxGodReturn.png";
            }
        });
        this.MovePlayer();
        func();
    }

    MovePlayer() {
        if (this.isOpen) {
            Laya.Tween.to(this.bed, { x: 456, y: 580 }, 1000);
            Laya.Tween.to(this.bed, { scaleX: 1.7, scaleY: 1.7 }, 500, Laya.Ease.circOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.bed, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.circIn);
            }));
        } else {
            Laya.Tween.to(this.bed, { x: 184, y: 405, scale: 1.5 }, 1000);
            Laya.Tween.to(this.bed, { scaleX: 1.7, scaleY: 1.7 }, 500, Laya.Ease.circOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.bed, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.circIn);
            }));
        }
    }

    UpData() {
        if (this.isTimeStop) {
            this.HandEffect();
            return;
        }
        this.ShowAddGold();
        this.TremorEffect();
        if (this.isAttack) {
            this.AttackEffect();
        }
        if (this.isOpen) {
            this.RFMoreGoldEffect("img/gold1.png", 128, this.bed);
        }
        this.GunAttack();
    }

    //金币和闪电产出效果
    ShowAddGold() {
        for (let i = 0; i < this.goldList.length; i++) {
            this.RFEffect(this.goldList[i][0], this.goldList[i][1], this.goldList[i][2]);
        }

    }
    //震颤特效
    TremorEffect() {
        if (this.isFly) {
            return;
        }
        for (let i = 0; i < this.tremorList.length; i++) {
            Laya.Tween.to(this.tremorList[i], { scaleX: 0.8, scaleY: 0.8 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.tremorList[i], { scaleX: 1, scaleY: 1 }, 100);
            }))
        }
    }
    /**
     * 
     * @param img 
     * @param num 
     * @param block 
     */
    public RFEffect(img: string, num: number, block: Laya.Sprite) {
        
        
        // 这里是干嘛的？
        var node: Laya.View = this.GetPR();
        console.log("看看名字"+node.name);
        block.parent.addChild(node);
        
        (node.getChildAt(0) as Laya.Image).skin = img;
        (node.getChildAt(1) as Laya.Label).text = "+" + num;
        (node.getChildAt(1) as Laya.Label).color = "white";
        node.alpha = 0;
        node.scaleY = 0;
        node.scaleX = 0;
        node.pos(block.x, block.y);
        Laya.Tween.to(node, { alpha: 1, scaleX: 1, scaleY: 1, y: node.y - 15 }, 500, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(node, { y: node.y - 45 }, 1000, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { y: node.y - 45, alpha: 0, scaleX: 0, scaleY: 0 }, 1000, null, Laya.Handler.create(this, function () {
                    node.destroy();
                }), 0, true);
            }), 0, true);
        }), 0, true);
        // console.log(11);
    }
    //箱神新加额外金币特效
    public RFMoreGoldEffect(img: string, num: number, block: Laya.Sprite) {
        var node: Laya.View = this.GetPR();

        if (node == null) {
            return;
        }
        block.parent.addChild(node);
        (node.getChildAt(0) as Laya.Image).skin = img;
        (node.getChildAt(1) as Laya.Label).text = "+" + num;
        (node.getChildAt(1) as Laya.Label).color = "white";
        node.alpha = 0;
        node.scaleY = 0;
        node.scaleX = 0;
        node.pos(block.x + 60, block.y + 10);
        Laya.Tween.to(node, { alpha: 1, scaleX: 0.7, scaleY: 0.7, y: node.y - 15 }, 500, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(node, { y: node.y - 45 }, 1000, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { y: node.y - 45, alpha: 0, scaleX: 0, scaleY: 0 }, 1000, null, Laya.Handler.create(this, function () {
                    node.destroy();
                }), 0, true);
            }), 0, true);
        }), 0, true);
        // console.log(11);
    }

    private GetPR() {
        let view: Laya.View = new Laya.View();

        let s = Laya.loader.getRes("RF.json");
        view.createView(s);
        return view;
    }
    /**提示玩家点击 */
    ClickTip(sp: Laya.Image, listener: Function, args?: any[]) {
        this.hand.visible = true;
        this.hand.pos(sp.x + sp.width / 2, sp.y + sp.height / 2);
        sp.on(Laya.Event.CLICK, this, listener, args);
    }
    //攻击特效
    AttackEffect() {
        this.doorEffect.visible = true;
        Laya.Tween.to(this.door, { scaleX: 0.8, scaleY: 0.8 }, 100, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.door, { scaleX: 1, scaleY: 1 }, 100, null, Laya.Handler.create(this, () => {
                this.doorEffect.visible = false;
            }));
        }));
        //门掉血
        if (this.doorHP.scaleX >= 0.1) {
            this.doorHP.scaleX -= 0.1;
        }

    }

    //手点击逻辑
    HandEffect() {
        if (this.isHandDown) {
            this.isHandDown = false;
            this.hand.skin = "img/handUp.png";
        } else {
            this.isHandDown = true;
            this.hand.skin = "img/handDown.png";
        }
    }

    GetDistance(x1: number, x2: number, y1: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    GetAngle(p1: Laya.Point, p2: Laya.Point) {
        var angle: number = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
        var theta: number = angle * (180 / Math.PI);
        console.log("旋转角度", theta);
        return theta;
    }

    //炮台攻击逻辑
    GunAttack() {
        if (this.GetDistance(this.gun.x, this.mgSk.x, this.gun.y, this.mgSk.y) > 100) {
            this.gun.rotation = this.GetAngle(new Laya.Point(this.gun.x, this.gun.y), new Laya.Point(this.mgSk.x, this.mgSk.y)) + 91;
        }
    }
    // attack(power: number, pos, bulletName: string, roomIndex: number,target = null) {
    //     var element = this.GetBuild((target as Laya.Sprite));
    //     this.InitBuild(element, power,roomIndex);
    //     var bulletPos = ((element.bullet.parent) as Laya.Sprite).globalToLocal(pos);
    //     element.bullet.pos(bulletPos.x, bulletPos.y);
    //     element.bullet.skin = "bullet/" + bulletName + "_Bullet.png";
    //     this.TrackMoveMent(element.bullet, element.movespeed,target);
    // }

    Process1() {
        this.bed.pos(184, 405);
        this.mgSk.pos(this.mgPoint1.x, this.mgPoint1.y);
        this.isOpen = true;
        Laya.Tween.to(this.mgSk, { x: this.mgPoint2.x, y: this.mgPoint2.y }, 100, null, Laya.Handler.create(this, () => {
            this.isTimeStop = true;
            this.ClickTip(this.boxGod, this.BoxGodClick, [() => {
                this.hand.visible = false;
                this.boxGod.off(Laya.Event.CLICK, this, this.BoxGodClick);
                this.isTimeStop = false;
                this.Process2();
            }]);
        }))
    }

    Process2() {
        Laya.Tween.to(this.mgSk, { x: this.mgPoint3.x, y: this.mgPoint3.y }, 200, null, Laya.Handler.create(this, () => {
            this.isAttack = true;
            this.mgSk.play(1, true);
            Laya.timer.once(3000, this, () => {
                this.isAttack = false;
                this.mgSk.play(0, true);
                Laya.Tween.to(this.mgSk, { x: this.mgPoint5.x, y: this.mgPoint5.y }, 1000, null, Laya.Handler.create(this, () => {
                    this.isTimeStop = true;
                    this.ClickTip(this.boxGod, this.BoxGodClick, [() => {
                        this.hand.visible = false;
                        this.boxGod.off(Laya.Event.CLICK, this, this.BoxGodClick);
                        this.isTimeStop = false;
                        Laya.timer.once(3000, this, () => {
                            this.Process3();
                        });
                    }]);
                }));
            })
        }));
    }

    Process3() {
        Laya.Tween.to(this.mgSk, { x: this.mgPoint4.x, y: this.mgPoint4.y }, 200, null, Laya.Handler.create(this, () => {
            this.isTimeStop = true;
            this.ClickTip(this.boxGod, this.BoxGodClick, [() => {
                this.hand.visible = false;
                this.boxGod.off(Laya.Event.CLICK, this, this.BoxGodClick);
                this.isTimeStop = false;
                Laya.Tween.to(this.mgSk, { x: this.mgPoint3.x, y: this.mgPoint3.y }, 1000, null, Laya.Handler.create(this, () => {
                    this.isAttack = true;
                    this.mgSk.play(1, true);
                }));
            }]);
        }))
    }
}