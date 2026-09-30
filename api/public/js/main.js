document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/events')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('event-list');
            container.innerHTML = '';
            
            if (data.length === 0) {
                container.innerHTML = '<p class="error-msg">No upcoming events at the moment.</p>';
                return;
            }
            
            data.forEach(event => {
                const div = document.createElement('div');
                div.className = 'event-card';
                
                // 使用模板字符串构建更丰富的 HTML 结构
                div.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>📅 Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
                    <p><strong>📍 Location:</strong> ${event.location}</p>
                    <p><strong>🏷️ Category:</strong> ${event.category_name}</p>
                    <p><strong>🎟️ Price:</strong> ${event.price > 0 ? '$' + event.price : 'Free'}</p>
                    <a href="detail.html?id=${event.event_id}" class="btn">View Details &rarr;</a>
                `;
                container.appendChild(div);
            });
        })
        .catch(err => {
            document.getElementById('event-list').innerHTML = '<p class="error-msg">Failed to load events. Check server connection.</p>';
        });
});