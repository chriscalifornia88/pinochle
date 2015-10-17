/**
 * Created by christian on 10/2/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts"/>
var Pinochle;
(function (Pinochle) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.apply(this, arguments);
        }
        Preload.prototype.preload = function () {
            // Show loading screen
            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.atlas('cards', 'assets/sprites/cards.png', 'assets/sprites/cards.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
            // Load game assets
            //this.load.tilemap('apartmentPorchMap', 'assets/tilemaps/chapter1/apartment_porch.json', null, Phaser.Tilemap.TILED_JSON);
            //this.load.image('chapter1Tiles', 'assets/tilemaps/chapter1/tiles.png');
            //
            //this.load.bitmapFont('justabit', 'assets/fonts/justabit.png', 'assets/fonts/justabit.xml');
            //
            //this.load.image('player', 'assets/images/player.png');
        };
        Preload.prototype.create = function () {
            this.game.state.start('Game');
        };
        return Preload;
    })(Phaser.State);
    Pinochle.Preload = Preload;
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 10/2/15.
 */
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts"/>
var Pinochle;
(function (Pinochle) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadbar', 'assets/sprites/preloader-bar.png');
        };
        Boot.prototype.create = function () {
            this.game.stage.backgroundColor = '#000000';
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // Center game horizontally
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.state.start('Preload');
        };
        return Boot;
    })(Phaser.State);
    Pinochle.Boot = Boot;
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 10/2/15.
 */
/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts"/>
var Pinochle;
(function (Pinochle) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.apply(this, arguments);
            this.loading = false;
        }
        Game.prototype.create = function () {
            //this.game.physics.arcade.enable(this.player);
            this.dialog = new Pinochle.Dialog();
            this.game.stage.backgroundColor = '#027f17';
            //this.game.stage.smoothed = false;
            this.game.scale.forceLandscape = true;
            // Setup input
            this.game.input.mouse.enabled = true;
            var x = 5;
            var y = 5;
            for (var i = 0; i < 39; i++) {
                var card = this.game.add.sprite(x, y, 'cards', i);
                card.scale.set(.6, .6);
                x += card.width + 5;
                if ((x + card.width) > this.game.width) {
                    x = 5;
                    y += card.height + 5;
                }
            }
        };
        Game.prototype.update = function () {
            // Collision
            //this.game.physics.arcade.collide(this.player, this.currentLevel.blockedLayer);
            //this.game.physics.arcade.collide(this.player, this.currentLevel.items, this.collideWithItem, null, this);
            //this.game.physics.arcade.overlap(this.player, this.currentLevel.doors, this.enterDoor, null, this);
        };
        Game.prototype.showDialog = function () {
            //var self = this;
            //var text = item.dialogText;
            //var options = item.dialogOptions;
            //
            //this.game.paused = true;
            //
            //this.dialog.onSelectionEvent = function (selected:number) {
            //    if (typeof options[selected] === 'undefined') {
            //        console.log('selected option ' + selected + ' does not exist');
            //        return;
            //    }
            //
            //    var option = options[selected];
            //
            //    for (var i = 0; i < option.results.length; i++) {
            //        var value:string = option.results[i].value;
            //
            //        switch (option.results[i].type) {
            //            case DialogOptionResultType.hide:
            //                if (value.length < 1) {
            //                    // Hide current object
            //                    item.visible = false;
            //                    break;
            //                }
            //
            //                var sprite = self.currentLevel.findSpriteByName(value);
            //                if (sprite !== null) {
            //                    sprite.visible = false;
            //                } else {
            //                    console.log("Cannot find sprite '" + value + "'");
            //                }
            //                break;
            //            case DialogOptionResultType.show:
            //                if (value.length < 1) {
            //                    // Show current object
            //                    item.visible = true;
            //                    break;
            //                }
            //
            //                var sprite = self.currentLevel.findSpriteByName(value);
            //                if (sprite !== null) {
            //                    sprite.visible = true;
            //                } else {
            //                    console.log("Cannot find sprite '" + value + "'");
            //                }
            //                break;
            //            case DialogOptionResultType.destroy:
            //                if (value.length < 1) {
            //                    // Destroy current object
            //                    item.destroy();
            //                    break;
            //                }
            //
            //                var sprite = self.currentLevel.findSpriteByName(value);
            //                if (sprite !== null) {
            //                    sprite.destroy();
            //                } else {
            //                    console.log("Cannot find sprite '" + value + "'");
            //                }
            //                break;
            //            case DialogOptionResultType.gain:
            //                if (value.length < 1) {
            //                    // Gain current object
            //                    self.inventory.add(item);
            //                    item.destroy();
            //                    break;
            //                }
            //
            //                var sprite = self.currentLevel.findSpriteByName(value);
            //                if (sprite !== null) {
            //                    self.inventory.add(sprite);
            //                    sprite.destroy();
            //                } else {
            //                    console.log("Cannot find sprite '" + value + "'");
            //                }
            //                break;
            //            case DialogOptionResultType.health:
            //                console.log('+' + value + ' Health!');
            //                break;
            //            default:
            //                console.log('nope:' + option.results[i].type);
            //        }
            //    }
            //};
            //
            //this.dialog.show(this.game, text, options);
        };
        return Game;
    })(Phaser.State);
    Pinochle.Game = Game;
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 10/2/15.
 */
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var Pinochle;
(function (Pinochle) {
    var Dialog = (function () {
        function Dialog() {
            this._open = false;
            this._onSelection = function (selection) {
            };
            this._options = [];
            this._selectedOption = -1;
        }
        Dialog.prototype.show = function (game, text, options) {
            this._box = this.createBox(game);
            // Text
            this._box.addChild(game.add.bitmapText(20, 20, "justabit", text, 16));
            // Options
            for (var i = 0; i < options.length; i++) {
                var x = 0;
                var y = 20 * (i + 2);
                var option = game.add.bitmapText(x, y, "justabit", options[i].text, 16);
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
        };
        Dialog.prototype.createBox = function (game) {
            var dialogHeight = Math.round(game.height / 4);
            if (dialogHeight < 192) {
                dialogHeight = 192;
            }
            var dialogBox = game.add.graphics(0, game.height - dialogHeight);
            dialogBox.beginFill(0x0000ff, 1);
            dialogBox.fixedToCamera = true;
            dialogBox.drawRect(0, 0, game.width, dialogHeight);
            return dialogBox;
        };
        Dialog.prototype.calculateCenter = function (width) {
            return Math.round((this._box.width / 2) - (width / 2));
        };
        Object.defineProperty(Dialog.prototype, "selectedOption", {
            get: function () {
                return this._selectedOption;
            },
            set: function (selectedOption) {
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
                }
                else {
                    // Min and Max values
                    if (selectedOption < 0) {
                        selectedOption = 0;
                    }
                    else if (selectedOption >= this._options.length) {
                        selectedOption = (this._options.length - 1);
                    }
                    // Select new option
                    this._options[selectedOption].text = '> ' + this._options[selectedOption].text + ' <';
                    // Center text
                    this._options[selectedOption].x = this.calculateCenter(this._options[selectedOption].textWidth);
                }
                this._selectedOption = selectedOption;
            },
            enumerable: true,
            configurable: true
        });
        Dialog.prototype.close = function () {
            this._open = false;
            this._box.visible = false;
            this._options = [];
            this._selectedOption = -1;
        };
        Dialog.prototype.select = function () {
            if (this._selectedOption > -1) {
                return this._onSelection(this._selectedOption);
            }
        };
        Object.defineProperty(Dialog.prototype, "open", {
            get: function () {
                return this._open;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "onSelectionEvent", {
            set: function (event) {
                this._onSelection = event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "box", {
            get: function () {
                return this._box;
            },
            enumerable: true,
            configurable: true
        });
        return Dialog;
    })();
    Pinochle.Dialog = Dialog;
    var DialogOption = (function () {
        function DialogOption(text, results) {
            this._text = text;
            this._results = results;
        }
        Object.defineProperty(DialogOption.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DialogOption.prototype, "results", {
            get: function () {
                return this._results;
            },
            enumerable: true,
            configurable: true
        });
        return DialogOption;
    })();
    Pinochle.DialogOption = DialogOption;
    var DialogOptionResult = (function () {
        function DialogOptionResult(type, value) {
            this._type = type;
            this._value = value;
        }
        Object.defineProperty(DialogOptionResult.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DialogOptionResult.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return DialogOptionResult;
    })();
    Pinochle.DialogOptionResult = DialogOptionResult;
    var DialogOptionResultType = (function () {
        function DialogOptionResultType() {
        }
        DialogOptionResultType.health = 'HEALTH';
        DialogOptionResultType.hide = 'HIDE';
        DialogOptionResultType.show = 'SHOW';
        DialogOptionResultType.destroy = 'DESTROY';
        DialogOptionResultType.gain = 'GAIN';
        return DialogOptionResultType;
    })();
    Pinochle.DialogOptionResultType = DialogOptionResultType;
})(Pinochle || (Pinochle = {}));
/**
 * Created by chris on 10/2/15.
 */
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="States/Preload.ts" />    
/// <reference path="States/Boot.ts" />    
/// <reference path="States/Game.ts" />  
/// <reference path="Dialog.ts" />    
var Pinochle;
(function (Pinochle) {
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this, 1366, 768, Phaser.ScaleManager.RESIZE, '', null);
            this.state.add('Preload', Pinochle.Preload, false);
            this.state.add('Boot', Pinochle.Boot, true);
            this.state.add('Game', Pinochle.Game, false);
        }
        return App;
    })(Phaser.Game);
    Pinochle.App = App;
})(Pinochle || (Pinochle = {}));
window.onload = function () {
    new Pinochle.App;
};
//# sourceMappingURL=app.js.map