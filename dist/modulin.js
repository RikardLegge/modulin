var modulin=function(){"use strict";var classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),slicedToArray=function(){function e(e,t){var r=[],n=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(n=(o=s.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){i=!0,a=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw a}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),toConsumableArray=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},ImportParser=function(){function e(t){classCallCheck(this,e),this.tokenizer=t}return createClass(e,[{key:"parse",value:function(e,t,r){var n=t.imports,i=this.extractLines(e),a=slicedToArray(i,2),o=a[0],s=a[1];return n.push.apply(n,toConsumableArray(this.tokenizeLines(s,r))),o}},{key:"extractLines",value:function(e){var t=/^import [\t \w"-{}.]*?;?[^\n]*/gm,r=[],n=e.replace(t,function(e){return r.push(e),""});return[n,r]}},{key:"tokenizeLines",value:function(e,t){var r=this;return e.map(function(e){return r.tokenize(e,t)})}},{key:"tokenize",value:function(e,t){var r=this,n=t.replace(/[^\/]*$/,""),i=this.tokenizer.defaultMember(e),a=this.tokenizer.module(e,n),o=this.tokenizer.globMember(e),s=this.tokenizer.mappedMembers(e),u=[i,o].concat(toConsumableArray(s)).filter(function(e){return r.filterEmpty(e)}).map(function(e){return new ImportMember(e)});return new ImportStatement({moduleName:a,members:u})}},{key:"filterEmpty",value:function(e){return!!e.name}}]),e}(),ImportMember=function e(t){var r=t.name,n=t.alias,i=t.type;classCallCheck(this,e),this.name=r,this.alias=n,this.type=i},ImportStatement=function e(t){var r=t.id,n=t.moduleName,i=t.members;classCallCheck(this,e),this.moduleName=n,this.members=i,this.id=r},Modulin=function(){function e(t){var r=t.config,n=void 0===r?{}:r,i=t.importParser,a=t.exportParser,o=t.wrapperGenerator,s=t.dependencyRepositoryFactory,u=t.loaderFactory;classCallCheck(this,e),this.config=n,this.importParser=i,this.exportParser=a,this.wrapperGenerator=o,this.dependencyRepositoryFactory=s,this.loaderFactory=u,this.defautImports=[new ImportStatement({moduleName:"exports",id:"exports",members:[]})],this.defaultExports=[]}return createClass(e,[{key:"getScriptInterceptor",value:function(){return this.intercept.bind(this)}},{key:"intercept",value:function(e,t,r){var n={imports:[].concat(toConsumableArray(this.defautImports)),exports:[].concat(toConsumableArray(this.defaultExports))},i=this.importParser.parse(e,n,r),a=this.exportParser.parse(i,n,r),o=this.wrapperGenerator.wrap(a,n.imports,n.exports),s=document.location.origin,u=s+"/"+this.url;return'define.amd.__scriptSource = "'+r+'"; '+o+"\n//# sourceURL="+u}},{key:"createLoader",value:function(e){var t=this.dependencyRepositoryFactory({intercept:this.getScriptInterceptor(),basePath:e});return this.loaderFactory.createLoader(t)}}]),e}(),Request=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.method,n=void 0===r?"GET":r,i=t.url;return classCallCheck(this,e),new Promise(function(e,t){var r=new XMLHttpRequest;r.open(n,i),r.onreadystatechange=function(){4==r.readyState&&(200==r.status?e(r.responseText):t(r.responseText))},r.send()})},ScriptLoader=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.basePath,n=t.intercept;classCallCheck(this,e),this.basePath=r,this.intercept=n}return createClass(e,[{key:"load",value:function(e,t){var r=this,n=""+this.basePath+e;return new Request({url:n}).then(function(e){return new Script(r.intercept(e,n,t),n,t)})}}]),e}(),Script=function(){function Script(e,t,r){classCallCheck(this,Script),this.id=r,this.url=t,this.source=e}return createClass(Script,[{key:"execute",value:function execute(){eval(this.source)}}]),Script}(),TokenizerUtils=function(){function e(){classCallCheck(this,e)}return createClass(e,null,[{key:"splitMemberAndAlias",value:function(e){function t(e){return e.trim()}var r=/\s+as\s+/g,n="mapped",i=e.split(r).map(t),a=slicedToArray(i,2),o=a[0],s=a[1];return{name:o,alias:s,type:n}}},{key:"resolveRelativePath",value:function(e,t){var r=/(^|\/)([\\.]){3,}/g,n=/(^|\/)[.](?=[^.])/g,i=/(\.?[^.\n\/]+)+(^|\/)[.]{2}/,a=t[0];if("/"===a||"."===a){var o="/"===a?t:e+t;o=o.replace(r,""),o=o.replace(n,"");for(var s=o.replace(i,"");o!==s;)o=s,s=o.replace(i,"");return o}return t}},{key:"splitVariableAndValue",value:function(e){function t(e){return e.trim()}var r=/=/,n="mapped",i=e.split(r).map(t),a=slicedToArray(i,2),o=a[0],s=a[1];return{name:o,value:s,type:n}}},{key:"filterEmpty",value:function(e){return!!e.trim()}}]),e}(),ImportTokenizer=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"defaultMember",value:function(e){var t="default",r=/^\s*import\s+(\w+)/,n=e.match(r),i=n?n[1]:null;return{name:i,type:t}}},{key:"module",value:function(e,t){var r=/(?:from\s+)?(["'])([\w\/\-.]+)\1\s*;?\s*$/,n=e.match(r),i=n?TokenizerUtils.resolveRelativePath(t,n[2]):null;return i}},{key:"globMember",value:function(e){var t="all",r=/\*\s+as\s+(\w+)\s+from/,n=e.match(r),i=n?n[1]:null;return{name:i,type:t}}},{key:"mappedMembers",value:function(e){var t=/{([\w\s,]*)}/,r=e.match(t),n=r?r[1]:"";return n.split(",").filter(function(e){return TokenizerUtils.filterEmpty(e)}).map(function(e){return TokenizerUtils.splitMemberAndAlias(e)})}}]),e}(),ExportParser=function(){function e(t){classCallCheck(this,e),this.tokenizer=t}return createClass(e,[{key:"parse",value:function(e,t){var r=t.exports,n=this.extractLines(e),i=slicedToArray(n,2),a=i[0],o=i[1];return r.push.apply(r,toConsumableArray(this.tokenizeLines(o))),a}},{key:"extractLines",value:function(e){var t=[],r=/^\s*export\s+((?:let|var|const)\s+[^\n]+)/gm,n=e.replace(r,function(e,r){var n="variableDeclaration";return t.push({type:n,line:e}),r}),i=/^\s*export\s+(?:{[\w\s,-]*}|\*)[^\n]*\n?/gm,a=n.replace(i,function(e){var r="preDeclaredVariable";return t.push({type:r,line:e}),""}),o=/^\s*export\s+(default\s+)?(([\w{(]+)(?:\s+([\w]+))?)/gm,s=a.replace(o,function(e,t,r,n,i){return t?"exports['default'] = "+r:"exports['"+i+"'] = "+r}),u=/^\s*export\s+\w[^\n]*/gm,c=s.replace(u,function(e){throw"Invalid export: "+e});return[c,t]}},{key:"tokenizeLines",value:function(e){var t=this;return e.map(function(e){return t.tokenize(e)})}},{key:"tokenize",value:function(e){var t=e.type,r=e.line,n=void 0;switch(t){case"variableDeclaration":return n=this.tokenizer.variableDeclaration(r),new ExportStatement({type:"variable",members:n.members.map(function(e){return new ExportMember(e)})});case"preDeclaredVariable":return n=this.tokenizer.preDeclaredVariables(r),new ExportStatement({type:"mapped",members:n.members.map(function(e){return new ExportMember(e)}),module:n.module,moduleIsString:n.moduleIsString})}}}]),e}(),ExportMember=function e(t){var r=t.name,n=t.alias,i=t.type;classCallCheck(this,e),this.name=r,this.alias=n,this.type=i},ExportStatement=function e(t){var r=t.type,n=t.members,i=t.module,a=t.moduleIsString;classCallCheck(this,e),this.type=r,this.members=n,this.module=i,this.moduleIsString=a},ExportTokenizer=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"preDeclaredVariables",value:function(e){var t=/^\s*export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-\/]+)\3)?\s*;?\s*$\n?/,r=e.match(t);if(!r)throw"";var n=r[4],i=!!r[3],a=!!r[2],o=r[1].split(",").filter(function(e){return TokenizerUtils.filterEmpty(e)}).map(function(e){return TokenizerUtils.splitMemberAndAlias(e)});return{members:o,allMembers:a,module:n,moduleIsString:i}}},{key:"variableDeclaration",value:function(e){var t=/^\s*export\s+\w+\s+([^\n]+);/,r=e.match(t);if(!r)throw"";var n=r[1].split(",").filter(function(e){return TokenizerUtils.filterEmpty(e)}).map(function(e){return TokenizerUtils.splitVariableAndValue(e)});return{members:n}}}]),e}(),AmdModule=function e(t){var r=t.id,n=t.dependencies,i=t.factory;classCallCheck(this,e),this.id=r,this.dependencies=n,"function"==typeof i?(this.exports={},this.factory=i):(this.exports=i,this.factory=function(){})},AmdFactory=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"createLoader",value:function(e){function t(t,n,i){var a=r(t,n,i),o=new AmdModule(a);e.register(o)}function r(e,r,n){return"function"==typeof e||"Object"===e.constructor.name?{id:t.amd.__scriptSource,dependencies:[],factory:e}:"Array"===e.constructor.name?{id:t.amd.__scriptSource,dependencies:e,factory:r}:{id:e,dependencies:r,factory:n}}return t.amd={},t}}]),e}(),ImportGeneratorAmd=function(){function e(){classCallCheck(this,e),this.counter=0}return createClass(e,[{key:"generate",value:function(e){var t=this,r=e.map(function(e){var r=e.id||t.generateId();return{id:r,statement:e}}),n=r.map(function(e){return e.statement.moduleName}).map(function(e){return'"'+e+'"'}).join(","),i=r.map(function(e){return e.id}).join(","),a=r.map(function(e){var r=e.id,n=e.statement;return t.formatImportMembers(r,n.members)}).filter(TokenizerUtils.filterEmpty).join(";\n  ");return{dependencyList:"["+n+"]",dependencyArguments:i,dependencyMappings:a}}},{key:"generateId",value:function(){return"__DEP"+ ++this.counter}},{key:"formatImportMembers",value:function(e,t){var r=this;return t.map(function(t){return r.formatImportMember(e,t)}).join(";")}},{key:"formatImportMember",value:function(e,t){var r=t.name,n=t.alias||r;switch(t.type){case"default":return"var "+n+" = "+e+'.exports["default"]';case"all":return"var "+n+" = "+e+".exports";case"mapped":return"var "+n+" = "+e+'.exports["'+r+'"]';default:return""}}}]),e}(),ExportGeneratorAmd=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"generate",value:function(e){var t=this,r=e.map(function(e){return t.formatImportMembers(e.members)}).join(";\n  ");return{exportMappings:r}}},{key:"formatImportMembers",value:function(e){var t=this;return e.map(function(e){return t.formatImportMember(e)}).join(";")}},{key:"formatImportMember",value:function(e){var t=e.name,r=e.alias||t;switch(e.type){case"mapped":return"exports['"+r+"'] = "+t+";";default:return""}}}]),e}(),WrapperGeneratorAmd=function(){function e(t){var r=t.importGenerator,n=t.exportGenerator;classCallCheck(this,e),this.importGenerator=r,this.exportGenerator=n}return createClass(e,[{key:"wrap",value:function(e,t,r){var n=this.importGenerator.generate(t),i=n.dependencyList,a=n.dependencyArguments,o=n.dependencyMappings,s=this.exportGenerator.generate(r),u=s.exportMappings;return"define("+i+", function("+a+"){ "+o+"\n"+e+"\n"+u+"\n});"}}]),e}(),AmdDependencyResolver=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"resolve",value:function(e){for(var t=e.pendingModules,r=e.modules,n=0;n<t.length;n++){var i=t[n];if(this.hasMetDependencies(i,r)){var a=i.factory.apply(i,toConsumableArray(this.getDependencies(i,r)));a&&(i.exports=a),r.push(i),t.splice(n,1),n=-1}}}},{key:"implicitDependencies",value:function(e,t){switch(e){case"exports":return t.exports}}},{key:"dependencyToModule",value:function(e,t){var r=this;return function(n){return r.implicitDependencies(n,e)||t.find(function(e){return n===e.id})}}},{key:"getDependencies",value:function(e,t){return e.dependencies.map(this.dependencyToModule(e,t))}},{key:"hasMetDependencies",value:function(e,t){return e.dependencies.every(this.dependencyToModule(e,t))}}]),e}(),AmdDependencyRepository=function(){function e(t){var r=t.scriptLoader,n=t.dependencyResolver;classCallCheck(this,e),this.scriptLoader=r,this.dependencyResolver=n,this.loadingModuleIds=[],this.pendingModules=[],this.resolvedModules=[{id:"exports"}]}return createClass(e,[{key:"register",value:function(e){var t=this,r=this.getUnresolvedDependencies(e.dependencies);if(0===r.length)return this.pendingModules.push(e),this.dependencyResolver.resolve({pendingModules:this.pendingModules,modules:this.resolvedModules}),void this.detectCircularReferences();var n=this.getUnloadedDependencies(r);return 0===n.length?(this.pendingModules.push(e),void this.detectCircularReferences()):(n.forEach(function(e){t.loadingModuleIds.indexOf(e)===-1&&(t.loadingModuleIds.push(e),t.scriptLoader.load(e+".js",e).then(function(r){var n=t.loadingModuleIds.indexOf(e);n!==-1&&t.loadingModuleIds.splice(n,1),r.execute()}))}),this.pendingModules.push(e),void this.detectCircularReferences())}},{key:"detectCircularReferences",value:function(){0===this.loadingModuleIds.length&&this.pendingModules.length>0&&console.log("Possible circular dependency",this.pendingModules)}},{key:"getUnloadedDependencies",value:function(e){var t=this;return e.filter(function(e){return!t.pendingModules.find(function(t){return e===t.id})&&!t.loadingModuleIds.find(function(t){return e===t})})}},{key:"getUnresolvedDependencies",value:function(e){var t=this;return e.filter(function(e){return!t.resolvedModules.find(function(t){return e===t.id})})}}]),e}(),main=new Modulin({importParser:new ImportParser(new ImportTokenizer),exportParser:new ExportParser(new ExportTokenizer),loaderFactory:new AmdFactory,wrapperGenerator:new WrapperGeneratorAmd({importGenerator:new ImportGeneratorAmd,exportGenerator:new ExportGeneratorAmd}),dependencyRepositoryFactory:function(e){var t=e.intercept,r=e.basePath;return new AmdDependencyRepository({scriptLoader:new ScriptLoader({intercept:t,basePath:r}),dependencyResolver:new AmdDependencyResolver})}});return main}();