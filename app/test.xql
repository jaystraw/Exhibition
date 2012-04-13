xquery version "1.0";

let $test:= 
    <dispatch xmlns="http://exist.sourceforge.net/NS/exist">
        <forward servlet="XQueryServlet">
            <set-attribute name="xquery.source" value="'Exhibition'" />
        </forward>
    </dispatch>

return
    
    $test