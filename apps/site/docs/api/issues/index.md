# Issues

Sodd has a number of built-in issue types that are returned when parsing fails. You can use these to provide better error messages to your users. All issues have at least two properties:

1. `code` — A string that identifies the issue type. This is useful for programatically handling issues.
2. `path` — An array of property names or indices that identifies the path to the value that caused the issue. This is useful for displaying error messages to users.

Issues will usually have additional properties that provide more information about the issue. See the individual issue types for more information.

See also the [guide on error handling](/guides/error-handling).
