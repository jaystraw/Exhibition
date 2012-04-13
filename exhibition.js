//
//
//	EXHIBITION <http://exhibition.jaystraw.info/>
//
//	Data on Parade
//
//	by Jay Straw <http://jaystraw.info/>
//
//
///////////////////////////
//
// SINGLE STEP:
//
//		#!/bin/sh
//		node exhibition.js
//
//			- or -
//
//		// javascript
//		var xbn = new require('exhibition')();
//
//

//
//	DEPENDENCIES
//
var
	mongoose = require('mongoose')
	,extend = require('extend')
	,http = require('http')
	,url = require('url')
	,fs = require('fs')
;

var ExhibitionClass = function( config ){

//
//	ENVIRONMENT
//
	// defaults
	var defconfig = {
		port: 8080
		,ip: '127.0.0.1'
		,_id:'4f82993def66b7862d000009'
		,dbstring: 'mongodb://localhost/exhibition'
	};
	// set current
	config = ( config === undefined || typeof config !== 'object' )
		? defconfig
		: extend( defconfig ,config )
	;
	
//
//	INITIALIZATION
//
	// connect to MongoDB
	mongoose.connect( config.dbstring );

	//	SCHEMAS
	//
	Data = new mongoose.Schema({
		//	DATA
		//	Data is the raw stuff or media we want in our Exhibition
		type: { type: String }	// mime type
		,parseableAs: String	// base64 or json or xml or text
		,parsed: {}			// object to interact with data, where applicable (encoding == json | xml so far)
		,data: String		// actual content
	});
	Label = new mongoose.Schema({
		//	LABEL
		//	a Label describes something
		context: [ String ]	// dimensional part of label (empty string if none specified)
		,label: [ String ]	// positional part of label (can't be empty)
		,lang: String		// language code, by that standards body who made the thing
	});
	Item = new mongoose.Schema({
		//	ITEM
		//	an Item is Labeled Data
		labels: [ Label ]
		,item: [ Data ]
	});
	Collection = new mongoose.Schema({
		//	COLLECTION
		//	a Collection holds Items and/or Collections
		labels: [ Label ]
		,collection: [ Item ]	// should be Item || Collection but dunno how to express that
	});
	Exhibit = new mongoose.Schema({
		//	EXHIBIT
		//	an Exhibit holds Collections
		labels: [ Label ]
		,exhibit: [ Collection ]
	});
	Exhibition = new mongoose.Schema({
		//	EXHIBITION
		//	program state
		labels: [ Label ]
		,arb: [ {} ] // holds anything
		,exhibition: [ Exhibit ]
	});
//
//	REQUEST HANDLER
//
	requestHandler = new function(){

	//	X'ers -- transformers
		this.Xer = [];

	//	X -- transform
		this.X = function( source, target ){
			// target is string indicating serializer to use on source
			// Check for serializer
			if( this.Xer[target] === undefined ){
				return undefined;
			}

			// Run through selected serializer
			return this.Xer[target](source);
		};

	// Handlers
		var registry = []; //require('./handler/index.js');
		// add others manually
		this.register = function( handler ){
			registry.push( handler );
		};
		// handle!
		this.do = function( req ,rsp ){
			var path = url.parse(req.url,true);
			for( var i = 0; i < registry.length; i++ ){
				if( registry[i].call( this ,req ,rsp ,path ) === false ){
					break;
				}
			}
		};

	// Create Server
		this.createServer = function( port ,ip ){
			// create
			var server = http.createServer(
				// "bind" callback to appropriate (current) scope
				requestHandler.do.bind( requestHandler )
			);
			// bring online
			server.listen( port ,ip );
			// tell the people
			console.log('Started server on '+ip+':'+port+'...');
		};
	};

	// include installed Xer's
	requestHandler.Xer =
		extend(
			requestHandler.Xer
			,require('./Xer')
		)
	;

	// include installed handlers
	var handlers = require('./handler');
	for( var h = 0; h < handlers.length; h++ ){
		requestHandler.register( handlers[h] );
	}

	// define our model with our schemas:
	LabelModel = mongoose.model('LabelModel',Label);
	DataModel = mongoose.model('DataModel',Data);
	ItemModel = mongoose.model('ItemModel',Item);
	CollectionModel = mongoose.model('CollectionModel',Collection);
	ExhibitModel = mongoose.model('ExhibitModel',Exhibit);
	ExhibitionModel = mongoose.model('ExhibitionModel',Exhibition);

//
//	INSTANTIATE ENVIRONMENT
//
	xbn = new ExhibitionModel();

	ExhibitionModel.find({'label':['flampie']},function(err,docs){
		console.log('FOUND');
		console.log('Docs:');
		console.log(docs);
		console.log('Errors:');
		console.log(err);
	});
//
//	HTTP SERVER
//
	requestHandler.createServer( config.port ,config.ip );

};

//
//	RUN
//
console.log('Welcome to Exhibition');
if( require.main === module ){
	console.log('Instantiating...');
	var exhibition = new ExhibitionClass({});
}
else {
	console.log('Modularizing...');
	module.exports = ExhibitionClass;
}

// vim:set syntax=javascript ts=4:
