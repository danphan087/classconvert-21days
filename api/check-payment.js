export default async function handler(req, res) {
    try {
        const { accountNumber, apiKey, paymentMessage } = req.query;

        if (!apiKey || !paymentMessage) {
            return res.status(200).json({ success: false, error: 'Thiếu cấu hình hoặc mã thanh toán' });
        }

        const resp = await fetch(`https://my.sepay.vn/user/transactions/list?account_number=${accountNumber}&limit=20`, {
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
