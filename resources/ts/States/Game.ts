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

        private serverCheckDelay = 2000; // 2 seconds

        private cardBackStyle = 'back_blue5';
        private cardWidth = 84;
        private cardHeight = 114;
        private loading:boolean = false;
        private dialog:Dialog;
        private players:Player[] = [];

        create() {
            //this.game.physics.arcade.enable(this.player);

            this.dialog = new Dialog();

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = '#027f17';
            this.game.scale.forceLandscape = true;
            //this.game.stage.smoothed = false;

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
                    // Refresh players
                    if (this.players.length === 0) {
                        // Calculate player positions
                        var seats:Seat[] = [];
                        switch (this._model.players.length) {
                            // todo: add support for 3-5 handed games
                            case 4:
                                seats = [
                                    new Seat(new Phaser.Rectangle(this.game.width / 2, this.game.height, this.game.width, this.cardHeight), 0),             // bottom
                                    new Seat(new Phaser.Rectangle(0, this.game.height / 2, this.game.height, this.cardHeight), 1.5708),                     // left
                                    new Seat(new Phaser.Rectangle(this.game.width, this.game.height / 2, this.game.height / 2, this.cardHeight), -1.5708),  // right
                                    new Seat(new Phaser.Rectangle(this.game.width / 2, 0, this.game.width, this.cardHeight), 3.14159),                      // top
                                ];
                                break;
                        }

                        // Calculate a seat offset so that the current player is on the bottom
                        var seatOffset = 0;
                        jQuery.each(this._model.players, (index:number, playerModel:Models.Player) => {
                            if (playerModel.user.id === this.userId) {
                                seatOffset = index;
                            }
                        });

                        // Rotate the seats by the offset
                        var newSeats:Seat[] = [];
                        for (var i = seatOffset; i < (seatOffset + seats.length); i++) {
                            var index = i;
                            if (index >= seats.length) {
                                index -= seats.length;
                            }
                            newSeats.push(seats[index]);
                        }
                        seats = newSeats;

                        // Create players
                        jQuery.each(this._model.players, (index:number, playerModel:Models.Player) => {
                            this.players.push(new Player(this.game, playerModel, seats, this.cardBackStyle));
                        });
                    } else {
                        // Update players
                        jQuery.each(this._model.players, (index:number, playerModel:Models.Player) => {
                            this.players[index].model = playerModel;
                        });
                    }

                    this.lastUpdated = moment(this._model.updated_at);
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
