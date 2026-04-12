import fs from 'fs';
import path from 'path';

const emails = {
    welcome: {
        subject: "Chào mừng bạn đến với thế giới 'Tuyển sinh Không người lái' 🚀",
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>Chào bạn,</h2>
                <p>Long đây. Rất vui vì bạn đã quyết định điền tên vào danh sách chờ sở hữu bộ <strong>14-Day Checklist: Tuyển sinh Tự động</strong>.</p>
                <p>Tại sao bạn nên chờ đón bộ tài liệu này? Vì đơn giản là Long không muốn bạn phải ngồi tư vấn từng người, gửi từng số tài khoản hay hì hụi gửi link học cho từng học viên nữa.</p>
                <p>Trong vài ngày tới, Long sẽ gửi cho bạn những "mảnh ghép" quan trọng nhất để xây dựng một cỗ máy bán hàng thực thụ. Hãy giữ hộp thư sạch sẽ để không bỏ lỡ nhé.</p>
                <p>Sẵn sàng chưa? Chúng ta bắt đầu thôi!</p>
                <p>-- Long từ ClassConvert</p>
            </div>
        `
    },
    nurture: {
        subject: "Đừng để website của bạn chỉ là một 'tờ rơi điện tử' 📄",
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>Chào bạn,</h2>
                <p>Có một sự thật "đau lòng" trong ngành EdTech: 90% website của các thầy cô hiện nay chỉ là cái hồ sơ giới thiệu, khách vào xem rồi đi chứ không để lại gì.</p>
                <p><strong>Sự khác biệt của một hệ thống Tự động hóa nằm ở đâu?</strong></p>
                <p>Đó chính là khả năng <strong>tương tác ngược</strong>. Một hệ thống chuẩn phải biết:</p>
                <ol>
                    <li>Nhận diện khách hàng ngay khi họ có ý định.</li>
                    <li>Tự động chăm sóc khi thầy cô đang ngủ.</li>
                    <li>Tự động thu tiền và bàn giao sản phẩm mà không cần "nhắc nợ".</li>
                </ol>
                <p>Insight nhỏ cho ngày hôm nay: Hãy bớt tập trung vào việc làm website cho đẹp, hãy tập trung vào việc làm cho nó <strong>biết ra đơn</strong>.</p>
                <p>Ngày mai, Long sẽ chỉ cho bạn cách hiện thực hóa điều này chỉ trong 14 ngày.</p>
                <p>-- Long ClassConvert</p>
            </div>
        `
    },
    sales: {
        subject: "5.000đ để sở hữu 'Cỗ máy Tuyển sinh' – Bạn có sẵn sàng? 💎",
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>Chào bạn,</h2>
                <p>Nếu bạn đã đọc 2 email trước, bạn hiểu rằng việc sở hữu một hệ thống tự động không còn là "lựa chọn" mà là "bắt buộc" nếu muốn bứt phá quy mô.</p>
                <p>Hôm nay, Long chính thức mở cổng cho bạn sở hữu: <strong>14-Day Checklist: Xây dựng Hệ thống Tuyển sinh Tự động</strong>.</p>
                <p><strong>Bạn sẽ nhận được gì?</strong></p>
                <ul>
                    <li>Lộ trình 14 ngày từ con số 0 đến khi có hệ thống QR thanh toán tự động.</li>
                    <li>Cách kết nối CRM để quản lý khách hàng tập trung.</li>
                    <li>Chiến thuật viết email chạm đúng nỗi đau khách hàng.</li>
                </ul>
                <p>Tất cả chỉ với chi phí trải nghiệm: <strong>5.000đ</strong> (chỉ bằng một cốc nước lọc, nhưng giá trị là cả một hệ thống vận hành trơn tru).</p>
                <p><a href="https://alpha.classconvert.vn/thanhtoan" style="padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">SỞ HỮU NGAY TẠI ĐÂY</a></p>
                <p>Hẹn gặp bạn bên trong hệ thống!</p>
                <p>-- Long ClassConvert</p>
            </div>
        `
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { email } = req.body;
        const isTest = email.includes('+test');
        
        // Cắt bỏ phần +test để lách luật khắt khe của Resend Sandbox Mode
        // (Resend chỉ cho gửi tới đúng email đã đăng ký, thêm +test nó cũng chặn)
        const recipientEmail = isTest ? email.replace('+test', '') : email;

        const configPath = path.join(process.cwd(), 'resend_config.txt');
        const apiKey = fs.readFileSync(configPath, 'utf8').trim();

        const sendEmail = async (template) => {
            const resp = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'ClassConvert <onboarding@resend.dev>',
                    to: [recipientEmail],
                    subject: template.subject,
                    html: template.html
                })
            });
            const data = await resp.json();
            if (!resp.ok) {
                console.error("Lỗi từ Resend:", data);
            }
            return { status: resp.status, data };
        };

        if (isTest) {
            console.log("Kích hoạt chế độ TEST cho:", recipientEmail);
            const r1 = await sendEmail(emails.welcome);
            const r2 = await sendEmail(emails.nurture);
            const r3 = await sendEmail(emails.sales);
            return res.status(200).json({ success: true, mode: 'test', results: [r1.status, r2.status, r3.status] });
        } else {
            console.log("Gửi Email Welcome cho:", email);
            const r1 = await sendEmail(emails.welcome);
            return res.status(200).json({ success: true, mode: 'production', result: r1.status });
        }
    } catch (error) {
        console.error("Lỗi Automation:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
