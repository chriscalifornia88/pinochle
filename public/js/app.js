var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by christian on 10/2/15.
 */
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
            this.load.atlas('icons', 'assets/sprites/icons.png', 'assets/sprites/icons.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
            this.load.image('table-shadow', 'assets/graphics/table-shadow.png');
            this.load.bitmapFont('justabit', 'assets/fonts/justabit.png', 'assets/fonts/justabit.xml');
            // Load game assets
            //this.load.tilemap('apartmentPorchMap', 'assets/tilemaps/chapter1/apartment_porch.json', null, Phaser.Tilemap.TILED_JSON);
            //this.load.image('chapter1Tiles', 'assets/tilemaps/chapter1/tiles.png');
            //
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
                    // Setup CSRF
                    jQuery.ajaxSetup({
                        headers: { "X-CSRF-TOKEN": response.csrfToken }
                    });
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
            this.infoBox = null;
            this.currentPlayer = false;
            this.busy = false;
            this.selectedCard = null;
            this.selectionArrow = null;
            this.lastUpdated = moment().subtract(1, 'days');
            this.game = game;
            this.cardBackStyle = cardBackStyle;
            this.seat = seats[model.seat - 1];
            this.playArea = this.game.add.group();
            this.playArea.position.set(this.seat.rectangle.x, this.seat.rectangle.y);
            this.playArea.pivot.set(0, this.seat.rectangle.height);
            this.playArea.rotation = this.seat.rotation;
            this.cards = this.game.add.group();
            this.playArea.add(this.cards);
            // Create info box            
            this.color = "0x" + model.color;
            this.model = model;
            // Setup icons
            this.selectionArrow = this.game.add.sprite(0, 0, 'icons', 'arrow_up');
            this.selectionArrow.scale.set(0.7, 0.7);
            this.selectionArrow.visible = false;
            this.playArea.add(this.selectionArrow);
        }
        Player.prototype.cardMouseOver = function (card) {
            if (this.busy) {
                return;
            }
            card.tint = 0x7facd3;
        };
        Player.prototype.cardMouseOut = function (card) {
            if (this.busy) {
                return;
            }
            card.tint = 0xffffff;
        };
        Player.prototype.cardMouseDown = function (card) {
            if (this.busy) {
                return;
            }
            if (card === this.selectedCard) {
                this.selectedCard = null;
                this.selectionArrow.visible = false;
                this.playCard(card);
                return;
            }
            if (this.selectedCard !== null) {
                this.selectedCard.y += 30;
            }
            card.y -= 30;
            this.selectedCard = card;
            this.cardMouseOut(card);
            // Show arrow
            this.selectionArrow.position.x = card.x + 3; // + (this.selectionArrow.width / 2);
            this.selectionArrow.position.y = card.y - (this.selectionArrow.height + 25);
            this.selectionArrow.visible = true;
        };
        Player.prototype.playCard = function (card) {
            var _this = this;
            var index = this.cards.getChildIndex(card);
            this.busy = true;
            jQuery.ajax({
                url: '/game/' + this._model.game_id + '/card/' + index,
                type: 'PUT',
                success: function (response) {
                    _this.busy = false;
                    jQuery.each(response.data.players, function (index, player) {
                        if (player.id === _this._model.id) {
                            // Refresh the play area
                            _this.model = player;
                        }
                    });
                },
                fail: function (response) {
                    this.busy = false;
                    console.log('error');
                    console.log(response);
                }
            });
        };
        Object.defineProperty(Player.prototype, "model", {
            set: function (value) {
                var _this = this;
                this._model = value;
                // Check if player has updated
                if (this.lastUpdated.diff(moment(this._model.updated_at)) !== 0) {
                    this.cards.removeAll(true);
                    this.playArea.remove(this.infoBox, true);
                    if (!this._model.hasOwnProperty('hand')) {
                        // If you have cannot access the player's hand, then show card backs only
                        this._model['hand'] = [];
                        for (var i = 0; i < this._model.card_count; i++) {
                            this._model.hand.push(this.cardBackStyle);
                        }
                    }
                    else {
                        // This is the currently logged in player
                        this.currentPlayer = true;
                    }
                    var x = 0;
                    var width = 0;
                    jQuery.each(this._model.hand, function (index, card) {
                        var sprite = _this.cards.create(x, 0, 'cards', card);
                        x += sprite.width / 2;
                        width += x + sprite.width / 2;
                        if (_this.currentPlayer) {
                            // Add events
                            sprite.inputEnabled = true;
                            sprite.input.useHandCursor = true;
                            sprite.events.onInputOver.add(_this.cardMouseOver, _this);
                            sprite.events.onInputOut.add(_this.cardMouseOut, _this);
                            sprite.events.onInputDown.add(_this.cardMouseDown, _this);
                        }
                    });
                    this.playArea.pivot.x = this.playArea.width / 2;
                    this.cards.pivot.x = this.cards.width / 2;
                    this.cards.x = this.playArea.width / 2;
                    this.infoBox = new Pinochle.InfoBox(this.game, this.playArea, this.color, this._model.user.name, this.seat.rotation);
                    // Update info box
                    this.infoBox.gameScore = 30;
                    this.infoBox.meldScore = 20;
                    this.infoBox.bid = 32;
                    //this.infoBox.passed = true;
                    this.infoBox.dealer = true;
                    // Layer cards over the infoBox
                    this.playArea.bringToTop(this.cards);
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
 * Created by chris on 10/24/15.
 */
var Pinochle;
(function (Pinochle) {
    var InfoBox = (function (_super) {
        __extends(InfoBox, _super);
        function InfoBox(game, playArea, color, name, textRotation) {
            _super.call(this, game);
            this.vertical = false;
            this._gameScoreValue = null;
            this._meldScoreValue = null;
            this._bidValue = null;
            this._passedValue = false;
            this._dealerValue = false;
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
                case 1.5708:
                    this.vertical = true;
                    this.items.x += 26;
                    this.items.y = -47;
                    break;
                case -1.5708:
                    this.vertical = true;
                    this.items.x += this.width - 26;
                    this.items.y = -48;
                    break;
                case 3.14159:
                    this.items.x += this.width - 26;
                    this.items.y = -48;
                    break;
                case 0:
                    this.items.x += 26;
                    this.items.y = -46;
                    break;
            }
            this.addChild(this.items);
            // Add text items
            var items = ["_gameScore", "_meldScore", "_bid", "_dealer"];
            var x = 0;
            var y = 0;
            for (var i = 0; i < items.length; i++) {
                this[items[i]] = this.game.add.bitmapText(x, y, "justabit", "", 20);
                this[items[i]].align = "center";
                if (this.vertical) {
                    // Stack the items top to bottom
                    y += 63;
                }
                else {
                    // Stack the items left to right
                    x += 63;
                }
                this.items.add(this[items[i]]);
            }
            this._name = this.game.add.bitmapText(460, -9, "justabit", name, 20);
            this._name.rotation = textRotation;
            this._name.updateText();
            switch (this.textRotation) {
                case 1.5708:
                    this._name.position.set(8, 464);
                    this._name.position.y -= this._name.textWidth;
                    break;
                case -1.5708:
                    this._name.position.set(-7, 464);
                    break;
                case 3.14159:
                    // Show the name right side up
                    this._name.rotation = 0;
                default:
                    // Right align the text
                    this._name.position.x -= this._name.textWidth;
                    break;
            }
            this.items.add(this._name);
            playArea.add(this);
        }
        InfoBox.prototype.centerText = function (text) {
            text.updateText();
            if (this.vertical) {
                text.position.x = 0 - (text.textWidth / 2);
            }
            else {
                text.position.y = 0 - (text.textHeight / 2);
            }
        };
        Object.defineProperty(InfoBox.prototype, "gameScore", {
            get: function () {
                return this._gameScoreValue;
            },
            set: function (value) {
                this._gameScoreValue = value;
                this._gameScore.text = "Score\n" + value;
                this.centerText(this._gameScore);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoBox.prototype, "meldScore", {
            get: function () {
                return this._meldScoreValue;
            },
            set: function (value) {
                this._meldScoreValue = value;
                this._meldScore.text = "Meld\n" + value;
                this.centerText(this._meldScore);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoBox.prototype, "bid", {
            get: function () {
                return this._bidValue;
            },
            set: function (value) {
                this._bidValue = value;
                if (this._passedValue) {
                    this._bid.text = "Bid\nPass";
                }
                else {
                    this._bid.text = "Bid\n" + value;
                }
                this.centerText(this._bid);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoBox.prototype, "passed", {
            get: function () {
                return this._passedValue;
            },
            set: function (value) {
                this._passedValue = value;
                if (this._passedValue) {
                    this._bid.text = "Bid\nPass";
                }
                else {
                    this._bid.text = "Bid\n" + this._bidValue;
                }
                this.centerText(this._bid);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoBox.prototype, "dealer", {
            get: function () {
                return this._dealerValue;
            },
            set: function (value) {
                this._dealerValue = value;
                if (this._dealerValue) {
                    this._dealer.text = "Deal";
                }
                else {
                    this._dealer.text = "";
                }
                this.centerText(this._dealer);
            },
            enumerable: true,
            configurable: true
        });
        return InfoBox;
    })(Phaser.Graphics);
    Pinochle.InfoBox = InfoBox;
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
/// <reference path="InfoBox.ts" />
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
