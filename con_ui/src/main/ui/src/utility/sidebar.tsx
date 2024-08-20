//
import React from 'react';

import ChartIcon from '@atlaskit/icon/glyph/list';
import { IconButton } from '@atlaskit/button/new';
import { Bleed, Box, xcss } from '@atlaskit/primitives';

export const sidebar = () => {
    return (
        <Box
            backgroundColor="color.background.brand.subtlest"
            xcss={xcss({
                borderRadius: 'border.radius.0',
                width: '100%',
            })}>
            <IconButton
                icon={ChartIcon}
                label="Edit"
                spacing="compact"
                appearance="subtle"></IconButton>
        </Box>
    );
};
