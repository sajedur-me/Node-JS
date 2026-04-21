const EventEmittre = require('events');

class ExpOtherFile extends EventEmittre {
    myFunction() {
        this.emit('farewell', {
            name: 'Sajed',
            message: 'It was nice meeting you!'
        });
    }
}


module.exports = ExpOtherFile; // এটি 'ExpOtherFile' ক্লাসকে মডিউল হিসেবে রপ্তানি করে, যাতে এটি অন্য ফাইল থেকে ইমপোর্ট করা যায়