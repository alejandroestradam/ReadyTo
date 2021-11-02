const mongoose = require('mongoose');

mongoose.connect( process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(db => console.log('Database Conected'))
  .catch(err => console.error(err));