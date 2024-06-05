const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nose2', {
    useNewUrlParser: true
})
    .then(db => console.log('Db is connected'))
    .catch(err => console.log(err));