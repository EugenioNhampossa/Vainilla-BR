import { Kbd, TextInput } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons';

export function SearchInput() {

    const rightSection = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Kbd>Ctrl</Kbd>
            <span style={{ margin: '0 5px' }}>+</span>
            <Kbd>K</Kbd>
        </div>
    );

    return (
        <TextInput
            onClick={() => openSpotlight()}
            placeholder="Search"
            icon={<IconSearch size={16} />}
            rightSectionWidth={90}
            rightSection={rightSection}
            styles={{ rightSection: { pointerEvents: 'none' } }}
        />
    );
}