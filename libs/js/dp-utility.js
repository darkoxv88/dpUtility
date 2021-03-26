/**
  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...


	* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * @Link CodeForces: https://codeforces.com/profile/darkoxv88

	* @fileoverview dp-utility.js provides some useful functionalities
  * @source https://github.com/darkoxv88/dpUtility
  * @version 1.0.8


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

window.dp = undefined;

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
    eval(''
      + 'class dpStaticTest { static test = true; };'
      + 'class dpFoo { _test; get test() { return this._test; }; set test(value) { this._test = value; }; constructor(i) { this.test = i; }; };'
      + 'class dpBar extends dpFoo { constructor() { super(`1`); }; }'
      + 'const asyncTest = async (x = new dpFoo()) => { let promise = new Promise(resolve => { resolve(x); }); await promise; };'
      + 'asyncTest();'
      + 'output = dpStaticTest.test;'
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

var dpConst = {
  supportsES6 : dpVerifyES6(true),
  epsilon : 0.000001,
  floatArray : (typeof Float32Array !== 'undefined') ? Float32Array : Array,
}

Object.freeze(dpConst);

/**
  * @name dp
	* @class
  * Static class.
  * Holds some useful functions.
	
  * @function deserialize
  * @function $
  * @function each
  * @function main
  * @function onLoad
  * @function registerStyle
  * @function byte
  * @function rgba
  * @function maxCap
  * @function minCap
  * @function degToRad
  * @function radToDeg
  * @service cookie
  * @service ajax
  * @service events
  * @service frame
**/
var dp = new function() {
  /**
    * @name deserialize
    * @function
    * Performs 1D deserialization of GET query
    * @param {string} str
    * @returns string
  **/
  this.deserialize = function(str) {
    let tempArray = {};
    let splitByAND = str.split('&');

    for (let i in splitByAND) {
      let splitByEqual = splitByAND[i].split('=');
      tempArray[splitByEqual[0]] = splitByEqual[1];
    }

    return tempArray;
  }

  /**
    * @name $
    * @function
    * Gets DOMelement/s
    * @param {string} value

    * If the string starts with '#' it will search by id attribute.
    * If the string starts with '&' it will search by name attribute.
    * If the string starts with '.' it will search by class attribute.
    * If the string is in HTML tag format '<>' it will search all DOM elements as that tag.
    * Everything else will use generic query selector.
    * 
    * @param {Element} target
    * If the target is of type Element it wil perform querySelectorAll on its chields and grandchields
    * 
    * @returns HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element>
  **/
   this.$ = function(value, target) {
    if (typeof value != 'string' || !value) return null;
  
    let firstChar = value[0];
    let subFirst = value.substr(1);

    let validateTarge = function(t) {
      if (!t) return false;
      if (t instanceof Element !== true) return false;
      if (!t.getElementsByClassName) return false;
      if (!t.getElementsByTagName) return false;
      if (!t.querySelectorAll) return false;
      return true;
    }(target);
  
    if (firstChar == '#') {
      return document.getElementById(subFirst);
    }

    if (firstChar == '&') { 
      return document.getElementsByName(subFirst);
    }
  
    if (firstChar == '.') {
      if (validateTarge) return target.getElementsByClassName(subFirst);
      return document.getElementsByClassName(subFirst);
    }
  
    if (firstChar == '<') {
      if (validateTarge) return target.getElementsByTagName(subFirst.substr(0, subFirst.length-1));
      return document.getElementsByTagName(subFirst.substr(0, subFirst.length-1));
    }
  
    if (validateTarge) return target.querySelectorAll(value);
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
  this.each = function(obj, callback) {
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
    * Handels the main call function
  **/
  this.main = function(mainFunc) {
    try {
      if (typeof mainFunc == 'function') mainFunc();
    } catch(err) {
      console.error(err);
    } finally {
      return 0;
    }
  }

  /**
    * @name onload
    * @returns {void}
    * @function
    * This function is called as the window.onload event
  **/
  this.onLoad = function(loadFunc) {
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

  /**
    * @name registerStyle
    * @returns {boolean}
    * @function
    * Adds the given style to head
    * @param {string} tag
    * should be a string of a html tag, ex: div || html-tag 
    * @param {string} style
    * Encompasses the given style param around the tag param
  **/
  this.registerStyle = function(tag, style) {
    let head = dp.$('<head>')[0];
    let dpStyles = dp.$('<dp-styles>');
    let styleInner = document.createElement('style');

    if (dpStyles.length == 0) {
      dpStyles = document.createElement('dp-styles');
      dpStyles.setAttribute('hidden', true);
      head.append(dpStyles);
    } else {
      dpStyles = dpStyles[0];
    }

    if (typeof tag != 'string' || typeof style != 'string') return false;

    let styleID = dp.$('#dp-style-' + tag);
    let buildStyle = function(tag, style) {
      let count = [...style].filter(x => x === '{').length;
      let s = style.split('}');

      let output = tag + ' {display: block;} ';
      for (let i in s) {
        if (i == count) return output;
        output += tag + " " + s[i] + "} "
      }
    }

    if (!tag) {
      styleInner.innerHTML = style;
      dpStyles.append(styleInner);
      return true;
    }

    if (styleID) {
      styleID.innerHTML = buildStyle(tag, style);
      return true;
    }

    styleInner.setAttribute('id', 'dp-style-' + tag);
    styleInner.innerHTML = buildStyle(tag, style);
    dpStyles.append(styleInner);

    return true;
  }

  /**
    * @name byte
    * @function
    * Takes a number value and tranforms it into type of intiger that ranges from 0 to 255 ( 0 <= x <= 255 ).
    * @param {number} val
  **/
  this.byte = function(val) { 
    if (!val) { return 0; }

    try {
      val = parseInt(val);
    } catch(error) {
      console.error('Value: ' + val + ' cant be parsed to int.' + ' --> ', error);
      return 0;
    }

    if (val > 255) { return 255; }
    if (val < 0) { return 0; }

    return val;
  }

  /**
    * @name rgba
    * @function
    * Formats the given numbers into a object with r,g,b,a keys each representing a byte value corresponding to color chanel.
    * @param {number} r
    * represents RED chanel
    * @param {number} g
    * represents GREEN chanel
    * @param {number} b
    * represents BLUE chanel
    * @param {number} a
    * represents ALFA chanel
  **/
  this.rgba = function(r, g, b, a = 255) {
    return {
      r : this.byte(r),
      g : this.byte(g),
      b : this.byte(b),
      a : this.byte(a)
    }
  }

  this.maxCap = function(value, cap) {
    if (typeof(value) !== 'number') { 
      console.error('value: ' + value + ' is not a number');
      return;
    }
    if (typeof(cap) !== 'number') { 
      console.error('cap: ' + cap + ' is not a number');
      return;
    }

    if (value > cap) { value = cap; }

    return value;
  }
  
  this.minCap = function(value, cap) {
    if (typeof(value) !== 'number') { 
      console.error('value: ' + value + ' is not a number');
      return;
    }
    if (typeof(cap) !== 'number') { 
      console.error('cap: ' + cap + ' is not a number');
      return;
    }

    if (value < cap) { value = cap; }

    return value;
  }

  /**
    * @name degToRad
    * @returns {number}
    * @function
    * Converts the given degree to radian
    * @param {number} tag
    * Degree value to convert.
  **/
  this.degToRad = function(val) {
    if (typeof(val) == 'number') return (val * (Math.PI / 180)); else return undefined;
  }

  /**
    * @name radToDeg
    * @returns {number}
    * @function
    * Converts the given radian to degre
    * @param {number} tag
    * Radian value to convert.
  **/
  this.radToDeg = function(val) {
    if (typeof(val) == 'number') return (val * (180 / Math.PI)); else return undefined;
  }

  this.cookie = null;
  this.ajax = null;
  this.events = null;
  this.frame = null;

}



// *********************** 
// Math ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



/**
  * @name dpVec2
	* @class
  * 
  * 
**/
var dpVec2 = new function() {

  this._array = dpConst.floatArray;

  this.empty = function() {
    let out = new this._array(2);
    out[0] = 0;
    out[1] = 0;
    return out;
  }

  this.create = function(x, y) {
    let out = new this._array(2);
    out[0] = x;
    out[1] = y;
    return out;
  }

  this.clone = function(v) {
    let out = new this._array(2);
    out[0] = v[0];
    out[1] = v[1];
    return out;
  }

  this.add = function(v1, v2) {
    return this.create(v1[0]+v2[0], v1[1]+v2[1]);
  }

  this.sub = function(v1, v2) {
    return this.create(v1[0]-v2[0], v1[1]-v2[1]);
  }

  this.mul = function(v1, v2) {
    return this.create(v1[0]*v2[0], v1[1]*v2[1]);
  }

  this.div = function(v1, v2) {
    return this.create(v1[0]/v2[0], v1[1]/v2[1]);
  }

  this.max = function(v1, v2) {
    return this.create(Math.max(v1[0], v2[0]), Math.max(v1[1], v2[1]));
  }

  this.scale = function(v1, scale) {
    return this.create(v1[0] * scale, v1[1] * scale); 
  }

  this.distance = function(v1, v2) {
    let x = v2[0] - v1[0];
    let y = v2[1] - v1[1];
    return x*x + y*y;
  }

  this.distanceSqrt = function(v1, v2) {
    return Math.sqrt(this.distance(v1, v2));
  }

  this.negate = function(v1) {
    return this.create(0 - v1[0], 0 - v1[1]);;
  }
}



/**
  * @name dpVec3
	* @class
  * 
  * 
**/
var dpVec3 = new function() {

  this._array = dpConst.floatArray;

  this.empty = function() {
    let out = new this._array(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }

  this.create = function(x, y, z) {
    let out = this.empty(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }

  this.clone = function(v) {
    let out = this.empty(3);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    return out;
  }

  this.add = function(v1, v2) {
    return this.create(v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]);
  }

  this.sub = function(v1, v2) {
    return this.create(v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]);
  }

  this.mul = function(v1, v2) {
    return this.create(v1[0]*v2[0], v1[1]*v2[1], v1[2]*v2[2]);
  }

  this.div = function(v1, v2) {
    return this.create(v1[0]/v2[0], v1[1]/v2[1], v1[2]/v2[2]);
  }

  this.scale = function(v1, scale) {
    return this.create(v1[0] * scale, v1[1] * scale, v1[2] * scale); 
  }

  this.dotProduct = function(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
  }

  this.lenght = function(v) {
    return Math.sqrt(this.dotProduct(v, v));
  }

  this.normalise = function(v) {
    const l = this.lenght(v)
    return this.create(v[0] / l, v[1] / l, v[2] / l);
  }

  this.crossProduct = function(v1, v2) {
    return this.create(
      v1[1]*v2[2] - v1[2]*v2[1], 
      v1[2]*v2[0] - v1[0]*v2[2], 
      v1[0]*v2[1] - v1[1]*v2[0]
    );
  }

}



/**
  * @name dpVec4
	* @class
  * 
  * 
**/
var dpVec4 = new function() {

  this._array = dpConst.floatArray;

  this.empty = function() {
    let out = new this._array(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
  }

  this.create = function(x, y, z, m) {
    let out = this.empty(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = m;
    return out;
  }

  this.clone = function(v) {
    let out = this.empty(3);
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[3] = v[3];
    return out;
  }

  this.add = function(v1, v2) {
    return this.create(v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2], v1[3]+v2[3]);
  }

  this.sub = function(v1, v2) {
    return this.create(v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2], v1[3]-v2[3]);
  }

  this.mul = function(v1, v2) {
    return this.create(v1[0]*v2[0], v1[1]*v2[1], v1[2]*v2[2], v1[3]*v2[3]);
  }

  this.div = function(v1, v2) {
    return this.create(v1[0]/v2[0], v1[1]/v2[1], v1[2]/v2[2], v1[3]/v2[3]);
  }

  this.scale = function(v1, scale) {
    return this.create(v1[0] * scale, v1[1] * scale, v1[2] * scale, v1[3] * scale); 
  }

}



/**
  * @name dpMat2x2
	* @class
  * 
  * 
**/
var dpMat2x2 = new function() {

  this._array = dpConst.floatArray;

  this.empty = function() {
    return new this._array(4);
  }

}



// *********************** 
// Helper ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



/**
  * @name dpCallback
	* @class
  * 
  * 
**/
function dpCallback(value, sub = null) {
  this.init(value, sub);
  this.init = undefined;
}
dpCallback.prototype = {

  _value : null,
  _call : null,

  init : function(value, sub) {
    this._value = value;
    this.subscribe(sub);
  },

  destructor : function() {
    this._value = undefined;
    this._call = undefined;
    delete this;
  },

  subscribe : function(callback) { 
    if (!callback) return;
    if (typeof(callback) !== 'function')  return;
    this._call = callback;
  },

  unsubscribe : function() { 
    this._call = null;
  },

  reset : function() {
    this._value = null;
    this.unsubscribe();
  },

  fireEvent : function() {
    try {
      if (typeof(this._call) !== 'function') { return; }
      this._call(this._value);
    } catch(err) { console.error(err); }
  },

  next : function(value) {
    this._value = value;
    this.fireEvent();
  },

  getValue : function() {
    return this._value;
  },

}



// *********************** 
// General ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



/**
  * @name dpCookie
	* @class
  * 
  * 
**/
function dpCookie() {
  this.init();
  this.init = undefined;
}
dpCookie.prototype = {

  init : function() { },

  destructor : function() {
    delete this;
  },

  put : function(cookieName, cookieValue, cookieDurationDays = 7, type = 'day') {
    if (typeof cookieName != 'string') { cookieName = 'noname' }
    if (typeof cookieDurationDays != 'number') { cookieDurationDays = 7; }

    let d = 24;
    let h = 60;

    if (type == 'hour') { d = 1; }
    if (type == 'minute') { d = 1; h = 1; }

    let date = new Date();
    date.setTime(date.getTime() + (cookieDurationDays * d * h * 60 * 1000));
    document.cookie = cookieName + '=' + JSON.stringify(cookieValue) + ';' + 'expires=' + date.toUTCString() + ';path=/';
  },

  get : function(cookieName) {
    cookieName = cookieName + '=';
    let decodedCookie = document.cookie.split('; ');

    for (let i = 0; i < decodedCookie.length; i++) {
      let cookie = decodedCookie[i];

      while (cookie.charAt(0) == ' ') { cookie = cookie.substring(1); }

      if (cookie.indexOf(cookieName) == 0) { return JSON.parse(cookie.substring(cookieName.length, cookie.length)); }
    }

    return undefined;
  },

  delete : function(cookieName) {
    let date = new Date();
    date.setTime(date.getTime() - 1000);
    document.cookie = cookieName + '=' + '' + ';' + 'expires=' + date.toUTCString() + ';path=/';
  },

  putObj : function(obj, cookieDurationDays = 7, type = 'day') {
    if (typeof(obj) !== 'object') { return false; }

    for (let item in obj) this.put(item, obj[item], cookieDurationDays, type);
  },

  getObj : function(obj) {
    if (typeof(obj) !== 'object') { return false; }

    let output = {}

    for (let item in obj) { output[item] = this.get(item); }

    return output;
  },

  deleteObj : function(obj) {
    if (typeof(obj) !== 'object') { return false; }

    for (let item in obj) { this.delete(item); }
  },

  getAll : function() {
    let output = {};
    const decodedCookie = document.cookie.split('; ');
    
    if (!decodedCookie[0]) { return output; }

    for (let i = 0; i < decodedCookie.length; i++) {
      let splitCookie = decodedCookie[i].split('=');

      while (splitCookie[0].charAt(0) == ' ') { splitCookie[0] = splitCookie[0].substring(1); }

      output[splitCookie[0]] = splitCookie[1];

      for (let j = 2; j < splitCookie.length; j++) { output[splitCookie[0]] = output[splitCookie[0]] + '=' + splitCookie[j]; }

      output[splitCookie[0]] = JSON.parse(output[splitCookie[0]]);
    }

    return output;

  },

  deleteAll: function() {
    this.deleteObj(this.getAll());
  }
  
}



/**
  * @name dpAJAX
	* @class
  * 
  * 
**/
function dpAJAX(errorCallback, progressCallback) {
  this.init(errorCallback, progressCallback);
  this.init = undefined;
}
dpAJAX.prototype = {

  _error : null,
  _progress : null,

  init : function(errorCallback, progressCallback) {
    this._error = new dpCallback(null);
    this._progress = new dpCallback({
      loaded : 0,
      total : 0,
    });

    this.subError(errorCallback);
    this.subProgress(progressCallback)
  },

  destructor : function() {
    this._error.destructor();
    this._progress = undefined;
    this._error.destructor();
    this._progress = undefined;
    delete this;
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
        const respHeaders = xhr.getAllResponseHeaders().split('\r\n').reduce((result, current) => {
          let [name, value] = current.split(': ');
          result[name] = value;
          return result;
        }, {});

        if (xhr.status != 200) { 
          console.error('Error ' + xhr.status + ': ' + xhr.statusText);
          this._error.next({
            status : xhr.status,
            statusText : xhr.statusText,
            headers : respHeaders,
            xhr : xhr,
          });
          reject(xhr.status, xhr.statusText, xhr);
          return;
        }

        if (typeof(callback) === 'function') callback(xhr.response, respHeaders, xhr);

        resolve(xhr.response, respHeaders, xhr);
      };

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          this._progress.next({
            loaded : event.loaded, 
            total : event.total,
          });
        } else {
          this._progress.next({
            loaded : event.loaded,
          });
        }
      };
      
      xhr.onerror = function() {
        console.error('Request failed');
      };

      xhr.send(body);
    });
  },

  get : function(url, header, callback) {
    return this._baseCall(url, null, header, callback, 'GET');
  },

  delete : function(url, header, callback) {
    return this._baseCall(url, null, header, callback, 'DELETE');
  },

  post : function(url, body, header, callback) {
    return this._baseCall(url, body, header, callback, 'POST');
  },

  update : function(url, body, header, callback) {
    return this._baseCall(url, body, header, callback, 'UPDATE');
  },

  put : function(url, body, header, callback) {
    return this._baseCall(url, body, header, callback, 'PUT');
  },

}



/**
  * @name dpEventsHandler
	* @class
  * 
  * 
**/
function dpEventsHandler(bodyFilter) {
  this.init(bodyFilter);
  this.init = undefined;
}
dpEventsHandler.prototype = {

  _mutation : null,
  _events : null,
  _bodyFilter : '',

  init : function(bodyFilter) {
    this._bodyFilter = '<body>';
    this._events = {};

    this._mutation = new MutationObserver(() => {
      this.populateEvents();
    });
    this._mutation.dpOnBody = false;
  },

  destructor : function() {
    this._bodyFilter = null;
    this._events = null;
    this._mutation = null;
    delete this;
  },

  add : function(type, query, callback) {
    let body = dp.$(this._bodyFilter);

    if (body instanceof HTMLElement !== true) body = body[0];

    if (typeof type == 'string' && typeof query == 'string'  && typeof callback == 'function') {
      this._events[String(type+query)] = {
        type : type,
        query : query,
        callback : callback,
      }
    }

    if (!body) {
      console.log('No parent tag was found');
      this._mutation.disconnect();
      this._mutation.dpOnBody = false;
      return;
    }

    if (!this._mutation.dpOnBody) {
      this._mutation.observe(body, {childList : true, subtree : true, attributes : true});
      this._mutation.dpOnBody = true;
    }
  },

  populateEvents() {
    let setEvent = function(e, t, c) {
      if (typeof c != 'function') return;

      if (e.addEventListener) {
        e.addEventListener(t, c, false);
        return;
      }

      if (e.attachEvent) {
        e.attachEvent('on'+t, c);
        return;
      }

      e['on'+t] = c;
    }

    for (let k in this._events) {
      const e = this._events[k];
      const elements =  dp.$(e.query);

      if (elements instanceof HTMLElement) {
        setEvent(elements, e.type, e.callback);
        continue;
      }

      for (let element = 0; element < elements.length; element++) setEvent(elements[element], e.type, e.callback);
    }
  },
  
}



/**
  * @name dpFrame
	* @class
  * 
  * 
**/
function dpFrame() {
  this.init();
  this.init = undefined;
}
dpFrame.prototype = {
  _isStopped : null,
  _isPaused : null,
  _startingTime : null,
  _lastTime : null,
  _totalElapsedTime : null,
  _elapsedSinceLastLoop : null,

  _onStart : null,
  onStart : function(value = null) {
    if (typeof value == 'function') { this._onStart.subscribe(value); }
  },

  _onUpdate : null,
  onUpdate : function(value = null) {
    if (typeof value == 'function') { this._onUpdate.subscribe(value); }
  },

  _onLateUpdate : null,
  onLateUpdate : function(value = null) {
    if (typeof value == 'function') { this._onLateUpdate.subscribe(value); }
  },

  init : function() {
    this._isStopped = false;
    this._isPaused = false;
    this._onStart = new dpCallback(null);
    this._onUpdate = new dpCallback(null);
    this._onLateUpdate = new dpCallback(null);
  },

  destructor : function() {
    this.frame = function(){};
    this._onStart.destructor();
    this._onStart = undefined;
    this._onUpdate.destructor();
    this._onUpdate = undefined;
    this._onLateUpdate.destructor();
    this._onLateUpdate = undefined;
    delete this;
  },

  start : function() { 
    requestAnimationFrame((currentTime) => {
      this.unpause();
      this.unstop();

      this._startingTime = currentTime;
      this._lastTime = currentTime;
      this._totalElapsedTime = 0;
      this._elapsedSinceLastLoop = 0;

      if (this._onStart instanceof dpCallback) this._onStart.next(0);

      requestAnimationFrame((t) => {this.frame(t);});
    });
  },

  frame : function(currentTime) {
    if (this._isStopped) {
      requestAnimationFrame((t) => {this.frame(t);});
      return;
    }

    this._totalElapsedTime = currentTime - this._startingTime;
    this._elapsedSinceLastLoop = currentTime - this._lastTime;

    this._lastTime = currentTime;
    this._onUpdate.next(this._elapsedSinceLastLoop);
    this._onLateUpdate.next(this._elapsedSinceLastLoop);

    requestAnimationFrame((t) => {this.frame(t);});
  },

  stop : function() {
    this._isStopped = true;
  },

  unstop : function() {
    this._isStopped = false;
  },

  pause : function() {
    this._isPaused = true;
  },

  unpause : function() {
    this._isPaused = false;
  },

}



// *********************** 
// Image processing ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



/**
  * @name dpColor
	* @class
  * 
  * 
**/
var dpColor = new function()  {

  this.kelvinTable = {
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
  }

  this.rgbToHSL = function(cR, cG, cB) {

    let r = dp.byte(cR) / 255;
    let g = dp.byte(cG) / 255;
    let b = dp.byte(cB) / 255;

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

  this.hslToRGB = function(h, s, l) {
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

    return dp.rgba(r, g, b);
  }

  this.colorTemperatureToRgb = function(value) {
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

    return dp.rgba(r, g, b);
  }

}



/**
  * @name dpCanvas2dCtx
	* @class
  * 
  * 
**/
function dpCanvas2dCtx() {
  this.init();
  this.init = undefined;
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
    this.onLoadEvent = new dpCallback();
  },

  destructor : function() {
    delete this;
  },

  onLoad: function(callback) {
    this.onLoadEvent.subscribe(callback);
  },

  loadImage : function(e, type='event') {
    if (!e) { return; }

    let files = null;

    if (type === 'src') { 
      this.registerImage(e);
      return;
    }

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



/**
  * @name dpImageProcessing
	* @class
  * 
  * 
**/
function dpImageProcessing(callback = null) {
  this.init(callback);
  this.init = undefined;
}
dpImageProcessing.prototype = {

  kelvinTable : null,
  dpCtx : null,

  init : function (callback) { 
    this.dpCtx = new dpCanvas2dCtx();

    if (typeof callback == 'function') {
      this.onLoad(callback);
    }
  },

  destructor : function() {
    this.kelvinTable = undefined;
    this.dpCtx.destructor();
    this.dpCtx = undefined;
    delete this;
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
    if ( !(imgData instanceof ImageData) || !operationMatrix ) {
      console.error('imgData param is required to an instance of ImageData');
      return null;
    }

    if ( imgData.data.length <= 1) return null;

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

        outputData.data[position] = dp.byte(sumR);
        outputData.data[position + 1] = dp.byte(sumG);
        outputData.data[position + 2] = dp.byte(sumB);
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



  flipImage : function(flipH, flipV) {
    var scaleH = flipH ? -1 : 1;
    var scaleV = flipV ? -1 : 1;

    this.dpCtx.ctxActive.save();

    if(flipH) { this.dpCtx.ctxActive.translate(this.dpCtx.getWidth(), 0); }
    if(flipV) { this.dpCtx.ctxActive.translate(0, this.dpCtx.getHeight()); } 

    this.dpCtx.ctxActive.scale(scaleH, scaleV);
    this.dpCtx.ctxActive.drawImage(this.dpCtx.getCanvas(), 0, 0);
    this.dpCtx.ctxActive.setTransform(1,0,0,1,0,0);
    this.dpCtx.ctxActive.restore();

    return true;
  },

  rotateImage : function(clockwise) {
    let org = document.createElement('canvas').getContext('2d');
    org.canvas.width = this.dpCtx.ctxActive.canvas.width;
    org.canvas.height = this.dpCtx.ctxActive.canvas.height;
    org.putImageData(this.dpCtx.getImageData(), 0, 0);

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
    this.dpCtx.ctxActive.drawImage(org.canvas, 0 , 0);
    this.dpCtx.ctxActive.setTransform(1,0,0,1,0,0);

    return true;
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

  sepia : function() {
    let imgData = this.dpCtx.getImageData();
    let data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      let red = data[i], green = data[i + 1], blue = data[i + 2];
  
      data[i] = dp.byte(0.393 * red + 0.769 * green + 0.189 * blue);
      data[i + 1] = dp.byte(0.349 * red + 0.686 * green + 0.168 * blue);
      data[i + 2] = dp.byte(0.272 * red + 0.534 * green + 0.131 * blue);
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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
      data[i] = dp.byte(255 * Math.pow((data[i] / 255), gammaCorrection));
      data[i+1] = dp.byte(255 * Math.pow((data[i+1] / 255), gammaCorrection));
      data[i+2] = dp.byte(255 * Math.pow((data[i+2] / 255), gammaCorrection));
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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
      data[i+3] = dp.byte(data[i+3] * value);
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
  },

  temperature : function(value) {
    try {
      value = parseInt(value);
    } catch(error) {
      console.error(`Value: ${value} cant be parsed to int.`, error)
      return;
    }

    if (value <= 0) { return false; }


    let gen = dpColor.colorTemperatureToRgb(value);

    let r = gen.r / 255;
    let g = gen.g / 255;
    let b = gen.b / 255;

    let imgData = this.dpCtx.getImageData();
    let data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = dp.byte(data[i] * r);
      data[i+1] = dp.byte(data[i+1] * g);
      data[i+2] = dp.byte(data[i+2] * b);
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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

      data[i] += dp.byte(random);
      data[i+1] += dp.byte(random);
      data[i+2] += dp.byte(random);
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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

      data[i] = dp.byte(
        ( ((1 - value)*luR + value)*red + ((1 - value)*luG)*green + ((1 - value)*luB)*blue )
      );
      
      data[i+1] = dp.byte(
        ( ((1 - value)*luR)*red + ((1 - value)*luG + value)*green + ((1 - value)*luB)*blue )
      );

      data[i+2] = dp.byte(
        ( ((1 - value)*luR)*red + ((1 - value)*luG)*green + ((1 - value)*luB + value)*blue )
      );
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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
      data[i] = dp.byte(data[i] + value);
      data[i+1] = dp.byte(data[i+1] + value);
      data[i+2] = dp.byte(data[i+2] + value);
    }

    this.dpCtx.ctxActive.putImageData(imgData, 0, 0);

    return true;
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

  

  sobel : function(type = 'x1') {
    let operator;

    switch(type) {
      case 'x1': {
        operator = [
          -1, -2, -1,
          0, 0, 0,
          1, 2, 1,
        ];
        break;
      }
      case 'x2': {
        operator = [
          1, 2, 1,
          0, 0, 0,
          -1, -2, -1,
        ];
        break;
      }
      case 'y1': {
        operator = [
          -1, 0, 1,
          -2, 0, 2,
          -1, 0, 1,
        ];
        break;
      }
      case 'y2': {
        operator = [
          1, 0, -1,
          2, 0, -2,
          1, 0, -1,
        ];
        break;
      }
    }

    let imgData = this.convolution(this.dpCtx.getImageData(), operator);

    return imgData;
  },

  roberts : function() {
    let operator = [
      0, 0, 0, 
      1, -1, 0, 
      0, 0, 0,
    ];

    let imgData = this.convolution(this.dpCtx.getImageData(), operator);

    return imgData;
  },

}



// *********************** 
// Instantiate services ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



dp.main(function() {
  dp.cookie = new dpCookie();
  dp.ajax = new dpAJAX();
  dp.events = new dpEventsHandler();
  dp.frame = new dpFrame();
});
