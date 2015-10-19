/**
 * Created by christian on 11/17/15.
 */
module Pinochle.Models {
    export class Player {
        public id:number;
        public user:User;
        public game_id:number;
        public created_at:string;
        public updated_at:string;
        public seat:number;
        public card_count:number;
        public hand:string[];
    }
}
