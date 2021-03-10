/*
  Made by: Darko Petrović

  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...

  FB: https://www.facebook.com/WitchkingOfAngmarr
  CodeForces: https://codeforces.com/profile/darkoxv88
  GitHub: https://github.com/darkoxv88

  Version: 0.0.1

  Software can be modified, used commercially, and distributed.
  Software can be modified and used in private.
  A license and copyright notice must be included in the software.
  Software authors provide no warranty with the software and are not liable for anything.
*/

"use strict";

try {
  eval(`
    let foo = 1;
    foo = class { static test = 1; }
  `);
} catch (e) { 
  console.error('Missing features' + '-->' + e)
}



// *********************** 
// 3D-Engine ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// *********************** 



class dp3DengineBase {

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
      this.gl = canvas.getContext('experimental-webgl');
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

    let tag = document.createElement('dp-engine');
    tag.setAttribute('engine-index', this.index);
    tag.setAttribute('style', 'display: block; width: 100%; height: 100%;');
    let div = document.createElement('div');
    div.setAttribute('style', 'width: 100%; height: 100%;');
    div.append(this.gl.canvas);
    tag.append(div);

    this._view = tag;

    let setViewDimensions = () => {
      if (
        this.gl.canvas.width != this.gl.canvas.parentElement.clientWidth || 
        this.gl.canvas.height != this.gl.canvas.parentElement.clientHeight
      ) {
        this.gl.canvas.width = this.gl.canvas.parentElement.clientWidth;
        this.gl.canvas.height = this.gl.canvas.parentElement.clientHeight;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      }
    };

    if (window.addEventListener) {
      window.addEventListener("resize", () => { setViewDimensions(); }, false);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', () => { setViewDimensions(); });
    } else if (window.onresize) {
      var currentWindowOnLoad = window.onresize;

      var newWindowOnLoad = (evt) => {
        currentWindowOnLoad(evt);
        setViewDimensions();
      }

      window.onresize = newWindowOnLoad;
    } else { 
      window.onresize = () => { setViewDimensions(); }
    }

    this.loadView(this._view);
    setViewDimensions();

    this.gl.useProgram(this.program);

    return null;
  }

  // Override
  loadView(ele) { }
  
}



class dp3Dengine extends dp3DengineBase {
  
  constructor(index = 1) {
    super(index);

    let tri = [0, 1, 0, 1, -1, 0, -1, -1, 0];
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tri), this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, `vertexPosition`);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this._gl.TRIANGLES, 0, 3);
  }

  // Override
  loadView(ele) { }
  // Override
  onStart() { }

}
