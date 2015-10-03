/**
 * Created by christian on 10/2/15.
 */
    
/// <reference path="../../../../node_modules/phaser/typescript/phaser.d.ts"/>
module Pinochle {
    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadbar', 'assets/images/preloader-bar.png');
        }

        create() {
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
        }
    }
}
