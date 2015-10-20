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
        private playArea:Phaser.Group;
        private cards:Phaser.Group;

        private lastUpdated:moment.Moment = moment().subtract(1, 'days');

        constructor(game:Phaser.Game, model:Models.Player, seats:Seat[], cardBackStyle:string) {
            this.game = game;
            this.cardBackStyle = cardBackStyle;
            this.seat = seats[model.seat - 1]
            this.playArea = this.game.add.group();
            this.playArea.position.set(this.seat.rectangle.x, this.seat.rectangle.y);
            this.playArea.pivot.set(0, this.seat.rectangle.height);
            this.playArea.rotation = this.seat.rotation;

            this.cards = this.game.add.group();
            this.playArea.add(this.cards);

            this.model = model;

            // Create info box
            this.infoBox = game.add.graphics(0, 0);
            this.infoBox.beginFill(0x000000, .07);
            var color:any = "0x" + model.color;
            this.infoBox.lineStyle(5, color, .52);

            var infoBoxWidth = 505;
            var infoBoxHeight = 60;
            
            this.infoBox.drawRoundedRect((this.playArea.width / 2) - (infoBoxWidth / 2), -17 - infoBoxHeight, infoBoxWidth, infoBoxHeight, 10);
            this.playArea.add(this.infoBox);
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
                this.playArea.pivot.x = this.playArea.width / 2;
                this.cards.pivot.x = this.cards.width / 2;
                this.cards.x = this.playArea.width / 2;

                // Center info box
                //this.infoBox.x = ((this.playArea.width / 2) - (this.infoBox.width / 2));

                this.lastUpdated = moment(this._model.updated_at);
            }
        }
    }
}
