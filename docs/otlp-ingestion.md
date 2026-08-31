# OTLP ingestion plan

The planned adapter will accept OTLP HTTP from a local collector, validate payload shape, normalize resource and span attributes, and retain only the fields needed for investigation. It should expose ingestion health separately from trace data so a broken collector cannot look like a quiet system.
