(self.webpackChunkReactNativeComponents=self.webpackChunkReactNativeComponents||[]).push([[179],{"./components sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.(?:ts%7Ctsx%7Cjs%7Cjsx)?)$":(module,__unused_webpack_exports,__webpack_require__)=>{var map={"./Button/Button.stories.tsx":"./components/Button/Button.stories.tsx"};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id="./components sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.(?:ts%7Ctsx%7Cjs%7Cjsx)?)$"},"./.storybook/preview.js":(__unused_webpack_module,exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.parameters=void 0;exports.parameters={actions:{argTypesRegex:"^on[A-Z].*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}}},"./.storybook/preview.js-generated-config-entry.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.weak-map.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-properties.js");var _clientApi=__webpack_require__("./node_modules/@storybook/client-api/dist/esm/index.js"),config=function _interopRequireWildcard(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache(r);if(t&&t.has(e))return t.get(e);var n={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var i=a?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u]}return n.default=e,t&&t.set(e,n),n}(__webpack_require__("./.storybook/preview.js"));function _getRequireWildcardCache(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(_getRequireWildcardCache=function _getRequireWildcardCache(e){return e?t:r})(e)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(config).forEach((function(key){var value=config[key];switch(key){case"args":return(0,_clientApi.addArgs)(value);case"argTypes":return(0,_clientApi.addArgTypes)(value);case"decorators":return value.forEach((function(decorator){return(0,_clientApi.addDecorator)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return(0,_clientApi.addLoader)(loader,!1)}));case"parameters":return(0,_clientApi.addParameters)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return(0,_clientApi.addArgTypesEnhancer)(enhancer)}));case"argsEnhancers":return value.forEach((function(enhancer){return(0,_clientApi.addArgsEnhancer)(enhancer)}));case"render":return(0,_clientApi.setGlobalRender)(value);case"globals":case"globalTypes":var v={};return v[key]=value,(0,_clientApi.addParameters)(v,!1);case"__namedExportsOrder":case"decorateStory":case"renderToDOM":return null;default:return console.log(key+" was not supported :( !")}}))},"./components/Button/Button.tsx":(__unused_webpack_module,exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _interopRequireDefault=__webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");Object.defineProperty(exports,"__esModule",{value:!0}),exports.MyButton=void 0;_interopRequireDefault(__webpack_require__("./node_modules/react/index.js"));var _StyleSheet=_interopRequireDefault(__webpack_require__("./node_modules/react-native-web/dist/exports/StyleSheet/index.js")),_Text=_interopRequireDefault(__webpack_require__("./node_modules/react-native-web/dist/exports/Text/index.js")),_TouchableOpacity=_interopRequireDefault(__webpack_require__("./node_modules/react-native-web/dist/exports/TouchableOpacity/index.js")),_View=_interopRequireDefault(__webpack_require__("./node_modules/react-native-web/dist/exports/View/index.js")),_jsxRuntime=__webpack_require__("./node_modules/react/jsx-runtime.js"),styles=_StyleSheet.default.create({button:{paddingVertical:8,paddingHorizontal:16,borderRadius:4,alignSelf:"flex-start",flexGrow:0,backgroundColor:"purple"},buttonText:{color:"white",fontSize:16,fontWeight:"bold"},buttonContainer:{alignItems:"flex-start",flex:1}}),MyButton=exports.MyButton=function MyButton(_ref){var text=_ref.text,onPress=_ref.onPress,color=_ref.color,textColor=_ref.textColor;return(0,_jsxRuntime.jsx)(_View.default,{style:styles.buttonContainer,children:(0,_jsxRuntime.jsx)(_TouchableOpacity.default,{style:[styles.button,!!color&&{backgroundColor:color}],onPress,activeOpacity:.8,children:(0,_jsxRuntime.jsx)(_Text.default,{style:[styles.buttonText,!!textColor&&{color:textColor}],children:text})})})};try{MyButton.displayName="MyButton",MyButton.__docgenInfo={description:"",displayName:"MyButton",props:{onPress:{defaultValue:null,description:"",name:"onPress",required:!0,type:{name:"() => void",raw:null,value:null}},text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string",raw:null,value:null}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string",raw:null,value:null}},textColor:{defaultValue:null,description:"",name:"textColor",required:!1,type:{name:"string",raw:null,value:null}}}}}catch(e){}try{MyButton.displayName="MyButton",MyButton.__docgenInfo={description:"",displayName:"MyButton",props:{'"onPress"':{defaultValue:null,description:"",name:"onPress",required:!0,type:{name:"() => void",raw:null,value:null}},'"text"':{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string",raw:null,value:null}},'"color"':{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string",raw:null,value:null}},'"textColor"':{defaultValue:null,description:"",name:"textColor",required:!1,type:{name:"string",raw:null,value:null}}}}}catch(e){}try{MyButton.displayName="MyButton",MyButton.__docgenInfo={description:"",displayName:"MyButton",props:{onPress:{defaultValue:null,description:"",name:"onPress",required:!0,type:{name:"() => void"}},text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}},textColor:{defaultValue:null,description:"",name:"textColor",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/Button/Button.tsx#MyButton"]={docgenInfo:MyButton.__docgenInfo,name:"MyButton",path:"components/Button/Button.tsx#MyButton"})}catch(__react_docgen_typescript_loader_error){}},"./components/Button/Button.stories.tsx":(__unused_webpack_module,exports,__webpack_require__)=>{__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");var _interopRequireDefault=__webpack_require__("./node_modules/@babel/runtime/helpers/interopRequireDefault.js");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.Basic=void 0;_interopRequireDefault(__webpack_require__("./node_modules/react/index.js"));var _Button=__webpack_require__("./components/Button/Button.tsx"),_jsxRuntime=__webpack_require__("./node_modules/react/jsx-runtime.js"),Basic=(exports.default={title:"components/MyButton",component:_Button.MyButton},exports.Basic=function Basic(args){return(0,_jsxRuntime.jsx)(_Button.MyButton,Object.assign({},args))});Basic.args={text:"Hello World",color:"purple"},Basic.parameters=Object.assign({storySource:{source:"args => (\n  <MyButton {...args} />\n)"}},Basic.parameters)},"./storybook-init-framework-entry.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{__webpack_require__("./node_modules/@storybook/react/dist/esm/client/index.js")},"?4f7e":()=>{},"./generated-stories-entry.cjs":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module=__webpack_require__.nmd(module),(0,__webpack_require__("./node_modules/@storybook/react/dist/esm/client/index.js").configure)([__webpack_require__("./components sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.(?:ts%7Ctsx%7Cjs%7Cjsx)?)$")],module,!1)}},__webpack_require__=>{var __webpack_exec__=moduleId=>__webpack_require__(__webpack_require__.s=moduleId);__webpack_require__.O(0,[850],(()=>(__webpack_exec__("./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js"),__webpack_exec__("./node_modules/@storybook/core-client/dist/esm/globals/globals.js"),__webpack_exec__("./storybook-init-framework-entry.js"),__webpack_exec__("./node_modules/@storybook/react/dist/esm/client/docs/config-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-links/preview.js-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-docs/preview.js-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-actions/preview.js-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-backgrounds/preview.js-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-measure/preview.js-generated-config-entry.js"),__webpack_exec__("./node_modules/@storybook/addon-outline/preview.js-generated-config-entry.js"),__webpack_exec__("./.storybook/preview.js-generated-config-entry.js"),__webpack_exec__("./generated-stories-entry.cjs"))));__webpack_require__.O()}]);