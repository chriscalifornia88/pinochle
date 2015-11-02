/**
 * Created by christian on 11/18/15.
 */
var Pinochle;
(function (Pinochle) {
    var Seat;
    (function (Seat) {
        var Position;
        (function (Position) {
            Position[Position["Bottom"] = 0] = "Bottom";
            Position[Position["Left"] = 1] = "Left";
            Position[Position["Top"] = 2] = "Top";
            Position[Position["Right"] = 3] = "Right";
        })(Position || (Position = {}));
        ;
    })(Seat = Pinochle.Seat || (Pinochle.Seat = {}));
})(Pinochle = exports.Pinochle || (exports.Pinochle = {}));
var Pinochle;
(function (Pinochle) {
    var Seat = (function () {
        function Seat(number, rectangle, rotation) {
            this._number = number;
            this._rectangle = rectangle;
            this._rotation = rotation;
        }
        Object.defineProperty(Seat.prototype, "number", {
            get: function () {
                return this._number;
            },
            set: function (value) {
                this._number = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Seat.prototype, "rectangle", {
            get: function () {
                return this._rectangle;
            },
            set: function (value) {
                this._rectangle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Seat.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
            },
            enumerable: true,
            configurable: true
        });
        return Seat;
    })();
    Pinochle.Seat = Seat;
})(Pinochle || (Pinochle = {}));
