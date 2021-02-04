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

let index = {
  init : function () {
    console.log('test');
  },
};



( function( window ) {
  
  function appInit() {
    this.init();
  }

  appInit.prototype = {

    init : function() { 
      index.init();
    },

  }

	window.appInit = new appInit();

} )( window );
