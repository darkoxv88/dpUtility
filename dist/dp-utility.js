/**
  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...


	* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * @Link CodeForces: https://codeforces.com/profile/darkoxv88

	* @fileoverview dp-utility.js provides some useful functionalities
  * @source https://github.com/darkoxv88/dpUtility
  * @version 1.1.7


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

(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) define([], function() { return factory.call(root); });
  else root.dp = factory.call(root);
}(this, function() {
  'use strict';

  /**	
    * @name verifyES6
    * @function
    * Verifies if browser supports ES6 (ECMAScript 2015).
    * If the browser supports ES6, it will return true.
  **/
  function verifyES6() {
    try {
      new Function(''
        + 'class dpStaticTest { static test = true; };'
        + 'class dpFoo { _test; get test() { return this._test; }; set test(value) { this._test = value; }; constructor(i) { this.test = i; }; };'
        + 'class dpBar extends dpFoo { constructor() { super(`1`); }; }'
        + 'const test = (x = new dpFoo()) => { let y = 1; return x; };'
      );
    } catch (err) {
      console.error(err);
      
      return false;
    }

    return true;
  }

  /**	
    * @name verifyES7()
    * @function
    * Verifies if browser supports ES7 (ECMAScript 2016).
    * If the browser supports ES7, it will return true.
  **/
  function verifyES7() {
    try {
      new Function(''
        + 'async function asyncTest(x) { var promise = new Promise(function(resolve) { resolve(x); }); return promise; };'
        + 'async function awaitTest() { return await asyncTest(true); };'
      );
    } catch (err) {
      console.error(err);

      return false;
    }

    return true;
  }

  var dpConst = {
    supportsES6 : verifyES6(),
    supportsES7 : verifyES7(),
    epsilon : 0.000001,
    floatArray : (typeof Float32Array !== 'undefined') ? Float32Array : Array,
  }

  Object.freeze(dpConst);

  if (!dpConst.supportsES6 || !dpConst.supportsES7) throw new Error('Insufficient feature support!');

  /**
    * @name deserialize
    * @function
    * Performs 1D deserialization of GET query.
    * @param {string} str
    * @returns string
  **/
  var deserialize = function(str) {
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
    * Gets DOMelement/s.
    * @param {string} value
    * If the string starts with '#' it will search by id attribute.
    * If the string starts with '.' it will search by class attribute.
    * If the string is in HTML tag format '<>' it will search all DOM elements as that tag.
    * Everything else will use generic query selector.
    * @param {Element} target
    * If the target is of type Element it wil perform querySelectorAll on its chields and grandchields.
    * @returns Element | HTMLCollectionOf<Element> | NodeListOf<Element>
  **/
   var $ = function(value, multiID, target) {
    if (typeof value != 'string') return null;

    let firstChar = value[0];

    let validateTarge = target instanceof Element;

    if (firstChar == '<') {
      let subFirst = value.substr(1);

      if (validateTarge) return target.querySelectorAll(subFirst.substr(0, subFirst.length-1));

      return document.querySelectorAll(subFirst.substr(0, subFirst.length-1));
    }

    let query;
  
    if (validateTarge) query = target.querySelectorAll(value);
    else query = document.querySelectorAll(value);

    if (firstChar !== '#' || multiID) return query;

    if (query[0]) return query[0];

    return null;
  };

  /**
    * @name each
    * @function
    * Iterates through given objects elemente.
    * @param {object} obj
    * Objects to iterate through.
    * @param {function} callback
    * When called it is given 2 elements, objects key name and that keys value.
  **/
  var each = function(obj, callback) {
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
    * @name functionWrapper
    * @function
    * Wrappes the given function in try-catch block.
    * @param {function} func
    * Function to wrapp.
    * @param {function} onError
    * Function that is called if an error happens.
  **/
  var functionWrapper = function(func, onError) {
    if (typeof func !== 'function') {
      console.warn(new TypeError('parameter "func" needs to be a function.'));
  
      return function() { }
    }
  
    return function() {
      try {
        return func.apply(this, arguments);
      } catch (e) {
        if (typeof onError === 'function') return onError(e);
        return null;
      }
    }
  }

  /**
    * @name main
    * @returns {void}
    * @function
    * Handels the main call function and the window.onload event.
  **/
  var main = function(mainFunc, onloadFunc, onerrorFunc) {
    try {
      if (typeof mainFunc === 'function') mainFunc();
    } catch (e) {
      if (typeof onerror === 'function') onerrorFunc(e);
    }
  
    if (typeof onloadFunc !== 'function') return;
  
    var init = function() {
      try {
        onloadFunc.apply(this, arguments);
      } catch (e) {
        if (typeof onerrorFunc === 'function') return onerrorFunc(e);
      }
    }
  
    if (window.addEventListener) {
      window.addEventListener("load", init, false);
      return;
    }
  
    if (window.attachEvent) {
      window.attachEvent('onload', init);
      return;
    }
  
    if (typeof window.onload == 'function') {
      var currentWindowOnLoad = window.onload;
  
      var newWindowOnLoad = function(evt) {
        currentWindowOnLoad(evt);
        init(evt);
      };
  
      window.onload = newWindowOnLoad;
      return;
    }
  
    window.onload = init;
  
    return;
  }

  /**
    * @name registerStyle
    * @returns {boolean}
    * @function
    * Adds the given style to head.
    * @param {string} tag
    * should be a string of a html tag, ex: div || html-tag.
    * @param {string} style
    * Encompasses the given style param around the tag param.
  **/
  var registerStyle = function(tag, style) {
    let head = $('<head>')[0];
    let dpStyles = $('<dp-styles>');
    let styleInner = document.createElement('style');

    if (dpStyles.length == 0) {
      dpStyles = document.createElement('dp-styles');
      dpStyles.setAttribute('hidden', true);
      head.append(dpStyles);
    } else {
      dpStyles = dpStyles[0];
    }

    if (typeof tag != 'string' || typeof style != 'string') return false;

    let styleID = $('#dp-style-' + tag);
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
    * @name maxCap
    * @returns {number}
    * @function
    * If the given value exceeds the cap, it will return the cap.
    * @param {number} value
    * @param {number} cap
  **/
  var maxCap = function(value, cap) {
    if (typeof(value) !== 'number' || typeof(cap) !== 'number') throw new TypeError(value + ' OR ' + cap + ' is not a number');
    if (value > cap) return cap;
    return value;
  }
  
  /**
    * @name minCap
    * @returns {number}
    * @function
    * If the given value is lower than the cap, it will return the cap.
    * @param {number} value
    * @param {number} cap
  **/
  var minCap = function(value, cap) {
    if (typeof(value) !== 'number' || typeof(cap) !== 'number') throw new TypeError(value + ' OR ' + cap + ' is not a number');
    if (value < cap) return cap;
    return value;
  }

  /**
    * @name degToRad
    * @returns {number}
    * @function
    * Converts the given degree to radian.
    * @param {number} val
    * Degree value to convert.
  **/
  var degToRad = function(val) {
    if (typeof(val) == 'number') return (val * (Math.PI / 180)); else return undefined;
  }

  /**
    * @name radToDeg
    * @returns {number}
    * @function
    * Converts the given radian to degre.
    * @param {number} val
    * Radian value to convert.
  **/
  var radToDeg = function(val) {
    if (typeof(val) == 'number') return (val * (180 / Math.PI)); else return undefined;
  }

  

  /**
    * @name safeUriHandler
    * @class
    * Safely handles URI encode and decode.
  **/
  var safeUriHandler = new function() {

    this.encode = function(str) {
      try {
        return encodeURIComponent(str);
      }
      catch (e) {
        console.warn('Could not encode the given string: ' + str, e);
  
        return str;
      }
    }

    this.decode = function(str) {
      try {
        return encodeURIComponent(str);
      }
      catch (e) {
        console.warn('Could not decode the given string: ' + str, e);
  
        return str;
      }
    }

  }



  /**
    * @name vec2
    * @class
    * Handles the calculations for a 2D Vector.
  **/
  var vec2 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @returns {vec2}
      * @function
      * Creates an empty vec2
    **/
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

    this.min = function(v1, v2) {
      return this.create(Math.min(v1[0], v2[0]), Math.min(v1[1], v2[1]));
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
      return this.create(0 - v1[0], 0 - v1[1]);
    }

    this.dotProduct = function(v1, v2) {
      return v1[0]*v2[0] + v1[1]*v2[1];
    }

    this.lenght = function(v) {
      return Math.sqrt(this.dotProduct(v, v));
    }

    this.normalize = function(a) {
	    let len = this.lenght(a);

      if (len === 0) return this.create(0, 0);

	    return this.create(
        out[0] = a[0] / len,
        out[1] = a[1] / len
      );
	  }

    this.inverse = function(a) {
      return this.create(1.0 / a[0], 1.0 / a[1]); 
    }

  }



  /**
    * @name vec3
    * @class
    * Handles the calculations for a 3D Vector.
  **/
  var vec3 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @returns {vec3}
      * @function
      * Creates an empty vec3
    **/
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

    this.min = function(v1, v2) {
      return this.create(Math.min(v1[0], v2[0]), Math.min(v1[1], v2[1]), Math.min(v1[2], v2[2]));
    }

    this.max = function(v1, v2) {
      return this.create(Math.max(v1[0], v2[0]), Math.max(v1[1], v2[1]), Math.max(v1[2], v2[2]));
    }

    this.scale = function(v1, scale) {
      return this.create(v1[0] * scale, v1[1] * scale, v1[2] * scale); 
    }

    this.distance = function(v1, v2) {
      let x = v2[0] - v1[0];
      let y = v2[1] - v1[1];
      let z = v2[2] - v1[2];
      return x*x + y*y + z*z;
    }

    this.distanceSqrt = function(v1, v2) {
      return Math.sqrt(this.distance(v1, v2));
    }

    this.negate = function(v1) {
      return this.create(0 - v1[0], 0 - v1[1], 0 - v1[2]);
    }

    this.dotProduct = function(v1, v2) {
      return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
    }

    this.lenght = function(v) {
      return Math.sqrt(this.dotProduct(v, v));
    }

    this.normalise = function(v) {
      const l = this.lenght(v);

      if (len === 0) return this.create(0, 0, 0);

      return this.create(
        v[0] / l,
        v[1] / l,
        v[2] / l
      );
    }

    this.crossProduct = function(v1, v2) {
      return this.create(
        v1[1]*v2[2] - v1[2]*v2[1], 
        v1[2]*v2[0] - v1[0]*v2[2], 
        v1[0]*v2[1] - v1[1]*v2[0]
      );
    }

    this.inverse = function(a) {
      return this.create(1.0 / a[0], 1.0 / a[1], 1.0 / a[2]); 
    }

  }



  /**
    * @name vec4
    * @class
    * Handles the calculations for a 4D Vector.
  **/
  var vec4 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @returns {vec3}
      * @function
      * Creates an empty vec3
    **/
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

    this.min = function(v1, v2) {
      return this.create(Math.min(v1[0], v2[0]), Math.min(v1[1], v2[1]), Math.min(v1[2], v2[2]), Math.min(v1[3], v2[3]));
    }

    this.max = function(v1, v2) {
      return this.create(Math.max(v1[0], v2[0]), Math.max(v1[1], v2[1]), Math.max(v1[2], v2[2]), Math.max(v1[3], v2[3]));
    }

    this.scale = function(v1, scale) {
      return this.create(v1[0] * scale, v1[1] * scale, v1[2] * scale, v1[3] * scale); 
    }

    this.distance = function(a, b) {
      let x = b[0] - a[0];
      let y = b[1] - a[1];
      let z = b[2] - a[2];
      let w = b[3] - a[3];
      return x*x + y*y + z*z + w*w;
    }

    this.distanceSqrt = function(v1, v2) {
      return Math.sqrt(this.distance(v1, v2));
    }

    this.negate = function(v1) {
      return this.create(0 - v1[0], 0 - v1[1], 0 - v1[2], 0 - v1[3]);
    }

    this.dotProduct = function(v1, v2) {
      return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2] + v1[3]*v2[3];
    }

    this.lenght = function(v) {
      return Math.sqrt(this.dotProduct(v, v));
    }

    this.inverse = function(a) {
      return this.create(1.0 / a[0], 1.0 / a[1], 1.0 / a[2], 1.0 / a[3]); 
    }

  }

  /**
    * @name mat2
    * @class
    * 
    * 
  **/
  var mat2 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @function
      * Creates an empty mat2 (2x2)
      * @returns {mat2}
    **/
    this.empty = function() {
      return new this._array(4);
    }

    /**
      * @name clone
      * @function
      * Clones the given mat2
      * @param {mat2} m the source matrix
      * @returns {mat2}
    **/
    this.clone = function(m) {
      let out = this.empty();

      out[0] = m[0];
      out[1] = m[1];
      out[2] = m[2];
      out[3] = m[3];

      return out;
    }

    /**
      * @name identity
      * @function
      * Creates an identity mat2
      * @returns {mat2}
    **/
    this.identity = function() {
      let out = this.empty();

	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;

	    return out;
	  }

    /**
      * @name transpose
      * @function
      * Transposes the given mat2
      * @param {mat2} m the source matrix
      * @returns {mat2}
    **/
    this.transpose = function(m) {
      let out = this.empty();

      out[0] = m[0];
      out[1] = m[2];
      out[2] = m[1];
      out[3] = m[3];
      
      return out;
    }

    /**
      * @name determinant
      * @function
      * Calculates the determinant of a mat2
      * @param {mat2} m the source matrix
      * @returns {Number} determinant of a
    **/
    this.determinant = function (m) {
      return m[0] * m[3] - m[2] * m[1];
    }

    /**
      * @name invert
      * @function
      * Inverts a mat2
      * @param {mat2} m the source matrix
      * @returns {mat2}
    **/
    this.invert = function(m) {
      let out = this.empty();

      det = this.determinant(m);

      if (!det) return out;

      det = 1.0 / det;

      out[0] =  m[3] * det;
      out[1] = -(m[1]) * det;
      out[2] = -(m[2]) * det;
      out[3] =  m[0] * det;

      return out;
    }

    /**
      * @name multiply
      * @function
      * Performs a standard matrix multiplication between two mat2.
      * @param {mat2} a the mat2 to multiply.
      * @param {mat2} b the mat2 multiply by.
      * @returns {mat2} mat2x2
    **/
    this.multiply = function (a, b) {
      let out = this.empty();

      out[0] = a[0] * b[0] + a[2] * b[1];
      out[1] = a[1] * b[0] + a[3] * b[1];
      out[2] = a[0]* b[2] + a[2] * b[3];
      out[3] = a[1] * b[2] + a[3] * b[3];

      return out;
    }

    /**
      * @name scale
      * @function
      * Scales the mat2 by the dimensions in the given vec2
      * @param {mat2} a the mat2 to scale
      * @param {vec2} v the vec2 to scale the matrix by
      * @returns {mat2} mat2
    **/
    this.scale = function(a, v) {
      let out = this.empty();

      out[0] = a[0] * v[0];
      out[1] = a[1] * v[0];
      out[2] = a[2] * v[1];
      out[3] = a[3] * v[1];

      return out;
    }

    /**
      * @name adjugate
      * @function
      * Adjugates the given mat2
      * @param {mat2} m the source matrix
      * @returns {mat2} mat2
    **/
    this.adjugate = function(m) {
      let out = this.empty();

	    out[0] =  a[3];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] =  a[0];

	    return out;
	  }

  }



  /**
    * @name mat3
    * @class
    * 
    * 
  **/
  var mat3 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @returns {mat3}
      * @function
      * Creates an empty mat3 (3x3)
    **/
    this.empty = function() {
      return new this._array(9);
    }

    /**
      * @name clone
      * @function
      * Clones the given mat3
      * @param {mat3} m the source matrix
      * @returns {mat3}
    **/
    this.clone = function(m) {
      let out = this.empty();

      out[0] = m[0];
      out[1] = m[1];
      out[2] = m[2];
      out[3] = m[3];
      out[4] = m[4];
      out[5] = m[5];
      out[6] = m[6];
      out[7] = m[7];
      out[8] = m[8];

      return out;
    }

    /**
      * @name identity
      * @function
      * Creates an identity mat3
      * @returns {mat3}
    **/
    this.identity = function() {
      let out = this.empty();

      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;

	    return out;
	  }

    /**
      * @name transpose
      * @function
      * Transposes the given mat3
      * @param {mat3} m the source matrix
      * @returns {mat3}
    **/
    this.transpose = function(m) {
      let out = this.empty();

      out[0] = m[0];
	    out[1] = m[3];
	    out[2] = m[6];
	    out[3] = m[1];
	    out[4] = m[4];
	    out[5] = m[7];
	    out[6] = m[2];
	    out[7] = m[5];
	    out[8] = m[8];
      
      return out;
    }

    /**
      * @name determinant
      * @function
      * Calculates the determinant of a mat3
      * @param {mat3} m the source matrix
      * @returns {Number} determinant of a
    **/
    this.determinant = function (m) {
	    return m[0] * (m[8] * m[4] - m[5] * m[7]) + m[1] * (m[5] * m[6] - m[8] * m[3]) + m[2] * (m[7] * m[3] - m[4] * m[6]);
	  }

    /**
      * @name invert
      * @function
      * Inverts a mat3
      * @param {mat3} m the source matrix
      * @returns {mat3}
    **/
    this.invert = function(m) {
      let out = this.empty();
	    let det = this.determinant(m);

	    if (!det) return out;

	    det = 1.0 / det;

	    out[0] = (m[8] * m[4] - m[5] * m[7]) * det;
	    out[1] = (-(m[8]) * m[1] + m[2] * m[7]) * det;
	    out[2] = (m[5] * m[1] - m[2] * m[4]) * det;
	    out[3] = (-(m[8]) * m[3] + m[5] * m[6]) * det;
	    out[4] = (m[8] * m[0] - m[2] * m[6]) * det;
	    out[5] = (-(m[5]) * m[0] + m[2] * m[3]) * det;
	    out[6] = (m[7] * m[3] - m[4] * m[6]) * det;
	    out[7] = (-(m[7]) * m[0] + m[1] * m[6]) * det;
	    out[8] = (m[4] * m[0] - m[1] * m[3]) * det;

	    return out;
	  }

    /**
      * @name multiply
      * @function
      * Performs a standard matrix multiplication between two mat3.
      * @param {mat3} a the mat3 to multiply.
      * @param {mat3} v the mat3 multiply by.
      * @returns {mat3}
    **/
    this.multiply = function (a, b) {
      let out = this.empty();

	    out[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
	    out[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
	    out[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];
	    out[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
	    out[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
	    out[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];
	    out[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
	    out[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
	    out[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];
    
      return out;
    }

    /**
      * @name scale
      * @function
      * Scales the mat3 by the dimensions in the given vec3
      * @param {mat3} a the mat3 to scale
      * @param {vec3} v the vec3 to scale the matrix by
      * @returns {mat2} mat3
    **/
     this.scale = function(a, v) {
      let out = this.empty();

      out[0] = a[0] * v[0];
      out[1] = a[1] * v[0];
      out[2] = a[2] * v[0];
      out[3] = a[3] * v[1];
      out[4] = a[4] * v[1];
      out[5] = a[5] * v[1];
      out[6] = a[6] * v[2];
      out[7] = a[7] * v[2];
      out[8] = a[8] * v[2];

      return out;
    }

  }



  /**
    * @name mat4
    * @class
    * 
    * 
  **/
  var mat4 = new function() {

    this._array = dpConst.floatArray;

    /**
      * @name empty
      * @returns {mat4}
      * @function
      * Creates an empty mat4 (4x4)
    **/
    this.empty = function() {
      return new this._array(16);
    }

    /**
      * @name clone
      * @function
      * Clones the given mat4
      * @param {mat4} m the source matrix
      * @returns {mat4}
    **/
    this.clone = function(m) {
      let out = this.empty();

      out[0] = m[0];
      out[1] = m[1];
      out[2] = m[2];
      out[3] = m[3];
      out[4] = m[4];
      out[5] = m[5];
      out[6] = m[6];
      out[7] = m[7];
      out[8] = m[8];
      out[9] = m[9];
      out[10] = m[10];
      out[11] = m[11];
      out[12] = m[12];
      out[13] = m[13];
      out[14] = m[14];
      out[15] = m[15];

      return out;
    }

    /**
      * @name identity
      * @function
      * Creates an identity mat4
      * @returns {mat4}
    **/
    this.identity = function() {
      let out = this.empty();

      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;

	    return out;
	  }

    /**
      * @name scale
      * @function
      * Scales the mat4 by the dimensions in the given vec4
      * @param {mat4} a the mat4 to scale
      * @param {vec4} v the vec4 to scale the matrix by
      * @returns {mat4} mat4
    **/
    this.scale = function(a, v) {
      let out = this.empty();

      out[0] = a[0] * v[0];
      out[1] = a[1] * v[0];
      out[2] = a[2] * v[0];
      out[3] = a[3] * v[0];
      out[4] = a[4] * v[1];
      out[5] = a[5] * v[1];
      out[6] = a[6] * v[1];
      out[7] = a[7] * v[1];
      out[8] = a[8] * v[2];
      out[9] = a[9] * v[2];
      out[10] = a[10] * v[2];
      out[11] = a[11] * v[2];
      out[12] = a[12] * v[3];
      out[13] = a[13] * v[3];
      out[14] = a[14] * v[3];
      out[15] = a[15] * v[3];

      return out;
    }

  }



  /**
    * @name quat
    * @class
    * 
    * 
  **/
  var quat = new function() {

    this._array = dpConst.floatArray;

    this.empty = function() {
      return new this._array(4);
    }

  }



  /**
    * @name webglUtility
    * @class
    * 
    * 
  **/
  var webglUtility = new function() {

    this.verifyWebgl = function() {
      if (window.WebGLRenderingContext) return true;

      return false;
    }

    this.createContext = function() {
      if (this.verifyWebgl() == false) return;

      let canvas = document.createElement('canvas');
      canvas.innerHTML = 'This browser does not support HTML5';

      let gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

      if (!gl) gl = canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });

      if (!gl) throw new Error('There was an unknown error.');

      return gl;
    }

    this.compileShader = function(gl, shaderSource, shaderType) {
      var shader = gl.createShader(shaderType);

      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      if (!(gl.getShaderParameter(shader, gl.COMPILE_STATUS))) {
        gl.deleteShader(shader);

        throw 'Could not compile shader: ' + gl.getShaderInfoLog(shader);
      }

      return shader;
    }

    this.compileShaderFromScript = function(gl, scriptId, shaderType) {
      var shaderScript = document.getElementById(scriptId);

      if (!shaderScript) throw('Error: unknown script element: ' + scriptId);
    
      var shaderSource = shaderScript.text;
    
      if (typeof(shaderType) == 'string') return this.compileShader(gl, shaderSource, shaderType);

      switch(shaderScript.type) {
        case 'x-shader/x-vertex': {
          shaderType = gl.VERTEX_SHADER;
          break;
        }
        case 'x-shader/x-fragment': {
          shaderType = gl.FRAGMENT_SHADER;
          break;
        }
      }

      if (!shaderType) throw('Error: failed to set shader');
    
      return this.compileShader(gl, shaderSource, shaderType);
    };

    this.createProgram = function(gl, vertexShader, fragmentShader) {
      var program = gl.createProgram();

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);

      if (!(gl.getProgramParameter(program, gl.LINK_STATUS))) throw ('Program failed to link: ' + gl.getProgramInfoLog (program));

      return program;
    };

    this.resizeCanvas = function(gl, width, height) {
      gl.canvas.width = width;
      gl.canvas.height = height;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(1, 1, 1, 1);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

  }



  /**
    * @name fileHandlers
    * @class
    * 
    * 
  **/
   var fileHandlers = new function() {

    this.loadFile = function(file, type) {
      return new Promise((resolve, reject) => {
        if (!FileReader) {
          console.error('There was an unknown error. Check if FileReader is supported or if the correct parameter was given');
          return;
        }
    
        if (file instanceof File !== true) {
          console.error('There is no instance of File class to read an image from.');
          return;
        }

        var reader = new FileReader();

        reader.onload = function() {
          if (typeof result == 'string') resolve(reader.result);
          else reject();
        };

        switch(type) {
          case 'text': {
            reader.readAsText(file);
            break;
          }
          default: {
            reader.readAsDataURL(file);
            break;
          }
        }
      });
    }

    this.loadImage = function(source) {
      return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = source;
      });
    }

    this.loadImageFromObject = function(source) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = (ev) => {
          if (typeof reader.result == 'string') resolve(this.loadImage(reader.result));
          else reject(ev);
        };
        reader.onerror = reject;
        reader.readAsDataURL(source);
      });
    }
    
  }



  /**
    * @name Callback
    * @class
    * 
    * 
  **/
  function Callback(value, sub, error) {
    this.init(value, sub, error);
    this.init = undefined;
  }
  Callback.prototype = {

    _value : null,
    _call : null,
    _onError : null,

    init : function(value, sub, error) {
      this._value = value;
      this.subscribe(sub);
      this.onError(error);
    },

    destructor : function() {
      this._value = undefined;
      this._call = undefined;
      delete this;
    },

    onError : function(func) {
      if (!func || typeof(func) !== 'function') return;
      this._onError = func;
    },

    subscribe : function(callback) { 
      if (!callback || typeof(callback) !== 'function') return;
      this._call = callback;
    },

    unsubscribe : function() { 
      this._call = null;
      this._onError = null;
    },

    reset : function() {
      this._value = null;
      this.unsubscribe();
    },

    fireEvent : function() {
      try {
        if (typeof(this._call) === 'function') this._call(this._value);
      } catch(err) {
        console.error(err); 
        if (typeof(this._onError) === 'function') this._onError(err);
      }
    },

    next : function(value) {
      this._value = value;
      this.fireEvent();
    },

    getValue : function() {
      return this._value;
    },

  }



  /**
  * @name Observer
	* @class
  * 
  * 
  **/
  function Observer(index, call, error) {
    this.init(index, call, error);
    this.init = undefined;
  }
  Observer.prototype = {

    _index : null,
    _onCall : null,

    init : function(index, call, error) {
      this._index = index;
      this._onCall = this._wrappObserver(call, error);
    },

    destructor : function() {
      this._index = undefined;
      this._onCall = undefined;
      delete this;
    },

    _wrappObserver : function(onCall, onError) {
      if (typeof onCall !== 'function') return function() { }

      return function() {
        try {
          onCall.apply(this, arguments);
        } catch (e) {
          if (typeof onError === 'function') onError(e);
          throw e;
        }
      }
    },

    call : function(data) {
      this._onCall(data);
    },

    observing : function() {
      if (!this._index && this._index !== 0) return false;
      return true;
    },

    unsubscribe : function() {
      this._index = null;
      this._onCall = null;;
    },

  }



  /**
    * @name Subject
    * @class
    * 
    * 
  **/
  function Subject(value) {
    this.init(value);
    this.init = undefined;
  }
  Subject.prototype = {

    _value : null,
    _pipe : null,
    _observers : null,
    _onError : null,
    _onComplete : null,

    init : function(value) {
      this._value = value;
      this._pipe = null;
      this._observers = [];
      this._onError = null;
      this._onComplete = null;
    },

    destructor : function() {
      this._value = undefined;
      this._pipe = undefined;
      this._onError = undefined;
      this._onComplete = undefined;

      for (let i = 0; i < this._observers.length; i++) {
        if (this._observers[i] instanceof Observer === true) this._observers[i].destructor();
        this._observers[i] = undefined;
      }

      this._observers = undefined;
      delete this;
    },

    getValue : function() {
      return this._value;
    },

    pipe : function(pipe, onError) {
      this._pipe = function(value) {
        if (typeof pipe !== 'function') return value;

        try {
          return pipe(value);
        } catch(err) {
          if (typeof onError === 'function') onError(value);
          return value;
        }
      }
    },

    onError : function(func) {
      if (typeof func === 'function') this._onError = func;
    },

    onComplete : function(func) {
      if (typeof func === 'function') this._onComplete = func;
    },

    subscribe : function(update, error) {
      let len = this._observers.length;
      this._observers.push(new Observer(len, update, error));
      return this._observers[len];
    },

    fireObservers : function() {
      for (let i = 0; i < this._observers.length; i++) {
        if (this._observers[i] instanceof Observer !== true) {
          this._observers[i].destructor();
          this._observers.splice(i, 1);
          i -= 1;
          continue;
        }

        if (!this._observers[i].observing()) {
          this._observers[i].destructor();
          this._observers.splice(i, 1);
          i -= 1;
          continue;
        }

        try { 
          this._observers[i].call(this._value);
        } catch(err) {
          console.error(err);
          if (typeof this._onError === 'function') this._onError(err)
        } finally {
          continue;
        }
      }

      try { 
        if (typeof this._onComplete === 'function') this._onComplete(this._value);
      } catch(err) {
        console.error(err);
        if (typeof this._onError === 'function') this._onError(err);
      }
    },

    next : function(value) {
      this._value = value;

      if (typeof this._pipe === 'function') this._value = this._pipe(this._value);

      this.fireObservers();
    },

  }



  /**
    * @name Canvas2dCtx
    * @class
    * 
    * 
  **/
   function Canvas2dCtx() {
    this.init();
    this.init = undefined;
  }
  Canvas2dCtx.prototype = {

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
      this.onLoadEvent = new Callback();
    },

    destructor : function() {
      this.img = undefined;
      this.imgData = undefined;
      delete this;
    },

    onLoad: function(callback) {
      this.onLoadEvent.subscribe(callback);
    },

    loadImage : function(e, type='event') {
      if (!e) { return; }

      switch(type) {
        case 'src': {
          if (typeof(e) == 'string') this.registerImage(e);
          return;
        }
        case 'event': {
          let files = e.target.files; 

          if (!files) {
            console.error('There was an unknown error. Check if correct parameter was given');
            return;
          }

          if (!files.length && !files[0]) {
            console.error('There was an unknown error. Check if correct parameter was given');
            return;
          }

          this.file = files[0];

          break;
        }
        case 'file': {
          this.file = e;
          break;
        }
        default: {
          return;
        } 
      }

      if (this.file instanceof File !== true) {
        console.error('There is no instance of File class to read an image from.');
        return;
      }

      if (!FileReader) {
        console.error('There was an unknown error. Check if FileReader is supported or if the correct parameter was given');
        return;
      }

      this.imgData.iName = this.file.name;
      this.imgData.iSize = this.file.size;
      this.imgData.iType = this.file.type;

      let fr = new FileReader();
      fr.onload = () => this.registerImage(fr.result);
      fr.readAsDataURL(this.file);
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
    * @name Cookie
    * @class
    * 
    * 
  **/
  function Cookie() {
    this.init();
    this.init = undefined;
  }
  Cookie.prototype = {

    init : function() { },

    destructor : function() {
      delete this;
    },

    put : function(cookieName, cookieValue, cookieDurationDays = 7) {
      if (typeof cookieName != 'string') { cookieName = 'noname' }
      if (typeof cookieDurationDays != 'number') { cookieDurationDays = 7; }

      let data = safeUriHandler.encode(JSON.stringify(cookieValue));

      let date = new Date();
      date.setTime(date.getTime() + (cookieDurationDays * 1 * 1 * 60 * 1000));

      document.cookie = cookieName + '=' + data + ';' + 'expires=' + date.toUTCString() + ';path=/';
    },

    get : function(cookieName) {
      cookieName = cookieName + '=';
      let decodedCookie = document.cookie.split('; ');

      for (let i = 0; i < decodedCookie.length; i++) {
        let cookie = decodedCookie[i];

        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);

        if (cookie.indexOf(cookieName) == 0) return JSON.parse(safeUriHandler.decode(cookie.substring(cookieName.length, cookie.length)));
      }

      return undefined;
    },

    delete : function(cookieName) {
      let date = new Date();
      date.setTime(date.getTime() - 1000);
      document.cookie = cookieName + '=' + '' + ';' + 'expires=' + date.toUTCString() + ';path=/';
    },

    putObj : function(obj, cookieDurationDays = 7) {
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
    * @name Ajax
    * @class
    * 
    * 
  **/
  function Ajax(errorCallback, progressCallback) {
    this.init(errorCallback, progressCallback);
    this.init = undefined;
  }
  Ajax.prototype = {

    _error : null,
    _progress : null,

    init : function(errorCallback, progressCallback) {
      this._error = new Callback(null);
      this._progress = new Callback({
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

    post : function(url, body, header, callback) {
      return this._baseCall(url, body, header, callback, 'POST');
    },

  }



  /**
    * @name EventsHandler
    * @class
    * 
    * 
  **/
  function EventsHandler() {
    this.init();
    this.init = undefined;
  }
  EventsHandler.prototype = {

    _mutation : null,
    _events : null,

    init : function() {
      this._events = {};

      this._mutation = new MutationObserver(() => {
        this.populateEvents();
      });
      this._mutation.dpOnBody = false;
    },

    destructor : function() {
      this._events = null;
      this._mutation = null;
      delete this;
    },

    add : function(type, query, callback) {
      let body = $('<body>');

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
        const elements = $(e.query);

        if (!elements) continue;

        if (elements instanceof Element) {
          setEvent(elements, e.type, e.callback);
          continue;
        }

        for (let element = 0; element < elements.length; element++) setEvent(elements[element], e.type, e.callback);
      }
    },
    
  }



  /**
    * @name Frame
    * @class
    * 
    * 
  **/
  function Frame() {
    this.init();
    this.init = undefined;
  }
  Frame.prototype = {
    _setToKill : null,
    _isStopped : null,
    _isPaused : null,
    _startingTime : null,
    _lastTime : null,
    _totalElapsedTime : null,
    _elapsedSinceLastLoop : null,

    _onStart : null,
    onStart : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onStart.subscribe(onCall, onError); }
    },
    onStartComplete : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onStart.onComplete(onCall, onError) }
    },

    _onUpdate : null,
    onUpdate : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onUpdate.subscribe(onCall, onError); }
    },
    oUpdateComplete : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onUpdate.onComplete(onCall, onError) }
    },

    _onLateUpdate : null,
    onLateUpdate : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onLateUpdate.subscribe(onCall, onError); }
    },
    onLateUpdateComplete : function(onCall, onError) {
      if (typeof onCall == 'function') { return this._onLateUpdate.onComplete(onCall, onError) }
    },

    init : function() {
      this._setToKill = false;
      this._isStopped = false;
      this._isPaused = false;
      this._onStart = new Subject(0);
      this._onUpdate = new Subject(0);
      this._onLateUpdate = new Subject(0);
    },

    destructor : function() {
      this.start = function(){};
      this.frame = function(){};
      this._onStart.destructor();
      this._onStart = undefined;
      this._onUpdate.destructor();
      this._onUpdate = undefined;
      this._onLateUpdate.destructor();
      this._onLateUpdate = undefined;
      delete this;
    },

    kill : function() {
      this._setToKill = true;
    },

    start : function() { 
      requestAnimationFrame((currentTime) => {
        this._startingTime = currentTime;
        this._lastTime = currentTime;
        this._totalElapsedTime = 0;
        this._elapsedSinceLastLoop = 0;

        this._onStart.next(0);

        requestAnimationFrame((t) => {
          this._setToKill = false;
          this.unpause();
          this.unstop();
          this.frame(t)
        });
      });
    },

    frame : function(currentTime) {
      if (this._setToKill) {
        this._setToKill = false;
        return;
      }

      if (this._isStopped) {
        requestAnimationFrame((t) => this.frame(t));
        return;
      }

      this._totalElapsedTime = currentTime - this._startingTime;
      this._elapsedSinceLastLoop = currentTime - this._lastTime;
      this._lastTime = currentTime;
      
      let deltaTime = this._elapsedSinceLastLoop;
      
      if (this._isPaused) deltaTime = 0;

      this._onUpdate.next(deltaTime);
      this._onLateUpdate.next(deltaTime);
      
      requestAnimationFrame((t) => this.frame(t));
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



  /**
    * @name color
    * @class
    * 
    * 
  **/
  var color = new function()  {

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

    /**
      * @name byte
      * @function
      * Takes a number value and tranforms it into type of intiger that ranges from 0 to 255 ( 0 <= x <= 255 ).
      * @param {number} val
    **/
    this.byte = function(val) { 
      try {
        val = parseInt(val);
    
        if (val > 255) { return 255; }
        if (val < 0) { return 0; }
    
        return val;
      } catch(error) {
        console.error(error);
        return 0;
      }
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

    this.rgbToHSL = function(cR, cG, cB) {

      let r = this.byte(cR) / 255;
      let g = this.byte(cG) / 255;
      let b = this.byte(cB) / 255;

      let max = Math.max(r, g, b); 
      let min = Math.min(r, g, b);
      let del = max - min;

      let h = 0; 
      let s = 0; 
      let l = (max + min) / 2;
    
      if (max == min) return {h: h, s: s, l: l};

      if (l < 0.5)  s = del / ( max + min )
      else          s = del / ( 2 - max - min ); 

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

        return this.rgba(r, g, b);
      }

      if (l < 0.5)  val2 = l * ( 1 + s );
      else          val2 = ( l + s ) - ( l * s );
      
      val1 = 2 * l - val2;

      let Hue_2_RGB = function( v1, v2, vH ) {
        if (vH < 0) vH += 1;
        if (vH > 1) vH -= 1;

        if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
        if ((2 * vH) < 1) return v2;
        if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);

        return ( v1 );
      };
      
      r = 255 * Hue_2_RGB(val1, val2, h + (1 / 3));
      g = 255 * Hue_2_RGB(val1, val2, h);
      b = 255 * Hue_2_RGB(val1, val2, h - (1 / 3));

      return this.rgba(r, g, b);
    }

    this.colorTemperatureToRgb = function(value) {
      let r, g, b;

      try {
        value = parseInt(value);
      } catch(error) {
        console.error(error);
        return;
      }

      if (value <= 0) value = 1;
      if (value > 1000000) value = 1000000;

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

      return this.rgba(r, g, b);
    }

  }



  /**
    * @name ImageProcessing
    * @class
    * 
    * 
  **/
  function ImageProcessing(callback = null) {
    this.init(callback);
    this.init = undefined;
  }
  ImageProcessing.prototype = {

    dpCtx : null,

    init : function (callback) { 
      this.dpCtx = new Canvas2dCtx();

      if (typeof callback == 'function') {
        this.onLoad(callback);
      }
    },

    destructor : function() {
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

          outputData.data[position] = color.byte(sumR);
          outputData.data[position + 1] = color.byte(sumG);
          outputData.data[position + 2] = color.byte(sumB);
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
    
        data[i] = color.byte(0.393 * red + 0.769 * green + 0.189 * blue);
        data[i + 1] = color.byte(0.349 * red + 0.686 * green + 0.168 * blue);
        data[i + 2] = color.byte(0.272 * red + 0.534 * green + 0.131 * blue);
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
        data[i] = color.byte(255 * Math.pow((data[i] / 255), gammaCorrection));
        data[i+1] = color.byte(255 * Math.pow((data[i+1] / 255), gammaCorrection));
        data[i+2] = color.byte(255 * Math.pow((data[i+2] / 255), gammaCorrection));
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
        data[i+3] = color.byte(data[i+3] * value);
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

      if (value <= 0) return false;

      let gen = color.colorTemperatureToRgb(value);

      let r = gen.r / 255;
      let g = gen.g / 255;
      let b = gen.b / 255;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i] = color.byte(data[i] * r);
        data[i+1] = color.byte(data[i+1] * g);
        data[i+2] = color.byte(data[i+2] * b);
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

        data[i] += color.byte(random);
        data[i+1] += color.byte(random);
        data[i+2] += color.byte(random);
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
        let hsl = color.rgbToHSL(data[i], data[i+1], data[i+2]);

        hsl.h = hsl.h + ( value / 360.0 );

        let rgb = color.hslToRGB(hsl.h, hsl.s, hsl.l);

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

        data[i] = color.byte(
          ( ((1 - value)*luR + value)*red + ((1 - value)*luG)*green + ((1 - value)*luB)*blue )
        );
        
        data[i+1] = color.byte(
          ( ((1 - value)*luR)*red + ((1 - value)*luG + value)*green + ((1 - value)*luB)*blue )
        );

        data[i+2] = color.byte(
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

      if (value > 100) value = 100;
      if (value < -100) value = -100;

      value = 2.55 * value;

      let imgData = this.dpCtx.getImageData();
      let data = imgData.data;

      for (var i = 0; i < data.length; i += 4) {
        data[i] = color.byte(data[i] + value);
        data[i+1] = color.byte(data[i+1] + value);
        data[i+2] = color.byte(data[i+2] + value);
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
      if (!imgData) return false;
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



  return {
    verifyES6 : verifyES6,
    verifyES7 : verifyES7,
    deserialize : deserialize,
    $ : $,
    each : each,
    functionWrapper : functionWrapper,
    main : main,
    registerStyle : registerStyle,
    maxCap : maxCap,
    minCap : minCap,
    degToRad : degToRad,
    radToDeg : radToDeg,
    safeUriHandler : safeUriHandler,
    vec2 : vec2,
    vec3 : vec3,
    vec4 : vec4,
    mat2 : mat2,
    mat3 : mat3,
    mat4 : mat4,
    fileHandlers : fileHandlers,
    webglUtility : webglUtility,
    Callback : Callback,
    Observer : Observer,
    Subject : Subject,
    Canvas2dCtx : Canvas2dCtx,
    Cookie : Cookie,
    Ajax : Ajax,
    EventsHandler : EventsHandler,
    Frame : Frame,
    color : color,
    ImageProcessing : ImageProcessing,
  }
}));
