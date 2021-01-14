/**
 * express_project.
 * Create by Devin on 2021/1/14.
 *
 * Copyright (c) 2021-present, Devin.
 * All rights reserved.
 *
 */
const logger = require('morgan')
const path = require('path')
const express = require('express')
const fs = require('fs')
const rfs = require('file-stream-rotator')

const port = 8000
const app = express()


app.all('*', (req, res, next) => {
    const {origin, Origin, referer, Referer} = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})


// 引入路由模块
const login = require('./route/login')
const admin = require('./route/admin')

// logger
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const errorLogStream = rfs.getStream({
    date_format: 'YYYY-MM-DD', // 日期类型
    filename: path.join(logDirectory, '%DATE%.error.log'), //文件名
    frequency: 'daily', // 每天的频率
    verbose: false
});
const accessLogStream = rfs.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, '%DATE%.access.log'),
    frequency: 'daily',
    verbose: false
});

// [2021-01-14T08:12:16.808Z] ::1 GET /login 304 - - 2.869 ms
logger.token('localDate', () => {
    let date = new Date()
    return date.toLocaleString()
})
app.use(logger('[:localDate] :method :url :status -- :response-time ms', {stream: accessLogStream}));
app.use(logger('[:localDate] :method :url :status -- :response-time ms', {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: errorLogStream
}));
app.use(logger('dev'))

// 匹配路由
app.use('/users/login', login)
app.use('/admin', admin)

// 开放静态资源
app.use(express.static(path.join(__dirname, 'public')))

// 开放模板目录
app.set('views', path.join(__dirname, 'views'))
// 配置模板引擎
app.set('views engine', 'art')
app.engine('art', require('express-art-template'))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
