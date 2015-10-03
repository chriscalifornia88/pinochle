/**
 * Created by christian on 10/2/15.
 */

/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts"/>
module Pinochle {
    export class Dialog {
        protected _box:Phaser.Graphics;
        protected _open:boolean = false;
        protected _onSelection:(selection:number) => void = function (selection:number) {

        };
        protected _options:Phaser.BitmapText[] = [];
        protected _selectedOption:number = -1;

        public show(game:Phaser.Game, text:string, options:DialogOption[]) {
            this._box = this.createBox(game);

            // Text
            this._box.addChild(game.add.bitmapText(20, 20, "justabit", text, 16));

            // Options
            for (var i = 0; i < options.length; i++) {
                var x = 0;
                var y = 20 * (i + 2);
            
                var option:Phaser.BitmapText = game.add.bitmapText(x, y, "justabit", options[i].text, 16);
            
                // Center text
                option.align = "center";
                option.x = this.calculateCenter(option.textWidth);

                this._options.push(option);
                this._box.addChild(option);
            }

            this.selectedOption = 0;
            this._box.visible = true;
            this._open = true;
            
            game.world.bringToTop(this._box);
        }

        protected createBox(game:Phaser.Game) {
            var dialogHeight = Math.round(game.height / 4);
            if (dialogHeight < 192) {
                dialogHeight = 192;
            }
            var dialogBox = game.add.graphics(0, game.height - dialogHeight);
            dialogBox.beginFill(0x0000ff, 1);
            dialogBox.fixedToCamera = true;
            dialogBox.drawRect(0, 0, game.width, dialogHeight);
            
            return dialogBox;
        }

        protected calculateCenter(width:number) {
            return Math.round((this._box.width / 2) - (width / 2))
        }

        get selectedOption():number {
            return this._selectedOption;
        }

        set selectedOption(selectedOption:number) {
            // Deselect current option
            if (typeof this._options[this._selectedOption] != 'undefined') {
                var text = this._options[this._selectedOption].text;
                this._options[this._selectedOption].text = text.substring(2, text.length - 2);

                // Center text
                this._options[this._selectedOption].x = this.calculateCenter(this._options[this._selectedOption].textWidth);
            }

            // Deselect all if the list is empty
            if (this._options.length === 0) {
                selectedOption = -1;
            } else {
                // Min and Max values
                if (selectedOption < 0) {
                    selectedOption = 0;
                } else if (selectedOption >= this._options.length) {
                    selectedOption = (this._options.length - 1);
                }

                // Select new option
                this._options[selectedOption].text = '> ' + this._options[selectedOption].text + ' <';

                // Center text
                this._options[selectedOption].x = this.calculateCenter(this._options[selectedOption].textWidth);
            }

            this._selectedOption = selectedOption;
        }

        close() {
            this._open = false;
            this._box.visible = false;
            this._options = [];
            this._selectedOption = -1;
        }

        select() {
            if (this._selectedOption > -1) {
                return this._onSelection(this._selectedOption);
            }
        }

        public get open():boolean {
            return this._open;
        }

        set onSelectionEvent(event:(selection:number) => void) {
            this._onSelection = event;
        }

        get box():Phaser.Graphics {
            return this._box;
        }
    }


    export class DialogOption {
        private _text:string;
        private _results:DialogOptionResult[];

        constructor(text:string, results:DialogOptionResult[]) {
            this._text = text;
            this._results = results;
        }

        public get text():string {
            return this._text;
        }

        public get results():DialogOptionResult[] {
            return this._results;
        }
    }

    export class DialogOptionResult {
        private _type:string;
        private _value:string;

        constructor(type:string, value:string) {
            this._type = type;
            this._value = value;
        }

        public get type():string {
            return this._type;
        }

        public get value():string {
            return this._value;
        }
    }

    export class DialogOptionResultType {
        static health:string = 'HEALTH';
        static hide:string = 'HIDE';
        static show:string = 'SHOW';
        static destroy:string = 'DESTROY';
        static gain:string = 'GAIN';
    }
}
