# UI Plan

here is the plan parts:

-   [ ] UI Page
    -   [ ] UI Components
        -   [ ] Charts (Chartjs)
        -   [ ] Numeric
        -   [ ] Guages
        -   [ ] Pits
        -   [ ] Playback Scroll (for both time/depth based)
    -   [ ] UI Page Settings
    -   [ ] UI Time Base
    -   [ ] UI Depth Page
    -   [ ] Home Page
    -   [ ] About Page
    -   [ ] Login Page
    -   [ ] Settings Page
    -   [ ] Exports Page
    -   [ ] Utility
        -   [ ] SignalR Connection
        -   [ ] Time Helper
        -   [ ] Playback Actions
            -   [ ] Time Base
            -   [ ] Depth Base
-   [ ] Backend
    -   [ ] Well's Parameter Sync (For each Wells Separately)
    -   [ ] Page Security
    -   [ ] Save Components In Database (Mongo)

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

```tsx
<Box
    id="main_home"
    padding="space.100"
    xcss={xcss({
        backgroundColor: 'color.background.accent.red.bolder',
        height: `calc(100vh - ${Constant.MenuSize + 1}px)`,
    })}></Box>
```

and go get size :

```js
const size = SizeHelper.getElementSize('main_home');
console.log('the size is: ', size);
```

## GRPC

before anything pull docker protoc image with following command :

```shell
docker pull znly/protoc
```
