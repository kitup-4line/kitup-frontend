# KitUp Frontend

신메뉴를 실제로 판매해 보기 전에 원가·판매 데이터로 검증하는 메뉴 테스트 도구

**배포 링크:** https://kitup-eta.vercel.app/

## 주요 기능

| 단계 | 설명 |
| --- | --- |
| 내 테스트 | 테스트 생성, 삭제 및 진행 상태별 관리 |
| 메뉴 등록 | 메뉴 정보 입력, AI 기반 재료 추정 및 원가 계산 |
| 운영 대시보드 | 주문 내역, 시간대별 판매, 채널별 수익 비교 및 원가 수정 |
| 분석 리포트 | 수익 구조, 판매 패턴, 고객 반응 분석 및 개선 방안 제안 |

## 기술 스택

- React 19, Vite
- React Router, TanStack Query
- MSW (개발 환경 API 모킹)
- Vitest, ESLint

## 시작하기

```bash
npm install
npm run dev      # 개발 서버 (MSW 모킹 자동 활성화)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint
npm test
```

> 개발 모드(`npm run dev`)에서는 `src/mocks/handlers.js`의 MSW 핸들러가 API 요청을 가로챕니다.
> 핸들러가 없는 요청은 실제 네트워크로 그대로 나갑니다.

## 폴더 구조

```
src/
├── app/        # 앱 설정, 라우터, 레이아웃 및 라우트 가드
├── pages/      # 메뉴 등록, 대시보드, 리포트 등 페이지
├── features/   # 기능별 API, 컴포넌트 및 훅
├── shared/     # 공통 UI 컴포넌트 및 유틸리티
└── mocks/      # 개발 환경 API 모킹 및 목 데이터
```

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/tests` | 테스트 목록 |
| `/tests/new` | 새 테스트 생성 |
| `/tests/:testId/onboarding/*` | 메뉴 등록 및 원가 산정 |
| `/tests/:testId/dashboard/*` | 운영 / 주문 탭, 원가 수정 |
| `/tests/:testId/precheck` | 리포트 사전 점검 |
| `/tests/:testId/report` | 분석 리포트 |

## 브랜치 / 커밋 규칙

- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 및 기능 통합 브랜치
- `develop`을 기준으로 `feat/*`, `fix/*`, `chore/*` 브랜치를 생성하여 작업합니다.
- 커밋 메시지: `feat: ...`, `fix: ...`, `chore: ...` (Conventional Commits)
