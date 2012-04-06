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

//
//	SCHEMAS
//
var Data = new mongoose.Schema({
	type: String		// mime type
	,encoding: String	// base64 or json or xml or text
	,parsed: {}			// object to interact with data, where applicable (encoding == json | xml so far)
	,data: String		// actual content
});
var Label = new mongoose.Schema({
	context: [ String ]	// context
	,label: [ String ]
	,lang: String
});
var Item = new mongoose.Schema({
	labels: [ Label ]
	,item: [ Data ]
});
var Collection = new mongoose.Schema({
	labels: [ Label ]
	,collection: [ Item ]
});
var Exhibit = new mongoose.Schema({
	labels: [ Label ]
	,exhibit: [ Collection ]
});


// vim:set syntax=javascript ts=4:
