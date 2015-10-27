/**
 * Created by chris on 10/24/15.
 */
module Pinochle {
    export class InfoBox extends Phaser.Graphics {
        private items:Phaser.Group;
        private textRotation:number;
        private vertical:boolean = false;

        private _gameScore:Phaser.BitmapText;
        private _gameScoreValue:number = null;

        private _meldScore:Phaser.BitmapText;
        private _meldScoreValue:number = null;

        private _bid:Phaser.BitmapText;
        private _bidValue:number = null;

        private _passedValue:boolean = false;

        private _dealer:Phaser.BitmapText;
        private _dealerValue:boolean = false;

        private _name:Phaser.BitmapText;

        constructor(game:Phaser.Game, playArea:Phaser.Group, color:number, name:string, textRotation) {
            super(game);

            this.lineStyle(5, color, .52);

            var infoBoxWidth = 505;
            var infoBoxHeight = 60;
            this.beginFill(0x000000, .07);
            this.drawRoundedRect((playArea.width / 2) - (infoBoxWidth / 2), -17 - infoBoxHeight, infoBoxWidth, infoBoxHeight, 10);

            this.textRotation = textRotation;
            this.items = game.add.group();
            this.items.width = this.width;
            this.items.height = this.height;

            // Flip the text upright
            this.items.rotation = 0 - textRotation;
            this.items.x = (playArea.width / 2) - (infoBoxWidth / 2);

            switch (this.textRotation) {
                case 1.5708: // Left
                    this.vertical = true;
                    this.items.x += 26;
                    this.items.y = -47;
                    break;
                case -1.5708: // Right
                    this.vertical = true;
                    this.items.x += this.width - 26;
                    this.items.y = -48;
                    break;
                case 3.14159: // Top
                    this.items.x += this.width - 26;
                    this.items.y = -48;
                    break;
                case 0: // Bottom
                    this.items.x += 26;
                    this.items.y = -46;
                    break;
            }
            this.addChild(this.items);

            // Add text items
            var items:string[] = ["_gameScore", "_meldScore", "_bid", "_dealer"];
            var x:number = 0;
            var y:number = 0;
            for (var i:number = 0; i < items.length; i++) {
                this[items[i]] = this.game.add.bitmapText(x, y, "justabit", "", 20);
                this[items[i]].align = "center";

                if (this.vertical) {
                    // Stack the items top to bottom
                    y += 63;
                } else {
                    // Stack the items left to right
                    x += 63;
                }

                this.items.add(this[items[i]]);
            }

            this._name = this.game.add.bitmapText(460, -9, "justabit", name, 20);
            this._name.rotation = textRotation;
            this._name.updateText();

            switch (this.textRotation) {
                case 1.5708: // Left
                    this._name.position.set(8, 464);
                    this._name.position.y -= this._name.textWidth;
                    break;
                case -1.5708: // Right
                    this._name.position.set(-7, 464);
                    break;
                case 3.14159: // Top
                    // Show the name right side up
                    this._name.rotation = 0;
                default: // Bottom
                    // Right align the text
                    this._name.position.x -= this._name.textWidth;
                    break;
            }

            this.items.add(this._name);
            playArea.add(this);
        }

        private centerText(text:Phaser.BitmapText) {
            text.updateText();
            if (this.vertical) {
                text.position.x = 0 - (text.textWidth / 2);
            } else {
                text.position.y = 0 - (text.textHeight / 2);
            }
        }

        public get gameScore():number {
            return this._gameScoreValue;
        }

        public set gameScore(value:number) {
            this._gameScoreValue = value;
            this._gameScore.text = "Score\n" + value;

            this.centerText(this._gameScore);
        }

        public get meldScore():number {
            return this._meldScoreValue;
        }

        public set meldScore(value:number) {
            this._meldScoreValue = value;
            this._meldScore.text = "Meld\n" + value;

            this.centerText(this._meldScore);
        }

        public get bid():number {
            return this._bidValue;
        }

        public set bid(value:number) {
            this._bidValue = value;

            if (this._passedValue) {
                this._bid.text = "Bid\nPass";
            } else {
                this._bid.text = "Bid\n" + value;
            }

            this.centerText(this._bid);
        }

        public get passed():boolean {
            return this._passedValue;
        }

        public set passed(value:boolean) {
            this._passedValue = value;

            if (this._passedValue) {
                this._bid.text = "Bid\nPass";
            } else {
                this._bid.text = "Bid\n" + this._bidValue;
            }

            this.centerText(this._bid);
        }

        public get dealer():boolean {
            return this._dealerValue;
        }

        public set dealer(value:boolean) {
            this._dealerValue = value;

            if (this._dealerValue) {
                this._dealer.text = "Deal";
            } else {
                this._dealer.text = "";
            }

            this.centerText(this._dealer);
        }
    }
}
