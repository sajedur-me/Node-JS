const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/') {
        res.write('<html><body><h1>Welcome to the Home Page!</h1><form action="/submit" method="post"><input type="text" name="message" placeholder="Enter your message"><button type="submit">Submit</button></form></body></html>');
        res.end();
    } else if(req.url === '/submit' && req.method === 'POST') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            console.log('Received message:');
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
        });
        res.write('Thank you for submitting your message!');
        res.end();
    } else {
        res.write('Page Not Found!');
        res.end();
    }
});


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



