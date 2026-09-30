document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const form = document.getElementById('search-form');
    const resultsDiv = document.getElementById('search-results');
    const errorMsg = document.getElementById('error-msg');

    // 1. 动态加载类别到下拉菜单中
    fetch('/api/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.category_id;
                option.textContent = cat.category_name;
                categorySelect.appendChild(option);
            });
        })
        .catch(err => console.error('Failed to load categories:', err));

    // 2. 处理表单提交
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        resultsDiv.innerHTML = '<p>Searching...</p>';

        const date = document.getElementById('date').value;
        const location = document.getElementById('location').value.trim();
        const category = document.getElementById('category').value;

        // 构建查询参数
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (location) params.append('location', location);
        if (category) params.append('category', category);

        // 3. 调用 API
        fetch(`/api/events/search?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                resultsDiv.innerHTML = '';
                if (data.length === 0) {
                    resultsDiv.innerHTML = '<p>No events found matching your criteria.</p>';
                    return;
                }
                
                // 渲染结果卡片
                data.forEach(event => {
                    const div = document.createElement('div');
                    div.className = 'event-card';
                    div.innerHTML = `
                        <h3>${event.title}</h3>
                        <p><strong>📅 Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
                        <p><strong>📍 Location:</strong> ${event.location}</p>
                        <p><strong>🏷️ Category:</strong> ${event.category_name}</p>
                        <a href="detail.html?id=${event.event_id}" class="btn">View Details &rarr;</a>
                    `;
                    resultsDiv.appendChild(div);
                });
            })
            .catch(err => {
                errorMsg.textContent = 'Error searching events. Please check server connection.';
                resultsDiv.innerHTML = '';
            });
    });

    // 4. 清除过滤器（纯 DOM 操作）
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('date').value = '';
        document.getElementById('location').value = '';
        document.getElementById('category').value = '';
        resultsDiv.innerHTML = '';
        errorMsg.textContent = '';
    });
});