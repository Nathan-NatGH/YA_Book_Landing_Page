import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'cover.jpg');
const stats = fs.statSync(filePath);
console.log('File size:', stats.size, 'bytes');
console.log('File path:', filePath);
