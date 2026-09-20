BEGIN;
CREATE TABLE IF NOT EXISTS oddestack_inquiries (
  id uuid PRIMARY KEY,
  idempotency_hash text UNIQUE NOT NULL,
  payload_hash text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS oddestack_inquiries_created ON oddestack_inquiries(created_at);
CREATE TABLE IF NOT EXISTS oddestack_inquiry_limits (
  bucket text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (bucket, window_start)
);
CREATE TABLE IF NOT EXISTS oddestack_inquiry_notifications (
  inquiry_id uuid PRIMARY KEY REFERENCES oddestack_inquiries(id) ON DELETE CASCADE,
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  lease_token uuid,
  locked_until timestamptz,
  delivered_at timestamptz,
  last_error text
);
CREATE INDEX IF NOT EXISTS oddestack_notifications_due ON oddestack_inquiry_notifications(next_attempt_at) WHERE delivered_at IS NULL;
COMMIT;
