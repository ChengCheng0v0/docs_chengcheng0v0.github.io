document.addEventListener('DOMContentLoaded', function () {
    // 处理导航点击事件
    const links = document.querySelectorAll('.link'); // 获取导航链接元素
    // 添加点击事件处理程序
    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 阻止默认的锚链接跳转行为

            // 获取要跳转到的元素的ID
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            // 检查目标元素是否存在
            if (targetElement) {
                // 使用滚动效果滚动到目标元素
                scrollSmoothToElement(targetElement);
            }
        });
    });
});

// 自定义平滑滚动函数
function scrollSmoothToElement(element) {
    const duration = 100; // 滚动动画持续时间
    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + (targetPosition - startPosition) * progress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// 弹窗
function showPopup() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('popup');
    overlay.style.display = 'block';
    popup.style.display = 'block';

    setTimeout(function () {
        overlay.classList.add('show');
        popup.classList.add('show');
    }, 10); // 添加类的延迟，确保它们在元素显示后添加
}

function hidePopup() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('popup');
    overlay.classList.remove('show');
    popup.classList.remove('show');

    setTimeout(function () {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }, 300); // 移除类的延迟，确保它们在动画结束后移除
}

// 标题按钮点击事件
function startButton() {
    const startElement = document.querySelector('#start');
    scrollSmoothToElement(startElement);
}
function introduceButton() {
    const introduceElement = document.querySelector('#introduce');
    scrollSmoothToElement(introduceElement);
}
