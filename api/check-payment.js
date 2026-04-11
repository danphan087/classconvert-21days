const https = require('https');

module.exports = function (req, res) {
    const accountNumber = req.query.accountNumber || '';
    const apiKey = req.query.apiKey || '';
    const paymentMessage = req.query.paymentMessage || '';

    if (!paymentMessage || !apiKey) {
        return res.status(200).json({ success: false, error: 'Thiếu thông tin' });
    }

    const options = {
        hostname: 'api.sepay.vn',
        port: 443,
        path: `/user/transactions/list?account_number=${accountNumber}&limit=20`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    };

    const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
            try {
                const data = JSON.parse(body);
                let found = false;
                if (data.transactions && data.transactions.length > 0) {
                    found = data.transactions.some(t => {
                        const content = (t.transaction_content || "").toUpperCase();
                        return content.includes(paymentMessage.toUpperCase());
                    });
                }
                res.status(200).json({ success: found });
            } catch (e) {
                res.status(500).json({ error: 'Lỗi đọc dữ liệu SePay', details: e.message });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ', details: e.message });
    });

    request.end();
};
