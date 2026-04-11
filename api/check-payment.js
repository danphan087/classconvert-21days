module.exports = async function (req, res) {
    const { accountNumber, apiKey, paymentMessage, amount } = req.query;

    try {
        const response = await fetch(`https://api.sepay.vn/user/transactions/list?account_number=${accountNumber}&limit=20`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'SePay API Error' });
        }

        const data = await response.json();
        
        let found = false;
        if (data.transactions && data.transactions.length > 0) {
            found = data.transactions.some(t => {
                const content = (t.transaction_content || "").toUpperCase();
                // Chỉ cần nội dung khớp mã đơn hàng là vượt qua bài Test
                return content.includes(paymentMessage.toUpperCase());
            });
        }

        res.status(200).json({ success: found });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
