/**
 * Created by christian on 10/2/15.
 */

module Pinochle {
    export class Game extends Phaser.State {
        private _model:Models.Game;
        private lastUpdated:moment.Moment = moment().subtract(1, 'days');

        // todo: soft code these IDs
        private gameId = 1;
        private userId = 1;

        private serverCheckDelay = 1000; // 1 second

        private cardBackStyle = 'back_blue5';
        private cardWidth = 84;
        private cardHeight = 114;
        private loading:boolean = false;
        private dialog:Dialog;
        private players:Player[] = [];
        private seats:Seat[] = [];
        private rotatedSeats:Seat[] = [];
        private playArea:Phaser.Group;
        private cards:Phaser.Group;

        create() {
            this.dialog = new Dialog();

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = '#5fa777';
            this.game.scale.forceLandscape = true;
            this.game.scale.refresh();

            var tableShadow:Phaser.Image = this.game.add.image(0, 0, 'table-shadow');
            tableShadow.width = this.game.width;
            tableShadow.height = this.game.width;
            //this.game.stage.smoothed = false;

            this.playArea = this.game.add.group();
            this.playArea.position.set(this.game.width / 2, this.game.height / 2);
            this.cards = this.game.add.group();
            this.playArea.add(this.cards);

            // Setup input
            this.game.input.mouse.enabled = true;

            // Load the game state
            this.checkServer();
        }

        checkServer() {
            jQuery.get('/game/' + this.gameId, {}, (response) => {
                this._model = response.data;

                // Check if game has updated
                if (this.lastUpdated.diff(moment(this._model.updated_at)) !== 0) {
                    this.cards.removeAll();

                    // Refresh players
                    if (this.players.length === 0) {
                        // Calculate player positions
                        var seats:Seat[] = [];
                        switch (this._model.players.length) {
                            // todo: add support for 3-5 handed games
                            case 4:
                                seats = [
                                    new Seat(1, Seat.Position.Bottom, new Phaser.Rectangle(this.game.width / 2, this.game.height, this.game.width, this.cardHeight), 0),
                                    new Seat(2, Seat.Position.Left, new Phaser.Rectangle(0, this.game.height / 2, this.game.height, this.cardHeight), 1.5708),
                                    new Seat(3, Seat.Position.Top, new Phaser.Rectangle(this.game.width / 2, 0, this.game.width, this.cardHeight), 3.14159),
                                    new Seat(4, Seat.Position.Right, new Phaser.Rectangle(this.game.width, this.game.height / 2, this.game.height / 2, this.cardHeight), -1.5708),
                                ];
                                break;
                        }
                        this.seats = seats;

                        // Rotate seats to the active player
                        var activePlayer = this._model.players.filter((playerModel:Models.Player)=> {
                            return playerModel.user.id === this.userId;
                        })[0];
                        this.rotatedSeats = this.rotateArray(activePlayer.seat - 1, seats);

                        // Set relative positions
                        var positions:Seat.Position[] = [Seat.Position.Bottom, Seat.Position.Left, Seat.Position.Top, Seat.Position.Right];
                        jQuery.each(this.rotatedSeats, (index:number) => {
                            this.rotatedSeats[index].relativePosition = positions[index];
                        });

                        // Create players
                        jQuery.each(this._model.players, (index:number, playerModel:Models.Player) => {
                            this.players.push(new Player(this.game, this._model, playerModel, this.rotatedSeats, this.cardBackStyle));
                        });
                    } else {
                        // Update players
                        jQuery.each(this._model.players, (index:number, playerModel:Models.Player) => {
                            this.players[index].model = playerModel;
                        });
                    }

                    // Pad the play area so that each player has an entry
                    var playArea = this._model.play_area;
                    if (playArea == null) {
                        playArea = [];
                    }
                    while (playArea.length < this.players.length) {
                        playArea.push("");
                    }

                    // Rotate the play area to the leading player
                    var rotatedSeatsByLeader = this.rotateArray(this._model.lead_seat - 1, this.seats);

                    // Update play area
                    jQuery.each(rotatedSeatsByLeader, (index:number, seat:Seat) => {
                        var card = playArea[index];

                        // Check if this seat has played a card
                        if (card.length > 0) {
                            // Place each card in front of the player who played it
                            var sprite:Phaser.Sprite = this.cards.create(0, 0, 'cards', card);
                            sprite.pivot.set(sprite.width / 2, sprite.height / 2);
                            sprite.rotation = seat.rotation;

                            switch (seat.relativePosition) {
                                case Seat.Position.Left:
                                    sprite.position.x -= sprite.height;
                                    break;
                                case Seat.Position.Right:
                                    sprite.position.x += sprite.height;
                                    break;
                                case Seat.Position.Top:
                                    sprite.position.y -= sprite.height;
                                    break;
                                case Seat.Position.Bottom:
                                    sprite.position.y += sprite.height;
                                    break;
                            }
                        }
                    });

                    this.lastUpdated = moment(this._model.updated_at);

                    // Setup CSRF
                    jQuery.ajaxSetup({
                        headers: {"X-CSRF-TOKEN": response.csrfToken}
                    });
                }

                // Queue up next server check
                setTimeout(() => {
                    this.checkServer();
                }, this.serverCheckDelay);

            }).fail((response) => {
                console.log('error');
                console.log(response);
            });
        }

        // Rotate array to the specified index
        rotateArray(index:number, array:any[]) {
            var rotatedArray:any[] = [];
            for (var i = index; i < (index + array.length); i++) {
                var offsetIndex = i;
                if (offsetIndex >= array.length) {
                    offsetIndex -= array.length;
                }
                rotatedArray.push(array[offsetIndex]);
            }

            return rotatedArray;
        }

        update() {
            // Collision
            //this.game.physics.arcade.collide(this.player, this.currentLevel.blockedLayer);
            //this.game.physics.arcade.collide(this.player, this.currentLevel.items, this.collideWithItem, null, this);
            //this.game.physics.arcade.overlap(this.player, this.currentLevel.doors, this.enterDoor, null, this);
        }

        showDialog() {
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
        }
    }
}
