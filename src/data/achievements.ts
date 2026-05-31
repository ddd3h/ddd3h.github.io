// ===== ACHIEVEMENTS DATA =====

export type Publication = {
  authors: string;
  en: { title: string; venue: string; note?: string };
  ja: { title: string; venue: string; note?: string };
  date: string;
  type: 'oral' | 'poster' | 'paper' | 'award' | 'grant' | 'other';
  url?: string;
  doi?: string;
};

export const achievements: Publication[] = [
  // ----- PAPERS -----
  {
    authors: 'Daisuke Nishihama, Daisuke Toyouchi, Yuri Oku, Kentaro Nagamine, Yuto Kuwayama',
    en: {
      title: 'Revealing the Effects of AGN Feedback on Galaxy Evolution in CROCODILE',
      venue: 'Astronomy & Astrophysics (in preparation)',
      note: 'Peer-reviewed, to be submitted to A&A',
    },
    ja: {
      title: 'CROCODILEにおけるAGNフィードバックの銀河進化への影響の解明',
      venue: 'Astronomy & Astrophysics（投稿予定、執筆中）',
      note: '査読論文',
    },
    date: '2025-00',
    type: 'paper',
  },
  {
    authors: 'Daisuke Nishihama, Kotaro Hoshi, Yu Ebisawa, Shogo Oba, Masaki Sato, Ryuichi Hodoshima',
    en: {
      title: 'ANCO-project: Transferring images in real-time via LoRa wireless communication in the Stratosphere',
      venue: 'ISTS JESA (in preparation)',
      note: 'Peer-reviewed, to be submitted to ISTS JESA',
    },
    ja: {
      title: 'ANCOプロジェクト：成層圏におけるLoRa無線通信によるリアルタイム画像転送',
      venue: 'ISTS JESA（投稿予定、執筆中）',
      note: '査読論文',
    },
    date: '2025-00',
    type: 'paper',
  },
  {
    authors: 'Yuto Kuwayama, Yongming Liang, Kentaro Nagamine, Yuri Oku, Daisuke Nishihama, Daisuke Toyouchi, Keita Fukushima, Hidenobu Yajima, Hyunbae Park, Masami Ouchi',
    en: {
      title: 'Cosmic Himalayas in CROCODILE: Probing the Extreme Quasar Overdensities by Count-in-Cells analysis and Nearest Neighbor Distribution',
      venue: 'Astronomy & Astrophysics',
      note: 'Peer-reviewed | DOI: 10.3847/1538-4357/ae5798',
    },
    ja: {
      title: 'CROCODILEにおけるCosmic Himalayas：セル内カウント解析と最近傍分布による極端なクェーサー過密度の探索',
      venue: 'Astronomy & Astrophysics',
      note: '査読論文 | DOI: 10.3847/1538-4357/ae5798',
    },
    date: '2025-00',
    type: 'paper',
    url: 'https://doi.org/10.48550/arXiv.2512.24966',
    doi: '10.3847/1538-4357/ae5798',
  },

  // ----- ORAL PRESENTATIONS -----
  {
    authors: 'Daisuke Nishihama, Daisuke Toyouchi, Yuri Oku, Kentaro Nagamine, Yuto Kuwayama',
    en: {
      title: 'AGN Feedback and Numerical Methods in Galaxy Evolution',
      venue: 'Galaxy-IGM 2025, Nasu',
      note: 'Oral presentation',
    },
    ja: {
      title: '銀河進化におけるAGNフィードバックと数値計算手法',
      venue: 'Galaxy-IGM 2025, 那須',
      note: '口頭発表',
    },
    date: '2025-07',
    type: 'oral',
  },
  {
    authors: 'Daisuke Nishihama, Yuri Oku, Julia Aizpún, Yuto Kuwayama, Kentaro Nagamine, Daisuke Toyouchi',
    en: {
      title: 'Influence of Thermal AGN Feedback on Galaxy Evolution in CROCODILE Simulation',
      venue: 'International Workshop on Galaxy Formation + AGORA in Asia 2025, Osaka',
      note: 'Oral presentation',
    },
    ja: {
      title: 'CROCODILEシミュレーションにおける熱的AGNフィードバックの銀河進化への影響',
      venue: '国際研究会 Galaxy Formation + AGORA in Asia 2025, 大阪',
      note: '口頭発表',
    },
    date: '2025-05',
    type: 'oral',
  },
  {
    authors: '西濱大将, 奥裕理, 長峯健太郎, 豊内大輔',
    en: {
      title: 'Effects of Thermal AGN Feedback on Galaxy Evolution in the CROCODILE Cosmological Simulation',
      venue: 'Japanese Astronomical Society Spring Meeting 2025, Mito',
      note: 'Oral presentation',
    },
    ja: {
      title: '宇宙論流体シミュレーション CROCODILE による熱的AGNフィードバックの銀河進化への影響',
      venue: '日本天文学会 2025年春季年会, 水戸',
      note: '口頭発表',
    },
    date: '2025-03',
    type: 'oral',
  },
  {
    authors: 'Daisuke Nishihama, Yuri Oku, Julia Aizpún, Yuto Kuwayama, Kentaro Nagamine, Daisuke Toyouchi',
    en: {
      title: 'Influence of Thermal AGN Feedback on Galaxy Evolution in CROCODILE Simulation',
      venue: 'SPR+ILR Joint Workshop, Tokyo',
      note: 'Oral presentation',
    },
    ja: {
      title: 'CROCODILEシミュレーションにおける熱的AGNフィードバックの銀河進化への影響',
      venue: 'SPR+ILR合同研究会, 東京',
      note: '口頭発表',
    },
    date: '2025-03',
    type: 'oral',
  },
  {
    authors: 'Daisuke Nishihama, Yuri Oku, Julia Aizpún, Yuto Kuwayama, Kentaro Nagamine, Daisuke Toyouchi',
    en: {
      title: 'Influence of Thermal AGN Feedback on Galaxy Evolution in CROCODILE Simulation',
      venue: 'International Workshop "Elucidating the Material Circulation in the Early Universe", Tokyo',
      note: 'Oral presentation',
    },
    ja: {
      title: 'CROCODILEシミュレーションにおける熱的AGNフィードバックの銀河進化への影響',
      venue: '国際研究会「初期宇宙における物質循環の解明」, 東京',
      note: '口頭発表',
    },
    date: '2025-03',
    type: 'oral',
  },
  {
    authors: '百々大貴, 前地祐記, 安齋俊晟, 粕田祥大, 永濱宏幸, 野見山裕也, 三宅咲緩, 柳沢夢生人, 荒川晴哉, 大井ヒカル, 大熊双葉, 奥沢太一, 加藤佑都, 金井美里, 河嶋奏, 久保かりん, 佐々木隼颯, 中野秀徳, 溝渕航太朗, 星光太郎, 林桃萌, 浜西克典, 利穂美咲希, 村松旺典, 吉田宣開, 宮崎剛, 西濱大将, 原田藍生',
    en: {
      title: 'Radiation Detection in the Stratosphere and Demonstration of Gimbal Mechanism — soffione-project',
      venue: 'Balloon Symposium 2024, Sagamihara',
      note: 'Oral presentation',
    },
    ja: {
      title: '成層圏での放射線検出とジンバル機構の実証 — soffione-project',
      venue: '大気球シンポジウム 2024, 相模原',
      note: '口頭発表',
    },
    date: '2024-11',
    type: 'oral',
  },
  {
    authors: 'Daisuke Nishihama, Yuri Oku, Kentaro Nagamine, Daisuke Toyouchi',
    en: {
      title: 'Cosmological Simulations Reveal the Effects of AGN Feedback on Bubble Formation and Chemical Contamination',
      venue: 'Galaxy-IGM Workshop, Hirosaki',
      note: 'Oral presentation',
    },
    ja: {
      title: '宇宙論シミュレーションによるAGNフィードバックのバブル形成と化学汚染への影響の解明',
      venue: 'Galaxy-IGM Workshop, 弘前',
      note: '口頭発表',
    },
    date: '2024-08',
    type: 'oral',
  },
  {
    authors: '清本拓人, 大塲翔吾, 西濱大将, 他24名',
    en: {
      title: 'Measurement of Radiation Dose in the Stratosphere and Real-Time Image Transfer via Wireless Communication — ANCO-project',
      venue: 'Balloon Symposium 2023, Sagamihara',
      note: 'Oral presentation',
    },
    ja: {
      title: '成層圏における放射線量の測定と無線通信による画像のリアルタイム転送 — ANCO-project',
      venue: '大気球シンポジウム 2023, 相模原',
      note: '口頭発表',
    },
    date: '2023-11',
    type: 'oral',
  },
  {
    authors: '足立恭果, 石﨑大貴, 佐藤正騎, 須田亮介, 清本拓人, 西濱大将, 他10名',
    en: {
      title: 'Unraveling the Relationship between Ozone and Radiation — ANCO-project',
      venue: 'Balloon Symposium 2022, Sagamihara',
      note: 'Oral presentation',
    },
    ja: {
      title: 'オゾンと放射線の関わりを解き明かす — ANCO-project',
      venue: '大気球シンポジウム 2022, 相模原',
      note: '口頭発表',
    },
    date: '2022-11',
    type: 'oral',
  },

  // ----- POSTER PRESENTATIONS -----
  {
    authors: '西濱大将, 奥裕理, 長峯健太郎, 豊内大輔',
    en: {
      title: 'Formation Mechanism of Bubble Structure at the Galactic Center: Elucidating AGN Feedback via Cosmological Simulations',
      venue: '54th Summer School of Astronomy and Astrophysics for Young Researchers, Ise',
      note: 'Poster presentation',
    },
    ja: {
      title: '銀河系中心におけるバブル構造の形成機構：宇宙論的シミュレーションに基づくAGNフィードバックの解明',
      venue: '第54回天文・天体物理若手夏の学校, 伊勢',
      note: 'ポスター発表',
    },
    date: '2024-07',
    type: 'poster',
  },

  // ----- AWARDS -----
  {
    authors: 'Daisuke Nishihama',
    en: {
      title: 'Student Commendation',
      venue: 'Saitama University',
    },
    ja: {
      title: '学生表彰',
      venue: '埼玉大学',
    },
    date: '2021-10',
    type: 'award',
  },
];
