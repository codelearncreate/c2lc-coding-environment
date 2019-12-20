# Contributing to the C2LC coding environment

## Coding Conventions

- Use [Flow](https://flow.org/) for static type checking
- Organize CSS by React component, storing the CSS for a component in a file named `COMPONENT.css` (for example `TextEditor.css`)
- Use [BEM](http://getbem.com/) (Block Element Modifier) to name and structure styles
- Do instance property initialization in the constructor
- Use [prototype method syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Prototype_methods) for class methods
- Use public class field syntax for React event handlers
    - [Handling Events (React documentation)](https://reactjs.org/docs/handling-events.html)
    - [Event Handling for React (Flow documentation)](https://flow.org/en/docs/react/events/)
    - [Ecma TC39 "Class field declarations for JavaScript" proposal](https://github.com/tc39/proposal-class-fields)
- Provide dependencies to an object instance via constructor parameters
- Prefer single quotes for string literals

### Naming

- JavaScript classes: UpperCamelCase
- Flow types: UpperCamelCase
- Methods and Functions: lowerCamelCase
- Event handlers begin with "handle" (for example `handleClick`)
- Event emitters begin with "on" (for example `onClick={this.handleClick}`)

## Testing with Enzyme and react-intl

### Shallow Rendering

When `injectIntl` is used, render `ComponentUnderTest.WrappedComponent` with an `intl` prop:

    import { createIntl } from 'react-intl';

    const intl = createIntl({
        locale,
        defaultLocale,
        messages
    });

    const wrapper = shallow(
        <ComponentUnderTest.WrappedComponent
            intl={intl} />
    );

Otherwise, render `ComponentUnderTest` directly:

    const wrapper = shallow(
        <ComponentUnderTest />
    );

### DOM Rendering

Render `ComponentUnderTest` with an `IntlProvider` `wrappingComponent`:

    import { IntlProvider } from 'react-intl';

    const wrapper = mount(
        <ComponentUnderTest />,
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale,
                defaultLocale,
                messages
            }
        }
    );
