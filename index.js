var restify = require( 'restify' ); 
var $       = require( 'underscore' ); 

function tomatoes( apikey ) {

    /*
    |   Error codes:
    |   -1: invalid parameter
    |   -2: request error
    |   -3: invalid response
    */

    var self = this;

    self.apikey = apikey;
    self.client = new restify.createJsonClient( {
        url: 'http://api.rottentomatoes.com'
    } );

    self.movie = {

        /*
        |   movie lookup by an id from a different vendor (imdb)
        |   -----------------------------------------
        |   type = vendor name: imdb
        |
        |   id = vendor id
        */
        alias: function( type, id, callback ) {

            if( !$.isString( type ) )
            {
                if( !$.isUndefined( callback ) )
                    callback( new Error( -1, 'type has to be a string' ) );

                return;
            }

            if( $.isUndefined( id ) || $.isObject( id ) )
            {
                if( !$.isUndefined( callback ) )
                    callback( new Error( -1, 'id has to be a string or an integer' ) );

                return;
            }

            var request_ep = '/api/public/v1.0/movie_alias.json?type=' + type + '&id=' + parseInt( id ) + '&apikey=' + self.apikey;

            self.client.get( request_ep, function( err, req, res, object ) {

                if( err )
                {
                    err.number = -2;
                    callback( err );
                }
                else
                {
                    if( $.isUndefined( object ) || $.isNull( object ) )
                        callback( new Error( -3, 'cannot understand server response' ) );
                    else
                    {
                        callback( null, object );
                    }

                }

            } );

        },

        /*
        |   gets movie info given movie id
        |   -----------------------------------------
        |   movieid = rottentomatoes movie id
        |
        |   callback(error, results) is called on error or complete
        */
        info: function( movieid, callback ) {

            if( $.isUndefined( movieid ) || $.isObject( movieid ) )
            {
                if( !$.isUndefined( callback ) )
                    callback( new Error( -1, 'movieid has to be a string or an integer' ) );

                return;
            }

            var request_ep = '/api/public/v1.0/movies/' + parseInt( movieid ) + '.json?apikey=' + self.apikey;

            self.client.get( request_ep, function( err, req, res, object ) {

                if( err )
                {
                    err.number = -2;
                    callback( err );
                }
                else
                {
                    if( $.isUndefined( object ) || $.isNull( object ) )
                        callback( new Error( -3, 'cannot understand server response' ) );
                    else
                    {
                        callback( null, object );
                    }

                }

            } );

        },

    };

    /*
    |   searches for a movie in rottentomatoes db
    |   -----------------------------------------
    |   search_info can be a string or an object 
    |       string: search query
    |       object: {
    |           q       -> search query,
    |           limit   -> number of results per page,
    |           page    -> page number
    |       }
    |
    |   callback(error, results) is called on error or complete
    |   if there's no result results is an empty array
    */
    self.search = function( search_info, callback ) {

        if( $.isUndefined( search_info ) )
        {
            if( !$.isUndefined( callback ) )
                callback( new Error( -1, 'search_info cannot be undefined' ) );

            return;
        }

        var q       = '',
            limit   = 25,
            page    = 1;

        if( $.isString( search_info ) )
            q = search_info;
        else
        {
            if( !$.isUndefined( search_info.q ) )
                q = search_info.q;
            else
            {
                callback( new Error( -1, 'search_info.q cannot be undefined' ) );
                return;
            }

            if( !$.isUndefined( search_info.limit ) && $.isFinite( search_info.limit ) )
                limit = search_info.limit;

            if( !$.isUndefined( search_info.page ) && $.isFinite( search_info.page ) )
                page = search_info.page;
        }

        //  everything should be fine, send the request
        var request_ep = '/api/public/v1.0/movies.json?q=' + encodeURIComponent( q ) + '&page=' + parseInt( page ) + '&page_limit=' + parseInt( limit ) + '&apikey=' + self.apikey;

        self.client.get( request_ep, function( err, req, res, object ) {

            if( err )
            {
                err.number = -2;
                callback( err );
            }
            else
            {
                if( $.isUndefined( object ) || $.isNull( object ) )
                    callback( null, [ ], 0 );
                else
                {
                    callback( null, object.movies, object.total );
                }

            }

        } );

    };

}

module.exports.init = function( apikey ) {
    return new tomatoes( apikey );
};

