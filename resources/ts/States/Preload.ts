/**
 * Created by christian on 10/2/15.
 */

/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts"/>
module Pinochle {
    export class Preload extends Phaser.State {
        preloadBar:Phaser.Sprite;

        preload() {
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
        }

        create() {
            this.game.state.start('Game');
        }
    }
}
