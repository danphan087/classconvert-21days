import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        // Trỏ đến file HTML trong thư mục dự án
        const filePath = path.join(process.cwd(), '60-phut-tao-landing-page.html');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Không tìm thấy file sản phẩm.");
        }

        const stat = fs.statSync(filePath);

        // Cấu hình header ép trình duyệt phải TẢI XUỐNG thay vì mở trong tab mới
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': stat.size,
            'Content-Disposition': 'attachment; filename="60-phut-tao-landing-page.html"'
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } catch (error) {
        console.error("Lỗi tải file:", error);
        res.status(500).send("Lỗi server, không thể tải file.");
    }
}
