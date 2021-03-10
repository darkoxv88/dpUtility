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



class Engine extends dp3Dengine {

  loadView(ele) {
    let view = dp.$('<app-display>')[0];
    view.innerHTML = '';
    view.append(ele);
  }

  onStart() {
    
  }

}

let index = {
  test : null,
  _3D : null,

  init : function (buildEngine=false) {
    let c = new dpAJAX();

    c.get('test/test.html').then((data) => {
      console.log(data);
    });

    this.test = new dpImageProcessing(async () => {
      /*
      	<input type="file" onchange="index.test.loadImage(event)"></input>
        <img style="margin: 6px;" id="org-img" width="500px" height="auto"></img>
			  <img id="test-img" width="500px" height="auto"></img>
      */
      await this.test.asyncTemperature(6200);
      await this.test.asyncLightness(7);
      await this.test.asyncGamma(1.15)
      await this.test.asyncHue(38)
      await this.test.flipImage(true, false);
      await this.test.rotateImage(true);
      await this.test.asyncSaturation(-3);
      await this.test.asyncHighpass(3);
      console.log(await this.test.asyncHistogram());
      dp.$("#org-img").src  = this.test.getOrgImg();
      dp.$("#test-img").src = this.test.getImg();
    });

    if(buildEngine) {
      this._3D = new Engine(1);
    }
  },
};

dpComponents.register('app-a', '.a{display: block}', null, 'function', class test{});
dpComponents.register('app-b', '.b{display: block}', null, 'function', class test{});

dp.registerOnload(() => {
  index.init();
});