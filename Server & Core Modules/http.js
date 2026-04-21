// ডিটেইলস : এই কোডটি একটি সাধারণ HTTP সার্ভার তৈরি করে যা Node.js এর 'http' মডিউল ব্যবহার করে। সার্ভারটি 3000 পোর্টে চলছে এবং বিভিন্ন URL রিকোয়েস্টের জন্য বিভিন্ন রেসপন্স প্রদান করে। যখন ইউজার হোম পেজে (/) যায়, তখন একটি স্বাগতম বার্তা দেখানো হয়। যখন ইউজার 'about' পেজে (/about) যায়, তখন একটি তথ্যপূর্ণ বার্তা দেখানো হয়। অন্য কোন URL রিকোয়েস্ট করলে, সার্ভার একটি 'Page Not Found' বার্তা রেসপন্স করে।

const http = require('http');

// HTTP সার্ভার তৈরি করা হচ্ছে যা একটি কলব্যাক ফাংশন গ্রহণ করে। এই ফাংশনটি প্রতিটি ইনকামিং রিকোয়েস্টের জন্য চালানো হবে এবং রিকোয়েস্ট (req) এবং রেসপন্স (res) অবজেক্ট প্রদান করবে।
const server = http.createServer((req, res) => {
    if(req.url === '/') {
        res.write('Welcome to the Home Page!');
        res.end();
    } else if(req.url === '/about') {
        res.write('This is the About Page!');
        res.end();
    } else {
        res.write('Page Not Found!');
        res.end();
    }
});


// সার্ভারটি 3000 পোর্টে শুনতে শুরু করে এবং একটি কনসোল মেসেজ প্রিন্ট করে যা সার্ভারটি চলছে তা জানায়।
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
