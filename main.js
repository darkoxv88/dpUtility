/**
  ...No moon is there, no voice, no sound
  Of beating heart; a sigh profound...


	* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * @Link CodeForces: https://codeforces.com/profile/darkoxv88

	* @fileoverview main.js provides a demo of dp-utility.js and dp-3d-engine.js
  * @source https://github.com/darkoxv88/dpUtility
  * @version 1.0.0


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

dpVerifyES6();

class Engine extends dp3dEngine {

  loadView(ele) {
    let view = dp.$('<app-display>')[0];
    view.innerHTML = '';
    view.append(ele);
  }

}

let index = {
  test : null,
  _3D : null,

  init : function() {
    dp.$('<app-display>')[0].innerHTML = `
      <input style="margin: 6px;" type="file" onchange="index.test.loadImage(event)"></input>
      <img id="org-img" style="margin: 6px;" width="400px" height="auto"></img>
      <img id="test-img" style="margin: 6px;" width="400px" height="auto"></img>
    `;

    this.test = new dpImageProcessing(async () => {
      await this.test.asyncTemperature(6200);
      await this.test.asyncLightness(7);
      await this.test.asyncGamma(1.15)
      await this.test.asyncHue(38)
      await this.test.flipImage(true, false);
      await this.test.rotateImage(true);
      await this.test.asyncSaturation(-3);
      await this.test.asyncHighpass(3);
      await this.test.asyncNoise(5);
      console.log(await this.test.asyncHistogram());
      dp.$("#org-img").src  = this.test.getOrgImg();
      dp.$("#test-img").src = this.test.getImg();
    });
  },
};

dp.main(() => {
  let c = new dpAJAX();
  c.get('test/test.html').then((data) => {
    console.log(data);
  });

  index.init();

  if(false) {
    this._3D = new Engine(1);
  }
});
