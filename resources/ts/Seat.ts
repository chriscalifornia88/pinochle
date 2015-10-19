/**
 * Created by christian on 11/18/15.
 */
module Pinochle {
    export class Seat {
        private _rectangle:Phaser.Rectangle;
        private _rotation:number;

        constructor(rectangle:Phaser.Rectangle, rotation:number) {
            this._rectangle = rectangle;
            this._rotation = rotation;
        }

        public get rectangle():Phaser.Rectangle {
            return this._rectangle;
        }

        public set rectangle(value:Phaser.Rectangle) {
            this._rectangle = value;
        }

        public get rotation():number {
            return this._rotation;
        }

        public set rotation(value:number) {
            this._rotation = value;
        }
    }
}
