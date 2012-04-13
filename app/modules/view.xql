xquery version "3.0";

import module namespace config="http://exist-db.org/xquery/apps/config" at "config.xqm";
import module namespace xbn="http://jaystraw.info/exhibition" at "xbn.xqm";

declare namespace t="http://exist-db.org/xquery/apps/transform";

declare option exist:serialize "method=xml media-type=text/xml";

declare function t:transform($node as node()) {
    typeswitch ($node)
    case element() return
        switch ($node/@id)
            case "app-info" return
                config:app-info($node)
            case "exhibition" return
                xbn:get('exhibition')
            default return
                element { node-name($node) } {
                    $node/@*, for $child in $node/node() return t:transform($child)
                }
    default return
        $node
};

let $input := request:get-data()
return
    xbn:get('')
