//
//
//	TRANSFORMATION LIBRARY
//
//	Xer makes an Exhibition something else, and back again
//
//	//////////////////////
//
//

module.exports['html'] =
	function XerHTML( source ){
		// response array
		var r = [], i = 0;

		// source should be one of the following:
		if( typeof source !== 'object' ){
			console.log('SHEET: html Xer needs a schema Item to work!');
			return '';
		}
		else if( source.label !== undefined ){
			r.push(''
				+'<li'
				+	' class="label"'
				+	((source.lang !== undefined)
						?' lang="'+source.lang+'"'
						:''
					)
				+	' title="'
				+		((source.context !== undefined)
							?source.context
							:source.label
						)
				+	'"'
				+'>'
				+	source.label
				+'</li>'
			);
		}
		else if( source.data !== undefined ){
			r.push('<div id="'+source._id+'" class="data">');
			r.push('<ul class="info">');
			r.push('<li class="type">'+source.type+'</li>');
			if( source.parseableAs !== undefined ){ r.push('<li class="parseableAs">'+source.parseableAs+'</li>'); }
			r.push('</ul>');
			r.push('<div class="actual-data">');
			r.push( source.data );
			r.push('</div>');
			r.push('</div>');
		}
		else if( source.item !== undefined ){
			r.push('<li class="item" id="'+source._id+'">');
			r.push('<ul class="labels">');
			for( i = 0; i < source.labels.length; i++ ){
				r.push( XerHTML( source.labels[i] ) );
			}
			r.push('</ul>');
			r.push('<div class="item-data">');
			for( i = 0; i < source.item.length; i++ ){
				r.push( XerHTML( source.item[i] ) );
			}
			r.push('</div>');
			r.push('</li>');
		}
		else if( source.collection !== undefined && source.collection.length ){
			r.push('<li class="collection" id="'+source._id+'">');
			r.push('<ul class="labels">');
			for( i = 0; i < source.labels.length; i++ ){
				r.push( XerHTML( source.labels[i] ) );
			}
			r.push('</ul>');
			r.push('<ul class="collection-items">');
			for( i = 0; i < source.collection.length; i++ ){
				r.push( XerHTML( source.collection[i] ) );
			}
			r.push('</ul>');
			r.push('</li>');
		}
		else if( source.exhibit !== undefined ){
			r.push('<div class="exhibit">');
			r.push('<ul class="labels">');
			for( i = 0; i < source.labels.length; i++ ){
				r.push( XerHTML( source.labels[i] ) );
			}
			r.push('</ul>');
			r.push('<ul class="exhibit-collections">');
			for( i = 0; i < source.exhibit.length; i++ ){
				r.push( XerHTML( source.exhibit[i] ) );
			}
			r.push('</ul>');
			r.push('</div>');
		}
		else if( source.exhibition !== undefined ){
			r.push('<div class="exhibition">');
			r.push('<ul class="labels">');
			for( i = 0; i < source.labels.length; i++ ){
				r.push( XerHTML( source.labels[i] ) );
			}
			r.push('</ul>');
			r.push('<div class="exhibition-exhibits">');
			for( i = 0; i < source.exhibition.length; i++ ){
				r.push( XerHTML( source.exhibition[i] ) );
			}
			r.push('</div>');
			r.push('</div>');
		}
		else {
			console.log('SHEET: html Xer needs a schema Item to work! unkown object:');
			console.log(source);
			return '"unknown object"';
		}

		return r.join('\n');
	}
;

