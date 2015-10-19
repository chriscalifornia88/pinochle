/**
 * Created by christian on 11/17/15.
 */
module Pinochle {
    export class Player {
        private _model:Models.Player;

        private infoBox:Phaser.Graphics;

        private game:Phaser.Game;
        private cardBackStyle:string;
        private seat:Seat;
        private cards:Phaser.Group;

        private lastUpdated:moment.Moment = moment().subtract(1, 'days');

        constructor(game:Phaser.Game, model:Models.Player, seats:Seat[], cardBackStyle:string) {
            this.game = game;
            this.cardBackStyle = cardBackStyle;
            this.seat = seats[model.seat - 1]
            this.cards = this.game.add.group();
            this.cards.position.set(this.seat.rectangle.x, this.seat.rectangle.y);
            this.cards.pivot.set(0, this.seat.rectangle.height);
            this.cards.rotation = this.seat.rotation;

            this.model = model;

            if (true) {
                // Create info box
                this.infoBox = game.add.graphics(0, 0);
                this.infoBox.beginFill(0x000000, .07);
                var color:any = "0x" + model.color;
                this.infoBox.lineStyle(5, color, 1);

                var infoBoxWidth = 585;
                var infoBoxHeight = 60;

                // Place it above the cards
                switch (this.seat.rotation) {
                    case 0: // Bottom
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxWidth, infoBoxHeight, 5);
                        this.infoBox.pivot.set(this.infoBox.width / 2, this.infoBox.height);
                        this.infoBox.y -= this.seat.rectangle.height + 15
                        break;
                    case 3.14159: // Top
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxWidth, infoBoxHeight, 5);
                        this.infoBox.pivot.set(this.infoBox.width / 2, this.infoBox.height);
                        this.infoBox.y += (this.seat.rectangle.height + 15) + this.infoBox.height;
                        break;
                    case 1.5708: // Left
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxHeight, infoBoxWidth, 5);
                        this.infoBox.pivot.set(this.infoBox.width, this.infoBox.height / 2);
                        this.infoBox.x += (this.seat.rectangle.height + 151) + this.infoBox.width;
                    case -1.5708: // Right
                        this.infoBox.drawRoundedRect(this.seat.rectangle.x, this.seat.rectangle.y, infoBoxHeight, infoBoxWidth, 5);
                        this.infoBox.pivot.set(this.infoBox.width, this.infoBox.height / 2);
                        this.infoBox.x -= this.seat.rectangle.height + 15
                }
            }
        }

        public set model(value:Models.Player) {
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

                var x:number = 0;
                var width:number = 0;
                jQuery.each(this._model.hand, (index:number, card:string) => {
                    var sprite:Phaser.Sprite = this.cards.create(x, 0, 'cards', card);
                    x += sprite.width / 2;
                    width += x + sprite.width / 2;
                });
                this.cards.pivot.x = this.cards.width / 2;

                this.lastUpdated = moment(this._model.updated_at);
            }
        }
    }
}
