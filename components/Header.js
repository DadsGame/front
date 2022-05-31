import {React, useEffect, useState} from "react";
import Image from "next/image.js";
import logo from "../public/logo-dark.png";
import {
    alpha,
    Avatar, Button, Divider,
    IconButton,
    InputBase,
    Link, ListItemIcon,
    Menu, MenuItem,
    styled,
    Tooltip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import styles from '../styles/Header.module.css';
import useBreakpoint from "../hooks/useBreakpoint.js";
import {Login, Logout, PersonAdd, Settings} from "@mui/icons-material";
import {withCookies} from "react-cookie";
import PersonIcon from '@mui/icons-material/Person';
import GamesIcon from '@mui/icons-material/Games';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import {useRouter} from "next/router";

// TODO: Maybe move these styled inputs into a separate file/lib
const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.charAt(0)}`,
    };
}

const Header = ({cookies}) => {

    const {breakPointName} = useBreakpoint();
    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState('');
    const token = cookies.get('user') ?? '';
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const router = useRouter();

    const handleSearch = (search) => {
        setSearch(search);
        router.push({pathname: '/search', query: {search}});
    };

    useEffect(() => {
        if(!router.asPath.startsWith('/search')) setSearch('');
    }, [router.asPath]);


    return breakPointName === 'large' ? _renderLarge() : _renderSmall();

    function _renderSmall() {
        return (
            <div className={styles['header-small']}>
                <div className="logo">
                    <Image src={logo} alt="Dads Game logo" width={64} height={64}/>
                </div>
                <div className={styles.menu}>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        Menu
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>
                <div className={styles['search-small']}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search games…"
                            inputProps={{'aria-label': 'search'}}
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </Search>
                </div>
            </div>
        );
    }

    function _renderLarge() {
        return (
            <div className={styles.header}>
                <Image
                    src={logo}
                    alt="Dads Game logo"
                    width={64}
                    height={64}
                    onClick={() => router.push('/')}
                />
                <div className={styles.navlinks}>
                    <Link href="/" color="inherit" underline="hover">
                        Home
                    </Link>
                    <Link href="#" color="inherit" underline="hover">
                        Stats
                    </Link>
                </div>
                <div className={styles.search}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search games…"
                            inputProps={{'aria-label': 'search'}}
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                    </Search>
                </div>
                <div className={styles.profile}>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ml: 2}}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{width: 32, height: 32}}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >
                        {_renderMenuLarge()}

                    </Menu>
                </div>
            </div>
        );
    }

    function _renderMenuLarge() {
        if (token) {
            return (
                <div>
                    <MenuItem>
                        <PersonIcon/> Profile
                    </MenuItem>
                    <MenuItem onClick={() => {
                        console.log('library')
                        return router.push('/library')
                    }}>
                        <GamesIcon /> My Library
                    </MenuItem>
                    <MenuItem>
                        <EqualizerIcon/> Stats
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => {
                        cookies.remove('user');
                        return router.push('/');
                    }}>
                        <ListItemIcon>
                            <Logout fontSize="small"/>
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </div>);
        }

        return (
            <div>
               <MenuItem onClick={() => router.push('/login')}>
                    <Login fontSize="small" />Login
               </MenuItem>
               <MenuItem onClick={() => router.push('/register')}><PersonAdd fontSize="small" />Register</MenuItem>
            </div>
        );
    }


}

export default withCookies(Header);
