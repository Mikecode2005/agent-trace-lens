# Trace lifecycle

A trace enters through an ingestion adapter, is normalized into spans, is filtered by query parameters, is summarized for the overview, and is rendered as an investigation table. Export should preserve the mode and generatedAt metadata so downstream users do not confuse fixtures with production data.
