# Data modes

Every visible dataset must identify its freshness mode. Sample is deterministic fixture data, live is provider-backed telemetry, cached is a stored result with a known capture time, and delayed is live data behind an ingestion or processing lag.

A connection failure must remain visible; it must not become an empty sample dashboard.
