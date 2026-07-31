/**
 * Cusdis 免登入彈出式留言板模組（淺藍 + 亮黃可愛撞色 iframe 沙盒隔離版）
 */
(function () {
  'use strict';

  window.addEventListener('DOMContentLoaded', function () {
    try {
      // 0. 動態引入 Google 可愛字型 Quicksand
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap';
      document.head.appendChild(fontLink);

      // 1. 動態注入主頁面的彈窗 CSS 樣式
      const style = document.createElement('style');
      style.textContent = `
        /* 全域可愛字型設定 */
        #cusdis-modal-container, #cusdis-toggle-btn {
          font-family: 'Quicksand', 'Comfortaa', 'Comic Sans MS', "Mplus 1p", "微軟正黑體", sans-serif;
        }

        /* 1. 右下角圓形懸浮按鈕 (淺藍波波風格) */
        #cusdis-toggle-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          color: white;
          border: 3px solid #ffffff;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #cusdis-toggle-btn:hover {
          transform: translateY(-4px) rotate(8deg) scale(1.1);
          box-shadow: 0 12px 25px rgba(59, 130, 246, 0.5);
        }

        #cusdis-toggle-btn:active {
          transform: translateY(1px) scale(0.95);
        }

        /* 2. 全螢幕半透明背景遮罩 */
        #cusdis-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(30, 41, 59, 0.5);
          z-index: 10000;
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        /* 3. 彈出卡片主體 (藍白可愛圓滾滾卡片) */
        #cusdis-modal-card {
          width: 90%;
          max-width: 680px;
          height: 65vh;
          max-height: 700px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15), 0 10px 25px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: cusdisCutePopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 4px solid #f0f9ff;
        }

        /* 4. 卡片標題列 (柔和天空藍) */
        #cusdis-modal-header {
          padding: 18px 24px;
          background: #e0f2fe;
          border-bottom: 2px dashed #bae6fd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #cusdis-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0284c7;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.5px;
        }

        /* 關閉按鈕 (溫和淺黃) */
        #cusdis-close-btn {
          background: #fef08a;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 18px;
          color: #854d0e;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s ease;
        }

        #cusdis-close-btn:hover {
          background-color: #facc15;
          color: #451a03;
          transform: rotate(90deg);
        }

        /* 5. 內容區與沙盒 iframe */
        #cusdis-modal-body {
          padding: 10px 16px;
          overflow-y: auto;
          flex: 1;
          user-select: text;
          background-color: #ffffff;
        }

        #cusdis-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* 可愛彈跳登場動畫 */
        @keyframes cusdisCutePopIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.88); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        /* 手機版適應 (RWD) */
        @media (max-width: 640px) {
          #cusdis-modal-card {
            width: 93%;
            height: 75vh;
            border-radius: 20px;
          }

          #cusdis-modal-header {
            padding: 14px 18px;
          }

          #cusdis-modal-body {
            padding: 10px;
          }

          #cusdis-toggle-btn {
            bottom: 20px;
            right: 20px;
            width: 54px;
            height: 54px;
            font-size: 24px;
          }
        }
      `;
      document.head.appendChild(style);

      // 2. 建立觸發按鈕
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'cusdis-toggle-btn';
      toggleBtn.innerHTML = '📩';
      toggleBtn.setAttribute('title', '開啟留言區');

      // 3. 建立彈出容器
      const modalContainer = document.createElement('div');
      modalContainer.id = 'cusdis-modal-container';
      modalContainer.style.display = 'none';

      // 4. 填入卡片結構與沙盒 iframe
      modalContainer.innerHTML = `
        <div id="cusdis-modal-card">
          <div id="cusdis-modal-header">
            <h3>💬 歡迎留下你的意見與問題</h3>
            <button id="cusdis-close-btn">&times;</button>
          </div>
          <div id="cusdis-modal-body">
            <iframe id="cusdis-iframe"></iframe>
          </div>
        </div>
      `;

      // 5. 掛載 DOM
      document.body.appendChild(toggleBtn);
      document.body.appendChild(modalContainer);

      let isIframeLoaded = false;

      // 6. 按下留言按鈕時動態注入獨立環境至 iframe
      toggleBtn.addEventListener('click', () => {
        modalContainer.style.display = 'flex';

        if (!isIframeLoaded) {
          const iframe = document.getElementById('cusdis-iframe');
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

          // 建構 iframe 內部的獨立 HTML 文件，包含原本所有的自訂樣式與驗證邏輯
          const iframeHTML = `
            <!DOCTYPE html>
            <html lang="zh-TW">
            <head>
              <meta charset="utf-8">
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap">
              <style>
                body {
                  margin: 0;
                  padding: 10px;
                  background-color: #ffffff;
                  font-family: 'Quicksand', 'Comic Sans MS', "微軟正黑體", sans-serif;
                }

                /* 滾動條樣式 */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f0f9ff; border-radius: 10px; }
                ::-webkit-scrollbar-thumb { background: #7dd3fc; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
              </style>
            </head>
            <body>
              <div id="cusdis_thread"
                data-host="https://cusdis.com"
                data-app-id="772fcf7d-79cc-4e39-a230-6f2ade15d77c"
                data-page-id="pnp-pip-gui-editor"
                data-page-url="${window.location.href}"
                data-page-title="${document.title || 'PnP Editor'}">
              </div>

              <script>
                // 語系設定
                window.CUSDIS_LOCALE = {
                  powered_by: 'Powered by Cusdis',
                  post_comment: 'SUBMIT',
                  loading: '載入中...',
                  email: '電子郵件 (用作回覆，可不填)',
                  nickname: '你的暱稱',
                  reply_placeholder: '留下你的回覆...',
                  reply_btn: '回覆',
                  sending: '傳送中...',
                  mod_badge: '站長',
                  anonymous: '匿名訪客',
                  empty_comment: '留言內容不能為空！'
                };
              <\/script>
              <script async src="https://cusdis.com/js/cusdis.es.js"><\/script>

              <script>
                // 定時檢查內部渲染與樣式注入
                setInterval(() => {
                  const targetIframe = document.querySelector('#cusdis_thread iframe');
                  if (targetIframe && targetIframe.contentDocument) {
                    const doc = targetIframe.contentDocument;

                    // 注入內部美化 CSS
                    if (!doc.querySelector('#custom-iframe-style')) {
                      const iframeStyle = doc.createElement('style');
                      iframeStyle.id = 'custom-iframe-style';
                      iframeStyle.textContent = \`
                        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');
                        
                        body, input, textarea, button {
                          font-family: 'Quicksand', 'Comic Sans MS', "微軟正黑體", sans-serif !important;
                        }

                        textarea, input {
                          border-radius: 12px !important;
                          border: 2px solid #bae6fd !important;
                          padding: 10px 14px !important;
                          outline: none !important;
                          transition: all 0.2s ease !important;
                          background-color: #f0f9ff !important;
                        }

                        textarea:focus, input:focus {
                          border-color: #0284c7 !important;
                          background-color: #ffffff !important;
                          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
                        }

                        /* 🔥 亮黃色膠囊 SUBMIT 按鈕 🔥 */
                        button[type="submit"], button {
                          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
                          color: #ffffff !important;
                          font-family: 'Quicksand', sans-serif !important;
                          font-weight: 700 !important;
                          font-size: 18px !important;
                          letter-spacing: 2px !important;
                          border: none !important;
                          border-radius: 50px !important;
                          padding: 12px 36px !important;
                          cursor: pointer !important;
                          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5) !important;
                          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                          display: inline-block !important;
                          margin-top: 10px !important;
                          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15) !important;
                        }

                        button[type="submit"]:hover, button:hover {
                          transform: scale(1.05) !important;
                          background: linear-gradient(135deg, #fcd34d 0%, #d97706 100%) !important;
                          box-shadow: 0 8px 22px rgba(245, 158, 11, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.6) !important;
                        }

                        button[type="submit"]:active, button:active {
                          transform: scale(0.96) !important;
                          box-shadow: 0 3px 8px rgba(245, 158, 11, 0.3) !important;
                        }

                        button:disabled {
                          background: #cbd5e1 !important;
                          box-shadow: none !important;
                          cursor: not-allowed !important;
                          transform: none !important;
                        }
                      \`;
                      doc.head.appendChild(iframeStyle);
                    }

                    // 輸入框與高度
                    const textarea = doc.querySelector('textarea');
                    if (textarea && textarea.style.height !== '100px') {
                      textarea.style.height = '100px';
                      textarea.style.minHeight = '90px';
                    }

                    const scrollHeight = doc.documentElement.scrollHeight;
                    if (scrollHeight && targetIframe.style.height !== scrollHeight + 'px') {
                      targetIframe.style.height = scrollHeight + 'px';
                    }

                    // Email 格式驗證
                    const inputs = doc.querySelectorAll('input');
                    if (inputs.length >= 2) {
                      const emailInput = inputs[1];
                      const submitBtn = doc.querySelector('button[type="submit"]') || doc.querySelector('button');

                      let errorMsg = doc.querySelector('#custom-email-error');
                      if (!errorMsg) {
                        errorMsg = doc.createElement('div');
                        errorMsg.id = 'custom-email-error';
                        errorMsg.style.cssText = 'color: #ef4444; font-size: 13px; font-weight: bold; margin-top: 6px; display: none;';
                        emailInput.parentNode.appendChild(errorMsg);

                        emailInput.addEventListener('input', () => {
                          const val = emailInput.value.trim();
                          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;

                          if (val === '') {
                            errorMsg.style.display = 'none';
                            emailInput.style.borderColor = '';
                            if (submitBtn) submitBtn.disabled = false;
                          } else if (!emailRegex.test(val)) {
                            errorMsg.innerText = '❌ 電子郵件格式不正確（需包含 @ 與有效網域）';
                            errorMsg.style.display = 'block';
                            emailInput.style.borderColor = '#ef4444';
                            if (submitBtn) submitBtn.disabled = true;
                          } else {
                            errorMsg.style.display = 'none';
                            emailInput.style.borderColor = '#10b981';
                            if (submitBtn) submitBtn.disabled = false;
                          }
                        });
                      }
                    }

                    // 監聽送出按鈕
                    const submitBtn = doc.querySelector('button[type="submit"]') || doc.querySelector('button');
                    if (submitBtn && !submitBtn.dataset.hasClickListener) {
                      submitBtn.dataset.hasClickListener = 'true';

                      submitBtn.addEventListener('click', () => {
                        const commentText = textarea ? textarea.value.trim() : '';
                        if (!commentText) return;

                        setTimeout(() => {
                          alert('🎉 留言已成功送出！\\n\\n感謝您的意見。');
                          window.parent.document.getElementById('cusdis-modal-container').style.display = 'none';
                          window.location.reload();
                        }, 800);
                      });
                    }
                  }
                }, 200);
              <\/script>
            </body>
            </html>
          `;

          iframeDoc.open();
          iframeDoc.write(iframeHTML);
          iframeDoc.close();
          isIframeLoaded = true;
        }
      });

      // 關閉彈窗事件
      const closeBtn = modalContainer.querySelector('#cusdis-close-btn');
      closeBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });

    } catch (err) {
      console.warn("Cusdis initialize warning:", err);
    }
  });
})();