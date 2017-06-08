import sharp from 'sharp';

export const resizeImage = image => new Promise((resolve, reject) => (
  sharp(image)
    .resize(512, 512)
    .max()
    .toFormat('png')
    .toBuffer()
    .then(data => resolve(data))
  .catch(err => reject(err))
));

export default resizeImage;
