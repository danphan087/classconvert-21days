// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
            },
            colors: {
                primary: '#6366F1', 
                secondary: '#22D3EE',
            },
            animation: {
                glow: 'glow 2s infinite ease-in-out',
            },
            keyframes: {
                glow: {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)', transform: 'scale(1)' },
                    '50%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4), 0 0 10px rgba(255, 255, 255, 0.5)', transform: 'scale(1.02)' },
                }
            }
        }
    }
}

// Logic & Interactions
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('touchstart', function() {}, {passive: true});

    let currentTestimonial = 0;
    const track = document.getElementById('testimonial-track');
    const dots = document.getElementById('testimonial-dots');
    const totalTestimonials = 3;

    function setTestimonial(index) {
        currentTestimonial = index;
        updateCarousel();
    }

    // Expose setTestimonial to global window for onclick attributes
    window.setTestimonial = setTestimonial;

    function updateCarousel() {
        if(!track || !dots) return; 
        const percentage = currentTestimonial * -100;
        track.style.transform = `translateX(${percentage}%)`;
        
        const dotElements = dots.children;
        for (let i = 0; i < dotElements.length; i++) {
            if (i === currentTestimonial) {
                dotElements[i].classList.remove('bg-slate-300', 'w-2');
                dotElements[i].classList.add('bg-primary', 'w-6');
            } else {
                dotElements[i].classList.add('bg-slate-300', 'w-2');
                dotElements[i].classList.remove('bg-primary', 'w-6');
            }
        }
    }

    if(track) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            updateCarousel();
        }, 5000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Script Tự động cập nhật ngày giờ VN
    const dateElement = document.getElementById("auto-date");
    if (dateElement) {
        const options = { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' };
        const today = new Date().toLocaleDateString('vi-VN', options);
        dateElement.textContent = today;
    }
});

// Chatbot Logic
const faqData = [
    { q: "Có follower tự nhiên làm được không?", keywords: ["follower", "tự nhiên", "facebook", "tiktok", "quảng cáo", "qc"], a: "Hoàn toàn được thầy cô nhé! Hệ thống ClassConvert giúp thầy cô tận dụng tối đa lượng traffic tự nhiên hiện có để chuyển đổi họ thành học viên trả phí hiệu quả hơn." },
    { q: "Không rành kỹ thuật vận hành nổi không?", keywords: ["kỹ thuật", "công nghệ", "phức tạp", "khó", "setup"], a: "Thầy cô yên tâm, phần khó nhất là setup hệ thống thì tôi và đội ngũ đã làm hết trong 14 ngày rồi. Thầy cô chỉ cần thao tác 'cắm và chạy' thôi ạ." },
    { q: "Tại sao nên chọn ClassConvert?", keywords: ["tại sao", "khác biệt", "ưu điểm", "lợi ích"], a: "Tôi kết hợp 8 năm làm Marketing và 5 năm thực chiến ngành giáo dục để xây dựng cho thầy cô một 'cỗ máy' biết tự lọc khách và chốt đơn." },
    { q: "Dịch vụ giá bao nhiêu?", keywords: ["giá", "bao nhiêu", "tiền", "phí", "đắt", "học phí", "đầu tư"], a: "Về chi phí, thay vì nhìn vào con số, thầy cô hãy nhìn vào kết quả. Nếu hệ thống giúp thầy cô tăng thêm 5-10 học viên/tháng và tiết kiệm 80% thời gian tư vấn, thì đây là khoản đầu tư cực kỳ xứng đáng. Để có báo giá chính xác theo quy mô của thầy cô, tôi nên trao đổi với thầy cô trong 15 phút ạ." },
    { q: "Có phù hợp với môn của tôi không?", keywords: ["phù hợp", "đặc thù", "môn dạy", "áp dụng", "dành cho ai", "đúng không", "có dùng được"], a: "Hệ thống cực kỳ phù hợp nếu thầy cô dạy online lớp nhóm, coaching 1-1 hoặc bán khóa học Elearning. Chỉ cần thầy cô sẵn sàng thay đổi để tuyển sinh nhiều hơn, ClassConvert sẽ giúp được thầy cô ạ." },
    { q: "Để thầy cô nghĩ thêm đã...", keywords: ["nghĩ thêm", "suy nghĩ", "cân nhắc", "xem lại", "từ từ", "chưa vội", "để sau"], a: "Dạ vâng, thầy cô cứ cân nhắc kỹ ạ. Tuy nhiên, nếu thầy cô còn băn khoăn điểm nào hoặc muốn xem Demo trực tiếp cho môn của mình thì cứ đặt lịch 15 phút trao đổi miễn phí với tôi nhé, sẽ rõ ràng hơn rất nhiều ạ!" },
    { q: "Bao lâu thì hệ thống chạy được?", keywords: ["bao lâu", "thời gian", "mấy ngày", "nhanh không"], a: "Đúng 14 ngày thầy cô nhé! Quy trình đã được tối ưu hóa để thầy cô bắt đầu đón khách ngay sau 2 tuần." },
    { q: "Quay video có cần chuyên nghiệp?", keywords: ["video", "quay", "clip", "nói"], a: "Không cần đâu ạ! Video chân thực bằng điện thoại đôi khi còn hiệu quả hơn quay dựng cầu kỳ nếu nội dung đánh đúng nỗi đau khách hàng." },
    { q: "Lọc khách rác thế nào?", keywords: ["khách rác", "lọc", "phễu", "chất lượng"], a: "Chúng ta có phễu lọc qua buổi Masterclass và khảo sát đầu vào. Hệ thống sẽ tự loại những người không phù hợp ngay từ đầu." },
    { q: "Tham vấn 15 phút làm gì?", keywords: ["15 phút", "tham vấn", "gọi", "nói chuyện"], a: "Cuộc gọi này để tôi Demo trực tiếp cách cỗ máy ClassConvert áp dụng vào đúng trường hợp của thầy cô trước khi thầy cô quyết định." }
];

function toggleChat() {
    const chatWin = document.getElementById('chat-window');
    chatWin.classList.toggle('active');
    chatWin.classList.toggle('hidden');
    
    const msgBox = document.getElementById('chat-messages');
    if (msgBox.children.length === 0) {
        setTimeout(() => {
            appendMessage("bot", "Chào thầy cô! Rất vui vì thầy cô đã quan tâm đến ClassConvert. Thầy cô đang muốn tìm cách để lớp học luôn đầy chỗ mà không cần phải tư vấn 1-1 mệt mỏi đúng không?");
        }, 500);
    }
}

function appendMessage(sender, text) {
    const msgBox = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = sender === "bot" ? "bot-msg" : "user-msg";
    div.innerText = text;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
}

function handleFAQ(index) {
    const faq = faqData[index];
    appendMessage("user", faq.q);
    
    // Hide suggestions after first interaction
    document.getElementById('chat-suggestions').classList.add('hidden');
    
    setTimeout(() => {
        appendMessage("bot", faq.a);
    }, 600);
}

function handleUserInput() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim().toLowerCase();
    if (!text) return;

    appendMessage("user", input.value);
    input.value = "";
    
    // Hide suggestions after first interaction
    document.getElementById('chat-suggestions').classList.add('hidden');

    setTimeout(() => {
        // Simple keywords matching
        let answer = "Câu hỏi này rất hay, nhưng để trả lời chính xác nhất cho trường hợp của thầy cô, có lẽ chúng ta nên trao đổi trực tiếp 15 phút ạ. Thầy cô có thể đặt lịch ngay bên dưới nhé!";
        
        for (let item of faqData) {
            if (item.keywords.some(k => text.includes(k))) {
                answer = item.a;
                break;
            }
        }
        
        appendMessage("bot", answer);
    }, 800);
}

// Support Enter key
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });
    }

    const faqContainer = document.getElementById('faq-buttons');
    if (faqContainer) {
        faqData.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = "faq-btn";
            btn.innerText = item.q;
            btn.onclick = () => handleFAQ(index);
            faqContainer.appendChild(btn);
        });
    }
});

// Supabase Configuration
const SUPABASE_URL = "https://rypaiacnnorwxjaywhcd.supabase.co";
const SUPABASE_KEY = "sb_publishable_ThnqQjrR_ch32dsVyqlBwQ_WQmwv46q";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// SePay Payment Automation Logic
const SEPAY_CONFIG = {
    apiKey: "0NMPWQXMRSLJATN8VYT1E6FDCYELRT72D5SOJZSXQLE69LKCP3JKBMQIHURIH9UW",
    accountNumber: "29947747",
    bank: "ACB",
    amount: 5000
};

let paymentMessage = "";

function initPayment() {
    paymentMessage = "CC21D" + Math.floor(1000 + Math.random() * 9000);
    const msgElement = document.getElementById('sepay-message');
    const qrElement = document.getElementById('sepay-qr');
    
    if (msgElement) msgElement.innerText = paymentMessage;
    
    if (qrElement) {
        qrElement.src = `https://qr.sepay.vn/img?acc=${SEPAY_CONFIG.accountNumber}&bank=${SEPAY_CONFIG.bank}&amount=${SEPAY_CONFIG.amount}&des=${paymentMessage}&template=compact`;
    }

    const checkInterval = setInterval(async () => {
        paymentCheckInterval = checkInterval;
        const isPaid = await checkPaymentStatus();
        if (isPaid) {
            clearInterval(checkInterval);
            await handleSuccessfulPayment();
            showPaymentSuccess();
        }
    }, 5000);
}

let pollingAttempts = 0;
async function checkPaymentStatus() {
    pollingAttempts++;
    
    // Tự động vượt lỗi (Bypass) sau 30s NẾU đang ở chế độ TEST (+test)
    if (pollingAttempts >= 6 && currentCustomerInfo?.email?.includes('+test')) {
        console.log("Chế độ TEST: Tự động ghi nhận thành công sau 30s...");
        return true;
    }

    if (pollingAttempts > 120) { // Timeout sau 10 phút
        console.error("Hết thời gian chờ thanh toán.");
        return false;
    }

    try {
        const url = `/api/check-payment?accountNumber=${SEPAY_CONFIG.accountNumber}&apiKey=${SEPAY_CONFIG.apiKey}&paymentMessage=${paymentMessage}`;
        const response = await fetch(url);
        
        const data = await response.json();
        
        if (data.success) {
            return true;
        }
    } catch (e) { 
        console.error("Lỗi kết nối Trạm trung chuyển:", e); 
    }
    return false;
}

async function handleSuccessfulPayment() {
    // Tự động lưu khách hàng và đơn hàng vào Supabase khi thanh toán thành công
    try {
        let customerName = "Khách hàng (" + paymentMessage + ")";
        let customerPhone = paymentMessage;
        let customerEmail = "";
        
        // Sử dụng thông tin từ form nếu có
        if (typeof currentCustomerInfo !== 'undefined' && currentCustomerInfo) {
            customerName = currentCustomerInfo.name;
            customerPhone = currentCustomerInfo.phone;
            customerEmail = currentCustomerInfo.email || "";
        }

        let customerData = { name: customerName, phone: customerPhone };
        if (customerEmail) customerData.email = customerEmail;
        
        // 2. Thêm vào bảng customers
        const { data: customer, error: cError } = await _supabase
            .from('customers')
            .insert([customerData])
            .select();

        if (customer) {
            // 3. Tạo đơn hàng (Sản phẩm ID 1 mặc định)
            await _supabase.from('orders').insert([{
                customer_id: customer[0].id,
                product_id: 1,
                amount: 5000,
                status: 'completed'
            }]);
            
            // Gửi Email xác nhận đơn hàng (Automation)
            if (customerPhone.includes('@') || currentCustomerInfo?.email) {
                const targetEmail = currentCustomerInfo?.email || customerPhone;
                console.log("Đang gửi email xác nhận đơn hàng tới:", targetEmail);
                fetch('/api/automate-emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email: targetEmail, 
                        type: 'order_confirmation',
                        productName: '14-Day Checklist: Tuyển sinh Tự động',
                        amount: '5.000'
                    })
                });
            }

            // 4. Trừ kho sản phẩm 1
            const { data: product } = await _supabase.from('products').select('stock_quantity').eq('id', 1).single();
            if (product) {
                await _supabase.from('products').update({ stock_quantity: product.stock_quantity - 1 }).eq('id', 1);
            }
        }
    } catch (e) { console.error("Lỗi lưu DB:", e); }
}

function showPaymentSuccess() {
    const ui = document.getElementById('payment-ui');
    const success = document.getElementById('payment-success');
    if (ui) ui.classList.add('hidden');
    if (success) success.classList.remove('hidden');
}

let currentCustomerInfo = null;
let paymentCheckInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            currentCustomerInfo = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value
            };

            // Gửi email tự động (Automation)
            if (currentCustomerInfo.email) {
                console.log("Đang kích hoạt chuỗi Email Automation...");
                fetch('/api/automate-emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: currentCustomerInfo.email })
                }).then(r => r.json()).then(data => {
                    if (data.mode === 'test') {
                        alert("Chế độ TEST đã kích hoạt! Hãy kiểm tra hòm thư để nhận ngay 3 email chào mừng, nuôi dưỡng và chốt đơn.");
                    }
                });
            }

            document.getElementById('customer-form-ui').classList.add('hidden');
            document.getElementById('payment-ui').classList.remove('hidden');
            
            initPayment();
        });

        // Nút quay lại
        const backBtn = document.getElementById('back-to-form');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.getElementById('payment-ui').classList.add('hidden');
                document.getElementById('customer-form-ui').classList.remove('hidden');
                if (paymentCheckInterval) {
                   clearInterval(paymentCheckInterval);
                }
            });
        }
    } else if (document.getElementById('sepay-checkout')) {
        // Dự phòng nếu không có form (trang cũ)
        initPayment();
    }
});
