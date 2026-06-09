// ===== RESUME DATA =====
// Edit this file to update experience, education, projects, and skills.
// Each entry has `en` and `ja` fields for bilingual content.
// Set `end: null` to show "present" / "現在".

export type Entry = {
  en: { title: string; org: string; desc?: string };
  ja: { title: string; org: string; desc?: string };
  start: string;
  end: string | null;
  category?: 'technical' | 'teaching';
};

export type Project = {
  en: { title: string; desc: string };
  ja: { title: string; desc: string };
};

// ----- EXPERIENCE -----
export const experience: Entry[] = [
  {
    en: {
      title: 'Chart Inc.',
      org: 'Chief Technology Officer (CTO), Board Member & Rocket Development Lead',
    },
    ja: {
      title: 'Chart Inc.',
      org: '取締役・ロケット開発部門責任者',
    },
    start: '2024',
    end: null,
    category: 'technical',
  },
  {
    en: {
      title: 'ZO MOTORS Corp.',
      org: 'One-Man IT',
    },
    ja: {
      title: 'ZO MOTORS株式会社',
      org: 'ワンマンIT',
    },
    start: '2023.04',
    end: '2023.12',
    category: 'technical',
  },
  {
    en: {
      title: 'M-Lab Co., Ltd.',
      org: 'Programming Instructor',
    },
    ja: {
      title: 'M-Lab株式会社',
      org: 'プログラミング講師',
    },
    start: '2021',
    end: '2022',
    category: 'technical',
  },

  {
    en: {
      title: 'Sundai Education Center Inc.',
      org: 'Professorial Lecturer',
      desc: 'Teaching science and mathematics to high school students preparing for university entrance examinations.',
    },
    ja: {
      title: '駿台教育センター株式会社',
      org: 'プロ講師',
      desc: '中学生への理科指導。',
    },
    start: '2024',
    end: '2026',
    category: 'teaching',
  },
  {
    en: {
      title: 'Waseda Academy Co., Ltd.',
      org: 'Class Teacher',
      desc: 'Teaching science and mathematics to high school students preparing for university entrance examinations.',
    },
    ja: {
      title: '株式会社早稲田アカデミー',
      org: 'クラス担任',
      desc: '小学生・中学生への理科・数学指導。',
    },
    start: '2020',
    end: '2024',
    category: 'teaching',
  },
];

// ----- EDUCATION -----
export const education: Entry[] = [
  {
    en: {
      title: "Ph.D. of Science (in progress)",
      org: 'The University of Osaka, Graduate School of Science, Department of Earth and Space Science',
      desc: 'OUTAP / Supervisor: Kentaro Nagamine'
    },
    ja: {
      title: '博士（理学）（在学中）',
      org: '大阪大学大学院 理学研究科 宇宙地球科学専攻',
      desc: '宇宙進化グループ',
    },
    start: '2026',
    end: null,
  },
  {
    en: {
      title: "Master of Science in Astrophysics",
      org: 'The University of Osaka, Graduate School of Science, Department of Earth and Space Science',
      desc: 'OUTAP / Supervisor: Kentaro Nagamine',
    },
    ja: {
      title: '修士（理学）',
      org: '大阪大学大学院 理学研究科 宇宙地球科学専攻',
      desc: '宇宙進化グループ / 指導教員：長峰健太郎',
    },
    start: '2024',
    end: '2026',
  },
  {
  en: {
    title: "Bachelor of Science in Physics",
    org: "Saitama University, Department of Physics, Faculty of Science",
    desc: 'Supervisor: Kousuke Sato',
  },
  ja: {
    title: "学士（理学）",
    org: "埼玉大学 理学部 物理学科",
    desc: '指導教員：佐藤浩介',
  },
  start: "2020",
  end: "2024",
},
{
  en: {
    title: "Kasukabe Kyoei High School",
    org: "Kasukabe-city, Saitama, Japan",
  },
  ja: {
    title: "私立春日部共栄高等学校",
    org: "埼玉県春日部市、日本",
  },
  start: "2016",
  end: "2019",
}
];

// ----- PROJECTS & EXTRA -----
export const projects: Project[] = [
  {
    en: {
      title: 'CROCODILE Simulation',
      desc: 'Implemented top-heavy IMF models to reproduce circumgalactic medium metallicity patterns consistent with observational data. AGN feedback modeling in cosmological simulations.',
    },
    ja: {
      title: 'CROCODILEシミュレーション',
      desc: 'トップヘビーIMFモデルを実装し、観測データと整合する銀河周辺ガス金属量パターンを再現。宇宙論シミュレーションにおけるAGNフィードバックモデリング。',
    },
  },
  {
    en: {
      title: 'High-Altitude Balloon Experiments',
      desc: 'ANCO-project: stratospheric payload experiments with custom GUI-based real-time telemetry systems.',
    },
    ja: {
      title: '高高度気球実験',
      desc: 'ANCO-project：カスタムGUIベースリアルタイムテレメトリシステムを用いた成層圏ペイロード実験。',
    },
  },
  {
    en: {
      title: 'Rocket & CanSat Development',
      desc: 'CORE hybrid rocket projects, HIBARI. Simulation, electronics, and recovery system design.',
    },
    ja: {
      title: 'ロケット・カンサット開発',
      desc: 'HIBARI、CORE、Mach50ハイブリッドロケットプロジェクト。シミュレーション、電子回路、回収システム設計。',
    },
  },
  {
    en: {
      title: 'Science Outreach',
      desc: 'Organized astronomy festivals, delivered public lectures, and taught Python workshops for science students.',
    },
    ja: {
      title: '科学アウトリーチ',
      desc: '天文フェスティバルの企画、一般向け講演、理科学生向けPythonワークショップを実施。',
    },
  },
];

// ----- SKILLS -----
// level: 0–100
export const technicalSkills = [
  { name: 'Python', level: 100 },
  { name: 'C / C++', level: 70 },
  { name: 'Julia', level: 80 },
  { name: 'Rust', level: 70 },
  { name: 'TypeScript', level: 60 },
  { name: 'HTML / CSS', level: 100 },
  { name: 'Git', level: 80 },
  { name: 'IoT / Microcontrollers', level: 72 },
];

// ----- PERSONALITY TAGS -----
export const personality = {
  en: ['Ambitious', 'Open-minded', 'Team Player', 'Intellectually curious'],
  ja: ['向上心が強い', 'オープンマインド', 'チームプレイヤー', '知的好奇心旺盛'],
};

// ----- INTEREST TAGS -----
export const interests = {
  en: ['Astronomy', 'Rocket Engineering', 'Machine Learning', 'Travel', 'Photography'],
  ja: ['天文学', 'ロケット工学', '機械学習', '旅行', '写真'],
};

// ----- COMMITTEE & MEMBERSHIP -----
export type CommitteeEntry = {
  en: { role: string; org: string; desc?: string };
  ja: { role: string; org: string; desc?: string };
  start: string;
  end: string | null;
};

export const committees: CommitteeEntry[] = [
  {
    en: { role: '3rd President of Akatoki', org: 'Space Engineering Circle Akatoki, 3rd Generation President' },
    ja: { role: 'あかとき 第3代代表', org: '埼玉大学宇宙工学サークルあかとき' },
    start: '2022.04',
    end: '2023.03',
  },
  {
    en: { role: 'ANCO-project, Communications Team Lead Developer', org: 'Akatoki Space Engineering Circle, Saitama University' },
    ja: { role: 'ANCO-project 通信班 開発責任者', org: '宇宙工学サークルあかとき' },
    start: '2023.03',
    end: '2024.10',
  },
  {
    en: { role: 'Ehime Nanyo Joint Balloon Experiment Operations Committee / Japan-Mongolia Joint Balloon Experiment Safety Review Committee', org: 'Committee Member' },
    ja: { role: '委員', org: 'えひめ南予共同気球実験運営委員会・日本モンゴル共同気球実験安全審査委員会' },
    start: '2024.03',
    end: '2026.12',
  },
  {
    en: { role: 'Japanese Astronomical Society Member', org: '' },
    ja: { role: '日本天文学会 会員', org: '' },
    start: '2024',
    end: '2026',
  },
  {
    en: { role: 'Secretariat / Session Chair, Galaxy & Galaxy Cluster Division', org: '55th Summer School of Astronomy and Astrophysics for Young Researchers' },
    ja: { role: '事務局・銀河・銀河団分科会座長団', org: '第55回 天文・天体物理若手夏の学校' },
    start: '2025.03',
    end: '2025.12',
  },
];

// ----- CERTIFICATIONS -----
export type Certification = {
  en: string;
  ja: string;
  year?: string;
};

export const certifications: Certification[] = [
  {
    en: 'High School Teacher Type 1 License (Science)',
    ja: '高等学校教諭一種免許状（理科）',
  },
  {
    en: 'Junior High School Teacher Type 1 License (Science)',
    ja: '中学校教諭一種免許状（理科）',
  },
  {
    en: 'High School Teacher Specialized License (Science)',
    ja: '高等学校教諭専修免許状（理科）',
  },
  {
    en: 'Junior High School Teacher Specialized License (Science)',
    ja: '中学校教諭専修免許状（理科）',
  },
  {
    en: 'Ordinary Motor Vehicle Type 1 Driver\'s License (AT)',
    ja: '普通自動車第一種運転免許（AT限定）',
  },
];

// ----- LANGUAGES -----
export const spokenLanguages = [
  { en: { name: 'Japanese', level: 'Native' }, ja: { name: '日本語', level: 'ネイティブ' } },
  { en: { name: 'English', level: 'Professional' }, ja: { name: '英語', level: 'ビジネスレベル' } },
];
