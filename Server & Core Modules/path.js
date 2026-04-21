// ডিটেইলস : জাভাস্ক্রিপ্টে পাথ মডিউল হলো একটি কোর মডিউল যা ফাইল পাথের সাথে কাজ করে। এটি বিভিন্ন ফাংশন প্রদান করে যা পাথের বিভিন্ন অংশকে বিশ্লেষণ এবং পরিচালনা করতে সাহায্য করে। পাথ মডিউল ব্যবহার করে আপনি পাথের ডিরেক্টরি নাম, এক্সটেনশন, বেস নাম ইত্যাদি সহজেই পেতে পারেন।

const path = require('path');

const myPath = 'C:/Users/sajed/OneDrive/Desktop/Node-JS/Server & Core Modules/index.js';

console.log(path.dirname(myPath)); // এটি পাথের ডিরেক্টরি অংশকে রিটার্ন করে
console.log(path.extname(myPath)); // এটি পাথের এক্সটেনশন অংশকে রিটার্ন করে
console.log(path.basename(myPath)); // এটি পাথের বেস নামকে রিটার্ন করে, অর্থাৎ ফাইলের নাম এবং এক্সটেনশন সহ
console.log(path.parse(myPath)); // এটি পাথের বিভিন্ন অংশকে একটি অবজেক্ট আকারে রিটার্ন করে, যেমন: root, dir, base, ext, name