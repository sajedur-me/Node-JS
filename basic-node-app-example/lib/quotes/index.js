/*
* Title: Quotes Library
* Description: A simple library that provides a collection of quotes.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 2026-04-24
*/

// কোডের ব্যাখ্যা: এই কোডটি একটি সহজ লাইব্রেরি যা বিভিন্ন উক্তি প্রদান করে। এটি ফাইল সিস্টেম (fs) মডিউল ব্যবহার করে একটি টেক্সট ফাইল থেকে উক্তিগুলি পড়ে এবং একটি অ্যারে হিসাবে প্রদান করে। 
const fs = require('fs');


const quotes = {};

quotes.allQuotes = function allQuotes() {
    const quotesFile = fs.readFileSync('./lib/quotes/quotes.txt', 'utf-8');
    return quotesFile.split('\n').filter((q) => q.trim() !== '');
};

module.exports = quotes;

// এছাড়াও, এই কোডটি একটি `quotes` অবজেক্ট তৈরি করে যার মধ্যে একটি `allQuotes` ফাংশন রয়েছে। এই ফাংশনটি `quotes.txt` ফাইল থেকে সমস্ত উক্তি পড়ে এবং একটি অ্যারে হিসাবে প্রদান করে, যেখানে প্রতিটি উক্তি একটি স্ট্রিং হিসেবে থাকে। উক্তিগুলি নতুন লাইনে বিভক্ত করা হয় এবং খালি লাইনের উক্তিগুলি ফিল্টার করা হয়। এই লাইব্রেরিটি `module.exports` ব্যবহার করে রপ্তানি করা হয়, যাতে এটি অন্যান্য ফাইল থেকে আমদানি করা যায় এবং ব্যবহার করা যায়।