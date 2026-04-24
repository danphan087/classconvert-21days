export default async function handler(req, res) {
    try {
        const { accountNumber, paymentMessage } = req.query;

        // Đọc API Key từ biến môi trường, không nhận từ client
        const apiKey = process.env.SEPAY_API_KEY;
        const sepayAccount = accountNumber || process.env.SEPAY_ACCOUNT_NUMBER;

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'SEPAY_API_KEY chưa được cấu hình trong .env' });
        }

        if (!paymentMessage) {
            return res.status(200).json({ success: false, error: 'Thiếu mã thanh toán' });
        }

        const resp = await fetch(`https://my.sepay.vn/userapi/transactions/list?account_number=${sepayAccount}&limit=20`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await resp.json();
        
        let found = false;
        if (data.transactions) {
            found = data.transactions.some(t => {
                const content = (t.transaction_content || "").toUpperCase();
                return content.includes(paymentMessage.toUpperCase());
            });
        }
        res.status(200).json({ success: found, message: "OK" });
    } catch(e) {
        res.status(500).json({ success: false, error: e.message });
    }
}
