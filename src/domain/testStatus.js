// 테스트 상태 정의와 상태별 표시·이동 규칙
export const TEST_STATUS = {
  RUNNING: "RUNNING",
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
};

// 목록 필터 탭 (ALL은 상태가 아니라 '전체' 필터)
export const TEST_FILTER = {
  ALL: "ALL",
  ...TEST_STATUS,
};

export const STATUS_META = {
  [TEST_STATUS.RUNNING]: {
    badgeLabel: "LIVE 운영 중",
    actionLabel: "운영 확인",
    getPath: (id) => `/tests/${id}/dashboard`,
  },
  [TEST_STATUS.DRAFT]: {
    badgeLabel: "작성 중 · 임시저장",
    actionLabel: "이어서 작성",
    getPath: (id) => `/tests/${id}/onboarding/menu`,
  },
  [TEST_STATUS.COMPLETED]: {
    badgeLabel: "테스트 종료 · 리포트",
    actionLabel: "리포트 보기",
    getPath: (id) => `/tests/${id}/report`,
  },
};
