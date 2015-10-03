var elixir = require('laravel-elixir');

elixir(function(mix) {
    mix
        .copy('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js', 'public/js/vendor/bootstrap')
        .copy('node_modules/jquery/dist/jquery.min.js', 'public/js/vendor/jquery')
        .copy('node_modules/jquery/dist/jquery.min.map', 'public/js/vendor/jquery');
});
