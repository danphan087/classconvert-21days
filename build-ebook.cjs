const fs = require('fs');
const path = require('path');

const draftDir = path.join(__dirname, 'ebook-draft');
const outputFile = path.join(__dirname, '60-phut-tao-landing-page.html');

const files = [
  'loi-mo-dau.md',
  'chuong-01.md',
  'chuong-02.md',
  'chuong-03.md',
  'chuong-04.md',
  'chuong-05.md',
  'chuong-06.md',
  'chuong-07.md',
  'chuong-08.md',
  'chuong-09.md',
  'loi-ket.md'
];

const icons = [
    // Lời mở đầu - Wave/Hand
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>`,
    // Chương 1 - Target/Rocket
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    // Chương 2 - Layout/Structure
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>`,
    // Chương 3 - Diamond/Unique
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>`,
    // Chương 4 - Heart/Empathy
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`,
    // Chương 5 - Camera/Image
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
    // Chương 6 - Clock/Time
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    // Chương 7 - Robot/Automation
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    // Chương 8 - Megaphone/Traffic
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>`,
    // Chương 9 - Shield/Alert
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
    // Lời kết - Check/Flag
    `<svg class="w-16 h-16 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
];

let tocHtml = '<ul class="space-y-4">\n';
let contentHtml = '';

files.forEach((file, index) => {
  const filePath = path.join(draftDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let md = fs.readFileSync(filePath, 'utf-8');
  
  const titleMatch = md.match(/^# (.*)$/m);
  const title = titleMatch ? titleMatch[1] : `Chương ${index}`;
  const sectionId = `section-${index}`;
  
  tocHtml += `
    <li class="flex items-center gap-4">
        <div class="text-2xl font-black text-indigo-200 w-12 text-right">${index < 10 ? '0'+index : index}</div>
        <a href="#${sectionId}" class="text-xl font-bold text-slate-700 hover:text-indigo-600 transition-colors">${title}</a>
    </li>\n`;
  
  // Basic Markdown to HTML
  let html = md
    .replace(/^# (.*$)/gim, `${icons[index]}\n<h1 id="${sectionId}" class="text-3xl md:text-4xl font-black text-indigo-900 mb-8 border-b-4 border-indigo-100 pb-4 inline-block block">$1</h1>`)
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-indigo-800 mt-10 mb-4">$1</h3>')
    .replace(/^> (.*$)/gim, '<div class="quote my-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl"><p class="text-lg italic text-indigo-900 m-0">$1</p></div>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^---$/gim, '') // Remove standard hr, we'll style Key Takeaway separately
    .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>');

  // Wrap lists
  html = html.replace(/(<li class="mb-2">.*<\/li>\n)+/g, '<ul class="list-disc pl-6 mb-6 text-slate-600 text-lg leading-relaxed">$&</ul>');

  // Handle Key Takeaways
  html = html.replace(/<ul class="list-disc pl-6 mb-6 text-slate-600 text-lg leading-relaxed">\n<li class="mb-2">Key Takeaway:<\/li>\n(<li class="mb-2">.*<\/li>\n)+<\/ul>/g, (match) => {
      const items = match.match(/<li class="mb-2">(?!Key Takeaway).*<\/li>/g).join('\n');
      return `<div class="mt-12 mb-8 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-8 h-1 bg-indigo-600"></div>
                    <h3 class="uppercase font-bold tracking-widest text-indigo-600 m-0 text-xl">Key Takeaway</h3>
                </div>
                <ul class="list-disc pl-6 text-slate-700 text-lg space-y-2 font-medium">${items}</ul>
              </div>`;
  });
  
  // Handle paragraphs
  const lines = html.split('\n');
  let finalHtml = '';
  
  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed) {
       continue; // skip empty lines to avoid empty p tags
    }
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('</ul')) {
      finalHtml += line + '\n';
    } else {
      finalHtml += `<p class="text-lg leading-relaxed text-slate-600 mb-6">${line}</p>\n`;
    }
  }

  const pageBreakClass = index > 0 ? 'page-break' : '';
  contentHtml += `<div class="${pageBreakClass} max-w-4xl mx-auto py-12 md:py-20">\n${finalHtml}\n</div>\n`;
});

tocHtml += '</ul>';

const template = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>60 Phút Tạo Landing Page Tuyển Sinh</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Manrope', sans-serif; 
            background: #fff; 
            color: #1e293b; 
        }
        .gradient-bg { 
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
        }
        @media print {
            .no-print { display: none; }
            body { padding: 0; margin: 0; }
            .page-break { page-break-before: always; }
            .gradient-bg {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .bg-slate-50, .bg-indigo-50, .border-indigo-100, .border-indigo-500, .border-slate-200 {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        @page {
            size: A4;
            margin: 20mm 15mm;
            @bottom-center {
                content: "Trang " counter(page);
                font-family: 'Manrope', sans-serif;
                font-size: 10pt;
                color: #64748b;
            }
            @top-center {
                content: "60 Phút Tạo Landing Page Tuyển Sinh";
                font-family: 'Manrope', sans-serif;
                font-size: 9pt;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
        }
    </style>
</head>
<body class="p-4 md:p-8 lg:p-16">

    <!-- Trang Bìa -->
    <div class="max-w-4xl mx-auto h-[1000px] flex flex-col items-center justify-center text-center border-[16px] md:border-[24px] border-indigo-50 rounded-[40px] gradient-bg text-white relative overflow-hidden page-break-after">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
        
        <div class="z-10 px-8 md:px-16 w-full">
            <h2 class="text-xl md:text-2xl font-bold opacity-80 mb-6 tracking-widest uppercase letter-spacing-2">Bí quyết chuyển hóa học viên</h2>
            <h1 class="text-6xl md:text-8xl font-black mb-8 leading-[1.1] uppercase tracking-tight">60 Phút Tạo<br><span class="text-indigo-200">Landing Page</span><br>Tuyển Sinh</h1>
            
            <div class="w-32 h-2 bg-indigo-200 mx-auto rounded-full mb-12 opacity-80"></div>
            
            <p class="text-2xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">Hướng dẫn thực chiến dành cho giáo viên mở lớp online không cần rành kỹ thuật.</p>
        </div>
        
        <div class="absolute bottom-16 w-full px-16 flex justify-between items-end">
            <div class="text-left">
                <p class="text-lg font-bold opacity-90 uppercase tracking-wider mb-1">Tác giả</p>
                <p class="text-2xl font-black">Long Phan</p>
            </div>
            <div class="text-right">
                <p class="text-lg font-bold opacity-90 uppercase tracking-wider mb-1">Xuất bản</p>
                <p class="text-xl font-bold">2026</p>
            </div>
        </div>
    </div>

    <div class="page-break"></div>

    <!-- Table of Contents -->
    <div class="max-w-4xl mx-auto py-20 page-break-after">
        <div class="flex items-center gap-4 mb-16">
            <div class="w-16 h-2 bg-indigo-600 rounded-full"></div>
            <p class="text-4xl font-black text-indigo-900 uppercase tracking-widest m-0">Mục Lục</p>
        </div>
        <div class="bg-slate-50 p-10 rounded-3xl border border-slate-100">
            ${tocHtml}
        </div>
    </div>

    <div class="page-break"></div>

    <!-- Content -->
    ${contentHtml}

    <!-- Chữ ký / Back Cover -->
    <div class="page-break max-w-4xl mx-auto py-32">
        <div class="text-center p-16 bg-gradient-to-br from-indigo-50 to-white rounded-[40px] border-4 border-indigo-100 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-200 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <div class="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto mb-8 flex items-center justify-center transform rotate-12 shadow-lg shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white transform -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            
            <h2 class="text-4xl font-black text-indigo-900 mb-6">Sẵn sàng tuyển sinh tự động?</h2>
            <p class="text-xl text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">Hãy áp dụng ngay những kiến thức trong cuốn ebook này. Nếu thầy cô cần hỗ trợ thêm về hệ thống công nghệ, hãy kết nối với chúng tôi.</p>
            
            <div class="inline-block bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Trang web hỗ trợ</p>
                <p class="text-3xl font-black text-indigo-600">classconvert.vn</p>
            </div>
        </div>
    </div>

</body>
</html>`;

fs.writeFileSync(outputFile, template);
console.log('Ebook HTML generated successfully with Tailwind design at ' + outputFile);
