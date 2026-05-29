# Security Specification

## Data Invariants
1. **User Ownership**: A user can only modify their own profile, favorites, and listings.
2. **Car Listings**: Publicly readable. Only the creator/seller can update or delete.
3. **Payments**: Private to the user who made them. Immutable after creation.
4. **Bookings**: Only accessible to the buyer (userId) or the seller (sellerId).
5. **Chats**: Only accessible to participants.
6. **Integrity**: Timestamps (createdAt, updatedAt) must be server-generated.

## The "Dirty Dozen" Payloads (Failed Cases)
1. **Identity Spoofing**: `create` in `cars` with a `seller.id` that doesn't match `request.auth.uid`.
2. **Admin Privilege Escalation**: Update a car to `isVerified: true` as a regular user.
3. **Shadow Field Injection**: `create` a booking with an undocumented field `isAdminOverride: true`.
4. **PII Leak**: `get` another user's profile detail.
5. **Orphaned Writes**: `create` a booking for a `carId` that doesn't exist.
6. **State Shortcutting**: Update a booking status directly to `Confirmed` by the buyer (only seller or system should do this).
7. **Temporal Fraud**: `create` a car with a `createdAt` in the past (must be `request.time`).
8. **Owner Hijack**: Update `seller.id` of an existing car to a different UID.
9. **Quota Exhaustion (Large Payloads)**: Send a 1MB string in `description`.
10. **ID Poisoning**: Use a document ID like `.../bookings/LONG_JUNK_STRING`.
11. **Chat Sniffing**: `list` or `get` messages of a chat where the user is not a participant.
12. **Blanket Read Scam**: Query `payments` without a `userId` filter.

## Test Runner
Verified with `firestore.rules`.
