/**
  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...


	* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * @Link CodeForces: https://codeforces.com/profile/darkoxv88

	* @fileoverview dp-utility.js provides some useful functionalities
  * @source https://github.com/darkoxv88/dpUtility
  * @version 1.0.4


  Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
**/

"use strict";

/**	
  * @name dpVerifyES6
	* @function 
  * Verifies if browser supports ES6 (ECMAScript 2015).
  * If the browser supports ES6, it will return true.
  * @param {boolean} kill
  * If the test fails and kill is set to true it will then throw an error and if called in global scope it will kill the script.
**/

function dpVerifyES6(kill) {
  var output = false;

  try {
    eval(
      `
        class dpStaticTest { static test = true; }

        class dpFoo { 
          _test;
          get test() { return this._test; }
          set test(value) { this._test = value; }
          constructor(i) { this.test = i; } 
        }

        class dpBar extends dpFoo {
          constructor() { super(1); }
        }

        const asyncTest = async (x = new dpBar()) => {
          let promise = new Promise(resolve => { resolve(x); });
          await promise;
        }

        asyncTest();

        output = dpStaticTest.test;
      `
    );
  } catch (err) {
    if (kill) {
      throw new Error(err); 
    } else {
      console.error(err);
      return false;
    }
  }

  return output;
}
  
const dpConst = {
  supportsES6 : dpVerifyES6(true),
  epsilon : 0.000001,
  array : (typeof Float32Array !== 'undefined') ? Float32Array : Array,
}

Object.freeze(dpConst);

window.dp = null;
window.dpTypes = null;
window.dpMath = null;
window.dpSubject = null;
window.dpCanvas2dCtx = null;
window.dpCookies = null;
window.dpAJAX = null;
window.dpFrame = null;
window.dpComponents = null;
window.dpColor = null;
window.dpImageProcessing = null;



/**
  * @name dp
	* @class
  * Static class.
  * Holds some useful functions.
	
  * @function deserialize
  * @function $
  * @function each
  * @function onload {override}
**/

class dp {

  /**
    * @name deserialize
    * @function
    * Performs 1D deserialization of GET query
    * @param {string} str
  **/
  static deserialize = function(str) {
    let tempArray = {};
    let splitByAND = str.split('&');
  
    for (let i in splitByAND) {
      let splitByEqual = splitByAND[i].split('=');
      tempArray[splitByEqual[0]] = splitByEqual[1];
    }
  
    return tempArray;
  };

  /**
    * @name $
    * @function
    * Gets DOMelement/s
    * @param {string} str
    * If the string starts with '#' it will search by id attribute.
    * If the string starts with '.' it will search by class attribute.
    * If the string starts with '&' it will search by name attribute.
    * If the string is in tag format '<div>' it will search all DOM elements as that tag.
    * Everything else will use generic query selector.
  **/
  static $ = function(value) {
    if (typeof value != 'string' || !value) return null;
  
    let firstChar = value[0];
    let subFirst = value.substr(1);
  
    if (firstChar == '#') {
      return document.getElementById(subFirst);
    }
  
    if (firstChar == '.') {
      return document.getElementsByClassName(subFirst);
    }
  
    if (firstChar == '&') { 
      return document.getElementsByName(subFirst);
    }
  
    if (firstChar == '<') {
      return document.getElementsByTagName(subFirst.substr(0, subFirst.length-1));
    }
  
    return document.querySelectorAll(value);
  };

  /**
    * @name each
    * @function
    * Iterates through given objects elements.
    * @param {object} obj
    * Objects to iterate through.
    * @param {function} callback
    * When called it is given 2 elements, objects key name and that keys value.
  **/
  static each = function(obj, callback) {
    if (typeof obj != 'object') {
      console.error('obj type needs to be object.');
      return null;
    }
    if (typeof callback != 'function') {
      console.error('callback type needs to be function.');
      return null;
    }
    
    for (let k in obj) {
      callback(k, obj[k]);
    }
  };

  /**
   * @name main
   * @returns {void}
   * @function
   * This function is called as the window.onload event
  **/
  static main = function(loadFunc) {
    if (typeof loadFunc != 'function') return null;

    if (window.addEventListener) {
      window.addEventListener("load", loadFunc, false);
      return null;
    }

    if (window.attachEvent) {
      window.attachEvent('onload', loadFunc);
      return null;
    }

    if (typeof window.onload == 'function') {
      var currentWindowOnLoad = window.onload;

      var newWindowOnLoad = function(evt) {
        currentWindowOnLoad(evt);
        loadFunc(evt);
      };

      window.onload = newWindowOnLoad;
    } else { 
      window.onload = loadFunc;
    }
  }

}



class dpTypes {

  static byte(val) { 
    if (!val) { return 0; }

    try {
      val = parseInt(val);
    } catch(error) {
      console.error(`Value: ${val} cant be parsed to int.`, error);
      return;
    }

    if (val > 255) { return 255; }
    if (val < 0) { return 0; }

    return val;
  }

  static color(r, g, b, a = 255) {
    var obj = {
      r : dpTypes.byte(r),
      g : dpTypes.byte(g),
      b : dpTypes.byte(b),
      a : dpTypes.byte(a)
    }

    return obj;
  }

}



// *********************** 
// Math ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dpMath {

  static maxCap(value, cap) {
    if (typeof(value) !== 'number') { 
      console.error(`value: ${value} is not a number`);
      return 0;
    }
    if (typeof(cap) !== 'number') { 
      console.error(`cap: ${cap} is not a number`);
      return 0;
    }

    if (value > cap) { value = cap; }

    return value;
  }

  static minCap(value, cap) {
    if (typeof(value) !== 'number') { 
      console.error(`value: ${value} is not a number`);
      return 0;
    }
    if (typeof(cap) !== 'number') { 
      console.error(`cap: ${cap} is not a number`);
      return 0;
    }

    if (value < cap) { value = cap; }

    return value;
  }

  static degToRad(val) {
    if (typeof(val) == 'number') return (val * (Math.PI / 180)); else return undefined;
  }

  static radToDeg(val) {
    if (typeof(val) == 'number') return (val * (180 / Math.PI)); else return undefined;
  }

}



class dpVec3 {

  static create(x, y, z) {
    new Float32Array(x, y, z);
  }

  static add(v1, v2) {
    return new Float32Array(v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]);
  }

  static sub(v1, v2) {
    return new Float32Array(v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]);
  }

  static mul(v1, v2) {
    return new Float32Array(v1[0]*v2[0], v1[1]*v2[1], v1[2]*v2[2]);
  }

  static div(v1, v2) {
    return new Float32Array(v1[0]/v2[0], v1[1]/v2[1], v1[2]/v2[2]);
  }

  static dotProduct(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
  }

  static length(v) {
    return Math.sqrt(this.dotProduct(v, v));
  }

  static normalise(v) {
    const l = this.length(v)
    return new Float32Array(v[0] / l, v[1] / l, v[2] / l);
  }

  static crossProduct(v1, v2) {
    return new Float32Array(
      v1[1]*v2[2] - v1[2]*v2[1], 
      v1[2]*v2[0] - v1[0]*v2[2], 
      v1[0]*v2[1] - v1[1]*v2[0]
    );
  }

}



// *********************** 
// Helper ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpSubject(value, sub = null) {
    this.init(value, sub);
  }

  dpSubject.prototype = {

    value : null,
    call : null,

    init : function(value, sub) {
      this.value = value;
      this.subscribe(sub);
    },

    subscribe : function(callback) { 
      if (!callback) { return; }

      if (typeof(callback) !== 'function') { 
        console.error(`callback: ${callback} is not a function`);
        return; 
      }

      this.call = callback;
    },

    unsubscribe : function() { 
      this.call = null;
    },

    reset : function () {
      this.value = null;
      this.unsubscribe();
    },

    fireEvent : function() {
      try {
        if (typeof(this.call) !== 'function') { return; }
        this.call(this.value);
      } catch(err) { console.error(err); }
    },

    next : function(value) {
      this.value = value;
      this.fireEvent();
    },

    getValue : function() {
      return this.value;
    }

  }

  window.dpSubject = dpSubject;

} )( window );



( function( window ) {
  
  function dpCanvas2dCtx() {
    this.init();
  }

  dpCanvas2dCtx.prototype = {

    onLoadEvent : null,
    file : null,
    img: null,
    imgData : {
      iName : '',
      iSize : 0,
      iType : '',
      src : '',
      width : 0,
      height : 0,
    },
    ctxOrg: null,
    ctxActive: null,

    init : function() { 
      this.onLoadEvent = new dpSubject();
    },

    onLoad: function(callback) {
      this.onLoadEvent.subscribe(callback);
    },

    loadImage : function(e, type='event') {
      if (!e) { return; }

      let files = null;

      if (type === 'event') { 
        files = e.target.files; 
      } else if(type === 'file') {
        files = e;
      } else { return; }
  
      if (FileReader && files && files.length) {
        this.imgData.iName = files[0].name;
        this.imgData.iSize = files[0].size;
        this.imgData.iType = files[0].type;

        this.file = files[0];

        let fr = new FileReader();
        fr.onload = () => this.registerImage(fr.result);
        fr.readAsDataURL(files[0]);
      } else {
        console.error('There was an unknown error. Check if FileReader is supported');
      }
    },

    registerImage : function(src) {
      let img = document.createElement('img');
      img.onload = () => this.createCanvasCtxFromImage(img);
      img.src = src;
      this.imgData.src = src;
      this.img = img;
    },

    createCanvasCtxFromImage : function(img) {
      try {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        this.imgData.width = img.width;
        this.imgData.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.ctxOrg = ctx;
        this.ctxActive = this.duplicateCtxOrg();
      } catch(error) {
        console.error(error);
        return;
      }

      this.onLoadEvent.next(null);
    },

    generate2dCtx : function(w = this.imgData.width, h = this.imgData.height) {
      let newCanvas = document.createElement('canvas');
      newCanvas.width = w;
      newCanvas.height = h;
      return  newCanvas.getContext('2d');
    },

    duplicateCtxOrg : function() {
      let context = this.generate2dCtx(this.ctxOrg.canvas.width, this.ctxOrg.canvas.height)
      context.drawImage(this.ctxOrg.canvas, 0, 0);
      return context;
    },

    duplicateCtxActive : function() {
      let context = this.generate2dCtx(this.ctxActive.canvas.width, this.ctxActive.canvas.height)
      context.drawImage(this.ctxActive.canvas, 0, 0);
      return context;
    },

    getImageUrl : function(mimeType = 'image/png') {
      return this.ctxActive.canvas.toDataURL(mimeType);
    },

    getOriginalImageUrl : function(mimeType = 'image/png') {
      return this.ctxOrg.canvas.toDataURL(mimeType);
    },

    reset : function() {
      this.ctxActive = this.duplicateCtxOrg();
    },

    getWidth : function() {
      return this.ctxActive.canvas.width;
    },

    getHeight : function() {
      return this.ctxActive.canvas.height;
    },

    getCanvas : function() {
      return this.ctxActive.canvas;
    },

    getImageData : function() {
      return this.ctxActive.getImageData(0, 0, this.getWidth(), this.getHeight());
    },

  }
	
	window.dpCanvas2dCtx = dpCanvas2dCtx;

} )( window );



// *********************** 
// General ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpCookies() {
    this.init();
  }

  dpCookies.prototype = {

    init : function() { },

    set : function(cookieName, cookieValue, cookieDurationDays = 7, type = 'day') {
      if( typeof cookieDurationDays != 'number' ) { cookieDurationDays = 7; }
      if( typeof cookieDurationDays <= 0 ) { cookieDurationDays = 7; }

      let d = 24;
      let h = 60;

      if (type = 'hour') { d = 1; }
      if (type = 'minute') { d = 1; h = 1; }
  
      let date = new Date();
      date.setTime(date.getTime() + (cookieDurationDays * d * h * 60 * 1000));
      document.cookie = cookieName + '=' + cookieValue + ';' + 'expires=' + date.toUTCString() + ';path=/';
    },

    get : function(cookieName) {
      cookieName = cookieName + '=';
      let decodedCookie = document.cookie.split(';');
  
      for ( let i = 0; i < decodedCookie.length; i++ ) {
        let c = decodedCookie[i];
  
        while( c.charAt(0) == ' ' ) { c = c.substring(1); }
  
        if( c.indexOf(cookieName) == 0 ) { return c.substring(cookieName.length, c.length); }
      }
  
      return '';
    },

    delete : function(cookieName) {
      let date = new Date();
      date.setTime(date.getTime() - 1000);
      document.cookie = cookieName + '=' + '' + ';' + 'expires=' + date.toUTCString() + ';path=/';
    },

    setObj : function(obj, cookieDurationDays = 7, type = 'day') {
      if (typeof(obj) !== 'object') { return false; }

      for (let item in obj) {
        this.set(item, JSON.stringify(obj[item]), cookieDurationDays = 7, type = 'day');
      }
    },

    getObj : function(obj) {
      if (typeof(obj) !== 'object') { return false; }

      let output = {}

      for (let item in obj) {
        output[item] = this.get(item);
      }

      return output;
    },

    deleteObj : function(obj) {
      if (typeof(obj) !== 'object') { return false; }

      for (let item in obj) {
        this.delete(item);
      }
    }
    
  }

  window.dpCookies = dpCookies;

} )( window );



( function( window ) {
  
  function dpAJAX() {
    this.init();
  }

  dpAJAX.prototype = {

    _error : null,
    _progress : null,

    init : function(errorIntercept = null, progressCallback = null) {
      this._error = new dpSubject(null);
      this._progress = new dpSubject({
        loaded : 0,
        total : 0,
      });

      this.subError(errorIntercept);
      this.subProgress(progressCallback)
    },

    subError : function(callback) {
      this._error.subscribe(callback);
    },

    subProgress : function(callback) {
      this._progress.subscribe(callback);
    },

    _baseCall : async function(url, body, header, callback, type) {
      if (typeof type !== 'string') {
        console.log('Call type needs to be a string!')
        return null;
      }

      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open(type, url, true);

        if (typeof(header) === 'object') {
          for (let item in header) {
            xhr.setRequestHeader(item, header[item]);
          }
        }

        xhr.onload = () => {
          if (xhr.status != 200) { 
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            this._error.next({status:xhr.status, statusText:xhr.statusText});
            reject(xhr.status, xhr.statusText);
          } else {
            const respHeaders = xhr.getAllResponseHeaders().split('\r\n').reduce((result, current) => {
              let [name, value] = current.split(': ');
              result[name] = value;
              return result;
            }, {});

            if (typeof(callback) === 'function') { 
              callback(xhr.response, respHeaders); 
            }

            resolve(xhr.response, respHeaders);
          }
        };

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            this._progress.next({loaded : event.loaded, total : event.total});
          } else {
            this._progress.next(event.loaded);
          }
        };
        
        xhr.onerror = () => {
          console.error('Request failed');
        };

        xhr.send(body);
      });
    },

    get : async function(url, header, callback, type='GET') {
      return this._baseCall(url, null, header, callback, type);
    },

    post : async function(url, body, header, callback, type='POST') {
      return this._baseCall(url, body, header, callback, type);
    },
    
  }

  window.dpAJAX = dpAJAX;

} )( window );



class dpFrame {

  _isPaused;
  _startingTime;
  _lastTime;

  _totalElapsedTime;
  get totalTime() {
    return this._totalElapsedTime;
  }

  _elapsedSinceLastLoop;
  get deltaTime() {
    return this._elapsedSinceLastLoop;
  }

  _onUpdate;
  set onUpdate(value = null) {
    if (typeof value == 'function') { this._onUpdate.subscribe(value); }
  }

  _onLateUpdate;
  set onLateUpdate(value = null) {
    if (typeof value == 'function') { this._onLateUpdate.subscribe(value); }
  }

  constructor(callbackOnStart) {
    this._isPaused = false;
    this._onUpdate = new dpSubject(null);
    this._onLateUpdate = new dpSubject(null);

    requestAnimationFrame((currentTime) => {
      if (!this._startingTime) { 
        this._startingTime = currentTime;
      }
      if (!this._lastTime) {
        this._lastTime = currentTime;
      }

      this._totalElapsedTime = 0;
      this._elapsedSinceLastLoop = 0;

      requestAnimationFrame((t) => {this.frame(t);});

      if (typeof callbackOnStart == 'function') { callbackOnStart(); }
    });
  }

  frame(currentTime) {
    if (this._isPaused) {
      requestAnimationFrame((t) => {this.frame(t);});
      return null;
    }

    this._totalElapsedTime = currentTime - this._startingTime;
    this._elapsedSinceLastLoop = currentTime - this._lastTime;

    this._lastTime = currentTime;

    this._onUpdate.next(this._lastTime);
    this._onLateUpdate.next(this._lastTime);

    requestAnimationFrame((t) => {this.frame(t);});
  }

  pause() {
    this._isPaused = true;
  }

  unpause() {
    this._isPaused = false;
  }

}



class dpComponents {

  static _components = {}
  static _logic = {}

  static async registerStyle(tag, style) {
    let promise = new Promise(resolve => {
      let head = dp.$('<head>')[0];
      let dpStyles = dp.$('<dp-styles>');

      if (dpStyles.length == 0) {
        dpStyles = document.createElement('dp-styles');
        dpStyles.setAttribute('hidden', true);
        head.append(dpStyles);
      } else {
        dpStyles = dpStyles[0];
      }

      let styleID = dp.$('#dp-style-' + tag);
      let buildStyle = function(tag, style) {
        let count = [...style].filter(x => x === '{').length;
        let s = style.split('}');

        let output = '';
        for (let i in s) {
          if (i == s.length-1) return output;
          output += tag + " " + s[i] + " }"
        }
      }

      if (styleID) {
        styleID.innerHTML = buildStyle(tag, style);
        resolve(true);
      }

      let styleInner = document.createElement('style');
      styleInner.setAttribute('id', 'dp-style-' + tag);
      styleInner.innerHTML = buildStyle(tag, style);
      dpStyles.append(styleInner);
      
      resolve(true);
    });

    return await promise;
  }

  static async register(tag, style, template, buildType = 'function', templateClass) {
    if (this._components[tag]) { return false; }

    this._components[tag] = {};

    let promise = new Promise(async (resolve) => {
      if (typeof tag !== 'string') resolve(false);

      let activateClass;
      let activateStyle = await this.registerStyle(tag, style);

      this._components[tag] = {
        name: tag,
        style: activateStyle,
        template : template,
        type : buildType,
      }
      
      if (typeof templateClass == 'function') activateClass = new templateClass();

      this._logic[tag] = activateClass;

      resolve(true);
    });

    return await promise;
  }

  static event(tag, func, data) {
    if (typeof this._logic[tag][func] == 'function') this._logic[tag][func](data);
  }

  static test() {
    dpComponents.register('dp-a', '.a{display: block}', null, 'function', class test{});
  }

}



// *********************** 
// Image processing ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dpColor  {

  static getKelvinTable() {
    const obj = {
      1000: [255, 56, 0],
      1500: [255, 109, 0],
      1900: [255, 131, 0],
      2000: [255, 137, 18],
      2200: [255, 147, 44],
      2500: [255, 161, 72],
      2700: [255, 169, 87],
      2800: [255, 173, 94],
      2900: [255, 177, 101],
      3000: [255, 180, 107],
      3500: [255, 196, 137],
      4000: [255, 209, 163],
      4100: [255, 211, 168],
      4300: [255, 215, 177],
      4500: [255, 219, 186],
      5000: [255, 228, 206],
      5100: [255, 230, 210],
      5200: [255, 232, 213],
      5300: [255, 233, 217],
      5400: [255, 235, 220],
      5500: [255, 236, 224],
      5600: [255, 238, 227],
      5700: [255, 239, 230],
      6000: [255, 243, 239],
      6500: [255, 249, 253],
      6600: [254, 249, 255],
      6700: [252, 247, 255],
      6800: [249, 246, 255],
      6900: [247, 245, 255],
      7000: [245, 243, 255],
      7100: [243, 242, 255],
      7200: [240, 241, 255],
      7300: [239, 240, 255],
      7400: [237, 239, 255],
      7500: [235, 238, 255],
      8000: [227, 233, 255],
      8500: [220, 229, 255],
      9000: [214, 225, 255],
      9300: [210, 223, 255],
      9500: [208, 222, 255],
      9600: [207, 221, 255],
      9700: [207, 221, 255],
      9800: [206, 220, 255],
      9900: [205, 220, 255],
      10000: [204, 219, 255],
      10500: [200, 217, 255],
      11000: [200, 213, 255],
      11500: [193, 213, 255],
      12000: [191, 211, 255],
      12500: [188, 210, 255],
      13000: [186, 208, 255],
      13500: [184, 207, 255],
      14000: [182, 206, 255],
      14500: [180, 205, 255],
      15000: [179, 204, 255],
      15500: [177, 203, 255],
      16000: [176, 202, 255],
      16500: [175, 201, 255],
      17000: [174, 200, 255],
      17500: [173, 200, 255],
    };

    Object.freeze(obj);

    return obj;
  }

  static rgbToHSL(cR, cG, cB) {

    let r = dpTypes.byte(cR) / 255;
    let g = dpTypes.byte(cG) / 255;
    let b = dpTypes.byte(cB) / 255;

    let max = Math.max(r, g, b); 
    let min = Math.min(r, g, b);
    let del = max - min;

    let h = 0; 
    let s = 0; 
    let l = (max + min) / 2;
  
    if (max == min) return {h: h, s: s, l: l};

    if (l < 0.5) { 
      s = del / ( max + min )
    } else { 
      s = del / ( 2 - max - min ); 
    };

    let delR = ( ( ( max - r ) / 6 ) + ( del / 2 ) ) / del;
    let delG = ( ( ( max - g ) / 6 ) + ( del / 2 ) ) / del;
    let delB = ( ( ( max - b ) / 6 ) + ( del / 2 ) ) / del;

    if      (r == max) h = delB - delG;
    else if (g == max) h = ( 1 / 3 ) + delR - delB;
    else if (b == max) h = ( 2 / 3 ) + delG - delR;

    if (h < 0) h += 1;
    if (h > 1) h -= 1;

    return {h: h, s: s, l: l};
  }

  static hslToRGB(h, s, l) {
    let r, g, b = 0;
    let val1, val2;

    if (s == 0)
    {
      r = l * 255;
      g = l * 255;
      b = l * 255;
    }
    else
    {
      if (l < 0.5) val2 = l * ( 1 + s );
      else           val2 = ( l + s ) - ( l * s );
    
      val1 = 2 * l - val2;

      let Hue_2_RGB = function( v1, v2, vH ) {
        if (vH < 0) vH += 1;
        if (vH > 1) vH -= 1;

        if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
        if ( ( 2 * vH ) < 1 ) return ( v2 );
        if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );

        return ( v1 );
      };
    
      r = 255 * Hue_2_RGB(val1, val2, h + ( 1 / 3 ));
      g = 255 * Hue_2_RGB(val1, val2, h );
      b = 255 * Hue_2_RGB(val1, val2, h - ( 1 / 3 ));
    }

    return dpTypes.color(r, g, b);
  }

  static colorTemperatureToRgb(value) {
    let r, g, b;

    try {
      value = parseInt(value);
    } catch(error) {
      console.error(`Value: ${value} cant be parsed to int.`, error)
      return;
    }

    if(value <= 0) { value = 1 ;}
    if(value > 1000000) { value = 1000000 ;}

    value /= 100;

    if (value <= 66) {
      r = 255;
      g = (99.4708025861 * Math.log(value) - 161.1195681661).toFixed(0)
    } else {
      r = (329.698727446 * Math.pow(value - 60, -0.1332047592)).toFixed(0)
      g = (288.1221695283 * Math.pow(value - 60, -0.0755148492)).toFixed(0);
    }

    if (value >= 66) {
      b = 255;
    } else if (value <= 19) {
      b = 0;
    } else {
      b = (138.5177312231 * Math.log(value - 10) - 305.0447927307).toFixed(0);
    }

    return dpTypes.color(r, g, b);
  }

}



( function( window ) {
  
  function dpImageProcessing(callback = null) {
    this.init(callback);
  }

  dpImageProcessing.prototype = {

    kelvinTable : null,
    dpCtx : null,

    init : function (callback) { 
      this.dpCtx = new dpCanvas2dCtx();
      this.kelvinTable = dpColor.getKelvinTable();
      if (typeof callback == 'function') {
        this.onLoad(callback);
      }
    },

    onLoad : function(callback) { 
      this.dpCtx.onLoad(callback);
    },

    loadImage : function(e, type='event') {
      this.dpCtx.loadImage(e, type);
    },

    getImg : function() {
      return this.dpCtx.getImageUrl();
    },

    getOrgImg : function() {
      return this.dpCtx.getOriginalImageUrl();
    },

    reset : function() {
      this.dpCtx.reset();
    },

    convolution : function (imgData, operationMatrix) {
      if ( !(imgData instanceof ImageData) ) {
        console.error('imgData param is required to an instance of ImageData');
        return null;
      }

      if ( imgData.data.length <= 0) return new ImageData(0, 0);

      let side = Math.round(Math.sqrt(operationMatrix.length));
      let halfSide = Math.floor(side / 2);
      let canvasWidth = imgData.width;
      let canvasHeight = imgData.height;
      let outputData = new ImageData(canvasWidth, canvasHeight);
      
      for (let h = 0; h < canvasHeight; h++) {
        for (let w = 0; w < canvasWidth; w++) {

          let position = (h * canvasWidth + w) * 4;
          let sumR = 0, sumG = 0, sumB = 0;

          for (let matH = 0; matH < side; matH++) {
            for (let matW = 0; matW < side; matW++) {
              
              let currentMatH = h + matH - halfSide;
              let currentMatW = w + matW - halfSide;

              while ( currentMatH < 0 ) {
                currentMatH += 1;
              };

              while ( currentMatH >= canvasHeight ) {
                currentMatH -= 1;
              };

              while ( currentMatW < 0 ) {
                currentMatW += 1;
              };

              while ( currentMatW >= canvasWidth ) {
                currentMatW -= 1;
              };

              let offset = (currentMatH * canvasWidth + currentMatW) * 4;
              let operation = operationMatrix[matH * side + matW];

              sumR += imgData.data[offset] * operation;
              sumG += imgData.data[offset + 1] * operation;
              sumB += imgData.data[offset + 2] * operation;
            }
          }

          outputData.data[position] = dpTypes.byte(sumR);
          outputData.data[position + 1] = dpTypes.byte(sumG);
          outputData.data[position + 2] = dpTypes.byte(sumB);
          outputData.data[position + 3] = imgData.data[position + 3];
        }
      }

      return outputData; 
    },

    histogram : function() {
      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;
      
      let output = {
        r : [],
        g : [],
        b : [],
      }

      for (var i = 0; i < 256; i += 1) {
        output.r[i] = 0;
        output.g[i] = 0;
        output.b[i] = 0;
      }
      
      for (var i = 0; i < data.length; i += 4) {
        output.r[data[i]] += 1;
        output.g[data[i+1]] += 1;
        output.b[data[i+2]] += 1;
      }
      
      return output;
    },

    asyncHistogram : async function() {
      let promise = new Promise(resolve => { resolve(this.histogram()); });

      return await promise;
    },



    flipImage : async function(flipH, flipV) {
      var scaleH = flipH ? -1 : 1;
      var scaleV = flipV ? -1 : 1;

      this.dpCtx.ctxActive.save();

      if(flipH) { this.dpCtx.ctxActive.translate(this.dpCtx.getWidth(), 0); }
      if(flipV) { this.dpCtx.ctxActive.translate(0, this.dpCtx.getHeight()); } 

      this.dpCtx.ctxActive.scale(scaleH, scaleV);
      this.dpCtx.ctxActive.drawImage(this.dpCtx.getCanvas(), 0, 0);
      this.dpCtx.ctxActive.setTransform(1,0,0,1,0,0);
      this.dpCtx.ctxActive.restore();

      return await new Promise(resolve => { resolve(true); });
    },

    rotateImage : async function(clockwise) {
      let bmp = await createImageBitmap(this.dpCtx.getImageData());

      const degrees = clockwise == true ? 90 : -90;
      const iw = this.dpCtx.getWidth();
      const ih = this.dpCtx.getHeight();

      this.dpCtx.ctxActive.canvas.width = ih;
      this.dpCtx.ctxActive.canvas.height = iw;

      if(clockwise) {
        this.dpCtx.ctxActive.translate(ih, 0);
      } else {
        this.dpCtx.ctxActive.translate(0, iw);
      }

      this.dpCtx.ctxActive.rotate(degrees*Math.PI/180);
      this.dpCtx.ctxActive.drawImage(bmp, 0 , 0);
      this.dpCtx.ctxActive.setTransform(1,0,0,1,0,0);

      return await new Promise(resolve => { resolve(true); });
    },



    colorFilter : function(type) {
      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        if (type === 'R') {
          data[i];
          data[i + 1] = 0;
          data[i + 2] = 0;
          continue;
        }
        if (type === 'G') {
          data[i] = 0;
          data[i + 1];
          data[i + 2] = 0;
          continue;
        }
        if (type === 'B') {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2];
          continue;
        }
        if (type === 'C') {
          data[i] = 0;
          data[i + 1];
          data[i + 2];
          continue;
        }
        if (type === 'M') {
          data[i];
          data[i + 1] = 0;
          data[i + 2];
          continue;
        }
        if (type === 'Y') {
          data[i];
          data[i + 1];
          data[i + 2] = 0;
          continue;
        }
      }
      
      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncColorFilter : async function(type) {
      let promise = new Promise(resolve => {
        const res = this.colorFilter(type);
        resolve(res);
      });

      return await promise;
    },

    invert : function() {
      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];  
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      
      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncInvert : async function() {
      let promise = new Promise(resolve => { resolve(this.invert()); });
      return await promise;
    },

    grayscale : function(blackPass=0, whitePass=255) {
      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {

        var avg = (data[i]*0.3) + (data[i + 1]*0.59) + (data[i + 2]*0.11);

        if(avg < blackPass) { avg = 0; }
        else if(avg > whitePass) { avg = 255; }

        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncGrayscale : async function(blackPass=0, whitePass=255) {
      let promise = new Promise(resolve => { resolve(this.grayscale(blackPass, whitePass)); });
      return await promise;
    },

    sepia : function() {
      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];
    
        data[i] = dpTypes.byte(0.393 * red + 0.769 * green + 0.189 * blue);
        data[i + 1] = dpTypes.byte(0.349 * red + 0.686 * green + 0.168 * blue);
        data[i + 2] = dpTypes.byte(0.272 * red + 0.534 * green + 0.131 * blue);
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncSepia : async function() {
      let promise = new Promise(resolve => {
        const res = this.sepia();
        resolve(res);
      });

      return await promise;
    },

    gamma : function(value) {
      try {
        value = parseFloat(parseFloat(value).toFixed(4));
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to float.`, error)
        return;
      }

      if (value < 0) { value = 0; }
      if (value > 100) { value = 100.0; }

      let gammaCorrection = 1 / value;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i] = dpTypes.byte(255 * Math.pow((data[i] / 255), gammaCorrection));
        data[i+1] = dpTypes.byte(255 * Math.pow((data[i+1] / 255), gammaCorrection));
        data[i+2] = dpTypes.byte(255 * Math.pow((data[i+2] / 255), gammaCorrection));
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncGamma : async function(value) {
      let promise = new Promise(resolve => {
        const res = this.gamma(value);
        resolve(res);
      });

      return await promise;
    },

    transparency : function(value) {
      try {
        value = parseFloat(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to float.`, error)
        return;
      }

      if (value < 0) { value = 0; }
      if (value > 100) { value = 100; }

      value = value / 100;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i+3] = dpTypes.byte(data[i+3] * value);
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncTransparency : async function(value) {
      let promise = new Promise(resolve => {
        const res = this.transparency(value);
        resolve(res);
      });

      return await promise;
    },

    temperature : function(value) {
      try {
        value = parseInt(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to int.`, error)
        return;
      }

      if (value <= 0) { return false; }

      let color = this.kelvinTable[value];

      if (!color) { 
        let gen = dpColor.colorTemperatureToRgb(value);
        color = [];
        color[0] = gen.r;
        color[1] = gen.g;
        color[2] = gen.b;
      }

      let r = color[0] / 255;
      let g = color[1] / 255;
      let b = color[2] / 255;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i] = dpTypes.byte(data[i] * r);
        data[i+1] = dpTypes.byte(data[i+1] * g);
        data[i+2] = dpTypes.byte(data[i+2] * b);
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncTemperature : async function(value) {
      let promise = new Promise(resolve => {
        const res = this.temperature(value);
        resolve(res);
      });

      return await promise;
    },

    noise : function(value) {
      try {
        value = parseFloat(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to int.`, error)
        return;
      }

      if (value <= 0) value = 0;
      if (value >= 10000) value = 10000;

      const level = value * 255 * 0.1

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        let random = (0.5 - Math.random()) * level;

        data[i] += dpTypes.byte(random);
        data[i+1] += dpTypes.byte(random);
        data[i+2] += dpTypes.byte(random);
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncNoise : async function(value) {
      let promise = new Promise(resolve => { resolve(this.noise(value)); });

      return await promise;
    },

    hue : function(value) {
      try {
        value = parseFloat(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to float.`, error)
        return;
      }

      if (value > 180) { value = 180; }
      if (value < -180) { value = -180; }

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        let hsl = dpColor.rgbToHSL(data[i], data[i+1], data[i+2]);

        hsl.h = hsl.h + ( value / 360.0 );

        let rgb = dpColor.hslToRGB(hsl.h, hsl.s, hsl.l);

        data[i] = rgb.r;
        data[i+1] = rgb.g;
        data[i+2] = rgb.b;
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncHue : async function(value) {
      let promise = new Promise(resolve => { resolve(this.hue(value)); });

      return await promise;
    },

    saturation : function(value) {
      try {
        value = parseFloat(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to float.`, error)
        return;
      }

      if (value > 100) { value = 100; }
      if (value < -100) { value = -100; }

      value = (100.0 + value) / 100.0;
      value *= value;

      let luR = 0.3086;
      let luG = 0.6094;
      let luB = 0.0820;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];

        data[i] = dpTypes.byte(
          ( ((1 - value)*luR + value)*red + ((1 - value)*luG)*green + ((1 - value)*luB)*blue )
        );
        
        data[i+1] = dpTypes.byte(
          ( ((1 - value)*luR)*red + ((1 - value)*luG + value)*green + ((1 - value)*luB)*blue )
        );

        data[i+2] = dpTypes.byte(
          ( ((1 - value)*luR)*red + ((1 - value)*luG)*green + ((1 - value)*luB + value)*blue )
        );
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncSaturation : async function(value) {
      let promise = new Promise(resolve => {
        const res = this.saturation(value);
        resolve(res);
      });

      return await promise;
    },

    lightness : function(value) {
      try {
        value = parseInt(value);
      } catch(error) {
        console.error(`Value: ${value} cant be parsed to int.`, error)
        return;
      }

      if (value > 100) { value = 100; }
      if (value < -100) { value = -100; }

      value = 2.55 * value;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i] = dpTypes.byte(data[i] + value);
        data[i+1] = dpTypes.byte(data[i+1] + value);
        data[i+2] = dpTypes.byte(data[i+2] + value);
      }

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncLightness : async function(value) {
      let promise = new Promise(resolve => {
        const res = this.lightness(value);
        resolve(res);
      });

      return await promise;
    },



    lowpass : function(type = 0) {
      let operator = [];

      switch(type) {
        case 1: {
          const k = 1/10;
          const c = 2/10;
          operator = [
            k, k, k,
            k, c, k,
            k, k, k,
          ];
          break;
        }
        case 2: {
          operator = [
            1/16, 2/16, 1/16, 
            2/16, 4/16, 2/16, 
            1/16, 2/16, 1/16,
          ];
          break;
        }
        case 3: {
          operator = [
            1/273, 4/273,  7/273,  4/273,  1/273,
            4/273, 16/273, 26/273, 16/273, 4/273,
            7/273, 26/273, 41/273, 26/273, 7/273,
            4/273, 16/273, 26/273, 16/273, 4/273,
            1/273, 4/273,  7/273,  4/273,  1/273,
          ];
          break;
        }
        default: {
          const k = 1/9;
          operator = [
            k, k, k, 
            k, k, k, 
            k, k, k,
          ];
          break;
        } 
      }

      let imgData = this.convolution(this.dpCtx.getImageData(), operator);

      if ( !imgData ) return false;

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncLowpass : async function(type = 0) {
      let promise = new Promise(resolve => { resolve(this.lowpass(type)); });

      return await promise;
    },

    highpass : function(type = 0) {
      let operator = [];

      switch(type) {
        case 1: {
          operator = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0,
          ];
          break;
        }
        case 2: {
          operator = [
            1, -2, 1,
            -2, 5, -2,
            1, -2, 1,
          ];
          break;
        }
        case 3: {
          operator = [
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, 25, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
          ];
          break;
        }
        default: {
          operator = [
            -1, -1, -1,
            -1, 9, -1,
            -1, -1, -1,
          ];
          break;
        } 
      }

      let imgData = this.convolution(this.dpCtx.getImageData(), operator);

      if ( !imgData ) return false;
      
      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncHighpass : async function(type = 0) {
      let promise = new Promise(resolve => { resolve(this.highpass(type)); });
      return await promise;
    },

    sharpen : function() {
      let operator = [
        0, -0.2, 0, 
        -0.2, 1.8, -0.2, 
        0, -0.2, 0
      ];

      let imgData = this.convolution(this.dpCtx.getImageData(), operator);

      if (!imgData) return false;

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncSharpen : async function() {
      let promise = new Promise(resolve => { resolve(this.sharpen()); });
      return await promise;
    },

    gaussian : function(type = 0) {
      let operator = [];

      switch(type) {
        case 1: {
          operator = [
            1/52, 1/52, 2/52, 1/52, 1/52,
            1/52, 2/52, 4/52, 2/52, 1/52,
            2/52, 4/52, 8/52, 4/52, 2/52,
            1/52, 2/52, 4/52, 2/52, 1/52,
            1/52, 1/52, 2/52, 1/52, 1/52,
          ];
          break;
        }
        case 2: {
          operator = [
            1/140, 1/140, 2/140, 2/140, 2/140, 1/140, 1/140,
            1/140, 2/140, 2/140, 4/140, 2/140, 2/140, 1/140,
            2/140, 2/140, 4/140, 8/140, 4/140, 2/140, 2/140,
            2/140, 4/140, 8/140, 16/140, 8/140, 4/140, 2/140,
            2/140, 2/140, 4/140, 8/140, 4/140, 2/140, 2/140,
            1/140, 2/140, 2/140, 4/140, 2/140, 2/140, 1/140,
            1/140, 1/140, 2/140, 2/140, 2/140, 1/140, 1/140,
          ];
          break;
        }
        default: {
          operator = [
            1/16, 2/16, 1/16,
            2/16, 4/16, 2/16,
            1/16, 2/16, 1/16,
          ];
          break;
        } 
      }

      let imgData = this.convolution(this.dpCtx.getImageData(), operator);

      if (!imgData) return false;

      this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

      return true;
    },

    asyncGaussian : async function(type = 0) {
      let promise = new Promise(resolve => { resolve(this.gaussian(type)); });
      return await promise;
    },

  }

	window.dpImageProcessing = dpImageProcessing;

} )( window );
