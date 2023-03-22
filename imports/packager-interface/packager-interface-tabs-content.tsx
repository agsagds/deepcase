import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RiInstallLine, RiUninstallLine } from 'react-icons/ri';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Box, Button, Divider, Flex, HStack, List, ListItem, Select, Spacer, Text } from '@chakra-ui/react';
import { Install } from "./icons/install";
import { TbArrowRotaryFirstRight, TbBookDownload } from 'react-icons/tb';
import { TagLink } from '../tag-component';
import _ from 'lodash';

const axiosHooks = require("axios-hooks");
const axios = require("axios");
const useAxios = axiosHooks.makeUseAxios({ axios: axios.create() });

const tabTextVariant = {
  active: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.3
    }
  },
  inactive: {
    opacity: 0,
    x: -30,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.1
    },
    transitionEnd: { display: "none" }
  }
};

const variantsPackages = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const variantsPackage = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

export interface IPackageInstalledVersion {
  id: number;
  version: string;
  packageId: number;  
}

export interface IPackage {
  id: number;
  name: string;
  description?: any;
  versions?: IPackageInstalledVersion[];
}

interface IPackageProps extends IPackage {
  i?: number;
  expanded?: boolean | number;
  onOpen?: (e: any) => any;
  style?: any;
  variants?: any;
  transition?: any;
  latestVersion: string;
}

export type Package = IPackage[];

const versionsListVariants = {
  open: {
    opacity: 1,
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

// const versions = [
//   '0.1',
//   '0.1.2',
//   '0.3',
//   '0.3.2',
//   '1.0'
// ]

const ListVersions = React.memo<any>(({ 
  name,
  latestVersion
}) => {
  const [isOpenListVersions, setIsOpenListVersions] = useState(false);
  const [selectValue, setSelectValue ] = useState(latestVersion);

  const [{ data, loading, error }, refetch] = useAxios(`https://registry.npmjs.com/${name}`);

  console.log('ListVersions.data', data)

  const versions = data ? Object.keys(data.versions) : [latestVersion];

  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  versions.sort(collator.compare);
  console.log('ListVersions.versions', versions)

  return (<Box as={motion.nav}
      initial={false}
      animate={isOpenListVersions ? "open" : "closed"}
      sx={{
        filter: 'drop-shadow(0px 0px 1px #5f6977)',
        width: '3.9rem',
        position: 'absolute',
        top: 0,
        right: 0,
      }}
    >
      <Box as={motion.button}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpenListVersions(!isOpenListVersions)}
        sx={{
          background: '#fff',
          color: '#0080ff',
          border: 'none',
          borderRadius: '0.3rem',
          p: '0.1rem 0.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          w:'100%',
          textAlign: 'left',
          mb: '0.3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text fontSize='sm'>{selectValue}</Text>
        <Box as={motion.div}
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 }
          }}
          animate={{ originY: 0.55 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <TbArrowRotaryFirstRight />
        </Box>
      </Box>
      <Box
        as={motion.ul}
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0% round 5px)",
            y: 0,
            originY: 0.5,
            originX: 0.5,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05
            }
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50% round 5px)",
            originY: 0,
            originX: 1,
            y: -26,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              delay: 0.3,
            }
          }
        }}
        sx={{
          zIndex: 44,
          position: 'relative',
          display: 'flex',
          height: '4rem',
          flexDirection: 'column',
          gap: '0.7rem',
          background: '#fff',
          p: 2,
          overflowY: 'scroll',
          overscrollBehavior: 'contain',
        }}
        style={{ pointerEvents: isOpenListVersions ? "auto" : "none" }}
      >
        {versions && versions.map(v => (
          <Box 
            as={motion.li} 
            sx={{listStyle: 'none', display: 'block', fontSize: '0.8rem'}} 
            variants={versionsListVariants}
            key={v}
            role='button'
            onClick={() => {
              setSelectValue(v);
              setIsOpenListVersions(false);
            }}
          >{v}</Box>
        ))}
      </Box>
    </Box>
  )
})

const PackageItem = React.memo<any>(function PackageItem({
  id,
  expanded, 
  onOpen, 
  name, 
  description,
  versions, 
  style,
  variants = {},
  transition = {},
  latestVersion = "0.0.0",
}:IPackageProps) {

  const open = expanded;

  return (<Box 
      as={motion.li} 
      variants={variantsPackage} 
      sx={{
        listStyle: "none", 
        background: 'transparent', 
        p: 1, 
        borderRadius: '0.5rem',
        border: '1px solid #e2e7ed',
      }}
      >
        <Flex>
          <Box as={motion.div}
            role='h2'
            width='100%'
            animate={{ 
              color: "000", 
            }}
            variants={variants}
            transition={transition}
            sx={{
              justifyContent: 'flex-start',
              p: 0,
              fontSize: 'sm',
              ...style
            }}
          >{name}</Box>
          <Box pos='relative' zIndex={3}>
            <ListVersions name={name} latestVersion={latestVersion} />
          </Box>
        </Flex>
        <Flex alignItems='center'>
          <Box as={motion.div}
            width='100%'
            variants={variants}
            transition={transition}
            sx={{
              justifyContent: 'flex-start',
              p: 0,
              fontSize: 'sm',
              ...style
            }}
          >{description}</Box>
          <TagLink version='install' leftIcon={TbBookDownload} size='sm' />
        </Flex>

      {versions && <Divider />}
      {versions && <Text fontSize='xs'>Installed Versions:</Text>}
      {versions && <Box sx={{
          float: 'revert', 
          '& > *:not(:last-of-type)': {
            mr: '0.5rem'
          }
        }}>
        {versions && versions.map((c, i) =>(
          <TagLink version={c.version} key={c.id} />
        ))}
      </Box>}
    </Box>
  )
})

const variantsInstall = {
  show: { opacity: 1, x: '0%' },
  hide: { opacity: 0, x: '-100%' },
  initial: { opacity: 1, x: '0%' },
}
const variantsUninstalled = {
  show: { opacity: 1, x: '0%' },
  hide: { opacity: 0, x: '-100%' },
  initial: { opacity: 0, x: '-100%' },
}

export const TabComponent = React.memo<any>(({ 
  variant = 0,
  installedPackages = [], 
  notInstalledPackages,
}:{ 
  variant?: number,
  installedPackages: any[]; 
  notInstalledPackages: any[]; 
}) => {
  const [expanded, setExpanded] = useState(false);
  const controlInstall = useAnimation();
  const controlUninstalled = useAnimation();

  useEffect(() => {
    if (variant === 0) {
      controlInstall.start("show"); 
      controlUninstalled.start("hide");
    } else {
      controlUninstalled.start("show");
      controlInstall.start("hide"); 
    }
  }, [controlInstall, controlUninstalled, variant]);

  return (<AnimatePresence initial={false}>
      {variant === 0 ? <Box 
        as={motion.section}
        animate={controlInstall}
        variants={variantsInstall}
        initial='initial'
        exit='initial'
        sx={{
          w: '100%',
          p: 2,
        }}
      >
        <Box 
          as={motion.ul} 
          variants={variantsPackages} 
          sx={{
            '& > *:not(:last-child)':{
              mb: 1
            },
            overflowY: 'scroll',
            overscrollBehavior: 'contain',
          }}
        >
          {installedPackages.map((p, i) => (
            <PackageItem 
              key={p.localPackage.namespaceId}
              id={p.localPackage.namespaceId}
              expanded={expanded}
              onOpen={(e) => {
                if (e.target.value == p.localPackage.namespaceId) setExpanded(!expanded)
              }}
              name={p.localPackage.name}
              description={p.remotePackage.package.description}
              latestVersion={p.remotePackage.package.version}
              versions={p.localPackage.versions}
            />
          ))}
        </Box>
      </Box>
      : variant === 1 ? <Box 
        as={motion.section}
        animate={controlUninstalled}
        variants={variantsUninstalled}
        initial='initial'
        exit='initial'
        sx={{
          w: '100%',
          p: 2,
        }}
      >
        <Box 
          as={motion.ul} 
          variants={variantsPackages} 
          sx={{
            '& > *:not(:last-child)':{
              mb: 1
            },
            overflowY: 'scroll',
            overscrollBehavior: 'contain',
          }}
        >
          {notInstalledPackages.map((p, i) => (
            <PackageItem 
              key={p.remotePackage.package.name}
              id={p.remotePackage.package.name}
              expanded={expanded}
              onOpen={(e) => {
                if (e.target.value == p.remotePackage.package.name) setExpanded(!expanded)
              }}
              name={p.remotePackage.package.name}
              description={p.remotePackage.package.description}
              latestVersion={p.remotePackage.package.version}
            />
          ))}
        </Box>
      </Box> : null}
    </AnimatePresence>
  )
});
