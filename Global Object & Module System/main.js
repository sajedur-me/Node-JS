const _ = require("lodash"); // lodash লাইব্রেরি ইমপোর্ট করা হচ্ছে
const people = require("./people"); // people.js ফাইল থেকে people ভেরিয়েবল ইমপোর্ট করা হচ্ছে

console.log(people);
console.log(_.last(people.people)); // lodash লাইব্রেরির last ফাংশন ব্যবহার করে people অ্যারের শেষ উপাদানটি প্রিন্ট করা হচ্ছে


