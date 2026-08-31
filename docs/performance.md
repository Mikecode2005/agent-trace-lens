# Performance notes

Large traces should be aggregated on the server or at the collector boundary. The UI should cap table rows, paginate investigations, and avoid recalculating summaries for every render. Use deterministic fixtures for performance regressions.
