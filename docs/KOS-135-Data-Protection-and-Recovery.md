# KOS-135 — Data Protection & Recovery

## Protection layers

1. Every KOS transaction saves automatically.
2. Every save creates a rolling browser recovery point.
3. Imports, resets, migrations, and restores create a pre-change recovery point.
4. External backups use a versioned envelope and integrity checksum.
5. Persistent browser storage can be requested when supported.

## Important distinction

Browser recovery points protect against mistakes and some corruption on the same browser. They do not survive complete deletion of browser storage. External backup files protect against browser or device loss.

## Retention

The repository retains the 20 most recent automatic recovery points by default.
