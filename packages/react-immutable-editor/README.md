# React Immutable Editor

An editor for [immutable-js](https://immutable-js.github.io/immutable-js/docs/#/") maps in React, hacked around [react-json-tree](https://www.npmjs.com/package/react-json-tree) for debugging of immutables.

Install: `npm i --save-dev react-immutable-editor`

## Minimal Example

```js
import React from 'react';
import { ImmutableEditor, themeMaterial, EditorProps } from 'react-immutable-editor';
import { OrderedMap } from 'immutable';

/**
 * Pass down `data` and optionally an `onChange` handler.
 */
const ThemedImmutableEditor = (props: { data: OrderedMap } & Pick<EditorProps, 'onChange'>) =>
    <ImmutableEditor
        theme={themeMaterial} // any BASE16 style
        invertTheme={false}// useful for default `dark/light` theme

        data={props.data}// pass down your immutable

        // `keys` is an array that can be used for .getIn and .setIn
        // val is the data that was changed
        onChange={(keys, val) => {
            /* update a value in data */
            props.onChange(keys, val)
        }}
        getVal={keys => {
            /* get a value in data */
            return props.data.getIn(keys);
        }}
    />
```

See [demo file](https://github.com/elbakerino/react-immutable-editor/blob/main/demo/src/main.ts) for the full React example.

## Type Support

As input any immutable is valid (e.g. `Map`, `List`), or anything that implements `toJS` (like immutable) and is compatible with `react-json-tree`.

Editing map values currently supports:

- String (will render input or textarea)
- Boolean (will render a checkbox)
- Number (will render a text-input and converts the input back on change)

## Limitations

Adding and deleting existing entries is currently not implemented.

Changing object properties (not the values) isn't implemented yet.

Styling currently doesn't handle invert correctly inside the editor added parts, it switches color values instead of inverting them.

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](https://github.com/elbakerino/react-immutable-editor/blob/main/LICENSE).

Created by [Michael Becker](https://i-am-digital.eu)
