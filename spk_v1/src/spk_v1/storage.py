"""Publish complete files without following an existing destination symlink."""

from __future__ import annotations

import os
import stat
import tempfile
from contextlib import contextmanager
from pathlib import Path
from typing import BinaryIO, Iterator


@contextmanager
def atomic_output(path: Path) -> Iterator[BinaryIO]:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as output:
            if path.exists() and not path.is_symlink():
                previous = path.stat()
                if stat.S_ISREG(previous.st_mode):
                    os.fchmod(output.fileno(), stat.S_IMODE(previous.st_mode))
            yield output
            output.flush()
            os.fsync(output.fileno())
        # Replace the directory entry itself, including a symlink, never its target.
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def atomic_write_text(path: Path, text: str) -> None:
    with atomic_output(path) as output:
        output.write(text.encode("utf-8"))
