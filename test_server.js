import http from 'http';

http.get('http://localhost:3000/cover_v2.jpg', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
}).on('error', (err) => {
  console.error('Error:', err.message);
});
