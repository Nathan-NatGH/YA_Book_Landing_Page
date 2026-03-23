import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'cover.png');
if (fs.existsSync(filePath)) {
  const buffer = fs.readFileSync(filePath);
  console.log('File size:', buffer.length);
  console.log('First 8 bytes:', buffer.slice(0, 8).toString('hex'));
} else {
  console.log('File does not exist');
}
