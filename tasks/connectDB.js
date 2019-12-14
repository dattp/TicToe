const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (error) => {
    if (error) console.log('=====>Loi ket noi DB: ', error)
});
module.exports = mongoose