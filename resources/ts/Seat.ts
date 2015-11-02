/**
 * Created by christian on 11/18/15.
 */
module Pinochle {
    export class Seat {
        private _position:Seat.Position;
        private _relativePosition:Seat.Position;
        private _number:number;
        private _rectangle:Phaser.Rectangle;
        private _rotation:number;

        constructor(number:number, position:Seat.Position, rectangle:Phaser.Rectangle, rotation:number) {
            this._number = number;
            this._position = position;
            this._relativePosition = position;
            this._rectangle = rectangle;
            this._rotation = rotation;
        }

        public get number():number {
            return this._number;
        }

        public set number(value:number) {
            this._number = value;
        }

        public get position():Pinochle.Seat.Position {
            return this._position;
        }

        public set position(value:Pinochle.Seat.Position) {
            this._position = value;
        }

        public get relativePosition():Pinochle.Seat.Position {
            return this._relativePosition;
        }

        public set relativePosition(value:Pinochle.Seat.Position) {
            this._relativePosition = value;
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

module Pinochle.Seat {
    export enum Position {Bottom, Left, Top, Right}
}
