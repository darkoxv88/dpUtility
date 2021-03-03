/*
  Made by: Darko Petrović

  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...

  FB: https://www.facebook.com/WitchkingOfAngmarr
  CodeForces: https://codeforces.com/profile/darkoxv88
  GitHub: https://github.com/darkoxv88

  Version: 1.0.0

  Software can be modified, used commercially, and distributed.
  Software can be modified and used in private.
  A license and copyright notice must be included in the software.
  Software authors provide no warranty with the software and are not liable for anything.
*/

"use strict";

try {
  eval('let foo = 1;');
} catch (e) { 
  console.error('Missing features' + '-->' + e)
}

( function( ) {

  let scriptInit =  function () {

  }

	scriptInit();

} )( );



// *********************** 
// 3D-Engine ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dp3DengineBase {

  _index;
  get index() {
    return this._index;
  }

  _ctx;
  get ctx() {
    return this._ctx;
  }

  get view() {
    let tag = document.createElement('dp-engine');
    tag.setAttribute('engine-index', this.index);
    tag.setAttribute('style', 'width: 100%; height: 100%;');
    let div = document.createElement('div');
    tag.setAttribute('style', 'width: 100%; height: 100%;');
    div.append(this.ctx.canvas);
    tag.append(div);
    return tag;
  }

  constructor(index) {
    this._index = index;

    let canvas;
    let supported = false;

    try {
      canvas = document.createElement('canvas'); 
      supported = window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch(e) {
      supported = false;
    }

    if (supported === false) {
      console.error("WebGL is not supported!");
      return;
    }

    this._ctx = canvas.getContext('webgl');

    if (!this._ctx) {
      this._ctx = canvas.getContext('experimental-webgl');
    }

    this._ctx.clearColor(1, 1, 1, 1);
    this._ctx.clear(this._ctx.COLOR_BUFFER_BIT | this._ctx.DEPTH_BUFFER_BIT);
  }

}



class dp3Dengine extends dp3DengineBase {
  
  constructor(index) {
    super(index);
    this.engineSetup();
  }

  async engineSetup() {
    this.loadView(this.view);
    this.onStart();
  }

  loadView(ele) { }

  onStart() { }

}
