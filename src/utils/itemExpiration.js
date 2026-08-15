/**
 * Utility function to automatically mark items as 'expired' or 'archived'
 * after 30 days of inactivity to keep the feed fresh and reduce clutter.
 *
 * @param {Array} items List of items to check
 * @param {number} daysThreshold Inactivity period in days (default: 30)
 * @returns {{ updatedItems: Array, expiredCount: number, archivedCount: number }}
 */
export function checkAndMarkExpiredItems(items = [], daysThreshold = 30) {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  let expiredCount = 0;
  let archivedCount = 0;

  const updatedItems = items.map((item) => {
    // Only active items can expire; already claimed/returned items are resolved
    if (item.status !== 'active' && item.status !== 'expired') {
      return item;
    }

    const itemDate = new Date(item.createdAt || item.date);
    const diffDays = (now.getTime() - itemDate.getTime()) / msPerDay;

    // Mark active items older than threshold (30 days) as 'expired'
    if (item.status === 'active' && diffDays >= daysThreshold) {
      expiredCount++;
      return {
        ...item,
        status: 'expired',
      };
    }

    // Move expired items older than 60 days to 'archived'
    if (item.status === 'expired' && diffDays >= daysThreshold * 2) {
      archivedCount++;
      return {
        ...item,
        status: 'archived',
      };
    }

    return item;
  });

  return { updatedItems, expiredCount, archivedCount };
}

/**
 * Helper to check whether an individual item is expired or archived based on date
 * @param {Object} item
 * @param {number} daysThreshold
 * @returns {boolean}
 */
export function isItemExpired(item, daysThreshold = 30) {
  if (item.status === 'expired' || item.status === 'archived') return true;
  if (item.status !== 'active') return false;

  const itemDate = new Date(item.createdAt || item.date);
  const now = new Date();
  const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= daysThreshold;
}
