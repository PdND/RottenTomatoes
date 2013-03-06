RottenTomatoes
==============

RottenTomatoes API library for Node.JS

Still work in progress!

How it works
==============

Initialization
-------------

```javascript
var rottentomatoes = require( 'rottentomatoes' );
var tomatoes = new rottentomatoes.init( API_KEY );
```

Searching by title
-------------

```javascript
var search_query = 'Nosferatu';

tomatoes.search( search_info, function( error, results ) {
  //  ...
} );

//  Advanced search

var search_info = {
  q: 'The Godfather',
  page: 1,
  limit: 5
};

tomatoes.search( search_info, function( error, results, total_results ) {
  //  ...
} );
```

Searching by id
-------------

```javascript
<<<<<<< HEAD
tomatoes.movie.info( 123456 /* movie id */, function( error, results ) {
=======
tomatoes.movie.info( MOVIE_ID, function( error, results ) {
  //  ...
} );
```

Searching by imdb id
-------------

```javascript
tomatoes.movie.alias( 'imdb', IMDB_ID, function( error, results ) {
>>>>>>> Added movie.alias function for movie_alias API
  //  ...
} );
```

Dependencies
==============

- restify >= 2.3.0
- underscore >= 1.4.0
