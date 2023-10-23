const express = require('express');
const request = require('request');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 白名单的邮件地址后缀
const emailWhitelist = [
    '@kawaii.fans',
    '@nyan.fans',
    '@114514.red',
    '@ikun.fit',
    '@omoe.ink',
    '@qwq.fund',
    '@qwq.email'
];

// 启用CORS中间件，允许来自任何来源的请求
app.use(cors({ origin: '*' }));

// 生成格式化的日志时间戳
function getFormattedTimestamp() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Shanghai', // 设置时区为GMT+8
        hour12: false, // 使用24小时制
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const [{ value: year }, , { value: month }, , { value: day }, , { value: hour }, , { value: minute }, , { value: second }] = formatter.formatToParts(now);

    return `(GMT+8) ${year}.${month}.${day} ${hour}:${minute}:${second}`;
}

// 记录请求信息的中间件
app.use((req, res, next) => {
    const timestamp = getFormattedTimestamp();

    // 获取IPv4地址
    request('http://ip-api.com/json', (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const publicIPv4 = data.query;

            console.log(`[${timestamp}] [IP: ${publicIPv4}] ${req.method} ${req.originalUrl}`);
        } else {
            console.error('获取IPv4地址时出错: ' + error);
            console.log(`[${timestamp}] [IP: Unknown] ${req.method} ${req.originalUrl}`);
        }
        next();
    });
});

// 输出调试日志
function log(msg) {
    const timestamp = getFormattedTimestamp();

    console.log(`[${timestamp}] ` + msg);
}

// 配置MySQL数据库
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'su252302',
    database: 'chmail',
});

// 连接MySQL数据库
db.connect((err) => {
    if (err) {
        console.error('无法连接到MySQL数据库: ' + err);
    } else {
        console.log('已连接到MySQL数据库');
    }
});

// 检查邮件地址可用性
app.post('/checkUser', (req, res) => {
    const { email, domain } = req.body;

    // 检查 email 和 domain 是否为空
    if (!email || !domain) {
        res.status(400).json({ error: 'null_data' });
        log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "error: null_data"');
        return;
    }

    // 使用正则表达式检查电子邮件是否合法（只允许小于24位的英文字母和数字）
    const emailPattern = /^[a-zA-Z0-9]{1,24}$/;
    if (!emailPattern.test(email)) {
        res.status(400).json({ error: 'illegal_characters' });
        log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "error: illegal_characters"');
        return;
    }

    // 检查电子邮件地址后缀是否在白名单中
    if (!emailWhitelist.includes(domain)) {
        res.status(400).json({ error: 'not_whitelisted', message: '你个肮脏的黑客！' });
        log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "error: not_whitelisted"');
        return;
    }

    // 查询数据库，检查用户是否存在
    db.query('SELECT * FROM users WHERE email = ?', [`${email}${domain}`], (err, results) => {
        if (err) {
            console.error('查询数据库时出错: ' + err);
            res.status(500).json({ message: '查询数据库时出错' });
        } else {
            if (results.length > 0) {
                // 用户已存在
                if (results[0].state === 'reserved') {
                    // 用户状态为
                    res.status(200).json({ message: 'beautiful_account' });
                    log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "beautiful_account"');
                } else {
                    res.status(200).json({ message: 'user_exists' });
                    log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "user_exists"');
                }
            } else {
                // 用户不存在
                res.status(200).json({ message: 'user_absent' });
                log('↑ 请求类型：检查可用性, 请求内容："' + email + domain + '", 请求结果: "user_absent"');
            }
        }
    });
});

const PORT = process.env.PORT || 3101;
app.listen(PORT, () => {
    console.log(`服务器正在运行，监听端口 ${PORT}`);
});
