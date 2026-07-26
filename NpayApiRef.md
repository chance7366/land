# Npay 부동산 맵 API 조사 (재분석)

조사일: 2026-07-26  
도구: Cursor Playwright MCP  
대상 URL (요청 원문):

```
https://fin.land.naver.com/map?center=3zaMFL-2AMAjy&zoom=14.900628876372176&showArticles=false&realEstateTypes=A01-A04-B01-A05-A06-A07-C02-A02-B02-C01-C03-C04-D05-F01-D02-E03-D01-E04-E02-D03-D04-E01-Z00&tradeTypes=A1-B1-B2-B3
```

페이지 타이틀: **Npay 부동산**  
Base API: `https://fin.land.naver.com/front-api/v1`

> 이전 `NpayApiRef.md` 내용은 삭제하고, 위 URL 기준으로 다시 작성함.

---

## 1. 결론

**특정 지역의 모든 매물 정보를 스크래핑하는 데 쓸 수 있는 데이터 요청이 있다.**

| 우선순위 | Method | Path | 역할 |
|---------|--------|------|------|
| ★★★ | POST | `/article/boundedArticles` | 매물 목록(페이지네이션) — **수집 본체** |
| ★★★ | POST | `/article/boundedArticlesCount` | 전체 건수 |
| ★★ | GET | `/legalDivision/searchByCoordinate` | 법정동 코드·폴리곤(지역 한정) |
| ★ | POST | `/article/map/articleClusters` | 지도 클러스터(핀/건수) — 상세 목록용 아님 |
| ★ | POST | `/complex/complexClusters` | 단지 클러스터 — 매물 목록용 아님 |

권장 수집 루프:

1. 좌표 → `legalDivision/searchByCoordinate?needsPolygon=true`  
2. `legalDivisionNumbers` + `boundingBox` + URL과 동일한 `tradeTypes`/`realEstateTypes`로 Count  
3. `boundedArticles`를 `lastInfo`로 `hasNextPage === false`까지 반복

---

## 2. URL 쿼리 → API filter 매핑

쿼리 문자열의 `-` 구분 값이 POST body의 배열로 그대로 전달된다.

### tradeTypes (`A1-B1-B2-B3`)

```json
["A1", "B1", "B2", "B3"]
```

관측된 의미(샘플 기준):

| 코드 | 추정 |
|------|------|
| A1 | 매매 |
| B1 | 전세 |
| B2 | 월세 |
| B3 | (추가 임대/단기 등 — UI 라벨 별도 확인) |

### realEstateTypes (URL 전체)

```json
[
  "A01","A04","B01","A05","A06","A07","C02","A02","B02",
  "C01","C03","C04","D05","F01","D02","E03","D01","E04",
  "E02","D03","D04","E01","Z00"
]
```

1페이지 샘플에서 실제 등장한 유형 예: `A01`(아파트), `A02`(오피스텔), `D02`(단지내상가 등).

### showArticles

| URL | 네트워크에서 관측된 매물 API |
|-----|------------------------------|
| `showArticles=false` | **거의 없음** (complexClusters / preSale 위주) |
| `showArticles=true` | `boundedArticlesCount`, `article/map/articleClusters` 호출 |

→ 수집기는 맵 UI에 의존하지 말고 **API를 직접 호출**하는 것이 맞다.  
(`showArticles=false`여도 동일 body로 Count/List를 브라우저 세션에서 호출하면 정상 응답.)

### showOnlySelectedRegion (UI 「방화동만 보기」)

클릭 후 URL에 `showOnlySelectedRegion=true` 추가되고, filter에:

```json
"legalDivisionNumbers": ["1150010900"],
"legalDivisionType": "EUP"
```

이 세션에서 방화동 = `1150010900` (서울시 강서구 방화동).

---

## 3. 단계별 네트워크 관측

### 3-1. 원문 URL (`showArticles=false`)

호출 예:

- `GET /auth/userInfo`
- `GET /legalDivision/searchByCoordinate?longitude=…&latitude=…&type=EUP`
- `POST /complex/complexClusters` ← URL의 trade/estate 타입이 filter에 반영됨
- `POST /preSale/pinExposure`

**매물 목록 API 없음.**

`complexClusters` request body에 이미 전체 타입 배열이 들어감 (위 매핑 참고).

### 3-2. 동일 필터 + `showArticles=true`

추가로:

- `POST /article/boundedArticlesCount` → **totalCount = 1343** (뷰포트 bbox, 법정동 미지정)
- `POST /article/map/articleClusters` → totalCount 1285(클러스터 합/집계 차이 가능), 클러스터별 `articleCount`

UI에도 「매물 1343개」 수준으로 표시됨.

### 3-3. 「방화동만 보기」 후

- `GET /legalDivision/searchByCoordinate?...&needsPolygon=true`
- Count 재호출: `legalDivisionNumbers:["1150010900"]` → **totalCount = 1059**
- articleClusters 재호출

---

## 4. API 상세

### A. 법정동 — `GET /legalDivision/searchByCoordinate`

예:

```
?longitude=126.8140637&latitude=37.57931&type=EUP&needsPolygon=true
```

응답 핵심:

- `legalDivisionNumber`: `1150010900`
- `cityFullName` / `cityName` / `divisionName` / `sectorName`
- `polygon` (MultiPolygon) — bbox 산출·지역 마스크용

---

### B. 건수 — `POST /article/boundedArticlesCount`

방화동 + URL 전체 타입 filter 예:

```json
{
  "filter": {
    "tradeTypes": ["A1", "B1", "B2", "B3"],
    "realEstateTypes": [
      "A01","A04","B01","A05","A06","A07","C02","A02","B02",
      "C01","C03","C04","D05","F01","D02","E03","D01","E04",
      "E02","D03","D04","E01","Z00"
    ],
    "roomCount": [],
    "bathRoomCount": [],
    "optionTypes": [],
    "oneRoomShapeTypes": [],
    "moveInTypes": [],
    "filtersExclusiveSpace": false,
    "floorTypes": [],
    "directionTypes": [],
    "hasArticlePhoto": false,
    "isAuthorizedByOwner": false,
    "parkingTypes": [],
    "entranceTypes": [],
    "hasArticle": false,
    "legalDivisionNumbers": ["1150010900"],
    "legalDivisionType": "EUP"
  },
  "boundingBox": {
    "left": 126.80096068767511,
    "right": 126.82716671231782,
    "top": 37.586815442903315,
    "bottom": 37.57180380043786
  },
  "precision": 14.900628876372176,
  "userChannelType": "PC"
}
```

검증: HTTP 200, `totalCount: 1059`.

뷰포트만(법정동 없이)일 때: **1343**.

---

### C. 지도 클러스터 — `POST /article/map/articleClusters`

body 패턴은 Count와 동일(페이지네이션 없음).

응답: `clusters[].clusterId`, `coordinates`, `articleCount`  
(드물게 단일 매물 요약 `article` 필드가 붙은 클러스터도 있음)

→ 지도용. **전수 상세 수집에는 D 사용.**

---

### D. 매물 목록 — `POST /article/boundedArticles` ★

Count와 같은 `filter`/`boundingBox`/`precision`에 더해:

```json
"articlePagingRequest": {
  "size": 30,
  "articleSortType": "RANKING_DESC",
  "lastInfo": []
}
```

다음 페이지: 이전 `result.lastInfo`를 그대로 전달.

#### 브라우저 세션에서 검증 (방화동 + 전체 타입)

| 항목 | 결과 |
|------|------|
| Count | 1059 |
| 1페이지 | 30건, `hasNextPage: true` |
| `lastInfo` 예 | `[1, 1040.184…, "2639983090"]` |
| 2페이지 | 30건, `hasNextPage: true`, 다른 articleNumber |
| 1페이지 거래유형 분포 | A1:25, B2:4, B1:1 |
| 1페이지 매물유형 분포 | A01:27, A02:2, D02:1 |

→ **페이지네이션으로 지역 전량 수집 가능** (약 ⌈1059/30⌉ ≈ 36회).

#### 응답 구조

```
result: {
  seed, lastInfo, hasNextPage, totalCount,
  list: [
    {
      representativeArticleInfo: { ...매물 필드 },
      duplicatedArticleInfo?: { ... }   // 있을 수 있음
    }
  ]
}
```

`representativeArticleInfo` 주요 키(이번 재분석에서 확인):

- `articleNumber`, `articleName`, `buildingType`
- `tradeType`, `realEstateType`
- `spaceInfo`, `landInfo`, `buildingInfo`
- `priceInfo` (`dealPrice`, `warrantyPrice`, `rentPrice`, `managementFeeAmount` …) — **원 단위**
- `address` (`city`, `division`, `sector`, `coordinates`)
- `articleDetail` (방향, 층 `floorInfo`/`floorDetailInfo`, 특징 설명 …)
- `brokerInfo`, `verificationInfo`
- `articleMedia` / `articleMediaDto`

샘플(축약, 월세·상가):

```json
{
  "articleNumber": "2639994109",
  "tradeType": "B2",
  "realEstateType": "D02",
  "articleName": "단지내상가",
  "priceInfo": {
    "dealPrice": 0,
    "warrantyPrice": 20000000,
    "rentPrice": 1100000,
    "managementFeeAmount": 100000
  },
  "spaceInfo": { "supplySpace": 63.27, "exclusiveSpace": 35.38 },
  "address": {
    "city": "서울시",
    "division": "강서구",
    "sector": "방화동",
    "coordinates": { "xCoordinate": 126.8081836, "yCoordinate": 37.5711828 }
  },
  "articleDetail": {
    "floorInfo": "1/16",
    "articleFeatureDescription": "개화산역 초역세권 아파트 단지내 상가"
  }
}
```

---

### E. 단지 — `POST /complex/complexClusters`

`showArticles=false`에서도 호출됨.  
URL의 `tradeTypes`/`realEstateTypes`가 filter에 포함됨.  
매물 전수 수집의 주 API는 아님.

---

## 5. 특정 지역 “모든 매물” 수집 체크리스트

1. URL(또는 UI)과 동일한 `tradeTypes` / `realEstateTypes` 배열 사용  
2. 지역 코드: `legalDivisionNumbers` + `legalDivisionType: "EUP"`  
3. bbox: 폴리곤 외접 박스 또는 맵 뷰포트 (법정동만 보기 시에도 맵이 bbox를 같이 보냄)  
4. Count로 목표 건수 확인  
5. `boundedArticles` size=30, `lastInfo` 루프  
6. `representativeArticleInfo` 기준으로 upsert  
7. Rate limit(429) 대비 간격·재시도  
8. TLS: Node 단독 fetch보다 브라우저/`curl_cffi` 권장(기존 경험)

---

## 6. 이번 세션 숫자 요약

| 조건 | totalCount |
|------|------------|
| 뷰포트 + 전체 타입 (`showArticles=true`) | **1343** |
| 방화동(`1150010900`) + 전체 타입 | **1059** |
| articleClusters(뷰포트) totalCount | 1285 (Count와 집계 방식이 다를 수 있음) |

법정동: 서울특별시 강서구 방화동 (`1150010900`)  
센터 좌표(관측): lng≈126.8140637, lat≈37.57931  
zoom/precision: `14.900628876372176`
