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
	,http = require('http')
	,url = require('url')
	,fs = require('fs')
;

var ExhibitionClass = function(){

//
//	ENVIRONMENT
//

	var requestHandler = new function(){
		var registry = [];
		this.register = function( handler ){
			registry.push( handler );
		};
		this.do = function( req ,rsp ){
			var path = url.parse(req.url,true);
			for( var i = 0; i < registry.length; i++ ){
				if( registry[i].call( this ,req ,rsp ,path ) === false ){
					break;
				}
			}
		};
		this.createServer = function(){
			var server = http.createServer( requestHandler.do.bind( this ) );
			server.listen( port ,ip );
			console.log('Started server on '+ip+':'+port+'...');
		};
	};

	//	SERVER
	//
	var port = 8080;
	var ip = '127.0.0.1';

	// connect to MongoDB
	mongoose.connect('mongodb://localhost/exhibition');

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

	// define our model with our schemas:
	var ExhibitionModel = mongoose.model('ExhibitionModel',Exhibition);

//
//	INSTANTIATE ENVIRONMENT
//
	var xbn = new ExhibitionModel();

	requestHandler.register(function(req,rsp,path){
		// PUSH A LABEL
		// ?pushLabel=label
		if( path.query !== undefined && path.query.pushLabel ){
			var label = { label: [ path.query.pushLabel ] };
			xbn.labels.push( label );
			xbn.save(function(err,data){
				if(err){console.log('SHEET: '+err);}
				else{ }
			});
		};
	});
	requestHandler.register(function(req,rsp,path){
		if( path.query !== undefined && path.query.pushAnExhibit ){
			var item = [];
			item[0] = {
				labels: [ { context: ['coolness'],label: ['12.5'] } ]
				,item: [
					{
						type: 'text/xml'
						,encoding: 'utf8'
						,parsed: {}
						,data: '<bold>and the <em>beautiful</em></bold>'
					}
				]
			};
			item[1] = {
				labels: [ { context: ['knees'] ,label: ['double','jointed'] } ]
				,item: [
					{
						type: 'text/xml'
						,encoding: 'utf8'
						,parsed: {}
						,data: '<bold>smelly oldies all day !!!</bold>'
					}
				]
			};
			var collection = {
				labels: [ { context: ['given'], label: path.query.pushAnExhibit.split(/\s+/) }, { label: ['new','collection'] } ]
				,collection: [ item[0] ,item[1] ]
			};
			var exhibit = {
				labels: [ { label: ['new','exhibit'] } ]
				,exhibit: [ collection ]
			};

			xbn.exhibition.push( exhibit );

			//	SAVE
			xbn.save(function(err,data){
				if(err){console.log('SHEET: '+err);}
				else{ }
			});
		}
	});
	requestHandler.register(function(req,rsp,path){
		// decide what to do
		// SCRIPTS
		if( path.pathname === '/script' || path.pathname.substr( 0 ,8 ) === '/script/' ){
			rsp.end('/* nothing yet to see here */');
		}
		else
		// STYLES
		if( path.pathname === '/style' || path.pathname.substr( 0,7 ) === '/style/' ){
			rsp.end('/* nothing to yet here see */');
		}
		else
		// EVERYTHING ELSE
		{
			rsp.writeHead(
				200
				,{'Content-Type':'text/html'}
			);
			var r = [];

			r.push('<!DOCTYPE html>');
			r.push('<html lang="en">');
			r.push('<head>');
			r.push('<title>EXHIBITION</title>');
			r.push('<link rel="stylesheet" type="text/css" href="/style" />');
			r.push('<script type="text/javascript" src="/script"></script>');
			r.push('</head>');
			r.push('<body>');
			r.push('<div class="exhibition">');
			r.push('<div class="main-exhibit">');
			
			r.push( xbn.toString() );

			r.push('</div>')
			r.push('</div>');
			r.push('</body>');
			r.push('</html>');
			
			rsp.end( r.join('\n') );
		};
	});


//
//	HTTP SERVER
//
	requestHandler.createServer();
};

//
//	RUN
//
console.log('Welcome to Exhibition');
if( require.main === module ){
	console.log('Instantiating...');
	var exhibition = new ExhibitionClass();
}
else {
	console.log('Modularizing...');
	module.exports = ExhibitionClass;
}

// vim:set syntax=javascript ts=4:
