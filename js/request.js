// 检测邮件地址可用性

function checkUser() {
    const emailInput = document.querySelector('.email-input');
    const domainSelect = document.querySelector('.domain-select');
    const checkResult = document.getElementById('check-result');
    const email = emailInput.value;
    const domain = domainSelect.value;

    if (!email) {
        checkResult.innerHTML = '请输入您想注册的邮件地址。';
        checkResult.style.color = 'red';
        checkResult.style.display = 'block';
        return;
    }

    // 发送POST请求
    fetch('http://127.0.0.1:3101/checkUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, domain: domain }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'user_exists') {
                checkResult.innerHTML = '此邮件地址已被他人注册或处于保护期内<br>您可以尝试使用其他邮件地址或<a href="https://114514.shop" target="_blank">购买靓号</a>';
                checkResult.style.color = 'red';
            }
            else if (data.message === 'beautiful_account') {
                checkResult.innerHTML = '此邮件地址不可用<br>这是一个预留靓号，您可以尝试使用其他邮件地址或<a href="https://114514.shop" target="_blank">购买此靓号</a>';
                checkResult.style.color = 'red';
            }
            else if (data.message === 'user_absent') {
                window.location.replace("./index.html?email=" + email + domain);
            }
            else if (data.error === 'null_data') {
                checkResult.innerHTML = '请输入您想注册的邮件地址';
                checkResult.style.color = 'red';
            }
            else if (data.error === 'illegal_characters') {
                checkResult.innerHTML = '此邮件地址不可用<br>检测到非法字符';
                checkResult.style.color = 'red';
            }
            else if (data.error === 'not_whitelisted') {
                checkResult.innerHTML = '查询失败，请不要尝试使用其他域名！<br>你个肮脏的黑客！';
                checkResult.style.color = 'red';
            } else {
                checkResult.innerHTML = '发生错误，请稍后重试。';
                checkResult.style.color = 'red';
            }
            checkResult.style.display = 'block';
        })
        .catch(error => {
            console.error('发生错误: ' + error);
            checkResult.innerHTML = '发生错误，请稍后重试。<br>请检查您的网络设置，如果仍然出现错误，则意味着服务器可能出现问题。您可以通过工单系统报告此问题。';
            checkResult.style.color = 'red';
            checkResult.style.display = 'block';
        });
}
