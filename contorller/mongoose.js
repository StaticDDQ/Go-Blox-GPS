var mongoose = require('mongoose');

var data = {
    username: "jkwo32",
    password: "goblox123"
};

var options ={
    useNewUrlParser: true,
};

var stringMongoose = "mongodb://"+data.username+":"+data.password+"{}}@ds233806.mlab.com:33806/members_goblox";

mongoose.connect(stringMongoose, options)
.catch((err) => console.log(err));
