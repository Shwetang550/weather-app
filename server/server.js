const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();


// import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tagRoutes = require('./routes/tagRoutes');


// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cors());
if ((process.env.NODE_ENV = 'development')) {
    app.use(cors({ origin: `http://localhost:3000` }));
}


//middlewares
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', tagRoutes);



//mongodb connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('DB connected'))
.catch(() => console.log('DB connection error: ', err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
} );