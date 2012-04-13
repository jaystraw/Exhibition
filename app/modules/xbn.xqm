(:

	EXHIBITION MODULE

:)
module namespace xbn="http://jaystraw.info/exhibition";

declare variable $xbn:app-root := 
    let $rawPath := system:get-module-load-path()
    let $modulePath :=
        (: strip the xmldb: part :)
        if (starts-with($rawPath, "xmldb:exist://")) then
            if (starts-with($rawPath, "xmldb:exist://embedded-eXist-server")) then
                substring($rawPath, 36)
            else
                substring($rawPath, 15)
        else
            $rawPath
    return
        substring-before($modulePath, "/modules")
;

declare function xbn:get( $exhibition ){

	collection(concat($xbn:app-root,'/local'))//exhibition

};

