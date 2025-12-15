import { Book } from './types';

// Sample data to demonstrate download functionality
export const BOOKS: Book[] = [
  {
    id: 1,
    title: "건설현장 안전관리 매뉴얼 V1.0",
    author: "안전관리팀",
    category: "건설안전",
    subcategory: "메뉴얼",
    rating: 4.8,
    description: "현장에서 즉시 적용 가능한 안전관리 핵심 매뉴얼입니다.\n중대재해처벌법 대응 가이드라인이 포함되어 있습니다. (샘플 파일)",
    // Data URI must be encoded for special characters
    fileUrl: "data:text/plain;charset=utf-8," + encodeURIComponent("건설현장 안전관리 매뉴얼 샘플 내용입니다. 실제 파일은 PDF 등으로 제공됩니다."),
    fileName: "건설현장_안전관리_매뉴얼.txt",
    isBestSeller: true,
    isNew: false
  },
  {
    id: 2,
    title: "공사일보 자동화 엑셀 서식",
    author: "김공무",
    category: "건설공무",
    subcategory: "서식",
    rating: 4.5,
    description: "복잡한 공사일보 작성을 10분으로 단축시켜주는 자동화 엑셀 서식입니다.\n날씨, 인원, 장비 현황 자동 집계 기능 포함.",
    externalUrl: "https://www.google.com", 
    isBestSeller: false,
    isNew: true
  },
  {
    id: 3,
    title: "2024년 표준시방서 개정판",
    author: "국토교통부",
    category: "건설품질",
    subcategory: "메뉴얼",
    rating: 5.0,
    description: "최신 개정된 표준시방서 모음집입니다.\n품질관리 기준 및 시험 방법이 상세히 수록되어 있습니다.",
    fileUrl: "data:text/plain;charset=utf-8," + encodeURIComponent("2024년 표준시방서 개정판 샘플 텍스트입니다."),
    fileName: "2024_표준시방서_개정판.txt",
    isBestSeller: true,
    isNew: true
  },
  {
    id: 4,
    title: "ChatGPT 건설 실무 활용 가이드",
    author: "스마트건설팀",
    category: "AI 자동화",
    subcategory: "메뉴얼",
    rating: 4.9,
    description: "생성형 AI를 활용하여 시방서 검토, 공문 작성 시간을 획기적으로 단축하는 프롬프트 모음집입니다.",
    fileUrl: "data:text/plain;charset=utf-8," + encodeURIComponent("ChatGPT 건설 실무 활용 가이드 샘플입니다."),
    fileName: "ChatGPT_건설_활용_가이드.txt",
    isBestSeller: false,
    isNew: true
  }
];

export const CATEGORIES = ["전체", "건설공무", "건설안전", "건설품질", "AI 자동화"];

export const SUB_CATEGORIES = ["메뉴얼", "서식"];