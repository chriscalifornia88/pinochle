/**
 * Created by christian on 11/17/15.
 */
module Pinochle {
    export class Player {
        private _model:Models.Player;

        private color:any;
        private infoBox:InfoBox = null;

        private gameModel:Models.Game;
        public game:Phaser.Game;
        public seat:Seat;
        private cardBackStyle:string;
        private playArea:Phaser.Group;
        private cards:Phaser.Group;
        private currentPlayer:boolean = false;
        private busy:boolean = false;
        private selectedCard:Phaser.Sprite = null;
        private selectionArrow:Phaser.Sprite = null;

        private lastUpdated:moment.Moment = moment().subtract(1, 'days');

        constructor(game:Phaser.Game, gameModel:Models.Game, model:Models.Player, seats:Seat[], cardBackStyle:string) {
            this.gameModel = gameModel;
            this.game = game;
            this.cardBackStyle = cardBackStyle;
            this.seat = seats[model.seat - 1]
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

        private cardMouseOver(card:Phaser.Sprite) {
            if (this.busy) {
                return;
            }

            card.tint = 0x7facd3;
        }

        private cardMouseOut(card:Phaser.Sprite) {
            if (this.busy) {
                return;
            }

            card.tint = 0xffffff;
        }

        private cardMouseDown(card:Phaser.Sprite) {
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
            this.selectionArrow.position.x = card.x + 3;// + (this.selectionArrow.width / 2);
            this.selectionArrow.position.y = card.y - (this.selectionArrow.height + 25);
            this.selectionArrow.visible = true;
            this.playArea.bringToTop(this.selectionArrow);
        }

        private playCard(card:Phaser.Sprite) {
            var index:number = this.cards.getChildIndex(card);

            this.busy = true;
            jQuery.ajax({
                url: '/game/' + this._model.game_id + '/card/' + index,
                type: 'PUT',
                success: (response) => {
                    this.busy = false;
                    jQuery.each(response.data.players, (index:number, player:Models.Player) => {
                        if (player.id === this._model.id) {
                            // Refresh the play area
                            this.model = player;
                        }
                    })
                },
                error: (response) => {
                    this.busy = false;
                    console.log('error');
                    console.log(response);
                }
            });
        }

        public set model(value:Models.Player) {
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
                } else {
                    // This is the currently logged in player
                    this.currentPlayer = true;
                }

                var x:number = 0;
                var width:number = 0;
                jQuery.each(this._model.hand, (index:number, card:string) => {
                    var sprite:Phaser.Sprite = this.cards.create(x, 0, 'cards', card);
                    x += sprite.width / 2;
                    width += x + sprite.width / 2;

                    if (this.currentPlayer) {
                        // Add events
                        sprite.inputEnabled = true;
                        sprite.input.useHandCursor = true;
                        sprite.events.onInputOver.add(this.cardMouseOver, this);
                        sprite.events.onInputOut.add(this.cardMouseOut, this);
                        sprite.events.onInputDown.add(this.cardMouseDown, this);
                    }
                });
                this.playArea.pivot.x = this.playArea.width / 2;
                this.cards.pivot.x = this.cards.width / 2;
                this.cards.x = this.playArea.width / 2;

                this.infoBox = new InfoBox(this, this.playArea, this.color, this._model.user.name);

                // Update info box
                this.infoBox.gameScore = 30;
                this.infoBox.meldScore = 20;
                this.infoBox.bid = 32;
                //this.infoBox.passed = true;
                this.infoBox.leader = (this._model.seat === this.gameModel.lead_seat);
                this.infoBox.dealer = (this._model.seat === this.gameModel.dealer_seat);

                // Layer cards over the infoBox
                this.playArea.bringToTop(this.cards);

                this.lastUpdated = moment(this._model.updated_at);
            }
        }
    }
}
