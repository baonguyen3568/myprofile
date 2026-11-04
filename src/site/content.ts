export type Lang = 'en' | 'vi';

export type Category = 'Agents' | 'RAG' | 'Vision' | 'GenMedia' | 'Infra';

export interface Project {
  id: string;
  file: string;
  title: string;
  category: Category;
  year: string;
  role: string;
  summary: string;
  bullets: string[];
  stack: string[];
  image?: string;
  link?: { label: string; href: string };
}

const projectsEn: Project[] = [
  {
    id: 'ntcsale',
    file: 'ntcsale/agent_loop.py',
    title: 'NTCsale',
    category: 'Agents',
    year: '2026',
    role: 'Backend lead & release owner',
    summary: 'Multi-tenant AI sales assistant and storefront platform, in pilot with an affiliated company.',
    bullets: [
      'Led backend in a 5-person team and owned every production release: 14 versions in 3 weeks.',
      'Refactored twice into a modular monolith with ports-and-adapters layering, enforced by an architecture checker.',
      'Replaced a planner–executor design with a single tool-calling loop, tiered memory and structured tool errors.',
      'Designed a 12-agent development workflow: the team merged 686 PRs and closed 844 issues in about four weeks.'
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Redis', 'MinIO', 'Next.js', 'vLLM'],
    link: { label: 'saleai.ntc.ai.vn', href: 'https://saleai.ntc.ai.vn' }
  },
  {
    id: 'visionid',
    file: 'visionid/pipeline.py',
    title: 'NTC VisionID',
    category: 'Vision',
    year: '2026',
    role: 'Sole engineer, design to production',
    summary: 'Real-time face-recognition attendance across 9 RTSP cameras in two cities.',
    bullets: [
      'GStreamer → SCRFD detection → ArcFace embedding → tracking, at 15–20 FPS per camera with 20–30 people in frame.',
      'Runs in production since April 2026: 3 affiliated companies, about 60 employees checked in daily.',
      'Tuned the cosine-similarity threshold from operational feedback and replaced delayed alerts with a web-push PWA.',
      'HR layer on top: shifts, leave, overtime, multi-level approvals, role-based access and payroll export.'
    ],
    stack: ['GStreamer', 'InsightFace', 'Qdrant', 'FastAPI', 'Vue 3', 'RTX PRO'],
    image: 'assets/cases/face-attendance.png',
    link: { label: 'vision.ntc.ai.vn', href: 'https://vision.ntc.ai.vn' }
  },
  {
    id: 'doc-agent-rag',
    file: 'labs/document_agent.py',
    title: 'Document Agent RAG',
    category: 'RAG',
    year: '2026',
    role: 'Built the app, led blueprint packaging',
    summary: 'One-command app that customers install on DGX Spark from the NTC Labs catalogue.',
    bullets: [
      'OCR and vision-model parsing of uploaded documents.',
      'Hybrid lexical + vector retrieval on OpenSearch, then reranking.',
      'A tool-calling agent that answers with file and page citations.',
      'Assigned the team to package NVIDIA blueprints for the same catalogue to support GB10 sales.'
    ],
    stack: ['OpenSearch', 'Agentic RAG', 'Reranking', 'OCR', 'DGX Spark'],
    image: 'assets/cases/enterprise-rag.webp',
    link: { label: 'labs.ntc.ai.vn', href: 'https://labs.ntc.ai.vn' }
  },
  {
    id: 'facespeed',
    file: 'facespeed/leader_agent.py',
    title: 'FaceSpeed Studio',
    category: 'RAG',
    year: '2026',
    role: 'Agentic voice RAG with a 3D avatar',
    summary: 'Local PDF voice-RAG: a leader agent delegates to search agents, answers are spoken by an avatar.',
    bullets: [
      'Search tools: metadata, exact phrase, BM25, dense search with rerank, summaries and graph expansion.',
      'Docling ingestion, PostgreSQL metadata, Qdrant retrieval and vLLM review.',
      'NVIDIA Riva TTS with Three.js avatar playback, while citations stay inspectable on screen.'
    ],
    stack: ['Docling', 'Qdrant', 'vLLM', 'NVIDIA Riva', 'Three.js'],
    image: 'assets/cases/facespeed.png'
  },
  {
    id: 'retail-agent',
    file: 'retail/react_agent.ts',
    title: 'NTC Store Retail Agent',
    category: 'Agents',
    year: '2026',
    role: 'Full-stack ReAct agent',
    summary: 'A retail agent that connects products, cart, policy and conversation through tools.',
    bullets: [
      'ReAct loop, tool registry, contract-validated observations and account-scoped memory.',
      'Qdrant policy retrieval for warranty and delivery questions with streamed answers.',
      'A response quality gate that revises weak answers before they reach the customer.'
    ],
    stack: ['ReAct', 'Next.js', 'NestJS', 'Prisma', 'Qdrant', 'Redis'],
    image: 'assets/cases/retail-agent.jpg'
  },
  {
    id: 'blog2vid',
    file: 'blog2vid/render_graph.py',
    title: 'blog2vid',
    category: 'GenMedia',
    year: '2026',
    role: 'Leading a 7-agent build · in progress',
    summary: 'Fully local article-to-video pipeline on a single DGX Spark.',
    bullets: [
      'Qwen3.8-27B script → Qwen-Image-Edit stills → MiniMax H3 video → VieNeu-TTS voice → ACE-Step music.',
      'Model choice from public benchmarks and licence review: dropped LTX, moved from Wan 2.2 to H3.',
      'OOM guards, a 50% memory cap and a thermal watchdog after hangs at 97 °C.'
    ],
    stack: ['MiniMax H3', 'Qwen-Image-Edit', 'VieNeu-TTS', 'Kafka', 'MongoDB']
  },
  {
    id: 'story-studio',
    file: 'story_studio/pipeline.py',
    title: 'AI Story Studio',
    category: 'GenMedia',
    year: '2026',
    role: 'Local media production pipeline',
    summary: 'From chapter URLs to rewritten text, TTS audio and GPU-rendered video.',
    bullets: [
      'Chapter collection, rewriting, chunking, TTS, audio merge and progress tracking.',
      'Portable Windows packaging, native GPU rendering and long-job streaming.'
    ],
    stack: ['FastAPI', 'TTS', 'GPU rendering', 'Automation'],
    image: 'assets/cases/story-studio.png'
  },
  {
    id: 'infra',
    file: 'infra/fleet.yaml',
    title: 'NVIDIA AI fleet',
    category: 'Infra',
    year: '2025–2026',
    role: 'Bring-up, serving & pre-sales',
    summary: 'A heterogeneous NVIDIA fleet run from bare OS for internal products and customer PoCs.',
    bullets: [
      'DGX Spark (GB10), RTX PRO 5000/2000 Blackwell servers, Jetson edge devices and Xeon VPS.',
      'Local LLM serving with vLLM: Qwen3.8-27B NVFP4 with FP8 KV cache.',
      'Talks and booth demos at DCCI Summit 2026, AI Day 2026 and a TD SYNNEX partner event.'
    ],
    stack: ['vLLM', 'NVFP4', 'CUDA', 'Docker', 'Jetson', 'GB10']
  }
];

const projectsVi: Project[] = [
  {
    ...projectsEn[0],
    role: 'Lead backend, phụ trách release',
    summary: 'Nền tảng trợ lý bán hàng AI và website bán hàng nhiều tenant, đang chạy thử với một công ty thành viên.',
    bullets: [
      'Lead backend trong team 5 người và tự release mọi phiên bản production: 14 bản trong 3 tuần.',
      'Refactor hai lần thành modular monolith theo ports-and-adapters, có công cụ tự kiểm tra kiến trúc.',
      'Thay thiết kế planner–executor bằng một vòng tool-calling duy nhất, memory phân tầng và lỗi tool có cấu trúc.',
      'Thiết kế quy trình 12 agent viết code cho team: 686 PR được merge, 844 issue được đóng trong khoảng bốn tuần.'
    ]
  },
  {
    ...projectsEn[1],
    role: 'Một mình làm từ thiết kế đến production',
    summary: 'Chấm công bằng nhận diện khuôn mặt thời gian thực trên 9 camera RTSP ở hai thành phố.',
    bullets: [
      'GStreamer → phát hiện SCRFD → embedding ArcFace → tracking, đạt 15–20 FPS mỗi camera với 20–30 người trong khung.',
      'Chạy production từ tháng 4/2026 cho 3 công ty thành viên, khoảng 60 nhân viên chấm công mỗi ngày.',
      'Chỉnh ngưỡng cosine similarity theo phản hồi vận hành và thay cảnh báo chậm bằng PWA web push.',
      'Phần nhân sự: ca làm, nghỉ phép, tăng ca, duyệt nhiều cấp, phân quyền và xuất bảng lương.'
    ]
  },
  {
    ...projectsEn[2],
    role: 'Xây ứng dụng, phân công đóng gói blueprint',
    summary: 'Ứng dụng khách hàng tự cài lên DGX Spark bằng một lệnh từ kho NTC Labs.',
    bullets: [
      'Đọc tài liệu bằng OCR và model thị giác.',
      'Tìm kiếm hybrid lexical + vector trên OpenSearch, sau đó rerank.',
      'Agent tool-calling trả lời kèm nguồn file và số trang.',
      'Phân công team đóng gói các blueprint NVIDIA lên cùng kho để hỗ trợ bán GB10.'
    ]
  },
  {
    ...projectsEn[3],
    role: 'Agentic voice RAG với avatar 3D',
    summary: 'Voice RAG trên PDF chạy local: agent điều phối giao việc cho các agent tìm kiếm, avatar đọc câu trả lời.',
    bullets: [
      'Bộ tool tìm kiếm: metadata, cụm từ chính xác, BM25, dense search kèm rerank, tóm tắt và mở rộng theo graph.',
      'Nạp tài liệu bằng Docling, metadata trên PostgreSQL, truy xuất Qdrant và vLLM kiểm tra lại.',
      'NVIDIA Riva TTS phát qua avatar Three.js, nguồn trích dẫn vẫn hiện trên màn hình để kiểm tra.'
    ]
  },
  {
    ...projectsEn[4],
    role: 'ReAct agent full-stack',
    summary: 'Agent bán lẻ nối sản phẩm, giỏ hàng, chính sách và hội thoại qua các tool.',
    bullets: [
      'Vòng ReAct, tool registry, kết quả tool được kiểm theo contract và memory theo từng tài khoản.',
      'Truy xuất chính sách bảo hành, giao hàng trên Qdrant và trả lời dạng streaming.',
      'Bước kiểm chất lượng tự viết lại câu trả lời yếu trước khi đến tay khách.'
    ]
  },
  {
    ...projectsEn[5],
    role: 'Dẫn dắt team 7 agent · đang làm',
    summary: 'Pipeline biến bài viết thành video, chạy hoàn toàn local trên một máy DGX Spark.',
    bullets: [
      'Qwen3.8-27B viết kịch bản → Qwen-Image-Edit tạo ảnh → MiniMax H3 tạo video → VieNeu-TTS lồng tiếng → ACE-Step làm nhạc.',
      'Chọn model theo benchmark công khai và giấy phép: bỏ LTX, chuyển từ Wan 2.2 sang H3.',
      'Thêm chặn OOM, giới hạn 50% bộ nhớ và watchdog nhiệt sau các lần treo máy ở 97 °C.'
    ]
  },
  {
    ...projectsEn[6],
    role: 'Pipeline sản xuất media chạy local',
    summary: 'Từ link chương truyện ra văn bản viết lại, audio TTS và video render bằng GPU.',
    bullets: [
      'Thu thập chương, viết lại, chia đoạn, TTS, ghép audio và theo dõi tiến độ.',
      'Đóng gói chạy trên Windows, render GPU native và stream các job dài.'
    ]
  },
  {
    ...projectsEn[7],
    role: 'Dựng máy, serve model và pre-sales',
    summary: 'Hệ thống máy NVIDIA nhiều loại, tự dựng từ hệ điều hành trắng cho sản phẩm nội bộ và PoC khách hàng.',
    bullets: [
      'DGX Spark (GB10), server RTX PRO 5000/2000 Blackwell, thiết bị edge Jetson và VPS Xeon.',
      'Serve LLM local bằng vLLM: Qwen3.8-27B NVFP4 với KV cache FP8.',
      'Trình bày và demo tại DCCI Summit 2026, AI Day 2026 và sự kiện đối tác TD SYNNEX.'
    ]
  }
];

export const content = {
  en: {
    scenes: [
      ['home', 'Boot', 'Hero, live widgets and the agents on duty'],
      ['showcase', 'Ship', 'Terminal commands that launch real products'],
      ['work', 'Work', 'Eight selected systems, click a card for details'],
      ['gallery', 'Repos', 'Screens pulled from public GitHub repositories'],
      ['impact', 'Impact', 'Production numbers behind the work'],
      ['agents', 'Agents', 'How twelve coding agents shipped NTCsale'],
      ['sim', '3D', 'Robotics-style three.js sandbox, drag to orbit'],
      ['diff', 'Diff', 'Planner–executor vs single tool loop, in VS Code'],
      ['about', 'About', 'Education, toolkit and the way I ship'],
      ['journey', 'Log', 'Career as a git log'],
      ['contact', 'Contact', 'Email, GitHub, phone and a deploy button']
    ] as [string, string, string][],
    nav: [
      ['showcase', 'Ship'],
      ['work', 'Work'],
      ['agents', 'Agents'],
      ['about', 'About'],
      ['journey', 'Journey'],
      ['contact', 'Contact']
    ] as [string, string][],
    themeDark: 'Dark',
    themeLight: 'Light',
    motionOn: 'Motion on',
    motionOff: 'Motion off',
    letsTalk: "Let's talk",
    hero: {
      kicker: 'AI ENGINEER / LLM AGENTS',
      kickerMuted: 'COMPUTER VISION · GEN MEDIA',
      status: 'OPEN TO NEW ROLES · HCMC / REMOTE',
      backdrop: 'PORTFOLIO',
      hello: 'Hello, I’m',
      name: 'QUỐC BẢO',
      role: ['AI ENGINEER &', 'SYSTEM BUILDER'],
      description: 'I turn LLMs, cameras and GPUs into systems that run in production, from bare-metal GPU bring-up to the agent your customer talks to.',
      cta: 'See my work',
      location: 'HO CHI MINH CITY, VIETNAM',
      manifesto: ['Every system.', 'Built to run for real.'],
      stats: [
        ['14', 'RELEASES IN', '3 WEEKS'],
        ['686', 'PRS MERGED', 'IN 4 WEEKS'],
        ['9', 'LIVE RTSP', 'CAMERAS']
      ],
      cv: 'DOWNLOAD CV',
      cvHref: 'assets/cv/Nguyen_Le_Quoc_Bao_AI_Engineer_2026.pdf',
      github: 'OPEN GITHUB',
      scroll: 'SCROLL TO DISCOVER',
      autoplay: 'AUTOPLAY TOUR',
      stop: 'STOP TOUR',
      edition: 'SELECTED WORK / 2025–2026'
    },
    gallery: { eyebrow: '03 / SCREENS', title: 'MORE PIXELS, FEWER WORDS', count: 'shots · click one', close: 'Close' },
    showcase: {
      eyebrow: '01 / FROM COMMAND TO PRODUCT',
      title: ['TYPE IT.', 'SHIP IT.'],
      building: 'building…',
      note: 'COMMANDS SIMPLIFIED FOR READING',
      steps: [
        {
          name: 'VisionID',
          stats: ['9 cameras', '15–20 FPS', '~60 people/day', '2 cities', 'since 04/2026'],
          stack: ['GStreamer', 'SCRFD', 'ArcFace', 'Qdrant', 'FastAPI', 'PWA'],
          dir: 'visionid',
          url: 'vision.ntc.ai.vn',
          image: 'assets/cases/face-attendance.png',
          caption: '9 RTSP cameras · 15–20 FPS each · in production since April 2026',
          lines: ['$ docker compose -f prod.yml up -d', '✓ gstreamer   9 streams decoded', '✓ scrfd       loaded on RTX PRO 2000', '$ python -m visionid.pipeline --cams 9', 'cam_03  faces=24  fps=18.6', '✓ attendance  synced to HR layer']
        },
        {
          name: 'Document Agent RAG',
          stats: ['1-command install', 'OCR + VLM', 'hybrid search', 'rerank', 'page citations'],
          stack: ['OpenSearch', 'OCR', 'Reranker', 'Tool calling', 'DGX Spark'],
          dir: 'labs/doc-agent',
          url: 'labs.ntc.ai.vn',
          image: 'assets/cases/enterprise-rag.webp',
          caption: 'one-command install on DGX Spark · OCR, hybrid search, cited answers',
          lines: ['$ ./install.sh doc-agent-rag', '✓ opensearch  hybrid index ready', '✓ ocr         vision parser online', '$ docker compose up -d', 'agent → search(bm25 + vector) → rerank', '✓ answer with file + page citations']
        },
        {
          name: 'FaceSpeed Studio',
          stats: ['6 search tools', 'leader + search agents', 'Riva TTS', '3D avatar', 'local vLLM'],
          stack: ['Docling', 'Qdrant', 'vLLM', 'Riva', 'Three.js'],
          dir: 'facespeed',
          url: 'localhost:8080',
          image: 'assets/cases/facespeed.png',
          caption: 'leader agent + search agents · Riva voice · 3D avatar',
          lines: ['$ vllm serve qwen3.8-27b --quantization nvfp4', '✓ kv-cache    fp8 · ready', '$ ./riva_start.sh', '✓ riva tts    streaming', 'leader → [bm25, dense, graph_expand]', '✓ avatar speaks the answer']
        },
        {
          name: 'NTC Store Agent',
          stats: ['ReAct loop', 'tool registry', 'policy RAG', 'quality gate', 'streamed replies'],
          stack: ['Next.js', 'NestJS', 'Prisma', 'Redis', 'Qdrant'],
          dir: 'retail-agent',
          url: 'localhost:3000',
          image: 'assets/cases/retail-agent.jpg',
          caption: 'ReAct loop · tool registry · quality gate before every reply',
          lines: ['$ pnpm --filter api dev', '✓ tools       product · cart · policy', '$ pnpm --filter web dev', 'react: think → act → observe', '✓ quality gate passed', '✓ reply streamed to customer']
        }
      ]
    },
    sim: {
      eyebrow: '03 / SANDBOX · 3D',
      title: 'DRAG. SIMULATE. SHIP',
      body: 'A small three.js scene styled after robotics simulators. Drag to orbit while the arm runs its pick-and-place loop.',
      tabs: ['Layout', 'Modeling', 'Simulation', 'Scripting'],
      outliner: 'STAGE',
      props: 'JOINT STATE',
      drag: 'drag to orbit'
    },
    orchestra: {
      eyebrow: '04 / AGENT ORCHESTRATION',
      title: 'ONE ARCHITECT. TWELVE AGENTS',
      body: 'How the NTCsale team shipped: role-specific coding agents shared rules, skills and memory, picked work from GitHub issues over MCP and escalated architecture to me.',
      hub: 'ORCHESTRATOR',
      architect: 'architect · me',
      prs: 'PRS MERGED',
      issues: 'ISSUES CLOSED',
      note: 'Totals are real (about four weeks). Role labels and the live log are illustrative.'
    },
    work: {
      eyebrow: '02 / SELECTED WORK',
      title: 'CODE THAT SHIPS',
      all: 'ALL REPOS',
      selected: 'SELECTED WORK',
      filterAll: 'All',
      search: 'grep',
      placeholder: 'title or stack…',
      empty: 'No match for',
      reset: 'Reset search',
      repoNote: 'public repositories synced from GitHub at build time',
      more: 'Show more',
      of: 'of'
    },
    stack: { lead: 'RUNNING IN', strong: 'PRODUCTION WITH.' },
    impact: {
      eyebrow: 'IMPACT & NUMBERS',
      title: ['THE CODE.', 'THE IMPACT.'],
      big: '686',
      bigLabel: 'PRS MERGED',
      body: ['Numbers from production, not from slides.', 'Each one has a system and a story behind it.'],
      listHead: ['SELECTED RESULTS', '2025 – 2026'],
      rows: [
        ['14 production releases in 3 weeks', 'NTCsale · release owner', '14'],
        ['Outage rolled back in under 17 minutes', 'Oversized CSP header vs Nginx limit · fixed in 27', '17m'],
        ['About 60 people checked in every day', 'VisionID · 9 cameras · 2 cities', '60'],
        ['15–20 FPS per camera with 20–30 faces', 'Single RTX PRO 2000 Blackwell', '20fps'],
        ['844 issues closed in about four weeks', '12-agent development workflow', '844'],
        ['Speaker and booth demos at 3 industry events', 'DCCI Summit · AI Day · TD SYNNEX', '3']
      ] as [string, string, string][],
      more: 'Show all results',
      less: 'Collapse'
    },
    breakdown: {
      eyebrow: 'A LOOK UNDER THE HOOD',
      title: ['FROM PROMPT.', 'TO PRODUCTION.'],
      body: ['One agent. Two architectures.', 'The planner–executor was too unreliable for a self-hosted 27B model, so I cut it down to a single tool loop.'],
      credit: ['NTCSALE SALES AGENT / 2026', 'SIMPLIFIED FOR READING'],
      left: 'V1 · PLANNER–EXECUTOR',
      right: 'V2 · TOOL LOOP',
      hint: 'DRAG TO COMPARE',
      hint2: 'DRAG / SCROLL'
    },
    about: {
      eyebrow: '05 / BEHIND THE COMMITS',
      title: ['NOT JUST CODE.', 'SYSTEMS THAT '],
      accent: 'RUN.',
      body: "I'm Bảo, an AI engineer in Ho Chi Minh City. I work across the whole path: GPU bring-up, model serving, backend architecture, agent design and the customer demo. I code fast with agents and verify like a skeptic.",
      eduTitle: 'EDUCATION & SKILLS',
      eduLabel: 'EDUCATION',
      edu: [
        ['Nguyen Tat Thanh University', '2021–2025', "Engineer's Degree in AI · GPA 3.32/4.00 · Very Good"],
        ['NTC · Nhat Tien Chung IT Telecoms', '2025–now', 'AI Engineer & Product Manager · teams of up to 5']
      ] as [string, string, string][],
      toolkit: 'TOOLKIT',
      tags: ['LLM agents', 'Agentic RAG', 'LangGraph', 'MCP', 'vLLM', 'Computer vision', 'FastAPI', 'PostgreSQL', 'Docker', 'Next.js'],
      processTitle: 'FROM SPEC TO PRODUCTION',
      process: [
        ['01', 'SPEC', 'Write down what done means: inputs, outputs, edge cases and the eval that proves it.'],
        ['02', 'PLAN', 'Map the existing code first, then split the work into small tasks with file-level scope.'],
        ['03', 'BUILD', 'Code with role-specific agents that share rules and memory, with me as the architect.'],
        ['04', 'EVAL', 'Run the golden question set, an LLM judge and hands-on testing before anything ships.'],
        ['05', 'SHIP', 'Own the release, watch the logs and keep a rollback ready.']
      ] as [string, string, string][],
      quote: ['Code fast', 'with agents.', 'Verify', 'like a skeptic.'],
      sign: 'Quốc Bảo',
      quoteBottom: ['LET’S SHIP', 'THE NEXT RELEASE.']
    },
    journey: {
      eyebrow: '06 / THE JOURNEY',
      title: 'KEEP SHIPPING. KEEP LEARNING',
      resume: 'RESUME',
      rows: [
        ['Aug 2026 – now', 'Backend lead & release owner', 'NTCsale · 5-person team', 'Built auth, the backend foundation and AI website generation. Owned every release and fixed a production outage within 27 minutes.'],
        ['Apr 2026 – now', 'Sole engineer', 'NTC VisionID', 'Designed and shipped the full face-recognition pipeline and the HR layer. A second maintainer joined in October 2026.'],
        ['Oct 2026 – now', 'Lead, 7-agent build', 'blog2vid · in progress', 'Fully local AI video pipeline on DGX Spark, with model selection driven by benchmarks and licence review.'],
        ['Sep 2025 – now', 'AI Engineer & Product Manager', 'NTC · Nhat Tien Chung IT Telecoms', 'AI solutions for NTC and its affiliates: architecture, task allocation, releases, PoCs and pre-sales.'],
        ['2021 – 2025', 'AI engineering student', 'Nguyen Tat Thanh University', "Engineer's Degree in Artificial Intelligence, GPA 3.32/4.00, classification Very Good."]
      ] as [string, string, string, string][],
      milestonesEyebrow: 'A FEW MILESTONES',
      milestonesTitle: ['SMALL COMMITS.', 'BIG DIFF.'],
      milestones: [
        ['DCCI Summit 2026 · Viettel IDC', 'Edge AI cameras on Jetson'],
        ['AI Day 2026 · Hanoi', 'Agent runtimes & agentic coding'],
        ['TD SYNNEX partner event', 'RAG assistant for banking'],
        ['Article: NVIDIA Vera Rubin at OCP 2026', 'Technical content']
      ] as [string, string][]
    },
    contact: {
      eyebrow: '07 / YOUR NEXT SYSTEM',
      title: ["LET'S BUILD", 'TOGETHER'],
      body: ['Have a system that needs to run in production?', "Let's make it work, then make it fast."],
      cta: 'START A CONVERSATION',
      email: 'EMAIL',
      github: 'GITHUB',
      phone: 'PHONE',
      based: 'BASED IN',
      city: 'Ho Chi Minh City, Vietnam',
      card: ['MAKE IT', 'RUN IN PROD.'],
      cardHint: 'PRESS PLAY TO DEPLOY',
      formToggle: 'Tell me about your project',
      name: 'Your name',
      message: 'What are you building?',
      send: 'Send email',
      footer: '© 2026 NGUYỄN LÊ QUỐC BẢO. EVERY COMMIT HAS A PURPOSE.'
    },
    modal: { close: 'Close', open: 'Open' },
    projects: projectsEn
  },
  vi: {
    scenes: [
      ['home', 'Khởi động', 'Hero, widget chạy trực tiếp và các agent đang làm việc'],
      ['showcase', 'Ship', 'Gõ lệnh terminal để chạy sản phẩm thật'],
      ['work', 'Dự án', 'Tám hệ thống chọn lọc, bấm thẻ để xem chi tiết'],
      ['gallery', 'Repo', 'Ảnh lấy từ các repo GitHub công khai'],
      ['impact', 'Kết quả', 'Các con số production phía sau dự án'],
      ['agents', 'Agent', 'Cách mười hai agent viết code ship NTCsale'],
      ['sim', '3D', 'Sandbox three.js kiểu mô phỏng robot, kéo để xoay'],
      ['diff', 'Diff', 'Planner–executor so với một vòng tool, trong VS Code'],
      ['about', 'Giới thiệu', 'Học vấn, bộ công cụ và cách tôi ship'],
      ['journey', 'Log', 'Hành trình dạng git log'],
      ['contact', 'Liên hệ', 'Email, GitHub, điện thoại và nút deploy']
    ] as [string, string, string][],
    nav: [
      ['showcase', 'Ship'],
      ['work', 'Dự án'],
      ['agents', 'Agent'],
      ['about', 'Giới thiệu'],
      ['journey', 'Hành trình'],
      ['contact', 'Liên hệ']
    ] as [string, string][],
    themeDark: 'Tối',
    themeLight: 'Sáng',
    motionOn: 'Hiệu ứng bật',
    motionOff: 'Hiệu ứng tắt',
    letsTalk: 'Trò chuyện',
    hero: {
      kicker: 'KỸ SƯ AI / LLM AGENT',
      kickerMuted: 'COMPUTER VISION · AI TẠO SINH',
      status: 'SẴN SÀNG CƠ HỘI MỚI · HCM / REMOTE',
      backdrop: 'PORTFOLIO',
      hello: 'Xin chào, tôi là',
      name: 'QUỐC BẢO',
      role: ['KỸ SƯ AI &', 'NGƯỜI DỰNG HỆ THỐNG'],
      description: 'Tôi biến LLM, camera và GPU thành hệ thống chạy thật trên production, từ lúc dựng máy GPU đến agent mà khách hàng trò chuyện cùng.',
      cta: 'Xem dự án',
      location: 'TP. HỒ CHÍ MINH, VIỆT NAM',
      manifesto: ['Mỗi hệ thống.', 'Đều phải chạy thật.'],
      stats: [
        ['14', 'BẢN RELEASE', 'TRONG 3 TUẦN'],
        ['686', 'PR ĐƯỢC MERGE', 'TRONG 4 TUẦN'],
        ['9', 'CAMERA RTSP', 'ĐANG CHẠY']
      ],
      cv: 'TẢI CV',
      cvHref: 'assets/cv/Nguyen_Le_Quoc_Bao_Ky_su_AI_2026.pdf',
      github: 'MỞ GITHUB',
      scroll: 'CUỘN ĐỂ KHÁM PHÁ',
      autoplay: 'TỰ CUỘN XEM TRANG',
      stop: 'DỪNG TỰ CUỘN',
      edition: 'DỰ ÁN CHỌN LỌC / 2025–2026'
    },
    gallery: { eyebrow: '03 / MÀN HÌNH', title: 'NHIỀU ẢNH, ÍT CHỮ', count: 'ảnh · bấm để xem', close: 'Đóng' },
    showcase: {
      eyebrow: '01 / TỪ DÒNG LỆNH ĐẾN SẢN PHẨM',
      title: ['GÕ LỆNH.', 'LÊN SẢN PHẨM.'],
      building: 'đang build…',
      note: 'LỆNH ĐÃ RÚT GỌN ĐỂ DỄ ĐỌC',
      steps: [
        {
          name: 'VisionID',
          stats: ['9 camera', '15–20 FPS', '~60 người/ngày', '2 thành phố', 'từ 04/2026'],
          stack: ['GStreamer', 'SCRFD', 'ArcFace', 'Qdrant', 'FastAPI', 'PWA'],
          dir: 'visionid',
          url: 'vision.ntc.ai.vn',
          image: 'assets/cases/face-attendance.png',
          caption: '9 camera RTSP · 15–20 FPS mỗi camera · chạy production từ tháng 4/2026',
          lines: ['$ docker compose -f prod.yml up -d', '✓ gstreamer   giải mã 9 luồng', '✓ scrfd       chạy trên RTX PRO 2000', '$ python -m visionid.pipeline --cams 9', 'cam_03  faces=24  fps=18.6', '✓ chấm công   đã đồng bộ sang nhân sự']
        },
        {
          name: 'Document Agent RAG',
          stats: ['cài 1 lệnh', 'OCR + VLM', 'tìm kiếm hybrid', 'rerank', 'trích số trang'],
          stack: ['OpenSearch', 'OCR', 'Reranker', 'Tool calling', 'DGX Spark'],
          dir: 'labs/doc-agent',
          url: 'labs.ntc.ai.vn',
          image: 'assets/cases/enterprise-rag.webp',
          caption: 'cài bằng một lệnh trên DGX Spark · OCR, tìm kiếm hybrid, trả lời có nguồn',
          lines: ['$ ./install.sh doc-agent-rag', '✓ opensearch  index hybrid sẵn sàng', '✓ ocr         bộ đọc thị giác đã chạy', '$ docker compose up -d', 'agent → search(bm25 + vector) → rerank', '✓ trả lời kèm file và số trang']
        },
        {
          name: 'FaceSpeed Studio',
          stats: ['6 tool tìm kiếm', 'agent điều phối + tìm kiếm', 'Riva TTS', 'avatar 3D', 'vLLM local'],
          stack: ['Docling', 'Qdrant', 'vLLM', 'Riva', 'Three.js'],
          dir: 'facespeed',
          url: 'localhost:8080',
          image: 'assets/cases/facespeed.png',
          caption: 'agent điều phối + agent tìm kiếm · giọng Riva · avatar 3D',
          lines: ['$ vllm serve qwen3.8-27b --quantization nvfp4', '✓ kv-cache    fp8 · sẵn sàng', '$ ./riva_start.sh', '✓ riva tts    đang stream', 'leader → [bm25, dense, graph_expand]', '✓ avatar đọc câu trả lời']
        },
        {
          name: 'NTC Store Agent',
          stats: ['vòng ReAct', 'tool registry', 'RAG chính sách', 'kiểm chất lượng', 'stream câu trả lời'],
          stack: ['Next.js', 'NestJS', 'Prisma', 'Redis', 'Qdrant'],
          dir: 'retail-agent',
          url: 'localhost:3000',
          image: 'assets/cases/retail-agent.jpg',
          caption: 'vòng ReAct · tool registry · kiểm chất lượng trước mỗi câu trả lời',
          lines: ['$ pnpm --filter api dev', '✓ tools       sản phẩm · giỏ hàng · chính sách', '$ pnpm --filter web dev', 'react: think → act → observe', '✓ qua bước kiểm chất lượng', '✓ đã stream câu trả lời cho khách']
        }
      ]
    },
    sim: {
      eyebrow: '03 / SANDBOX · 3D',
      title: 'KÉO. MÔ PHỎNG. SHIP',
      body: 'Một cảnh three.js nhỏ theo phong cách phần mềm mô phỏng robot. Kéo để xoay góc nhìn trong lúc cánh tay chạy vòng gắp và đặt vật.',
      tabs: ['Layout', 'Modeling', 'Simulation', 'Scripting'],
      outliner: 'STAGE',
      props: 'TRẠNG THÁI KHỚP',
      drag: 'kéo để xoay'
    },
    orchestra: {
      eyebrow: '04 / ĐIỀU PHỐI AGENT',
      title: 'MỘT KIẾN TRÚC SƯ. MƯỜI HAI AGENT',
      body: 'Cách team NTCsale ship: các agent viết code theo vai trò dùng chung luật, skill và memory, nhận việc từ GitHub issue qua MCP và chuyển quyết định kiến trúc lên tôi.',
      hub: 'ORCHESTRATOR',
      architect: 'kiến trúc sư · tôi',
      prs: 'PR ĐƯỢC MERGE',
      issues: 'ISSUE ĐƯỢC ĐÓNG',
      note: 'Tổng số là thật (khoảng bốn tuần). Tên vai trò và log trực tiếp chỉ để minh hoạ.'
    },
    work: {
      eyebrow: '02 / DỰ ÁN CHỌN LỌC',
      title: 'CODE ĐÃ LÊN PRODUCTION',
      all: 'TẤT CẢ REPO',
      selected: 'DỰ ÁN CHỌN LỌC',
      filterAll: 'Tất cả',
      search: 'grep',
      placeholder: 'tên hoặc công nghệ…',
      empty: 'Không có kết quả cho',
      reset: 'Xoá tìm kiếm',
      repoNote: 'repo công khai, tự đồng bộ từ GitHub mỗi lần build',
      more: 'Xem thêm',
      of: 'trên'
    },
    stack: { lead: 'ĐANG CHẠY', strong: 'TRÊN PRODUCTION.' },
    impact: {
      eyebrow: 'KẾT QUẢ & CON SỐ',
      title: ['CODE.', 'VÀ KẾT QUẢ.'],
      big: '686',
      bigLabel: 'PR ĐƯỢC MERGE',
      body: ['Con số lấy từ production, không phải từ slide.', 'Mỗi con số có một hệ thống và một câu chuyện phía sau.'],
      listHead: ['KẾT QUẢ CHỌN LỌC', '2025 – 2026'],
      rows: [
        ['14 bản release production trong 3 tuần', 'NTCsale · phụ trách release', '14'],
        ['Rollback sự cố trong chưa đầy 17 phút', 'Header CSP vượt giới hạn Nginx · sửa xong trong 27 phút', '17m'],
        ['Khoảng 60 người chấm công mỗi ngày', 'VisionID · 9 camera · 2 thành phố', '60'],
        ['15–20 FPS mỗi camera với 20–30 khuôn mặt', 'Chỉ một GPU RTX PRO 2000 Blackwell', '20fps'],
        ['844 issue được đóng trong khoảng bốn tuần', 'Quy trình 12 agent viết code', '844'],
        ['Trình bày và demo tại 3 sự kiện ngành', 'DCCI Summit · AI Day · TD SYNNEX', '3']
      ] as [string, string, string][],
      more: 'Xem tất cả kết quả',
      less: 'Thu gọn'
    },
    breakdown: {
      eyebrow: 'NHÌN VÀO BÊN TRONG',
      title: ['TỪ PROMPT.', 'ĐẾN PRODUCTION.'],
      body: ['Một agent. Hai kiến trúc.', 'Planner–executor quá thiếu ổn định với model 27B tự host, nên tôi rút gọn thành một vòng tool duy nhất.'],
      credit: ['AGENT BÁN HÀNG NTCSALE / 2026', 'ĐÃ RÚT GỌN ĐỂ DỄ ĐỌC'],
      left: 'V1 · PLANNER–EXECUTOR',
      right: 'V2 · TOOL LOOP',
      hint: 'KÉO ĐỂ SO SÁNH',
      hint2: 'KÉO / CUỘN'
    },
    about: {
      eyebrow: '05 / PHÍA SAU NHỮNG COMMIT',
      title: ['KHÔNG CHỈ LÀ CODE.', 'MÀ LÀ HỆ THỐNG '],
      accent: 'CHẠY THẬT.',
      body: 'Tôi là Bảo, kỹ sư AI tại TP. Hồ Chí Minh. Tôi làm trọn con đường: dựng GPU, serve model, kiến trúc backend, thiết kế agent và demo cho khách hàng. Tôi viết code nhanh cùng agent và kiểm chứng kỹ như người hoài nghi.',
      eduTitle: 'HỌC VẤN & KỸ NĂNG',
      eduLabel: 'HỌC VẤN',
      edu: [
        ['Đại học Nguyễn Tất Thành', '2021–2025', 'Kỹ sư Trí tuệ nhân tạo · GPA 3.32/4.00 · Giỏi'],
        ['NTC · Nhất Tiến Chung', '2025–nay', 'Kỹ sư AI & Product Manager · dẫn team đến 5 người']
      ] as [string, string, string][],
      toolkit: 'BỘ CÔNG CỤ',
      tags: ['LLM agent', 'Agentic RAG', 'LangGraph', 'MCP', 'vLLM', 'Computer vision', 'FastAPI', 'PostgreSQL', 'Docker', 'Next.js'],
      processTitle: 'TỪ SPEC ĐẾN PRODUCTION',
      process: [
        ['01', 'SPEC', 'Viết rõ thế nào là xong: đầu vào, đầu ra, trường hợp biên và bộ eval để chứng minh.'],
        ['02', 'PLAN', 'Vẽ bản đồ code hiện có trước, rồi chia việc thành task nhỏ theo từng file.'],
        ['03', 'BUILD', 'Code cùng các agent chuyên vai trò, dùng chung luật và memory, tôi giữ vai kiến trúc sư.'],
        ['04', 'EVAL', 'Chạy bộ câu hỏi chuẩn, LLM chấm điểm và test tay trước khi ship.'],
        ['05', 'SHIP', 'Tự release, theo dõi log và luôn sẵn đường rollback.']
      ] as [string, string, string][],
      quote: ['Code nhanh', 'cùng agent.', 'Kiểm chứng', 'như người hoài nghi.'],
      sign: 'Quốc Bảo',
      quoteBottom: ['CÙNG SHIP', 'BẢN RELEASE TIẾP THEO.']
    },
    journey: {
      eyebrow: '06 / HÀNH TRÌNH',
      title: 'VẪN ĐANG SHIP. VẪN ĐANG HỌC',
      resume: 'CV',
      rows: [
        ['08/2026 – nay', 'Lead backend & phụ trách release', 'NTCsale · team 5 người', 'Xây nền tảng backend, xác thực và tính năng AI tạo website. Tự release mọi phiên bản và xử lý xong sự cố production trong 27 phút.'],
        ['04/2026 – nay', 'Kỹ sư duy nhất', 'NTC VisionID', 'Thiết kế và đưa toàn bộ pipeline nhận diện khuôn mặt cùng phần nhân sự lên production. Có thêm người bảo trì thứ hai từ tháng 10/2026.'],
        ['10/2026 – nay', 'Dẫn dắt team 7 agent', 'blog2vid · đang làm', 'Pipeline video AI chạy hoàn toàn local trên DGX Spark, chọn model dựa trên benchmark và giấy phép.'],
        ['09/2025 – nay', 'Kỹ sư AI & Product Manager', 'NTC · Nhất Tiến Chung', 'Giải pháp AI cho NTC và các công ty thành viên: kiến trúc, phân công, release, PoC và pre-sales.'],
        ['2021 – 2025', 'Sinh viên ngành AI', 'Đại học Nguyễn Tất Thành', 'Kỹ sư Trí tuệ nhân tạo, GPA 3.32/4.00, xếp loại Giỏi.']
      ] as [string, string, string, string][],
      milestonesEyebrow: 'VÀI CỘT MỐC',
      milestonesTitle: ['COMMIT NHỎ.', 'DIFF LỚN.'],
      milestones: [
        ['DCCI Summit 2026 · Viettel IDC', 'Camera AI edge trên Jetson'],
        ['AI Day 2026 · Hà Nội', 'Agent runtime & agentic coding'],
        ['Sự kiện đối tác TD SYNNEX', 'Trợ lý RAG cho ngân hàng'],
        ['Bài viết: NVIDIA Vera Rubin tại OCP 2026', 'Nội dung kỹ thuật']
      ] as [string, string][]
    },
    contact: {
      eyebrow: '07 / HỆ THỐNG TIẾP THEO CỦA BẠN',
      title: ['CÙNG NHAU', 'XÂY DỰNG'],
      body: ['Bạn có hệ thống cần chạy thật trên production?', 'Làm cho nó chạy được, rồi làm cho nó chạy nhanh.'],
      cta: 'BẮT ĐẦU TRÒ CHUYỆN',
      email: 'EMAIL',
      github: 'GITHUB',
      phone: 'ĐIỆN THOẠI',
      based: 'NƠI LÀM VIỆC',
      city: 'TP. Hồ Chí Minh, Việt Nam',
      card: ['ĐƯA NÓ', 'LÊN PRODUCTION.'],
      cardHint: 'BẤM PLAY ĐỂ DEPLOY',
      formToggle: 'Kể tôi nghe về dự án của bạn',
      name: 'Tên của bạn',
      message: 'Bạn đang xây gì?',
      send: 'Gửi email',
      footer: '© 2026 NGUYỄN LÊ QUỐC BẢO. MỖI COMMIT ĐỀU CÓ LÝ DO.'
    },
    modal: { close: 'Đóng', open: 'Mở' },
    projects: projectsVi
  }
};

export type Copy = (typeof content)['en'];

export const categories: Category[] = ['Agents', 'RAG', 'Vision', 'GenMedia', 'Infra'];

export const stackRail = [
  'FastAPI', 'PostgreSQL', 'Redis', 'Qdrant', 'OpenSearch', 'vLLM', 'LangGraph', 'LangChain', 'MCP',
  'GStreamer', 'InsightFace', 'Docker', 'Nginx', 'Kafka', 'MinIO', 'Next.js', 'React', 'CUDA', 'Jetson', 'DGX Spark'
];

export const links = {
  email: 'ngbao3558@gmail.com',
  github: 'https://github.com/baonguyen3568',
  phone: '+84 326 032 296',
  phoneHref: 'tel:+84326032296'
};
