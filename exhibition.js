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

var Exhibition = function(){

//
//	ENVIRONMENT
//

	var requestHandler = function( req ,rsp ){
		// parse request path
		var path = url.parse(req.url);
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
			
			r.push('</div>')
			r.push('</div>');
			r.push('</body>');
			r.push('</html>');
			
			rsp.end( r.join('\n') );
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
		,encoding: String	// base64 or json or xml or text
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

	// define our model with our schemas:
	var ExhibitModel = mongoose.model('ExhibitionModel',Exhibit);

//
//	INSTANTIATE ENVIRONMENT
//
	var xbt = new ExhibitModel();

	function requestHandler.register(function(){
		// PUSH A LABEL
		// ?pushLabel=label
		if( url.query.pushLabel ){
			xbt.labels.push({ label: [ url.query.pushLabel ] });
		};
	});
	function requestHandler.register(function(){
		if( url.query.pushAnExhibit ){
			xbt.exhibit.push({ labels: [ { context: 'handle' ,label: url.query.pushAnExhibit.split(/\s+/) } ] ,collection:
				 [
				 	{
						labels: [ { context: ['coolness'],label: ['12.5'] } ]
						,item: [
							{
								type: 'text/xml'
								,encoding: 'utf8'
								,parsed: {}
								,data: '<bold>and the <em>beautiful</em></bold>'
							}
						]
					}
				 	,{
						labels: [ { context: ['knees'] ,label: ['double','jointed'] } ]
						,item: [
							{
								type: 'text/xml'
								,encoding: 'utf8'
								,parsed: {}
								,data: '<bold>smelly oldies all day !!!</bold>'
							}
						]
					}
				 ]
			});
		}
	});

//
//	HTTP SERVER
//
	var server = http.createServer( requestHandler );
	server.listen( port ,ip );
	console.log('Started server on '+ip+':'+port+'...');

};

//
//	RUN
//
console.log('Welcome to Exhibition');
if( require.main === module ){
	console.log('Instantiating...');
	var exhibition = new Exhibition();
}
else {
	console.log('Modularizing...');
	module.exports = Exhibition;
}

// vim:set syntax=javascript ts=4:
