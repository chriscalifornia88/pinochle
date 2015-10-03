/**
 * Created by christian on 10/2/15.
 */

/// <reference path="../../../../node_modules/phaser/typescript/phaser.d.ts"/>
module Pinochle {
    export class Game extends Phaser.State {
        loading:boolean = false;

        dialog:Dialog;

        create() {
            //this.game.physics.arcade.enable(this.player);

            this.dialog = new Dialog();

            // Setup input
            this.game.input.mouse.enabled = true;
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
