/*
  Made by: Darko Petrović
  FB: https://www.facebook.com/WitchkingOfAngmarr
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

    this.test = new dpImageProcessing(async () => {
      let img = document.getElementById("test-img");
      await this.test.asyncLightness(50);
      await this.test.flipImage(true, false);
      await this.test.rotateImage(true);
      await this.test.rotateImage(true);
      img.src = this.test.getImg();
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
