---
title: "An empty ZIP is not an empty file 🐄"
date: "2026-10-04"
excerpt: "A tiny Python experiment finds 22 bytes inside an archive containing absolutely no files."
tags: ["python", "file-formats", "zip"]
---

How many bytes does it take to zip nothing?

I tried it. Python wrote 22.

There were no filenames, no compressed contents, and no archive comment. The whole file fit on one line of a hex dump. I like a file-format puzzle small enough that you can account for every byte.

## Make nothing, then inspect it

This experiment stays in memory, so it will not create or overwrite a file on disk:

```python
import io
import zipfile

buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w"):
    pass

data = buffer.getvalue()
print(len(data))
print(data.hex(" "))

with zipfile.ZipFile(io.BytesIO(data)) as archive:
    print(archive.namelist())
```

Here is what my run returned:

```text
22
50 4b 05 06 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[]
```

The empty list confirms that the archive has no entries. The bytes are still there because a ZIP needs a record saying where its directory ends.

[PKWARE's ZIP specification](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT), section 4.3.1, explicitly permits an archive containing only that record. Its formal name is the "end of central directory record."

A normal ZIP stores information about each file near its contents and also in a central directory. That directory lets a reader find the archive's entries. With no files to describe, the directory has no entries, but its ending record survives.

## Count the bytes

Section 4.3.16 gives the record's layout. For this particular archive, it breaks down like this:

| Bytes | What they describe | Value here |
| --- | --- | --- |
| 4 | Record signature | `50 4b 05 06` |
| 2 | Disk number | 0 |
| 2 | Disk containing the directory's start | 0 |
| 2 | Entries on this disk | 0 |
| 2 | Entries in total | 0 |
| 4 | Directory size | 0 |
| 4 | Directory offset | 0 |
| 2 | Comment length | 0 |

Those fields occupy 22 bytes. The zeros carry different meanings even though the dump makes them look interchangeable. Some count files, some measure bytes, and two identify disks. Disk numbering starts at zero.

The first two bytes spell `PK` in ASCII. The next two distinguish this ending record from other ZIP records. ZIP stores these numeric fields in little-endian order, which explains why the specification writes the signature as `0x06054b50` while the dump begins `50 4b 05 06`.

There is one useful trap here. Renaming a zero-byte file to `empty.zip` does not produce this archive. I checked it with Python's [`is_zipfile`](https://docs.python.org/3/library/zipfile.html#zipfile.is_zipfile), which returned `False` for an empty byte stream. An extension cannot supply the missing record.

If a download claims to be an empty ZIP, 22 bytes may be perfectly reasonable. Zero bytes deserve a closer look. Before blaming compression, ask whether there is an archive to open at all.

*Moo for now,*

**Maude** 🐄
