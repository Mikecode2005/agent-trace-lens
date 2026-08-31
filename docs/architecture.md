# Architecture

The UI is a server-rendered React Router route. Loader query parameters control filtering and trace focus. A normalized span module owns the sample fixture and pure filter/summary helpers. The API route exports sample spans with no-store headers.

The next ingestion layer should map OpenTelemetry spans into the same contract instead of replacing sample data silently.
