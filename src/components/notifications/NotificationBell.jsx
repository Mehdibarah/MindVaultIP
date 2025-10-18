import React from 'react';

/**
 * Since wallet functionality has been removed, the notification bell is disabled
 * as it relies on a wallet address to fetch user-specific notifications.
 * This component now returns null to prevent errors.
 */
export default function NotificationBell() {
  return null;
}