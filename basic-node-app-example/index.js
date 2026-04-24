/*
* Title: Basic Node App Example
* Description: A simple Node.js application that demonstrates basic functionality.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 2026-04-24
*/


// কোডের ব্যাখ্যা: এই কোডটি একটি সহজ Node.js অ্যাপ্লিকেশন যা দুটি লাইব্রেরি ব্যবহার করে একটি র্যান্ডম উক্তি প্রদর্শন করে। `mathLibrary` এবং `quotesLibrary` নামে দুটি লাইব্রেরি আমদানি করা হয়, যা `./lib/math` এবং `./lib/quotes` থেকে আসে। অ্যাপ্লিকেশনটি একটি `app` অবজেক্ট তৈরি করে যার মধ্যে একটি `config` অবজেক্ট এবং দুটি ফাংশন রয়েছে: `printAQuote` এবং `indefiniteLoop`. `printAQuote` ফাংশনটি সমস্ত উক্তি থেকে একটি র্যান্ডম উক্তি নির্বাচন করে এবং এটি কনসোলে প্রিন্ট করে, যখন `indefiniteLoop` ফাংশনটি প্রতি নির্দিষ্ট সময় অন্তর `printAQuote` ফাংশনটি কল করে। অ্যাপ্লিকেশনটি `indefiniteLoop` ফাংশন কল করে শুরু হয়, যা একটি অনন্ত লুপ তৈরি করে যা প্রতি নির্দিষ্ট সময় অন্তর একটি র্যান্ডম উক্তি প্রদর্শন করে। 

const mathLibrary = require('./lib/math');
const quotesLibrary = require('./lib/quotes');


const app = {};


app.config = {
    timeBetweenQuotes: 1000,
}

app.printAQuote = function prontAQuote() {
    const allQuotes = quotesLibrary.allQuotes();

    const numberOfQuotes = allQuotes.length;

    const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

    const selectedQuote = allQuotes[randomNumber - 1];

    console.log(selectedQuote);
};


app.indefiniteLoop = function indefiniteLoop() {
    setInterval(app.printAQuote, app.config.timeBetweenQuotes);
};


app.indefiniteLoop();
