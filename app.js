var express = require('express');      // 生成一个express实例
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require('./setting');
var flash = require('connect-flash');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//设置views文件夹为存放视图文件的目录,即存放模板文件
// _dirname为全局变量,存储当前正在执行的脚本所在目录
app.set('view engine', 'ejs');  //设置视图模板引擎为ejs
app.use(flash());

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));     //加载日志中间件
app.use(bodyParser.json());             //加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: true }));

//加载解析urlencoded请求体的中间件

app.use(cookieParser());        //加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));
//设置public文件夹为存放静态文件的目录




app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

routes(app);
