import axios from 'axios';

/**
 * Task progress status
 */
export type TaskStatus = 'started' | 'in_progress' | 'completed' | 'failed';

/**
 * Task notification structure
 */
export interface TaskNotification {
  status: TaskStatus;
  project: string;
  taskName: string;
  description: string;
  progress?: string;
  remaining?: string;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Telegram task notifier - sends progress updates to Telegram
 */
export class TaskNotifier {
  private botToken: string;
  private chatId: string;
  private apiUrl: string;
  private enabled: boolean;

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.apiUrl = `https://api.telegram.org/bot${botToken}`;
    this.enabled = !!botToken && !!chatId;
  }

  private async sendNotification(message: string): Promise<void> {
    if (!this.enabled) {
      console.log('[TaskNotifier] Disabled (no credentials)');
      return;
    }

    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
      });
    } catch (error: any) {
      console.error('[TaskNotifier] Failed to send notification:', error.response?.data || error.message);
    }
  }

  private formatMessage(notification: TaskNotification): string {
    const statusEmoji = {
      started: '🚀',
      in_progress: '⏳',
      completed: '✅',
      failed: '❌',
    };

    const emoji = statusEmoji[notification.status];
    const timestamp = new Date().toLocaleString('ko-KR');

    let message = `${emoji} *${notification.project}*\n\n`;
    message += `📋 **작업**: ${notification.taskName}\n`;
    message += `📝 ${notification.description}\n`;

    if (notification.progress) {
      message += `\n⏳ **진행상황**: ${notification.progress}\n`;
    }

    if (notification.remaining) {
      message += `📊 **남은작업**: ${notification.remaining}\n`;
    }

    if (notification.error) {
      message += `\n❌ **에러**: ${notification.error}\n`;
    }

    if (notification.metadata) {
      const metadataStr = Object.entries(notification.metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      if (metadataStr) {
        message += `\n📌 ${metadataStr}\n`;
      }
    }

    message += `\n🕒 ${timestamp}`;

    return message;
  }

  async notifyStarted(params: {
    project: string;
    taskName: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const notification: TaskNotification = {
      status: 'started',
      ...params,
    };
    const message = this.formatMessage(notification);
    await this.sendNotification(message);
    console.log(`[TaskNotifier] Started: ${params.project} - ${params.taskName}`);
  }

  async notifyInProgress(params: {
    project: string;
    taskName: string;
    description: string;
    progress: string;
    remaining?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const notification: TaskNotification = {
      status: 'in_progress',
      ...params,
    };
    const message = this.formatMessage(notification);
    await this.sendNotification(message);
    console.log(`[TaskNotifier] In Progress: ${params.project} - ${params.taskName} (${params.progress})`);
  }

  async notifyCompleted(params: {
    project: string;
    taskName: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const notification: TaskNotification = {
      status: 'completed',
      ...params,
    };
    const message = this.formatMessage(notification);
    await this.sendNotification(message);
    console.log(`[TaskNotifier] Completed: ${params.project} - ${params.taskName}`);
  }

  async notifyFailed(params: {
    project: string;
    taskName: string;
    description: string;
    error: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const notification: TaskNotification = {
      status: 'failed',
      ...params,
    };
    const message = this.formatMessage(notification);
    await this.sendNotification(message);
    console.error(`[TaskNotifier] Failed: ${params.project} - ${params.taskName} - ${params.error}`);
  }

  createTask(project: string, taskName: string, description: string) {
    const started = () => this.notifyStarted({ project, taskName, description });

    const update = (progress: string, remaining?: string, metadata?: Record<string, any>) =>
      this.notifyInProgress({ project, taskName, description, progress, remaining, metadata });

    const complete = (metadata?: Record<string, any>) =>
      this.notifyCompleted({ project, taskName, description, metadata });

    const failed = (error: string, metadata?: Record<string, any>) =>
      this.notifyFailed({ project, taskName, description, error, metadata });

    return { started, update, complete, failed };
  }
}

/**
 * Global task notifier instance
 */
let globalNotifier: TaskNotifier | null = null;

/**
 * Initialize global task notifier
 */
export function initTaskNotifier(botToken: string, chatId: string): void {
  globalNotifier = new TaskNotifier(botToken, chatId);
}

/**
 * Get global task notifier instance
 */
export function getTaskNotifier(): TaskNotifier | null {
  return globalNotifier;
}

/**
 * Convenience function to notify task started
 */
export async function notifyTaskStarted(params: {
  project: string;
  taskName: string;
  description: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  if (!globalNotifier) {
    console.warn('[TaskNotifier] Not initialized. Call initTaskNotifier() first.');
    return;
  }
  await globalNotifier.notifyStarted(params);
}

/**
 * Convenience function to notify task in progress
 */
export async function notifyTaskInProgress(params: {
  project: string;
  taskName: string;
  description: string;
  progress: string;
  remaining?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  if (!globalNotifier) {
    console.warn('[TaskNotifier] Not initialized. Call initTaskNotifier() first.');
    return;
  }
  await globalNotifier.notifyInProgress(params);
}

/**
 * Convenience function to notify task completed
 */
export async function notifyTaskCompleted(params: {
  project: string;
  taskName: string;
  description: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  if (!globalNotifier) {
    console.warn('[TaskNotifier] Not initialized. Call initTaskNotifier() first.');
    return;
  }
  await globalNotifier.notifyCompleted(params);
}

/**
 * Convenience function to notify task failed
 */
export async function notifyTaskFailed(params: {
  project: string;
  taskName: string;
  description: string;
  error: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  if (!globalNotifier) {
    console.warn('[TaskNotifier] Not initialized. Call initTaskNotifier() first.');
    return;
  }
  await globalNotifier.notifyFailed(params);
}
