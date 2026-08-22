# 귀신의 집 예약 (PULSE 세란제)

Claude Design 프로토타입(`Shared link.zip` 안의 `.dc.html`)을 Vite + React 로 옮긴 것.
Artifact 전용 문법(`<x-dc>`, `<sc-if>`, `<sc-for>`, `DCLogic`)은 전부 걷어내고
표준 JSX + `useState` + CSS 로만 되어 있다.

## 실행

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

## 화면 흐름

```
home → 인원·시간 선택 → 대표자 정보 → 예약 완료
```

화면 전환은 `src/App.jsx` 의 `screen` 상태 하나로 관리한다.

## 폴더 구조

```
src/
  App.jsx                  화면 전환 + 예약 폼 상태
  main.jsx / index.css     진입점 / 전역 스타일·키프레임·색 테마
  App.css                  390x844 목업 프레임

  api/                     ⚠ 백엔드 연결 지점 (UI와 분리된 곳)
    reservationApi.js        fetchAvailability() / createReservation()
    apiClient.js             fetch 래퍼 + ApiError
    mockReservationApi.js    서버 없을 때 쓰는 가짜 구현
  hooks/
    useAvailability.js       예약 가능 시간 조회
    useCreateReservation.js  예약 제출
  constants/schedule.js    운영 시간·인원 옵션·행사 날짜
  utils/                   전화번호 포맷, 슬롯 그룹핑, 확인증 PNG 저장
  components/              재사용 UI + 홈 화면 SVG 아트
  screens/                 4개 화면 (각각 .jsx + .css)
  styles/ui.css            버튼·패널 등 공통 스타일
```

## 백엔드 붙일 때 할 일

화면 코드는 `fetch` 를 전혀 모른다. 아래만 바꾸면 된다.

1. `.env.example` 을 `.env` 로 복사하고 값 채우기

   ```
   VITE_API_BASE_URL=https://api.example.com
   VITE_USE_MOCK=false
   ```

2. `src/api/reservationApi.js` 의 `PATHS` 를 서버 스펙에 맞추기

   | 화면 동작        | 함수                   | 기본 엔드포인트                            |
   | ---------------- | ---------------------- | ------------------------------------------ |
   | 시간표 불러오기  | `fetchAvailability()`  | `GET  /reservations/availability?date=...`  |
   | 예약하기 누르기  | `createReservation()`  | `POST /reservations`                        |

3. 응답 필드명이 다르면 같은 파일의 `normalizeAvailability` / `normalizeSlot` /
   `normalizeReservation` 만 고치면 된다.

기대하는 응답 형태:

```jsonc
// GET /reservations/availability?date=2026-09-03
{ "date": "2026-09-03", "slots": [{ "time": "12:30", "status": "open", "remaining": 4 }] }

// POST /reservations  { date, time, people, name, phone }
{ "id": "...", "code": "...", "date": "...", "time": "...", "people": 2, "name": "...", "phone": "..." }
```

`createReservation()` 이 돌려준 값은 `App.jsx` 의 `reservation` 상태에 들어간다.
예약번호를 완료 화면에 보여주고 싶으면 `DoneScreen` 에 한 줄만 추가하면 된다.

## 알아둘 것

- 행사 날짜(2026-09-03)는 `src/constants/schedule.js` 의 `EVENT_DATE` 상수 한 곳에만 있다.
- 선택 버튼 색 조합 3종(옐로/네이비/퍼플)은 `index.css` 의 `.theme-*` 클래스로 남아 있다.
  `App.jsx` 의 `THEME` 값만 바꾸면 된다.
- **시간은 드럼 선택기**(`src/components/TimeWheel.jsx`)로 고른다. 원본 디자인의
  33개 시간 버튼 그리드를 대체한 것 — 세로를 훨씬 덜 먹어서 어떤 폰에서도 안 잘린다.
  - 시 / 분 두 개의 휠. 굴리는 도중에도 값이 실시간으로 반영된다.
  - 이미 예약된 시간은 휠 안에서 취소선. 그 칸에 멈추면 경고가 뜨고 "다음"이 잠긴다.
  - 칸 높이는 40px 고정, 휠 높이만 `clamp(200px, 32dvh, 280px)` 로 화면에 맞춘다.
- 데스크톱에서는 원본대로 390x844 목업, 폭 430px 이하(실제 폰)에서는 화면을 꽉 채운다.
  세로가 모자라면 여백/간격이 `clamp(..., dvh, ...)` 로 좁아진다 — 축소(scale)는 쓰지 않는다.
