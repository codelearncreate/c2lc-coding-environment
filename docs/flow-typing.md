# Making Flow Aware of the Types for Our Dependencies

Flow needs help understanding dependencies that do not themselves use Flow. For
this purpose, we use `npx flow-typed <package@version>` to create files that
describe the types used in a given package. Thus far we have used this for the
following packages, as outlined in these commands:

```shell
npx flow-typed install classnames@2
npx flow-typed install enzyme@3
npx flow-typed install jest@24
npx flow-typed install react-bootstrap@0.32
npx flow-typed install react-intl@2
```

Note that there have been local changes to the flow types for `react-intl` and
`react-bootstrap`, those definitions cannot simply be regenerated or updated.

We have manually created types for packages that do note have flow-typed
definitions, like `Tone.js`. We also created types for the `messages.json`
language bundle used in this package.
