import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React from 'react';
import { TbAtom } from 'react-icons/tb';

export const TagLink = React.memo<any>(({
  size='sm',
  borderRadius='full',
  version, 
  key,
  hrefSpace = '/',
  leftIcon = TbAtom,
  onClick,
  colorScheme = 'blue'
}:{
  size?: string;
  borderRadius?: string;
  version: string; 
  key?: any;
  hrefSpace?: string;
  leftIcon?: any;
  onClick?: any;
  colorScheme?: string;
}) => {
  return (<a href={hrefSpace} key={key} onClick={onClick}>
      <Tag size={size} variant='subtle' colorScheme={colorScheme} borderRadius={borderRadius}>
        <TagLeftIcon as={leftIcon} />
        <TagLabel>{version}</TagLabel>
      </Tag>
    </a>
  )
})