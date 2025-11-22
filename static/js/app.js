function showTab(tabName, clickedButton) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

document.getElementById('stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const server = document.getElementById('stats-server').value;
    const uid = document.getElementById('stats-uid').value;
    const gamemode = document.getElementById('gamemode').value;
    const matchmode = document.getElementById('matchmode').value;
    
    const resultDiv = document.getElementById('stats-result');
    resultDiv.innerHTML = '<div class="loading">Đang tải dữ liệu</div>';
    
    try {
        const response = await fetch(`/get_player_stats?server=${server}&uid=${uid}&gamemode=${gamemode}&matchmode=${matchmode}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            displayStats(data.data, data.metadata);
        } else {
            resultDiv.innerHTML = `<div class="error">Lỗi: ${data.error || data.message || 'Không thể lấy dữ liệu'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Lỗi kết nối: ${error.message}</div>`;
    }
});

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const server = document.getElementById('profile-server').value;
    const uid = document.getElementById('profile-uid').value;
    
    const resultDiv = document.getElementById('profile-result');
    resultDiv.innerHTML = '<div class="loading">Đang tải dữ liệu</div>';
    
    try {
        const response = await fetch(`/get_player_personal_show?server=${server}&uid=${uid}`);
        const data = await response.json();
        
        if (response.ok) {
            displayProfile(data);
        } else {
            resultDiv.innerHTML = `<div class="error">Lỗi: ${data.error || data.message || 'Không thể lấy dữ liệu'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Lỗi kết nối: ${error.message}</div>`;
    }
});

document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const server = document.getElementById('search-server').value;
    const keyword = document.getElementById('keyword').value;
    
    const resultDiv = document.getElementById('search-result');
    resultDiv.innerHTML = '<div class="loading">Đang tìm kiếm</div>';
    
    try {
        const response = await fetch(`/get_search_account_by_keyword?server=${server}&keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        
        if (response.ok) {
            displaySearchResults(data);
        } else {
            resultDiv.innerHTML = `<div class="error">Lỗi: ${data.error || 'Không thể tìm kiếm'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Lỗi kết nối: ${error.message}</div>`;
    }
});

function displayStats(stats, metadata) {
    const resultDiv = document.getElementById('stats-result');
    
    let html = '<div class="result-card">';
    html += `<h3>📊 Thống kê ${metadata.gamemode.toUpperCase()} - ${metadata.matchmode}</h3>`;
    html += '<div class="success">Đã tải thành công!</div>';
    
    if (typeof stats === 'object') {
        for (const [key, value] of Object.entries(stats)) {
            html += `<div class="stat-item">
                <span class="stat-label">${formatKey(key)}:</span>
                <span class="stat-value">${formatValue(value)}</span>
            </div>`;
        }
    } else {
        html += `<pre>${JSON.stringify(stats, null, 2)}</pre>`;
    }
    
    html += '</div>';
    resultDiv.innerHTML = html;
}

function displayProfile(profile) {
    const resultDiv = document.getElementById('profile-result');
    
    let html = '<div class="result-card">';
    html += '<h3>👤 Thông tin cá nhân</h3>';
    html += '<div class="success">Đã tải thành công!</div>';
    html += `<pre>${JSON.stringify(profile, null, 2)}</pre>`;
    html += '</div>';
    
    resultDiv.innerHTML = html;
}

function displaySearchResults(results) {
    const resultDiv = document.getElementById('search-result');
    
    if (!results || (Array.isArray(results) && results.length === 0)) {
        resultDiv.innerHTML = '<div class="error">Không tìm thấy kết quả nào</div>';
        return;
    }
    
    let html = '<div class="result-card">';
    html += '<h3>🔍 Kết quả tìm kiếm</h3>';
    html += '<div class="success">Đã tìm thấy!</div>';
    html += `<pre>${JSON.stringify(results, null, 2)}</pre>`;
    html += '</div>';
    
    resultDiv.innerHTML = html;
}

function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatValue(value) {
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.nextElementSibling.textContent;
        element.nextElementSibling.textContent = '✅ Đã copy!';
        setTimeout(() => {
            element.nextElementSibling.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Lỗi khi copy:', err);
    });
}
