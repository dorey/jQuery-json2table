(function($){
    //Holds hierarchical structure with added class methods.
    var JsonTableObject = function(name, data){
        if('undefined'==typeof data) {
            return false;
        } else {
            var _t = new JsonTableObject;
            _t.__name__ = name;
            $.each(data, function(k, v){
                if($.type(v)==='string' || $.type(v)==='number' || $.type(v)==='null') {
                    _t[k] = new JsonTableKeyValue(k, v);
                } else if($.type(v)==='object' || $.type(v)==='array') {
                    _t[k] = new JsonTableObject(k, v);
                } else { /*--  console.log($.type(v)) --*/ }
            });
            return _t;
        }
    };
    JsonTableObject.prototype = new Object();
    $.extend(JsonTableObject.prototype, {
        childCount: function(){
            var count = 0;
            $.each(this, function(k, v){
                if(v instanceof JsonTableObject) {
                    count += v.childCount();
                } else if(v instanceof JsonTableKeyValue) {
                    count++;
                }
            });
            return count;
        },
        td: function(){
            return $("<td />", {rowspan: this.childCount(), 'class': 'children'}).html(Deslug(this.__name__, this));
        },
        getTable: function(){
            var table = $("<table />"),
                  tr = $("<tr />");
            function getTds(oa) {
                tr.append(oa.td());
                $.each(oa, function(k, v){
                    if(v instanceof JsonTableObject) {
                        getTds(v);
                    } else if(v instanceof JsonTableKeyValue) {
                        tr.append(v.keyTd())
                            .append(v.valTd());
                        table.append(tr);
                        tr = $("<tr />");
                    }
                });
            }
            getTds(this);
            return table;
        }
    })
    
    //Holds lowest-level of Json hierarchy -- key/value pairs
    var JsonTableKeyValue = function(name, __value__){
        this.__name__ = name;
        this.__value__ = __value__ || "";
        this.length = this.__value__.length;
    };
    with(JsonTableKeyValue.prototype = new String) {
        toString = valueOf = function(){return this.__value__};
    }
    $.extend(JsonTableKeyValue.prototype, {
        keyTd: function(){return $("<td />", {'class':'key'}).html(Deslug(this.__name__, this));},
        valTd: function(){return $("<td />", {'class':'val'}).html(this.__value__);}
    });
    
    var Deslug = function(str, cntxt){
        return function(i, html) {return str;}
    }
    $.setJson2tableDeSlugger = function(cb){if($.type(cb)==='function') Deslug = cb;}
    
    $.json2table = function(json, name) {
        var name = name || 'Root'
        return new JsonTableObject(name, json).getTable();
    };
})(jQuery)
