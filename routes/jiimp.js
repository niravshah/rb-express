var Jimp = require("jimp");


module.exports = {

  createFBImage: function (url) {

    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {


      Jimp.read('/Users/niravshah/Documents/code/raisebetter/rb-angular/src/assets/images/blog-1.jpg').then(function (fg) {

        Jimp.read('/Users/niravshah/Documents/code/raisebetter/rb-angular/src/assets/images/fb_blit_1200_630.png').then(function (bg) {

          bg
            .blit(fg, 0, 0)
            .print(font,100,100,"Hello World")
            .write('/Users/niravshah/Documents/code/raisebetter/rb-angular/src/assets/images/blit_result.png', function (err, res) {
              console.log(err, res);
            });

        }).catch(function (error) {
          console.log('bg error', error)
        });

      }).catch(function (error) {
        console.log('fg error', error)
      });

    });
  }

};



