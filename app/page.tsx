addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const clientIP = request.headers.get('cf-connecting-ip') || '无法获取';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fn Cloud蜂鸟云技术平台 - 智能访问</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 0;
                background-image: url('https://pic.imgdb.cn/item/66f6c445f21886ccc064b247.jpg');
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .container {
                background: rgba(255, 255, 255, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 24px;
                padding: 30px;
                width: 480px;
                min-height: 620px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .logo-container {
                position: relative;
                width: 180px;
                height: 180px;
                margin-bottom: 20px;
            }

            .logo {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 8px solid white;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                animation: pulse 2s infinite;
                object-fit: cover;
            }

            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(107, 223, 143, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 20px rgba(107, 223, 143, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(107, 223, 143, 0);
                }
            }

            h1 {
                color: #1a1f36;
                font-size: 28px;
                font-weight: 700;
                text-align: center;
                margin: 0 0 30px 0;
                padding-bottom: 15px;
                position: relative;
            }

            h1::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 4px;
                background: #6bdf8f;
                border-radius: 2px;
            }

            .description {
                width: 100%;
                padding: 0 15px;
                margin-bottom: 15px;
                font-weight: 600;
            }

            .cdn-item {
                color: #1a1f36;
                font-size: 16px;
                line-height: 1.6;
                padding: 12px 15px;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
            }

            .cdn-item:hover {
                background: rgba(255, 255, 255, 0.8);
                transform: translateX(5px);
            }

            .latency-bar {
                flex-grow: 1;
                height: 10px;
                background-color: #ddd;
                border-radius: 5px;
                overflow: hidden;
                margin-left: 10px;
                position: relative;
            }

            .latency-fill {
                height: 100%;
                background-color: #4caf50;
                width: 0;
                transition: width 0.3s ease;
            }

            .fastest {
                font-weight: bold;
                color: green;
                margin-top: 20px;
                font-size: 18px;
            }

            .visitor-count {
                font-size: 14px;
                color: #666;
                margin-top: 10px;
            }

            .ip-address {
                font-size: 14px;
                color: #555;
                margin-top: 15px;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo-container">
                <img class="logo" src="https://yunpan.flw8.top/PicGo/fnyun" alt="Logo">
            </div>
            <h1>Fn Cloud蜂鸟云技术 智能访问</h1>
            <div class="cdn-item">
                <p>FnCloud CDN:</p>
                <div class="latency-bar"><div class="latency-fill" id="cloudflare-latency"></div></div>
                <span id="cloudflare-time">测量中...</span>
            </div>
            <div class="cdn-item">
                <p>Cloudflare CDN:</p>
                <div class="latency-bar"><div class="latency-fill" id="cloudflare1-latency"></div></div>
                <span id="cloudflare1-time">测量中...</span>
            </div>
            <div class="cdn-item">
                <p>Fastly CDN:</p>
                <div class="latency-bar"><div class="latency-fill" id="cloudflare1-latency"></div></div>
                <span id="cloudflare1-time">测量中...</span>
            </div>
            <div class="cdn-item">
                <p>备用地址:</p>
                <div class="latency-bar"><div class="latency-fill" id="cloudflare1-latency"></div></div>
                <span id="cloudflare1-time">测量中...</span>
            </div>
            <div class="fastest" id="fastest-cdn">
                最快 CDN: 测量中...
            </div>
            <b>📈今日访问人数:</b><span id="visitCount">加载中...</span>
            <b>📊当前在线人数:</b><div id="liveuser" style="display: inline;">加载中...</div>
            <script src="https://liveuser.030101.xyz/main.js?sessionId=fntao5.cn"></script>
            </div>

            <script>
                fetch('https://tongji.090227.xyz/?id=blog.cmliussss.com')
                    .then(r => r.json())
                    .then(d => document.getElementById('visitCount').innerText = d.visitCount)
                    .catch(e => document.getElementById('visitCount').innerText = '加载失败');

                fetch('https://api.ipify.org?format=json')
                    .then(response => response.json())
                    .then(data => document.getElementById('clientIP').innerText = data.ip)
                    .catch(e => document.getElementById('clientIP').innerText = '加载失败');
            </script>

            <script>
                async function testLatency(url, elementId, timeId) {
                    const start = Date.now();
                    try {
                        const response = await fetch(url);
                        await response.text();
                    } catch (error) {
                        // Ignore errors
                    }
                    const latency = Date.now() - start;
                    document.getElementById(timeId).textContent = latency + 'ms';
                    document.getElementById(elementId).style.width = Math.min(100, (100 - (latency / 2))) + '%';
                    return latency;
                }

                async function measureAllLatencies() {
                    const results = await Promise.all([
                        testLatency('https://www.fnshop.fntaowu.com', 'cloudflare-latency', 'cloudflare-time'),
                        testLatency('https://xn--9kqw98kgro.fntao5.cn', 'cloudflare1-latency', 'cloudflare1-time'),
                        testLatency('https://fastlys.fntaowu.com', 'cloudflare1-latency', 'cloudflare1-time'),
                        testLatency('https://fnshop.ip-ddns.com', 'cloudflare1-latency', 'cloudflare1-time')
                    ]);

                    const cdns = ['Cloudflare', 'Cloudflare1'];
                    const fastestIndex = results.indexOf(Math.min(...results));
                    document.getElementById('fastest-cdn').textContent = '最快 CDN: ' + cdns[fastestIndex] + ' ✅';

                    const fastestCDNUrls = [
                        'https://www.fnshop.fntaowu.com', 'https://xn--9kqw98kgro.fntao5.cn', 'https://fastlys.fntaowu.com', 'https://fnshop.ip-ddns.com'
                    ];
                    window.location.href = fastestCDNUrls[fastestIndex];
                }

                measureAllLatencies();
            </script>
        </div>
    </body>
    </html>
    `;
  
    return new Response(htmlContent, {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
}
