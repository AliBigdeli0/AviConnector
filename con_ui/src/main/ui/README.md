# Atlassian Component

To get icons from icons, implement following command:

```javascript
import EditIcon from '@atlaskit/icon/glyph/edit';
import { IconButton } from '@atlaskit/button/new';

<IconButton icon={EditIcon} label="Edit"></IconButton>;
```

[Atlassian Icon Explorer](https://atlassian.design/components/icon/icon-explorer)
[Atlassian Icon Object](https://atlassian.design/components/icon-object/icon-explorer)

# CSS center of screen style

```css
style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: '700',
    }}
```

## Alerts & Spinner

### Alerts

To create alerts first you need to add two variables in the parent `InitTheme` function.

```js
// for update
const [updateParent, setUpdateParent] = useState(false);

// stack of messages
const [alertMsg, setAlertMsg] = useState < AlertMsgType > [];
```

To push message to alert section you can use the following code :

```js
alertMsg.push({
    type: 'sucess',
    title: 'test',
    description: `${alertMsg.length}from description`,
});
setAlertMsg(alertMsg);

// do not forget to update parent to see the alerts
setUpdateParent(!updateParent);
```

### Spinner

using spinner is much easier, just create a variable for `InitTheme` function :

```js
const [showSpinner, setShowSpinner] = useState < MsgType > '';
```

whenever you wanted to show alert fill it with a message:

```js
// to show message
setShowSpinner('show data...');

// to hide spinner
setShowSpinner('');
```

## Full Size Screen

to get full size screen is like:

```javascript
<Box
    id="main_home"
    padding="space.100"
    xcss={xcss({
        backgroundColor: 'color.background.accent.red.bolder',
        height: `calc(100vh - ${Constant.MenuSize + 1}px)`,
    })}></Box>
```
