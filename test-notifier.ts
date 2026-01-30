#!/usr/bin/env node

import 'dotenv/config.js';
import { initTaskNotifier, notifyTaskStarted, notifyTaskInProgress, notifyTaskCompleted } from './dist/task-notifier.js';

const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.ALLOWED_USERS?.split(',')[0] || '';

initTaskNotifier(botToken, chatId);

async function test() {
  await notifyTaskStarted({
    project: 'oh-my-telegram',
    taskName: 'Task Notifier 구현',
    description: '작업 진행 상황 Telegram 알림 시스템 개발',
    metadata: { file: 'task-notifier.ts', lines: 280 },
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  await notifyTaskInProgress({
    project: 'oh-my-telegram',
    taskName: 'Task Notifier 구현',
    description: '작업 진행 상황 Telegram 알림 시스템 개발',
    progress: '코드 작성 완료 (60%)',
    remaining: '테스트 및 빌드 (40%)',
    metadata: { phase: 'implementation', completed: ['types', 'class', 'methods'] },
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  await notifyTaskCompleted({
    project: 'oh-my-telegram',
    taskName: 'Task Notifier 구현',
    description: '작업 진행 상황 Telegram 알림 시스템 개발',
    metadata: { totalFiles: 1, totalLines: 280, buildTime: '2s' },
  });
}

test().catch(console.error);
