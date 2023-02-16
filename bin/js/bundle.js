(function () {
	'use strict';

	var Scene = Laya.Scene;
	var REG = Laya.ClassUtils.regClass;
	var ui;
	(function (ui) {
	    class MainSceneUI extends Scene {
	        constructor() { super(); }
	        createChildren() {
	            super.createChildren();
	            this.loadScene("MainScene");
	        }
	    }
	    ui.MainSceneUI = MainSceneUI;
	    REG("ui.MainSceneUI", MainSceneUI);
	    class PlayableAdUI extends Scene {
	        constructor() { super(); }
	        createChildren() {
	            super.createChildren();
	            this.loadScene("PlayableAd");
	        }
	    }
	    ui.PlayableAdUI = PlayableAdUI;
	    REG("ui.PlayableAdUI", PlayableAdUI);
	})(ui || (ui = {}));

	class Game extends ui.MainSceneUI {
	    constructor() {
	        super();
	        this.isOpen = false;
	        this.isGoodTiem = true;
	        this.isFly = false;
	        this.goldList = [];
	        this.tremorList = [];
	        this.isTimeStop = false;
	        this.isAttack = false;
	        this.isHandDown = false;
	        console.log("进入游戏");
	        this.LoadRes();
	    }
	    Init() {
	        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onStartDrag);
	        this.goldList.push(["img/gold1.png", 256, this.bed]);
	        this.tremorList.push(this.bed);
	        Laya.timer.loop(1000, this, this.UpData);
	        this.LoadAni();
	    }
	    LoadRes() {
	        Laya.loader.load(["RF.json", "spine/mg_5.sk"], Laya.Handler.create(this, this.Init));
	    }
	    LoadAni() {
	        let templet = new Laya.Templet();
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
	        });
	        templet.loadAni("spine/mg_5.sk");
	    }
	    onStartDrag(e) {
	        this.map.startDrag();
	    }
	    BoxGodClick(func) {
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
	            }
	            else {
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
	        }
	        else {
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
	    ShowAddGold() {
	        for (let i = 0; i < this.goldList.length; i++) {
	            this.RFEffect(this.goldList[i][0], this.goldList[i][1], this.goldList[i][2]);
	        }
	    }
	    TremorEffect() {
	        if (this.isFly) {
	            return;
	        }
	        for (let i = 0; i < this.tremorList.length; i++) {
	            Laya.Tween.to(this.tremorList[i], { scaleX: 0.8, scaleY: 0.8 }, 100, null, Laya.Handler.create(this, () => {
	                Laya.Tween.to(this.tremorList[i], { scaleX: 1, scaleY: 1 }, 100);
	            }));
	        }
	    }
	    RFEffect(img, num, block) {
	        var node = this.GetPR();
	        console.log("看看名字" + node.name);
	        block.parent.addChild(node);
	        node.getChildAt(0).skin = img;
	        node.getChildAt(1).text = "+" + num;
	        node.getChildAt(1).color = "white";
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
	    }
	    RFMoreGoldEffect(img, num, block) {
	        var node = this.GetPR();
	        if (node == null) {
	            return;
	        }
	        block.parent.addChild(node);
	        node.getChildAt(0).skin = img;
	        node.getChildAt(1).text = "+" + num;
	        node.getChildAt(1).color = "white";
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
	    }
	    GetPR() {
	        let view = new Laya.View();
	        let s = Laya.loader.getRes("RF.json");
	        view.createView(s);
	        return view;
	    }
	    ClickTip(sp, listener, args) {
	        this.hand.visible = true;
	        this.hand.pos(sp.x + sp.width / 2, sp.y + sp.height / 2);
	        sp.on(Laya.Event.CLICK, this, listener, args);
	    }
	    AttackEffect() {
	        this.doorEffect.visible = true;
	        Laya.Tween.to(this.door, { scaleX: 0.8, scaleY: 0.8 }, 100, null, Laya.Handler.create(this, () => {
	            Laya.Tween.to(this.door, { scaleX: 1, scaleY: 1 }, 100, null, Laya.Handler.create(this, () => {
	                this.doorEffect.visible = false;
	            }));
	        }));
	        if (this.doorHP.scaleX >= 0.1) {
	            this.doorHP.scaleX -= 0.1;
	        }
	    }
	    HandEffect() {
	        if (this.isHandDown) {
	            this.isHandDown = false;
	            this.hand.skin = "img/handUp.png";
	        }
	        else {
	            this.isHandDown = true;
	            this.hand.skin = "img/handDown.png";
	        }
	    }
	    GetDistance(x1, x2, y1, y2) {
	        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	    }
	    GetAngle(p1, p2) {
	        var angle = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
	        var theta = angle * (180 / Math.PI);
	        console.log("旋转角度", theta);
	        return theta;
	    }
	    GunAttack() {
	        if (this.GetDistance(this.gun.x, this.mgSk.x, this.gun.y, this.mgSk.y) > 100) {
	            this.gun.rotation = this.GetAngle(new Laya.Point(this.gun.x, this.gun.y), new Laya.Point(this.mgSk.x, this.mgSk.y)) + 91;
	        }
	    }
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
	        }));
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
	            });
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
	        }));
	    }
	}

	class OnGameStart extends ui.PlayableAdUI {
	    constructor() {
	        super();
	        console.log("进入游戏");
	        Laya.loader.load("RF.json");
	        Laya.timer.loop(1000, this, this.Update);
	    }
	    LoadRes() {
	    }
	    Update() {
	        this.TremorEffect();
	        this.ShowAddGold();
	    }
	    TremorEffect() {
	        Laya.Tween.to(this.bed, { scaleX: 0.8, scaleY: 0.8 }, 100, null, Laya.Handler.create(this, () => {
	            Laya.Tween.to(this.bed, { scaleX: 1, scaleY: 1 }, 100);
	        }));
	    }
	    ShowAddGold() {
	        this.RFEffect("img/gold1.png", 256, this.bed);
	    }
	    RFEffect(img, num, block) {
	        var node = this.GetPR();
	        console.log("看一下名字" + node.name);
	        block.parent.addChild(node);
	        node.getChildAt(0).skin = img;
	        node.getChildAt(1).text = "+" + num;
	        node.getChildAt(1).color = "white";
	        node.alpha = 0;
	        node.scaleY = 0;
	        node.scaleX = 0;
	        node.pos(block.x, block.y);
	        Laya.Tween.to(node, { alpha: 1, scaleX: 1, scaleY: 1, y: node.y - 15 }, 500, null, Laya.Handler.create(this, function () {
	            node.destroy();
	        }), 0, true);
	    }
	    GetPR() {
	        let view = new Laya.View();
	        let s = Laya.loader.getRes("RF.json");
	        view.createView(s);
	        return view;
	    }
	}

	class GameConfig {
	    constructor() { }
	    static init() {
	        var reg = Laya.ClassUtils.regClass;
	        reg("Game.ts", Game);
	        reg("OnGameStart.ts", OnGameStart);
	    }
	}
	GameConfig.width = 640;
	GameConfig.height = 1136;
	GameConfig.scaleMode = "fixedwidth";
	GameConfig.screenMode = "none";
	GameConfig.alignV = "top";
	GameConfig.alignH = "left";
	GameConfig.startScene = "PlayableAd.scene";
	GameConfig.sceneRoot = "";
	GameConfig.debug = false;
	GameConfig.stat = false;
	GameConfig.physicsDebug = false;
	GameConfig.exportSceneToJson = true;
	GameConfig.init();

	class Main {
	    constructor() {
	        if (window["Laya3D"])
	            Laya3D.init(GameConfig.width, GameConfig.height);
	        else
	            Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
	        Laya["Physics"] && Laya["Physics"].enable();
	        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
	        Laya.stage.scaleMode = GameConfig.scaleMode;
	        Laya.stage.screenMode = GameConfig.screenMode;
	        Laya.stage.alignV = GameConfig.alignV;
	        Laya.stage.alignH = GameConfig.alignH;
	        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
	        if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
	            Laya.enableDebugPanel();
	        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
	            Laya["PhysicsDebugDraw"].enable();
	        if (GameConfig.stat)
	            Laya.Stat.show();
	        Laya.alertGlobalError(true);
	        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	    }
	    onVersionLoaded() {
	        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	    }
	    onConfigLoaded() {
	        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	    }
	}
	new Main();

}());
