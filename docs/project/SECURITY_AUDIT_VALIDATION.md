# Security Audit Validation

- generated_at: `2026-04-13T06:16:45.820367+00:00`
- validation_passed: `False`
- audit_status: `NOT_STARTED`

## Checks

- status_enum_valid: `True`
- status_completed: `False`
- critical_findings_closed: `True`
- high_findings_closed: `True`
- report_url_present: `False`
- report_url_http: `False`
- completed_at_present: `False`
- completed_at_valid_iso: `False`

## Errors

- external_audit.status must be COMPLETED for expansion gate.
- report_url is required for completed audit evidence.
- report_url must be an http(s) URL.
- completed_at is required for completed audit evidence.
- completed_at must be valid ISO-8601 timestamp.
