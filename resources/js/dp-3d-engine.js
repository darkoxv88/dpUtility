/**
  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...


		* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * @Link CodeForces: https://codeforces.com/profile/darkoxv88

	* @fileoverview main.js provides a demo of dp-utility.js and dp-3d-engine
  * @source https://github.com/darkoxv88/dpUtility
  * @version 0.0.2


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

( function( window ) {
  
  dpVerifyES6();

  window.dpVec3 = null;

} )( window );



// *********************** 
// 3D-Engine ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dp3dEngineBase {

  _index;
  get index() {
    return this._index;
  }

  _gl;
  get gl() {
    return this._gl;
  }

  _program;
  get program() {
    return this._program;
  }

  _programInfo;
  get programInfo() {
    return this._programInfo;
  }

  _view;
  get view() {
    return this._view;
  }

  constructor(index) {
    this._index = index;

    let canvas;
    let supported = false;

    try {
      canvas = document.createElement('canvas');
      canvas.setAttribute('dp-canvas-engine', this.index);
      supported = window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch(e) {
      supported = false;
    }

    if (supported === false) {
      console.error("WebGL is not supported!");
      return;
    }

    this._gl = canvas.getContext('webgl');

    if (!this.gl) {
      this._gl = canvas.getContext('experimental-webgl');
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const vsSource = `
      attribute vec3 vertexPosition;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      void main() {
        gl_Position = vec4(vertexPosition, 1);
      }
    `;

    const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    let loadShader = (gl, type, source) => {
      const shader = gl.createShader(type);
    
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
    
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
    
      return shader;
    }

    const vertexShader = loadShader(this.gl, this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(this.gl, this.gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.gl.createProgram();

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    this._program =  shaderProgram;

    this._programInfo = {
      program: this._program,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(this.program, 'vertexPosition'),
      },
      uniformLocations: {
        modelViewMatrix: this.gl.getUniformLocation(this.program, 'modelViewMatrix'),
        projectionMatrix: this.gl.getUniformLocation(this.program, 'projectionMatrix'),
      },
    }

    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.program);

    let tag = document.createElement('dp-engine');
    tag.setAttribute('dp-engine-index', this.index);
    tag.setAttribute('style', 'display: block; width: 100%; height: 100%;');
    let style = document.createElement('style');
    style.innerHTML = `
      [dp-canvas-engine] {
        width: 100%;
        height: 100%;
      }
    `;
    let div = document.createElement('div');
    div.setAttribute('style', 'width: 100%; height: 100%;');
    div.append(this.gl.canvas);
    tag.append(style);
    tag.append(div);

    this._view = tag;
  }
  
}



class dp3dEngine extends dp3dEngineBase {
  
  _time;
  get time() {
    return this._time;
  }
  _ajax;
  get ajax() {
    return this._ajax;
  }

  constructor(index = 1) {
    super(index);

    this._ajax = new dpAJAX();

    this.loadView(this._view);

    let resizeCanvas = () => {
      this.gl.canvas.width = this.gl.canvas.clientWidth;
      this.gl.canvas.height = this.gl.canvas.clientHeight;
      this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
    }

    this._time = new dpFrame(() => {
      resizeCanvas();
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    });

    let data = [0, 0.25, 0, -1, 1, 0, 1, 1, 0];
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, `vertexPosition`);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
  }

  // Override
  loadView(ele) { }
}
