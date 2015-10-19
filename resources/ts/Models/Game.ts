/**
 * Created by christian on 11/17/15.
 */
module Pinochle.Models {
    export class Game {
        public id:number;
        public name:string;
        public play_area:string[];
        public active:boolean;
        public players:Models.Player[];
        public created_at:string;
        public updated_at:string;
    }
}
