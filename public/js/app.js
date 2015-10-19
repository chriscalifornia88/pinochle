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
            this.load.image('table-shadow', 'assets/graphics/table-shadow.png');
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
var Pinochle;
(function (Pinochle) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.apply(this, arguments);
            this.lastUpdated = moment().subtract(1, 'days');
            // todo: soft code these IDs
            this.gameId = 1;
            this.userId = 1;
            this.serverCheckDelay = 2000; // 2 seconds
            this.cardBackStyle = 'back_blue5';
            this.cardWidth = 84;
            this.cardHeight = 114;
            this.loading = false;
            this.players = [];
        }
        Game.prototype.create = function () {
            this.dialog = new Pinochle.Dialog();
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = '#5fa777';
            this.game.scale.forceLandscape = true;
            this.game.scale.refresh();
            var tableShadow = this.game.add.image(0, 0, 'table-shadow');
            tableShadow.width = this.game.width;
            tableShadow.height = this.game.width;
            //this.game.stage.smoothed = false;
            // Setup input
            this.game.input.mouse.enabled = true;
            // Load the game state
            this.checkServer();
        };
        Game.prototype.checkServer = function () {
            var _this = this;
            jQuery.get('/game/' + this.gameId, {}, function (response) {
                _this._model = response.data;
                // Check if game has updated
                if (_this.lastUpdated.diff(moment(_this._model.updated_at)) !== 0) {
                    // Refresh players
                    if (_this.players.length === 0) {
                        // Calculate player positions
                        var seats = [];
                        switch (_this._model.players.length) {
                            // todo: add support for 3-5 handed games
                            case 4:
                                seats = [
                                    new Pinochle.Seat(new Phaser.Rectangle(_this.game.width / 2, _this.game.height, _this.game.width, _this.cardHeight), 0),
                                    new Pinochle.Seat(new Phaser.Rectangle(0, _this.game.height / 2, _this.game.height, _this.cardHeight), 1.5708),
                                    new Pinochle.Seat(new Phaser.Rectangle(_this.game.width, _this.game.height / 2, _this.game.height / 2, _this.cardHeight), -1.5708),
                                    new Pinochle.Seat(new Phaser.Rectangle(_this.game.width / 2, 0, _this.game.width, _this.cardHeight), 3.14159),
                                ];
                                break;
                        }
                        // Calculate a seat offset so that the current player is on the bottom
                        var seatOffset = 0;
                        jQuery.each(_this._model.players, function (index, playerModel) {
                            if (playerModel.user.id === _this.userId) {
                                seatOffset = index;
                            }
                        });
                        // Rotate the seats by the offset
                        var newSeats = [];
                        for (var i = seatOffset; i < (seatOffset + seats.length); i++) {
                            var index = i;
                            if (index >= seats.length) {
                                index -= seats.length;
                            }
                            newSeats.push(seats[index]);
                        }
                        seats = newSeats;
                        // Create players
                        jQuery.each(_this._model.players, function (index, playerModel) {
                            _this.players.push(new Pinochle.Player(_this.game, playerModel, seats, _this.cardBackStyle));
                        });
                    }
                    else {
                        // Update players
                        jQuery.each(_this._model.players, function (index, playerModel) {
                            _this.players[index].model = playerModel;
                        });
                    }
                    _this.lastUpdated = moment(_this._model.updated_at);
                }
                // Queue up next server check
                setTimeout(function () {
                    _this.checkServer();
                }, _this.serverCheckDelay);
            }).fail(function (response) {
                console.log('error');
                console.log(response);
            });
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
 * Created by christian on 11/17/15.
 */
var Pinochle;
(function (Pinochle) {
    var Models;
    (function (Models) {
        var Game = (function () {
            function Game() {
            }
            return Game;
        })();
        Models.Game = Game;
    })(Models = Pinochle.Models || (Pinochle.Models = {}));
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 11/17/15.
 */
var Pinochle;
(function (Pinochle) {
    var Models;
    (function (Models) {
        var User = (function () {
            function User() {
            }
            return User;
        })();
        Models.User = User;
    })(Models = Pinochle.Models || (Pinochle.Models = {}));
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 11/17/15.
 */
var Pinochle;
(function (Pinochle) {
    var Models;
    (function (Models) {
        var Player = (function () {
            function Player() {
            }
            return Player;
        })();
        Models.Player = Player;
    })(Models = Pinochle.Models || (Pinochle.Models = {}));
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 11/18/15.
 */
var Pinochle;
(function (Pinochle) {
    var Seat = (function () {
        function Seat(rectangle, rotation) {
            this._rectangle = rectangle;
            this._rotation = rotation;
        }
        Object.defineProperty(Seat.prototype, "rectangle", {
            get: function () {
                return this._rectangle;
            },
            set: function (value) {
                this._rectangle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Seat.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
            },
            enumerable: true,
            configurable: true
        });
        return Seat;
    })();
    Pinochle.Seat = Seat;
})(Pinochle || (Pinochle = {}));
/**
 * Created by christian on 11/17/15.
 */
var Pinochle;
(function (Pinochle) {
    var Player = (function () {
        function Player(game, model, seats, cardBackStyle) {
            this.lastUpdated = moment().subtract(1, 'days');
            this.game = game;
            this.cardBackStyle = cardBackStyle;
            this.seat = seats[model.seat - 1];
            this.cards = this.game.add.group();
            this.cards.position.set(this.seat.rectangle.x, this.seat.rectangle.y);
            this.cards.pivot.set(0, this.seat.rectangle.height);
            this.cards.rotation = this.seat.rotation;
            this.model = model;
            if (true) {
                // Create info box
                this.infoBox = game.add.graphics(0, 0);
                this.infoBox.beginFill(0x000000, .07);
                var color = "0x" + model.color;
                this.infoBox.lineStyle(5, color, 1);
                var infoBoxWidth = 585;
                var infoBoxHeight = 60;
                // Place it above the cards
                switch (this.seat.rotation) {
                    case 0:
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxWidth, infoBoxHeight, 5);
                        this.infoBox.pivot.set(this.infoBox.width / 2, this.infoBox.height);
                        this.infoBox.y -= this.seat.rectangle.height + 15;
                        break;
                    case 3.14159:
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxWidth, infoBoxHeight, 5);
                        this.infoBox.pivot.set(this.infoBox.width / 2, this.infoBox.height);
                        this.infoBox.y += (this.seat.rectangle.height + 15) + this.infoBox.height;
                        break;
                    case 1.5708:
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxHeight, infoBoxWidth, 5);
                        this.infoBox.pivot.set(this.infoBox.width, this.infoBox.height / 2);
                        this.infoBox.x += (this.seat.rectangle.height + 151) + this.infoBox.width;
                    case -1.5708:
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxHeight, infoBoxWidth, 5);
                        this.infoBox.pivot.set(this.infoBox.width, this.infoBox.height / 2);
                        this.infoBox.x -= this.seat.rectangle.height + 15;
                }
            }
        }
        Object.defineProperty(Player.prototype, "model", {
            set: function (value) {
                var _this = this;
                this._model = value;
                // Check if player has updated
                if (this.lastUpdated.diff(moment(this._model.updated_at)) !== 0) {
                    this.cards.removeAll(true);
                    if (!this._model.hasOwnProperty('hand')) {
                        // If you have cannot access the player's hand, then show card backs only
                        this._model['hand'] = [];
                        for (var i = 0; i < this._model.card_count; i++) {
                            this._model.hand.push(this.cardBackStyle);
                        }
                    }
                    var x = 0;
                    var width = 0;
                    jQuery.each(this._model.hand, function (index, card) {
                        var sprite = _this.cards.create(x, 0, 'cards', card);
                        x += sprite.width / 2;
                        width += x + sprite.width / 2;
                    });
                    this.cards.pivot.x = this.cards.width / 2;
                    this.lastUpdated = moment(this._model.updated_at);
                }
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    })();
    Pinochle.Player = Player;
})(Pinochle || (Pinochle = {}));
/**
 * Created by chris on 10/2/15.
 */
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="States/Preload.ts" />    
/// <reference path="States/Boot.ts" />    
/// <reference path="States/Game.ts" />  
/// <reference path="Dialog.ts" />   
/// <reference path="Models/Game.ts" />    
/// <reference path="Models/User.ts" />    
/// <reference path="Models/Player.ts" />    
/// <reference path="Seat.ts" />
/// <reference path="Player.ts" />    
var Pinochle;
(function (Pinochle) {
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this, 1366, 768, Phaser.CANVAS, '', null);
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
