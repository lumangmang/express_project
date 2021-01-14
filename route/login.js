/**
 * express_project.
 * Create by Devin on 2021/1/14.
 *
 * Copyright (c) 2021-present, Devin.
 * All rights reserved.
 *
 */

const express = require('express')
// 创建登陆页路由
const login = express.Router()

login.get('/', (req, res) => {
    res.send('login page')
})

// 将路由对象作为模块成员导出
module.exports = login
