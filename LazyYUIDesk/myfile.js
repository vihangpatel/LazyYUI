$(document).ready(function(){

    'use strict';

    var codeText = $('#input').html(),
        skipped = 0,
        total = 0,
        done = 0;


    main();

    function main(){    
        var keys = getKeys();
        skipped = 0 ;
        done = 0;
        total = keys.length;

        for(var i = 0 ; i < keys.length ; i++){
            createDocBlock(keys[i]);   
        }

        //console.clear();
        console.log(codeText);
        fillUI();

    }

    function fillUI(){
        $('#input').html(codeText);
        $('#output').html(codeText);
        $("#sloc").html("Lines : " + codeText.split("\n").length);
        $("#skipped").html("Skipped YUI : " + skipped);
        $("#done").html("Done YUI : " + done);
    }

    function getKeys(){
        return Object.keys(code);   
    }

    function createDocBlock(key){
        var lineObject = getLine(key);
        if(isNullOrUndefined(lineObject)){
            console.debug('something wrong');
            skipped++;
            return false;
        }

        var docExist = DOCBLOCK_END.test(getCodeAt(lineObject.lineNo - 1)) ? true : false;
        if(docExist){
            console.info('doc block already exists for ', key);
            return;
        }

        var functionSignature = FUNCTION_REGEXP.exec(lineObject.text);    
        // Function documentation
        if(!isNullOrUndefined(functionSignature)) {
            createFunctionDocBlock(key , functionSignature , lineObject);   
        }
        else {
            // Attribute Documentation
            createAttrDocBlock(key , lineObject);
        }    
        done++;
        return true;
    }

    function createAttrDocBlock(key , lineObject){
        var attrText = lineObject.text.trim(),
            regExp = '/' + attrText + '\s*:\s*[A-Za-z\$\0-9\/[\s*/]]*',
            defaultVal = getAttributeValue(key , attrText);

        var text = ['/**'];
        text.push(' * [[Description]]' );
        text.push(' * @attribute ' + key );
        text.push(' * @type ' + getAttrType( key ) );
        text.push(' * @default ' +  defaultVal);   
        text.push(' */');
        console.log(getYUITextFromArray(text , lineObject.indentation));
        insertYUIDocBlock(getYUITextFromArray(text , lineObject.indentation) , lineObject.lineNo);
    }

    function getAttrType(defaultVal){
        var type = typeof code[defaultVal];    
        return type[0].toUpperCase() + type.slice(1);
    }

    function getAttributeValue(key , lineText){
        key = key.trim();
        lineText = lineText.trim();
        lineText = lineText.replace(key,'');
        lineText = lineText.replace(':' , '');
        lineText = lineText.replace(',','');
        return lineText.trim();
    }

    function getExistingDocSignature(position) {
        // get start line of documentation
        var i = 1;
        var currentLine = getCodeAt(position - i);
        var docLines = [];
        while (!DOCBLOCK_START.test(currentLine)) {
            docLines.push(currentLine);
            i++;
            currentLine = getCodeAt(position - i);
        }
        docLines.reverse();
        return docLines;
    }

    function createFunctionDocBlock(key , matches , lineObject){        
        var text = [];
        text.push('/**');

        var functionObject = getCurrentFunctionObject(lineObject.text);
        if(!isNullOrUndefined(functionObject)){
            text.push(' * ' + getFunctionDescription(key) );
            text.push(' * @method ' + key.trim() );
            text.push(' * @' + functionObject.visibility );
        }

        if(matches[1].length > 0)
        {
            var parameters = matches[1].split(',');
            for(var i = 0 ; i < parameters.length ; i++ ){
                text.push(' * @param {[[Type]]} ' + parameters[i].trim() + ' [[Description]]' );   
            }
        }

        if(checkForReturn(key)){
            text.push(' * @returns {[[Type]]} [[Description]]');   
        }

        text.push('*/');
        console.log(getYUITextFromArray(text , lineObject.indentation));
        insertYUIDocBlock(getYUITextFromArray(text , lineObject.indentation), lineObject.lineNo);
    }

    function checkForReturn(key){
        var blockText = code[key].toString(),
            regExp = /return\s+/,
            index = regExp.exec(blockText);
        return !isNullOrUndefined(index);
    }

    function getCurrentFunctionObject(lineText){ 
        var functionName =  "" + lineText.substr(0,lineText.indexOf(":")); 

        functionName = functionName.trim();
        return functionName.length === 0 ? null :
        { functionName : functionName , visibility : functionName[0] === "_" ? "private" : "public" };
    }

    function getFunctionDescription(functionName){
        functionName = functionName.trim();
        var lastIndexOfUnderScore = functionName.lastIndexOf('_') ;
        functionName = lastIndexOfUnderScore !== -1 ? functionName.slice(lastIndexOfUnderScore + 1) : functionName;
        var index = -1, i = 0 , matchedPrefix = "",
            prefixes = Object.keys(FUNCTION_NAME_PREFIX);


        for(i = 0 ; i < prefixes.length ; i++){
            index = functionName.search(prefixes[i]);
            if(index === 0){
                matchedPrefix = FUNCTION_NAME_PREFIX[prefixes[i]];                
                break;
            }
        }
        if(matchedPrefix.length !== 0){
            functionName = functionName.substr(prefixes[i].length , functionName.length - prefixes[i].length);
        }

        return matchedPrefix + functionName.replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str){ return str.toLowerCase(); }).toLowerCase();
    }

    function getLine(key){
        var lines = codeText.split('\n'),
            lineNo = -1,
            indentation = 0,
            lineAtIndex , bGo = false;
        for(var i = 0 ; i < lines.length ; i++){
            lineAtIndex = lines[i].trimLeft();
            var index = getMatch( lineAtIndex , key );
            if(index === 0 && !isInsideFunctionBlock(key,lineAtIndex)){
                bGo = true;
                lineNo = i;
                indentation = INDENTATION_REGEXP.exec(lines[i])[0];
                console.info(lineAtIndex);
                break;
            }
        }
        return bGo ? { text : lineAtIndex , lineNo : lineNo ,indentation : indentation} : null;
    }

    function getMatch(sourceLine , key ){
        sourceLine = sourceLine.trim();
        var index = sourceLine.search(key);
        // Handle $ sign differently
        if(index === -1 && sourceLine[0] === '$' && key[0] === '$'){
            sourceLine = sourceLine.slice(1);
            key = key.slice(1);
            return getMatch( sourceLine , key );
        }
        return index;
    }

    function getYUITextFromArray(array, indentation){
        return indentation + array.join('\n' + indentation);    
    }

    function isInsideFunctionBlock( key , match){
        if(typeof code[key] !== 'function'){
            return false;   
        }
        var functionText = code[key].toString();
        return functionText.search(match) !== -1;
    }

    function insertYUIDocBlock(yuiDoc , lineNo)
    {
        var lines = codeText.split('\n');
        lineNo = lineNo > lines.length ? lines.length : lineNo;

        var afterCode = lines.splice(lineNo),
            beforeCode = lines;

        beforeCode = beforeCode.concat(yuiDoc);
        codeText = beforeCode.concat(afterCode);
        codeText = codeText.join('\n');
    }

    function isNullOrUndefined(object){
        return object === null || typeof object === 'undefined';   
    }

    function getCodeAt(lineNo){
        var lines = codeText.split('\n');
        return lineNo > lines.length ? '' : lines[lineNo];
    }

});