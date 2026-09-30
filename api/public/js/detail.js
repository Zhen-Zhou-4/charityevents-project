document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const container = document.getElementById('detail-container');
    const banner = document.getElementById('detail-banner');
    const bannerTitle = document.getElementById('detail-banner-title');

    if (!eventId) {
        container.innerHTML = '<p class="error-msg">No event ID specified in the URL.</p>';
        return;
    }

    // 图片映射字典（与 main.js 保持一致）
    const eventImages = {
        'Annual Charity Gala': 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
        'Charity Concert': 'https://plus.unsplash.com/premium_photo-1664303096276-a8c7c9d992b1?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.1.0',
        'Community Music Fest': 'https://plus.unsplash.com/premium_photo-1719467541042-332142d0cfb6?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0',
        'Charity Fun Run': 'https://images.unsplash.com/photo-1790337590985-52559d9147be?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0',
        'Silent Auction Night': 'https://images.unsplash.com/photo-1597869742952-19fa5d5fc91e?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0'
    };

    fetch(`/api/events/${eventId}`)
        .then(res => {
            if (!res.ok) throw new Error('Event not found');
            return res.json();
        })
        .then(event => {
            const dateStr = new Date(event.event_date).toLocaleString();
            const priceStr = event.price > 0 ? `$${event.price}` : 'Free';
            const progress = Math.min((event.raised_amount / event.goal_amount) * 100, 100).toFixed(1);
            
            // 1. 动态设置顶部 Banner 的背景图和标题
            const imgUrl = eventImages[event.title] || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0';
            banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imgUrl}')`;
            bannerTitle.textContent = event.title;

            // 2. 渲染下方的内容
            container.innerHTML = `
                <div class="detail-meta">
                    <p><strong>Organizer:</strong> ${event.org_name}</p>
                    <p><strong>Category:</strong> ${event.category_name}</p>
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Ticket Price:</strong> ${priceStr}</p>
                </div>

                <h3 style="color: var(--primary-color); margin-bottom: 10px;">Event Description</h3>
                <p style="margin-bottom: 30px; color: var(--text-muted);">${event.description}</p>

                <h3 style="color: var(--primary-color); margin-bottom: 10px;">Goal & Progress</h3>
                <p>Goal Amount: <strong>$${event.goal_amount}</strong></p>
                <p>Raised Amount: <strong>$${event.raised_amount}</strong> (${progress}%)</p>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%;"></div>
                </div>
                
                <button id="register-btn" class="btn" style="margin-top: 20px;">Register Now &rarr;</button>
            `;

            document.getElementById('register-btn').addEventListener('click', () => {
                document.getElementById('register-modal').style.display = 'block';
            });
        })
        .catch(err => {
            container.innerHTML = `<p class="error-msg">Failed to load details: ${err.message}</p>`;
        });
});