import { Jimp } from 'jimp';
import path from 'path';

async function fixImage() {
  try {
    const inputPath = path.join(process.cwd(), 'public', 'cover.jpg');
    const outputPath = path.join(process.cwd(), 'public', 'cover_v2.jpg');
    
    console.log('Reading image from:', inputPath);
    const image = await Jimp.read(inputPath);
    
    console.log('Resizing image to 800px width...');
    image.resize({ w: 800 });
    
    console.log('Writing fixed image to:', outputPath);
    await image.write(outputPath);
    
    console.log('Image fixed successfully!');
  } catch (error) {
    console.error('Error fixing image:', error);
    process.exit(1);
  }
}

fixImage();
