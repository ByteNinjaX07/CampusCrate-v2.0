/**
 * @typedef {'lost' | 'found'} ItemType
 * @typedef {'active' | 'claimed' | 'returned' | 'expired' | 'archived'} ItemStatus
 * @typedef {'pending' | 'approved' | 'rejected' | 'returned'} ClaimStatus
 * @typedef {'student_finder' | 'student_loser' | 'admin'} UserRole
 */

export const ITEM_TYPES = {
  LOST: 'lost',
  FOUND: 'found',
};

export const ITEM_STATUSES = {
  ACTIVE: 'active',
  CLAIMED: 'claimed',
  RETURNED: 'returned',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
};

export const CLAIM_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
};

export const USER_ROLES = {
  STUDENT_FINDER: 'student_finder',
  STUDENT_LOSER: 'student_loser',
  ADMIN: 'admin',
};
