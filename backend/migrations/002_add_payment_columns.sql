-- migrations/002_add_payment_columns.sql
-- Adds columns needed to track a Razorpay TEST MODE payment against an
-- existing order. Safe to run multiple times (IF NOT EXISTS).

ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id   TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at             TIMESTAMPTZ;

-- payment_status already exists per the original schema (defaults to
-- 'pending' on insert). Expected values used by this code:
--   pending -> created, not paid
--   completed -> verified payment received (sandbox)
--   failed -> verification failed / payment failed
