# Task Notifier 사용법

작업 진행 상황을 Telegram으로 실시간 알림 받는 시스템입니다.

## 설정

`.env` 파일에 이미 설정되어 있음:
```bash
TELEGRAM_BOT_TOKEN=8598173520:AAFOueWt-WkUrKqjj1sUO_oD0Un-t4RcbmI
ALLOWED_USERS=990198083
```

## 사용 방법

### 1. 간단한 함수 호출 (권장)

```typescript
import { initTaskNotifier, notifyTaskStarted, notifyTaskInProgress, notifyTaskCompleted } from 'oh-my-telegram';

// 초기화 (한 번만)
initTaskNotifier(process.env.TELEGRAM_BOT_TOKEN, process.env.ALLOWED_USERS);

// 작업 시작
await notifyTaskStarted({
  project: '프로젝트명',
  taskName: '작업 이름',
  description: '작업 설명',
  metadata: { file: 'file.ts', phase: 'implementation' },
});

// 진행 상황 업데이트
await notifyTaskInProgress({
  project: '프로젝트명',
  taskName: '작업 이름',
  description: '작업 설명',
  progress: '구현 중 (50%)',
  remaining: '테스트, 빌드 (50%)',
  metadata: { completed: ['phase1'], remaining: ['phase2', 'phase3'] },
});

// 작업 완료
await notifyTaskCompleted({
  project: '프로젝트명',
  taskName: '작업 이름',
  description: '작업 설명',
  metadata: { totalTime: '5m', filesChanged: 3 },
});

// 실패 시
await notifyTaskFailed({
  project: '프로젝트명',
  taskName: '작업 이름',
  description: '작업 설명',
  error: '에러 메시지',
  metadata: { errorCode: 500 },
});
```

### 2. Task Tracker 사용 (더 간단)

```typescript
import { getTaskNotifier } from 'oh-my-telegram';

const notifier = getTaskNotifier();
const task = notifier.createTask('프로젝트명', '작업 이름', '작업 설명');

await task.started();
await task.update('50% 완료', '테스트 남음');
await task.complete({ totalTime: '5m' });
// 또는
await task.failed('에러 발생');
```

## 작업 템플릿

### 새로운 기능 추가 시

```typescript
// 1. 시작
await notifyTaskStarted({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 주가 조회 기능',
  description: '한국 주식시장 실시간 데이터 연동',
});

// 2. 진행 (반복)
await notifyTaskInProgress({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 주가 조회 기능',
  description: '한국 주식시장 실시간 데이터 연동',
  progress: 'API 연동 완료 (30%)',
  remaining: '데이터 파싱, 포맷팅, 테스트 (70%)',
});

// 3. 완료
await notifyTaskCompleted({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 주가 조회 기능',
  description: '한국 주식시장 실시간 데이터 연동',
  metadata: { stocksSupported: 'KOSPI, KOSDAQ', updateInterval: 'real-time' },
});
```

### 버그 수정 시

```typescript
await notifyTaskStarted({
  project: 'oh-my-telegram',
  taskName: '메시지 에디팅 버그 수정',
  description: '긴 메시지가 잘리는 문제 해결',
});

// ... 작업 중 ...

await notifyTaskCompleted({
  project: 'oh-my-telegram',
  taskName: '메시지 에디팅 버그 수정',
  description: '긴 메시지가 잘리는 문제 해결',
  metadata: { bugType: 'chunking', fixMethod: 'editMessageText' },
});
```

## 내 작업 프로세스 통합

### 복잡한 작업 (여러 단계)

```typescript
async function implementNewFeature() {
  const project = 'oh-my-telegram';
  const taskName = '새 기능 구현';
  const description = '상세 설명';

  await notifyTaskStarted({ project, taskName, description });

  try {
    // 단계 1: 분석
    await notifyTaskInProgress({
      project, taskName, description,
      progress: '요구사항 분석 완료',
      remaining: '설계, 구현, 테스트',
      metadata: { step: 1, totalSteps: 3 },
    });

    // 단계 2: 구현
    await notifyTaskInProgress({
      project, taskName, description,
      progress: '구현 완료 (80%)',
      remaining: '테스트만 남음',
      metadata: { step: 2, totalSteps: 3 },
    });

    // 단계 3: 테스트
    await notifyTaskInProgress({
      project, taskName, description,
      progress: '테스트 중 (95%)',
      remaining: '최종 검증',
      metadata: { step: 3, totalSteps: 3 },
    });

    await notifyTaskCompleted({
      project, taskName, description,
      metadata: { totalTime: '15m' },
    });
  } catch (error) {
    await notifyTaskFailed({
      project, taskName, description,
      error: error.message,
      metadata: { errorType: error.name },
    });
    throw error;
  }
}
```

## 항상 따를 작업 규칙

### ✅ 필수 (무조건)
1. **작업 시작 시** `notifyTaskStarted()` 호출
2. **단계 완료 시** `notifyTaskInProgress()`로 업데이트
3. **작업 완료 시** `notifyTaskCompleted()` 호출
4. **실패 시** `notifyTaskFailed()` 호출

### 📋 필수 항목
- **project**: 프로젝트명 (예: oh-my-telegram, clawdbot)
- **taskName**: 간단한 작업명 (예: BTC 분석 기능)
- **description**: 상세 설명 (무엇을 하는지)
- **progress**: 현재 진행 상황 (백분율 또는 단계)
- **remaining**: 남은 작업 (무엇이 남았는지)
- **metadata**: 추가 정보 (파일명, 라인수, 소요시간 등)

### ⏰ 알림 타이밍
- **시작**: 작업 시작 즉시
- **진행**: 주요 단계 완료 시마다
- **완료**: 작업 완료 즉시
- **실패**: 에러 발생 즉시

## 예제: 실제 작업 시나리오

```typescript
// 예: KOSPI 주가 기능 추가
await notifyTaskStarted({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 실시간 주가',
  description: '한국 주식시간 실시간 데이터 조회 및 분석',
});

await notifyTaskInProgress({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 실시간 주가',
  description: '한국 주식시간 실시간 데이터 조회 및 분석',
  progress: 'KRX API 연동 완료 (40%)',
  remaining: '주가 파싱, 기술적 분석, Telegram 포맷팅 (60%)',
  metadata: { api: 'KRX', endpoint: '/stock/price' },
});

await notifyTaskInProgress({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 실시간 주가',
  description: '한국 주식시간 실시간 데이터 조회 및 분석',
  progress: '기술적 분석 로직 구현 (80%)',
  remaining: '테스트만 남음 (20%)',
  metadata: { indicators: ['RSI', 'MACD', '이동평균선'] },
});

await notifyTaskCompleted({
  project: 'oh-my-telegram',
  taskName: 'KOSPI 실시간 주가',
  description: '한국 주식시간 실시간 데이터 조회 및 분석',
  metadata: { stocks: 'KOSPI200', indicators: 5, buildStatus: 'success' },
});
```

## 테스트

```bash
# 테스트 스크립트 실행
node test-notifier.ts

# Telegram에서 3개 메시지 확인:
# 1. 🚀 작업 시작
# 2. ⏳ 진행 중 (60%)
# 3. ✅ 완료
```

## 통합 방법

### 프로젝트 초기화 시

```typescript
// index.ts 또는 main.ts
import { initTaskNotifier } from 'oh-my-telegram';

initTaskNotifier(
  process.env.TELEGRAM_BOT_TOKEN!,
  process.env.ALLOWED_USERS!
);
```

### 전역에서 사용

```typescript
// 어디서든 import
import { notifyTaskStarted, notifyTaskInProgress, notifyTaskCompleted } from 'oh-my-telegram';

// 작업 시작
await notifyTaskStarted({...});
```
