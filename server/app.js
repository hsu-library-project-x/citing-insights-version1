const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config({ path: `${__dirname}/../.env` });
const config = require("./config.js");
const upload = require('./upload');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const helmet = require('helmet');
// const multer = require('multer');
const fs = require('fs');

const url = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let routes = require('./routes/index');
let users = require('./routes/userRoutes');
let courses = require('./routes/courseRoutes');
let assignments = require('./routes/assignmentRoutes');
let papers = require('./routes/paperRoutes');
let citations = require('./routes/citationRoutes');
let rubrics = require('./routes/rubricRoutes');
let feedback = require("./routes/feedbackRoutes");
let configurations = require("./routes/configurationsRoutes");
let groups = require("./routes/groupsRoutes");

let app = express();

app.use(helmet());

app.use(session({
  'secret': 'nufv98y984hfouijdso8fu32089r32tpbgg0bg01n2',
  'store': new MongoStore({ mongooseConnection: mongoose.connection }),
  'resave': true,
  'saveUninitialized': false
}));

//this line is just for the file uypload test
app.engine('html', require('ejs').renderFile);

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

if (app.get('env') === 'production') {
  app.use(logger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  }));
} else {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/upload', upload);
app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/assignments', assignments);
app.use('/api/papers', papers);
app.use('/api/citations', citations);
app.use('/api/rubrics', rubrics);
app.use('/api/feedback', feedback);
app.use('/api/configurations', configurations);
app.use('/api/groups', groups);

app.get('/api/logout', function (req, res) {
  req.session.destroy();
  return res.status(200).json();
});

if (app.get('env') === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
  });
}


module.exports = app;


