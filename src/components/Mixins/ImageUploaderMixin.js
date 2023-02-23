import EXIF from 'exif-js';

export default {
  methods: {
      getFixedImage(file, rawImage, length, index, afterAction) {
      EXIF.getData(file, () => {
        try {
          let orientation = EXIF.getTag(file, "Orientation");
          const canvas = document.createElement('canvas');

          // 임시 설정(회전 관련 적용 안되도록 처리)
          if(orientation>5) {
            orientation = 1;
          }


          if(orientation < 5 || orientation ===undefined) {
            canvas.width = rawImage.width;
            canvas.height = rawImage.height;
          }
          else {
            canvas.width = rawImage.height;
            canvas.height = rawImage.width;
          }

          document.body.appendChild(canvas);

          const ctx = canvas.getContext('2d');

          // 파일 사본일경우 exif가 없어서 orientation이 undefined이다

          // orientation 없을 경우
          if(orientation !== undefined) {

            if (orientation < 5)
              ctx.translate(rawImage.width * 0.5, rawImage.height * 0.5);
            else if(orientation === 6)
              ctx.translate(rawImage.height , 0);
            else
              ctx.translate(0, rawImage.width);

            switch (orientation) {
              case 2:
                // horizontal flip
                ctx.scale(-1, 1);
                break
              case 3:
                // 180° rotate left
                // 임시 설정(회전 관련 적용 안되도록 처리)
                //ctx.rotate(Math.PI);
                break
              case 4:
                // vertical flip
                ctx.scale(1, -1);
                break
              case 5:
                // vertical flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break
              case 6:
                // 90° rotate right
                ctx.rotate(0.5 * Math.PI);
                break
              case 7:
                // horizontal flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(-1, 1);
                break
              case 8:
                // 90° rotate left
                ctx.rotate(-0.5 * Math.PI);
                break
            }
            if (orientation < 5)
              ctx.translate(-rawImage.width * 0.5, -rawImage.height * 0.5);
          }

          ctx.drawImage(rawImage, 0, 0);

          const resizeImg = this.resizeImage(canvas);
          //canvas.remove();
          canvas.parentNode.removeChild(canvas);

          // after action
          // CInputImgUpload
          this.file = resizeImg;
          if (afterAction) {
            afterAction(file, resizeImg, length, index)
          } else {
            this.$emit('update:value', this.file);
          }
        } catch (e) {
          return console.log(e);
        }
      });
    },
    resizeImage(image){
      let maxWidth = 1200;
      let maxHeight = 1200;
      let quality = 1.0;

      const scale = this.getNewScale(image, maxWidth, maxHeight);
      const scaledWidth = image.width / scale;
      const scaledHeight = image.height / scale;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      return canvas.toDataURL('image/jpeg', quality)
    },
    getNewScale(image, maxWidth, maxHeight){
      if (image.width <= maxWidth && image.height <= maxHeight) {
        return 1
      }
      const isLandscape = image.width > image.height;
      const dimension = isLandscape ? image.width : image.height;
      return dimension / (isLandscape ? maxWidth : maxHeight)
    },
  }
}
