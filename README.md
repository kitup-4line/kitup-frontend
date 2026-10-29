# KitUp Frontend

신메뉴를 실제로 판매해 보기 전에 원가·판매 데이터로 검증하는 메뉴 테스트 도구

## 주요 기능

| 단계 | 설명 |
| --- | --- |
| 메뉴 등록 / 원가 계산 | 메뉴 정보와 레시피를 입력하면 AI가 재료를 추정하고 원가를 계산해 줍니다 |
| 대시보드 | 주문 목록, 시간대별 판매, 채널별 비교 같은 운영 지표를 보여 줍니다 |
| 리포트 | 수익 구조, 판매 패턴, 고객 반응을 분석하고 다음 실험을 제안합니다 |
| 시뮬레이터 | 판매 조건을 바꿨을 때의 결과와 예상 리뷰를 보여 줍니다 |

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
├── app/        # 앱 진입점, 라우터, 프로바이더, 레이아웃, 라우트 가드
├── pages/      # 라우트 단위 페이지 (onboarding / dashboard / report / simulator)
├── features/   # 기능별 모듈. 각각 api/(React Query 훅), components/, hooks/
│   ├── cost/
│   ├── dashboard/
│   ├── report/
│   ├── simulator/
│   └── test/
├── domain/     # UI와 무관한 순수 로직 (calc/ 계산 함수, 모델, 상수)
├── shared/     # 공용 UI 컴포넌트, API 클라이언트, 유틸
└── mocks/      # MSW 핸들러와 목 데이터
```

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/tests` | 테스트 목록 |
| `/tests/new` | 새 테스트 (메뉴 등록) |
| `/tests/:testId/onboarding/*` | 메뉴 → 레시피 → AI 재료 → 원가 결과 |
| `/tests/:testId/dashboard/*` | 운영 / 주문 탭, 원가 수정 |
| `/tests/:testId/precheck`, `/report` | 리포트 사전 점검, 리포트 |
| `/tests/:testId/simulator` | 시뮬레이터 |

## 브랜치 / 커밋 규칙

- `develop` 브랜치를 기준으로 `feat/*`, `fix/*`, `chore/*` 브랜치를 만들어 작업합니다
- 커밋 메시지: `feat: ...`, `fix: ...`, `chore: ...` (Conventional Commits)
