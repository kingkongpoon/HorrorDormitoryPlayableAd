/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class MainSceneUI extends Scene {
		public map:Laya.Image;
		public door:Laya.Image;
		public doorEffect:Laya.Image;
		public boxGod:Laya.Image;
		public boxGodUI:Laya.Image;
		public mgPoint1:Laya.Sprite;
		public mgPoint2:Laya.Sprite;
		public mgPoint3:Laya.Sprite;
		public mgPoint4:Laya.Sprite;
		public mgPoint5:Laya.Sprite;
		public hand:Laya.Image;
		public doorHP:Laya.Image;
		public bed:Laya.Image;
		public fort:Laya.Image;
		public gun:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("MainScene");
        }
    }
    REG("ui.MainSceneUI",MainSceneUI);
    export class PlayableAdUI extends Scene {
		public bed:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("PlayableAd");
        }
    }
    REG("ui.PlayableAdUI",PlayableAdUI);
}