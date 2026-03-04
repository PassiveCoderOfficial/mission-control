import { BANGLADESH_TZ } from '@/types/auth.types';

/**
 * Format a date for Bangladesh timezone
 */
export function formatDateForBD(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: BANGLADESH_TZ,
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
  };

  if (format === 'long') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-BD', options).format(dateObj);
}

/**
 * Get current time in Bangladesh timezone
 */
export function getCurrentTimeInBD(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: BANGLADESH_TZ }));
}

/**
 * Convert UTC date to Bangladesh timezone string
 */
export function convertToBDTime(utcDate: Date): string {
  return utcDate.toLocaleString('en-BD', {
    timeZone: BANGLADESH_TZ,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Get Bangladesh timezone offset in minutes
 */
export function getBDTimezoneOffset(): number {
  const now = new Date();
  const bdTime = new Date(now.toLocaleString('en-US', { timeZone: BANGLADESH_TZ }));
  const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  
  return (bdTime.getTime() - utcTime.getTime()) / (1000 * 60);
}

/**
 * Check if current time is within Bangladesh business hours (9 AM - 6 PM, Monday-Friday)
 */
export function isBDBusinessHours(): boolean {
  const now = getCurrentTimeInBD();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();
  
  // Monday to Friday, 9 AM to 6 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

/**
 * Format time relative to now in Bangladesh timezone
 */
export function formatTimeAgoInBD(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = getCurrentTimeInBD();
  const bdDate = new Date(dateObj.toLocaleString('en-US', { timeZone: BANGLADESH_TZ }));
  
  const diffInSeconds = Math.floor((now.getTime() - bdDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDateForBD(bdDate, 'short');
}