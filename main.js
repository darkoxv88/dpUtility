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
  test : null,

  init : function () {
    let c = new dpAJAX();

    c.get('test/test.html').then((data) => {
      console.log(data);
    });

    this.test = new canvas2Dctx();
    this.test.onLoad(() => {
      console.log(this.test.getImageUrl());
    });
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
