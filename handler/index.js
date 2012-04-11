//
//
//	REQUEST HANDLERS
//
//	facilitate Parades on which are Data
//
//	////////////////
//
//

module.exports = [];

module.exports.push(
	function(req,rsp,path){
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
	}
);

module.exports.push(
	function(req,rsp,path){
		if( path.query !== undefined && path.query.pushAnExhibit ){
			var item = [];
			item[0] = {
				labels: [ { context: ['coolness'],label: ['12.5'] } ]
				,item: [
					{
						type: 'text/xml'
						,parseableAs: 'xml'
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
						,parseableAs: 'xml'
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
	}
);

module.exports.push(
	function(req,rsp,path){
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
			r.push( requestHandler.X( xbn ,'html' ) );
			r.push('</div>');
			r.push('</body>');
			r.push('</html>');
			
			rsp.end( r.join('\n') );
		};
	}
);


