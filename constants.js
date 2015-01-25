var FUNCTION_REGEXP     = /function(?:\s+[A-Za-z\$\_][A-Za-z\$\_0-9]*)?\s*\(([^\)]*)/;
var DOCBLOCK_BOUNDARY   = /[A-Za-z\[\]]/;
var DOCBLOCK_START      = /^\s*\/\*\*/;
var DOCBLOCK_MIDDLE     = /^\s*\*/;
var DOCBLOCK_END        = /^\s*\*\//;
var DOCBLOCK_FIELD      = /(\[\[[^\]]+\]\])/;
var DOCBLOCK_LAST_FIELD = /.*(\[\[[^\]]+\]\])/;
var DOCBLOCK_PAR_OR_RET = /^\s*\* (\s{6,}|@(param|returns?))/;
var DOCBLOCK_PAR_LINE 	= /(\s+\*\s+@param\s+)([^ ]+\s+)([^ ]+\s+)(.*)/;
var DOCBLOCK_RET_LINE 	= /(\s+\*\s+@returns?\s+)([^ ]+\s+)/;
var DOCBLOCK_MULTI_LINE = /^(\s*)(\*)(\s+)/;
var INDENTATION_REGEXP  = /^([\t\ ]*)/;
var FUNCTION_NAME_PREFIX = { "is" : "Checks if", "replace" : "Replaces", "create" : "Creates", 
                             "delete" : "Deletes the", "remove" : "Removes" ,                              
                             "bring" : "Brings", "convert" : "Converts" , "get" : "Gets","set" : "Sets" , "on" : "On",
                             "find" : "Finds" , "filter" : "Filters" , "send" : "Sends", "make" : "Makes" , "decide" : "Decides" , "cut" : "Cuts" , "copy" : "Copies" , "paste" : "Pastes" , "close" : "Closes" , "open" : "Opens" , "equal" : "Checks if it is equal to",
                                "render" : "Renders" , "divert" : "Diverts" , "destroy" : "Destroys", "move" : "Moves" , "drag" : "Drags" , "drop" : "Drops" , "crop" : "Crops"  , "simulate" : "Simulates" , "trigger" : "Triggers" , "increase" : "Increases",
                                "decrease" : "Decreases" , "subtract"  : "Subtracts",
                                "shrink" : "Shrinks", "include" : "Includes", "append" : "Appends" , "calculate" : "Calculates" , "formulate" : "Formulates" , "manipulate" : "Manipulates" , "init" : "Initializes" , "initialize" : "Initializes" ,
                                "load" : "Loads" , "keep" : "Keeps" , "start" : "Starts" , "stop" : "Stops" , "pause" : "Pauses" , "fill" : "Fills" , "empty" : "Empties the" , "transfer" : "Transfers" , "traverse" : "Traverses", "expand" : "Expands" ,
                                "draw" : "Draws" , "erase" : "Erases" , "clear" : "Clears", "display" : "Dislays " , "show" : "Shows" , "hide" : "Hides", "animate" : "Animates" , "listen" : "Listens" , "bind" : "Binds" , "fire" : "Fires" ,
                                "change" : "Changes" , "fade" : "Fades" , "highlight" : "Highlights" , "freeze" : "Freezes" , "clone":"Clones" , "rotate" : "Rotates", "transform" : "Transforms"  , "intersect" : "Intersects"   , "contain" : "Check if contains", "generate" : "generates"
                               };