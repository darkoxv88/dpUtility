/*
  Made by: Darko Petrović
  FB: https://www.facebook.com/WitchkingofAngmarr
  GitHub: https://github.com/darkoxv88

  Version: 1.0.0

  Software can be modified, used commercially, and distributed.
  Software can be modified and used in private.
  A license and copyright notice must be included in the software.
  Software authors provide no warranty with the software and are not liable for anything.
*/

"use strict";

window.dpSubject = null;

window.dpColor = null;
window.dpVector = null;
window.dpMatrix = null;
window.dpCanvas2Dctx = null;

window.dpImageProcessing

window.dpCookies = null;
window.dpAJAX = null;



// *********************** 
// Global ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dpTypes
{
  static byte(val) { 
    if (!val) { return 0 ; }

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
      r : this.byte(r),
      g : this.byte(g),
      b : this.byte(b),
      a : this.byte(a)
    }

    return obj;
  }

  static vector3D (x, y, z, w = 1) {
    if (typeof(x) !== 'number') { x = 0; }
    if (typeof(y) !== 'number') { y = 0; }
    if (typeof(z) !== 'number') { z = 0; }
    if (typeof(w) !== 'number') { w = 0; }

    var obj = {
      x : x,
      y : y,
      z : z,
      w : w
    }

    return obj;
  }

  static triangle (v1, v2, v3, color) {
    let obj = {
      tri : [v1, v2, v3],
      color : color,
    }

    return obj;
  }

  static matrix4x4() {
    m = [];
    for(let i = 0; i < 4; i++) {
      m[i] = [];
      for(let j = 0; j < 4; j++) {
        m[i][j] = 0;
      }
    }
    return m;
  }
}



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

}



// *********************** 
// Util ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpSubject(value, sub = null) {
    this.init(value, sub);
  }

  dpSubject.prototype = {

    value : null,
    call : null,

    init : function (value, sub) {
      this.value = value;
      this.subscribe(sub);
    },

    subscribe : function (callback) { 
      if (!callback) { return; }
      if (typeof(callback) !== "function") { 
        console.error(`callback: ${callback} is not a function`);
        return; 
      }

      this.call = callback;
    },

    unsubscribe : function () { 
      this.call = null;
    },

    reset : function () {
      this.value = null;
      this.unsubscribe();
    },

    fireEvent : function () {
      try {
        if (typeof(this.call) !== "function") { return; }
        this.call(this.value);
      } catch(err) { console.error(err); }
    },

    next : function (value) {
      this.value = value;
      this.fireEvent();
    },

    getValue : function () {
      return this.value;
    }

  }

  window.dpSubject = dpSubject;

} )( window );



// *********************** 
// Math ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpColor() {
    this.init();
  }

  dpColor.prototype = {

    kelvinTable : { },

    init : function () { 
      this.kelvinTable = this.getKelvinTable();
    },

    getKelvinTable : function () {
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

      return obj;
    },

    rgbToHSL : function (cR, cG, cB) {

      let r = dpTypes.byte(cR) / 255;
      let g = dpTypes.byte(cG) / 255;
      let b = dpTypes.byte(cB) / 255;

      let max = Math.max(r, g, b); 
      let min = Math.min(r, g, b);
      let del = max - min;

      let h, s, l = (max + min) / 2;
    
      if (max == min) {
        h = 0;
        s = 0;
      } else {
        if ( l < 0.5 ) { 
          s = del / ( max + min )
        } else { 
          s = del / ( 2 - max - min ); 
        };

        let delR = ( ( ( max - r ) / 6 ) + ( del / 2 ) ) / del;
        let delG = ( ( ( max - g ) / 6 ) + ( del / 2 ) ) / del;
        let delB = ( ( ( max - b ) / 6 ) + ( del / 2 ) ) / del;

        if      ( r == max ) h = delB - delG;
        else if ( g == max ) h = ( 1 / 3 ) + delR - delB;
        else if ( b == max ) h = ( 2 / 3 ) + delG - delR;

        if ( h < 0 ) h += 1;
        if ( h > 1 ) h -= 1;
      }

      return {h: h, s: s, l: l};
    },

    hslToRGB : function (h, s, l) {
      let r, g, b = 0;
      let val1, val2;

      if ( s == 0 )
      {
        r = l * 255;
        g = l * 255;
        b = l * 255;
      }
      else
      {
        if ( l < 0.5 ) val2 = l * ( 1 + s );
        else           val2 = ( l + s ) - ( l * s );
      
        val1 = 2 * l - val2;

        let Hue_2_RGB = function( v1, v2, vH ){
          if ( vH < 0 ) vH += 1;
          if( vH > 1 ) vH -= 1;

          if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
          if ( ( 2 * vH ) < 1 ) return ( v2 );
          if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );

          return ( v1 );
        };
      
        r = 255 * Hue_2_RGB( val1, val2, h + ( 1 / 3 ) );
        g = 255 * Hue_2_RGB( val1, val2, h );
        b = 255 * Hue_2_RGB( val1, val2, h - ( 1 / 3 ) );
      }

      return dpTypes.color(r, g, b);
    },

    colorTemperatureToRgb : function (value) {
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

      return this.dpTypes.color(r, g, b);
    }

  }
	
	window.dpColor = dpColor;

} )( window );



( function( window ) {
  
  function dpVector() {
    this.init();
  }

  dpVector.prototype = {

    init : function () { },

    add : function (v1, v2) {
      return dpTypes.vector3D(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
    },

    sub : function (v1, v2) {
      return dpTypes.vector3D(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
    },

    mul : function (v1, v2) {
      return dpTypes.vector3D(v1.x*v2.x, v1.y*v2.y, v1.z*v2.z);
    },

    div : function (v1, v2) {
      return dpTypes.vector3D(v1.x/v2.x, v1.y/v2.y, v1.z/v2.z);
    },

    dotProduct : function (v1, v2) {
      return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    },

    length : function (v) {
      return Math.sqrt(this.dotProduct(v, v));
    },

    normalise : function (v) {
      const l = this.length(v)
      return dpTypes.vector3D(v.x / l, v.y / l, v.z / l);
    },

    crossProduct : function (v1, v2) {
      let v = dpTypes.vector3D(0, 0, 0);
      v.x = v1.y*v2.z - v1.z*v2.y;
      v.y = v1.z*v2.x - v1.x*v2.z;
      v.z = v1.x*v2.y - v1.y*v2.x;
      return v;
    },

  }
	
	window.dpVector = dpVector;

} )( window );


( function( window ) {
  
  function dpMatrix() {
    this.init();
  }

  dpMatrix.prototype = {

    init : function () { },

  }
	
	window.dpMatrix = dpMatrix;

} )( window );



// *********************** 
// Canvas ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpCanvas2Dctx() {
    this.init();
  }

  dpCanvas2Dctx.prototype = {

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

    init : function () { 
      this.onLoadEvent = new dpSubject();
    },

    onLoad: function (callback) {
      this.onLoadEvent.subscribe(callback);
    },

    loadImage : function (e, type='event') {
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
        fr.onload = () => this.createLoadedImage(fr.result);
        fr.readAsDataURL(files[0]);
      } else {
        console.error('There was an unknown error. Check if FileReader is supported');
      }
    },

    createLoadedImage : function (src) {
      let img = document.createElement('img');
      img.onload = () => this.createCanvasCtxFromImage(img);
      img.src = src;
      this.imgData.src = src;
      this.img = img;
    },

    createCanvasCtxFromImage : function (img) {
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

    generate2dCtx : function (w = this.imgData.width, h = this.imgData.height) {
      let newCanvas = document.createElement('canvas');
      newCanvas.width = w;
      newCanvas.height = h;
      return  newCanvas.getContext('2d');
    },

    duplicateCtxOrg : function () {
      let context = this.generate2dCtx(this.ctxOrg.canvas.width, this.ctxOrg.canvas.height)
      context.drawImage(this.ctxOrg.canvas, 0, 0);
      return context;
    },

    duplicateCtxActive : function () {
      let context = this.generate2dCtx(this.ctxActive.canvas.width, this.ctxActive.canvas.height)
      context.drawImage(this.ctxActive.canvas, 0, 0);
      return context;
    },

    getImageUrl : function (mimeType = 'image/png') {
      return this.ctxActive.canvas.toDataURL(mimeType);
    },

    reset : function () {
      this.ctxActive = this.duplicateCtxOrg();
    },

    aWidth : function () {
      return this.ctxActive.canvas.width;
    },

    aHeight : function () {
      return this.ctxActive.canvas.height;
    },

    getPixelData : function () {
      return this.ctxActive.getImageData(0, 0, this.aWidth(), this.aHeight());
    },

  }
	
	window.dpCanvas2Dctx = dpCanvas2Dctx;

} )( window );



// *********************** 
// Image processing ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpImageProcessing() {
    this.init();
  }

  dpImageProcessing.prototype = {

    dpColor : null,
    dpCtx : null,

    init : function () { 
      this.dpColor = new dpColor();
      this.dpCtx = new dpCanvas2Dctx();
    },

  }

	window.dpImageProcessing = dpImageProcessing;

} )( window );



// *********************** 
// Generic ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



( function( window ) {
  
  function dpCookies() {
    this.init();
  }

  dpCookies.prototype = {

    init : function () { },

    set : function (cookieName, cookieValue, cookieDurationDays = 7, type = 'day') {
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

    get : function (cookieName) {
      cookieName = cookieName + '=';
      let decodedCookie = document.cookie.split(';');
  
      for( let i = 0; i < decodedCookie.length; i++ ) {
        let c = decodedCookie[i];
  
        while( c.charAt(0) == ' ' ) { c = c.substring(1); }
  
        if( c.indexOf(cookieName) == 0 ) { return c.substring(cookieName.length, c.length); }
      }
  
      return '';
    },

    delete : function (cookieName) {
      let date = new Date();
      date.setTime(date.getTime() - 1000);
      document.cookie = cookieName + '=' + '' + ';' + 'expires=' + date.toUTCString() + ';path=/';
    },

    setObj : function (obj, cookieDurationDays = 7, type = 'day') {
      if (typeof(obj) !== 'object') { return false; }

      for(let item in obj) {
        this.set(item, JSON.stringify(obj[item]), cookieDurationDays = 7, type = 'day');
      }
    },

    getObj : function (obj) {
      if (typeof(obj) !== 'object') { return false; }

      let output = {}

      for(let item in obj) {
        output[item] = this.get(item);
      }

      return output;
    },

    deleteObj : function (obj) {
      if (typeof(obj) !== 'object') { return false; }

      for(let item in obj) {
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

    progress : null,
    error : null,

    init : function () {
      this.progress = new dpSubject({
        loaded : 0,
        total : 0,
      });
      this.error = new dpSubject(null);
    },

    subError : function (callback) {
      this.error.subscribe(callback);
    },

    get: async function (url, header, callback) {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);

        if (typeof(header) === 'object') {
          for(let item in header) {
            xhr.setRequestHeader(item, header[item]);
          }
        }

        xhr.send();

        xhr.onload = () => {
          if (xhr.status != 200) { 
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            this.error.next(xhr.status, xhr.statusText);
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
            this.progress.next({loaded : event.loaded, total : event.total});
          } else {
            this.progress.next(event.loaded);
          }
        };
        
        xhr.onerror = () => {
          console.error("Request failed");
        };
      });
    },

    post: async function (url, body, header, callback) {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url);

        if (typeof(header) === 'object') {
          for(let item in header) {
            xhr.setRequestHeader(item, header[item]);
          }
        }

        xhr.send(body);

        xhr.onload = () => {
          if (xhr.status != 200) { 
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            this.error.next(xhr.status, xhr.statusText);
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
            this.progress.next({loaded : event.loaded, total : event.total});
          } else {
            this.progress.next(event.loaded);
          }
        };
        
        xhr.onerror = () => {
          console.error("Request failed");
        };
      });
    },
    
  }

  window.dpAJAX = dpAJAX;

} )( window );
