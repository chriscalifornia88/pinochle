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
    
module Pinochle {
    export class App extends Phaser.Game {
        constructor() {
            super(1366, 768, Phaser.CANVAS, '', null);

            this.state.add('Preload', Pinochle.Preload, false);
            this.state.add('Boot', Pinochle.Boot, true);
            this.state.add('Game', Pinochle.Game, false);
        }
    }
}

window.onload = function () {
    new Pinochle.App;
}
