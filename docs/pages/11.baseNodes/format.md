### `format`

```js
format(nodeOrValue, [(format = '##.###')]);
```

Similar to concat. If `nodeOrValue` resolves to a number, the number is formatted according to the number formatter string passed as the second argument. A string will just be returned as is.

Format string will default to `##.###`, which is simply a standard decimal format with up to 3 decimal places. (eg. 12.12, 1234, 12.134)

Number format patterns are as per the Unicode TR35 spec https://www.unicode.org/reports/tr35/tr35-31/tr35-numbers.html#Number_Format_Patterns

Examples:
`format(1234567, '$#,###') // $1,234,567 (localized)`
`format(1234.1, '$#,##0.00') // $1,234.10 (localized)`
