const express = require('express');
const cors = require('cors');
const db = require('./event_db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. 获取首页活动列表 (只显示 is_active = TRUE 且活动日期 >= 今天)
app.get('/api/events', async (req, res) => {
    try {
        const query = `
            SELECT e.event_id, e.title, e.event_date, e.location, e.price, c.category_name 
            FROM events e
            JOIN categories c ON e.category_id = c.category_id
            WHERE e.is_active = TRUE AND e.event_date >= CURDATE()
            ORDER BY e.event_date ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 获取所有活动类别 (用于搜索页下拉菜单)
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 搜索活动 (支持日期、地点、类别组合筛选)
app.get('/api/events/search', async (req, res) => {
    const { date, location, category } = req.query;
    let query = `
        SELECT e.event_id, e.title, e.event_date, e.location, e.price, c.category_name 
        FROM events e
        JOIN categories c ON e.category_id = c.category_id
        WHERE e.is_active = TRUE
    `;
    let params = [];

    if (date) {
        query += ' AND DATE(e.event_date) = ?';
        params.push(date);
    }
    if (location) {
        query += ' AND e.location LIKE ?';
        params.push(`%${location}%`);
    }
    if (category) {
        query += ' AND c.category_id = ?';
        params.push(category);
    }
    query += ' ORDER BY e.event_date ASC';

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. 获取单个活动详情
app.get('/api/events/:id', async (req, res) => {
    try {
        const query = `
            SELECT e.*, c.category_name, o.name AS org_name, o.mission, o.contact_email
            FROM events e
            JOIN categories c ON e.category_id = c.category_id
            JOIN organizations o ON e.org_id = o.org_id
            WHERE e.event_id = ?
        `;
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));