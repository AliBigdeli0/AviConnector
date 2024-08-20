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
