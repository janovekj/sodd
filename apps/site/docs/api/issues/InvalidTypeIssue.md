# `InvalidTypeIssue`

An issue that occurs when the type of the parsed value does not match the expected type. Nearly every schema can result in this issue. In addition to the [basic issue properties](/api/issues), it contains the following information:

- `code`: `"invalid_type"`
- `expected`: The expected type
- `received`: The received type
