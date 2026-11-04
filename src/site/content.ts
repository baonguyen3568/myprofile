export type Lang = 'en' | 'vi';

export interface Entry {
  when: string;
  title: string;
  org: string;
  href?: string;
  desc: string;
  tags: string[];
}

export interface ProjectEntry {
  title: string;
  href?: string;
  /** Screenshot under public/, or a two-line text tile when there is no screenshot. */
  image?: string;
  tile?: [string, string];
  desc: string;
  metrics: string[];
  tags: string[];
}

export interface Talk {
  when: string;
  title: string;
  org: string;
}

export interface Copy {
  role: string;
  tagline: string;
  status: string;
  nav: { about: string; experience: string; projects: string; talks: string };
  copy: string;
  copied: string;
  theme: string;
  resume: string;
  resumeHref: string;
  archive: string;
  about: string[];
  experience: Entry[];
  projects: ProjectEntry[];
  talks: Talk[];
  footer: [string, string, string];
}

export const links = {
  email: 'ngbao3558@gmail.com',
  phone: '+84 326 032 296',
  phoneRaw: '+84326032296',
  github: 'https://github.com/baonguyen3568',
  repos: 'https://github.com/baonguyen3568?tab=repositories',
  ntcsale: 'https://saleai.ntc.ai.vn',
  vision: 'https://vision.ntc.ai.vn',
  labs: 'https://labs.ntc.ai.vn',
  inspiration: 'https://brittanychiang.com'
};

const en: Copy = {
  role: 'AI Engineer',
  tagline: 'I build AI agents and computer vision systems that companies use every day.',
  status: 'Open to new roles · Ho Chi Minh City or remote',
  nav: { about: 'About', experience: 'Experience', projects: 'Projects', talks: 'Talks' },
  copy: 'copy',
  copied: 'copied',
  theme: 'Switch theme',
  resume: 'View full résumé',
  resumeHref: 'assets/cv/Nguyen_Le_Quoc_Bao_AI_Engineer_2026.pdf',
  archive: 'View all repositories on GitHub',
  about: [
    "Hi, I'm Bảo. I'm an AI engineer in Ho Chi Minh City, and I like building things people actually use.",
    "Currently, I'm an AI engineer and product manager at **NTC**, where I lead the backend for **NTCsale**, an AI sales assistant we're piloting with one of our affiliate companies. Before that, I built **NTC VisionID**, a face-recognition attendance system that about 60 people have used to check in every day since April.",
    'A lot of my work sits close to the hardware. I set up our NVIDIA servers, serve the models myself, and take what we build to customer demos and events like AI Day 2026.'
  ],
  experience: [
    {
      when: 'Aug 2026 — Now',
      title: 'Backend Lead',
      org: 'NTCsale',
      href: links.ntcsale,
      desc: 'Lead the backend for a multi-tenant AI sales platform and handle every production release. Built sign-in, the core backend and AI website generation. Shipped 14 releases in 3 weeks.',
      tags: ['FastAPI', 'PostgreSQL', 'Redis', 'vLLM', 'Next.js']
    },
    {
      when: 'Apr 2026 — Now',
      title: 'Sole Engineer',
      org: 'NTC VisionID',
      href: links.vision,
      desc: 'Designed and built the whole system on my own, from the camera pipeline to HR features like shifts, leave, overtime and payroll export. In production since April 2026.',
      tags: ['GStreamer', 'InsightFace', 'Qdrant', 'Vue 3']
    },
    {
      when: 'Sep 2025 — Now',
      title: 'AI Engineer & Product Manager',
      org: 'NTC',
      desc: 'Build AI products for NTC and its affiliate companies. Plan the architecture, split work across a team of up to five, and run proof-of-concepts and pre-sales demos on NVIDIA hardware.',
      tags: ['LLM agents', 'RAG', 'vLLM', 'Docker', 'DGX Spark']
    },
    {
      when: '2021 — 2025',
      title: 'Engineer, Artificial Intelligence',
      org: 'Nguyen Tat Thanh University',
      desc: 'Graduated with a GPA of 3.32/4.00 (Very Good).',
      tags: []
    }
  ],
  projects: [
    {
      title: 'NTCsale',
      href: links.ntcsale,
      tile: ['686', 'PRs merged in ~4 weeks'],
      desc: 'AI sales assistant and storefront builder for multiple businesses. It runs on one tool-calling loop over a self-hosted 27B model. Our team built it alongside 12 coding agents.',
      metrics: ['14 releases in 3 weeks', '844 issues closed'],
      tags: ['FastAPI', 'Tool calling', 'MCP', 'Redis']
    },
    {
      title: 'NTC VisionID',
      href: links.vision,
      image: 'assets/thumbs/visionid.webp',
      desc: 'Face-recognition attendance system running on 9 cameras across two cities. Each camera runs at 15–20 FPS, and alerts go out as web push notifications.',
      metrics: ['9 cameras', '~60 check-ins a day'],
      tags: ['GStreamer', 'SCRFD', 'ArcFace', 'Qdrant', 'PWA']
    },
    {
      title: 'Document Agent RAG',
      href: links.labs,
      image: 'assets/thumbs/doc-agent.webp',
      desc: 'Document Q&A app that installs on DGX Spark with one command. It answers questions about your files and shows the page each answer came from.',
      metrics: ['One-command install', 'Cited answers'],
      tags: ['OpenSearch', 'Reranking', 'OCR', 'DGX Spark']
    },
    {
      title: 'FaceSpeed Studio',
      image: 'assets/thumbs/facespeed.webp',
      desc: 'Voice assistant for PDFs that runs fully offline. Ask a question out loud and a 3D avatar reads back the answer, with the sources on screen.',
      metrics: ['Runs offline', 'Voice in, voice out'],
      tags: ['Docling', 'Qdrant', 'NVIDIA Riva', 'Three.js']
    },
    {
      title: 'NTC Store Retail Agent',
      image: 'assets/thumbs/retail-agent.webp',
      desc: 'Shopping assistant that looks up products, manages the cart and answers warranty and delivery questions. Weak answers get rewritten before the customer sees them.',
      metrics: ['Streamed answers', 'Answer quality check'],
      tags: ['Next.js', 'NestJS', 'Prisma', 'Qdrant']
    },
    {
      title: 'NVIDIA AI fleet',
      tile: ['GB10', 'RTX PRO · Jetson'],
      desc: 'The NVIDIA machines behind our products and customer trials, including DGX Spark, RTX PRO servers and Jetson edge devices. I set them up from a bare OS and serve LLMs with vLLM.',
      metrics: ['DGX Spark', 'RTX PRO 5000 / 2000', 'Jetson'],
      tags: ['vLLM', 'CUDA', 'Docker']
    }
  ],
  talks: [
    { when: '2026', title: 'Edge AI cameras on Jetson', org: 'DCCI Summit 2026 · Viettel IDC' },
    { when: '2026', title: 'Agent runtimes and agentic coding', org: 'AI Day 2026 · Hanoi' },
    { when: '2026', title: 'RAG assistant for banking', org: 'TD SYNNEX partner event' },
    { when: '2026', title: 'NVIDIA Vera Rubin at OCP 2026', org: 'Article' }
  ],
  footer: ['Layout inspired by ', "Brittany Chiang's portfolio", '. Built with React and Vite, set in Manrope and JetBrains Mono.']
};

const vi: Copy = {
  role: 'Kỹ sư AI',
  tagline: 'Tôi làm AI agent và hệ thống thị giác máy tính mà doanh nghiệp dùng hằng ngày.',
  status: 'Đang tìm cơ hội mới · TP.HCM hoặc remote',
  nav: { about: 'Giới thiệu', experience: 'Kinh nghiệm', projects: 'Dự án', talks: 'Sự kiện' },
  copy: 'chép',
  copied: 'đã chép',
  theme: 'Đổi giao diện sáng tối',
  resume: 'Xem CV đầy đủ',
  resumeHref: 'assets/cv/Nguyen_Le_Quoc_Bao_Ky_su_AI_2026.pdf',
  archive: 'Xem toàn bộ repo trên GitHub',
  about: [
    'Chào bạn, tôi là Bảo, kỹ sư AI ở TP.HCM. Tôi thích làm ra những sản phẩm có người dùng thật.',
    'Hiện tôi là kỹ sư AI kiêm product manager ở **NTC**. Tôi lead backend cho **NTCsale**, trợ lý bán hàng AI đang chạy thử ở một công ty thành viên. Trước đó tôi tự làm **NTC VisionID**, hệ thống chấm công bằng khuôn mặt. Từ tháng 4 đến giờ, mỗi ngày có khoảng 60 người chấm công bằng nó.',
    'Phần lớn công việc của tôi gắn với phần cứng. Tôi tự dựng server NVIDIA, tự chạy model, rồi mang sản phẩm đi demo cho khách và tại các sự kiện như AI Day 2026.'
  ],
  experience: [
    {
      ...en.experience[0],
      when: '08/2026 — Nay',
      title: 'Lead Backend',
      desc: 'Lead backend cho nền tảng bán hàng AI dùng chung cho nhiều doanh nghiệp, tự release mọi phiên bản production. Làm phần đăng nhập, backend lõi và tính năng AI tạo website. Ra 14 bản trong 3 tuần.'
    },
    {
      ...en.experience[1],
      when: '04/2026 — Nay',
      title: 'Kỹ sư phụ trách chính',
      desc: 'Một mình thiết kế và làm toàn bộ hệ thống, từ pipeline camera đến phần nhân sự như ca làm, nghỉ phép, tăng ca và xuất bảng lương. Chạy production từ tháng 4/2026.'
    },
    {
      ...en.experience[2],
      when: '09/2025 — Nay',
      title: 'Kỹ sư AI & Product Manager',
      desc: 'Làm sản phẩm AI cho NTC và các công ty thành viên. Lên kiến trúc, chia việc cho team tối đa 5 người, làm PoC và demo pre-sales trên phần cứng NVIDIA.'
    },
    {
      ...en.experience[3],
      title: 'Kỹ sư Trí tuệ nhân tạo',
      org: 'Đại học Nguyễn Tất Thành',
      desc: 'Tốt nghiệp loại Giỏi, GPA 3.32/4.00.'
    }
  ],
  projects: [
    {
      ...en.projects[0],
      tile: ['686', 'PR được merge trong ~4 tuần'],
      desc: 'Trợ lý bán hàng AI và công cụ tạo website bán hàng cho nhiều doanh nghiệp. Chạy bằng một vòng tool-calling trên model 27B tự host. Team làm cùng 12 coding agent.',
      metrics: ['14 bản trong 3 tuần', '844 issue đã đóng']
    },
    {
      ...en.projects[1],
      desc: 'Hệ thống chấm công bằng khuôn mặt chạy trên 9 camera ở hai thành phố. Mỗi camera chạy 15–20 FPS, cảnh báo gửi qua thông báo trên web.',
      metrics: ['9 camera', '~60 lượt chấm công mỗi ngày']
    },
    {
      ...en.projects[2],
      desc: 'Ứng dụng hỏi đáp tài liệu, cài lên DGX Spark chỉ bằng một lệnh. Trả lời câu hỏi về tài liệu của bạn và chỉ rõ câu trả lời lấy từ trang nào.',
      metrics: ['Cài bằng một lệnh', 'Có trích nguồn']
    },
    {
      ...en.projects[3],
      desc: 'Trợ lý giọng nói cho file PDF, chạy hoàn toàn offline. Bạn hỏi bằng giọng nói, avatar 3D đọc câu trả lời và hiện nguồn trên màn hình.',
      metrics: ['Chạy offline', 'Hỏi và đáp bằng giọng nói']
    },
    {
      ...en.projects[4],
      desc: 'Trợ lý mua sắm biết tra sản phẩm, quản lý giỏ hàng và trả lời câu hỏi về bảo hành, giao hàng. Câu trả lời chưa tốt sẽ được viết lại trước khi đến tay khách.',
      metrics: ['Trả lời dạng stream', 'Tự kiểm tra câu trả lời']
    },
    {
      ...en.projects[5],
      title: 'Dàn máy NVIDIA',
      desc: 'Dàn máy NVIDIA đứng sau các sản phẩm và PoC của công ty, gồm DGX Spark, server RTX PRO và thiết bị Jetson. Tôi tự cài từ hệ điều hành trắng và chạy LLM bằng vLLM.'
    }
  ],
  talks: [
    { when: '2026', title: 'Camera AI trên Jetson', org: 'DCCI Summit 2026 · Viettel IDC' },
    { when: '2026', title: 'Agent runtime và agentic coding', org: 'AI Day 2026 · Hà Nội' },
    { when: '2026', title: 'Trợ lý RAG cho ngân hàng', org: 'Sự kiện đối tác TD SYNNEX' },
    { when: '2026', title: 'NVIDIA Vera Rubin tại OCP 2026', org: 'Bài viết' }
  ],
  footer: ['Bố cục lấy cảm hứng từ ', 'portfolio của Brittany Chiang', '. Làm bằng React và Vite, font Manrope và JetBrains Mono.']
};

export const content: Record<Lang, Copy> = { en, vi };
