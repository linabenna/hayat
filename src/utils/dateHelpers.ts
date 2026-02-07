/**
 * Date Helper Utilities
 */

import {format, differenceInDays, differenceInHours, parseISO} from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const getDaysUntil = (targetDate: string | Date): number => {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  return differenceInDays(target, new Date());
};

export const getHoursUntil = (targetDate: string | Date): number => {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  return differenceInHours(target, new Date());
};

export const isOverdue = (date: string | Date): boolean => {
  return getDaysUntil(date) < 0;
};

export const isUrgent = (date: string | Date, thresholdDays: number = 30): boolean => {
  const daysUntil = getDaysUntil(date);
  return daysUntil >= 0 && daysUntil <= thresholdDays;
};
