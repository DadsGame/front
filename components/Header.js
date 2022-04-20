import {React, useState} from "react";
import Image from "next/image.js";
import logo from "../public/logo-dark.png";
import {
    alpha,
    Avatar, Button,
    IconButton,
    InputBase,
    Link,
    Menu, MenuItem,
    styled,
    Tooltip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import styles from '../styles/Header.module.css';
import useBreakpoint from "../hooks/useBreakpoint.js";

// TODO: Maybe move these styled inputs into a separate file/lib
const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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

const Header = () => {

    const {breakPointName} = useBreakpoint();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return breakPointName === 'large' ? _renderLarge() : _renderSmall();

    function _renderSmall() {
        return(
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
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search games…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </div>
            </div>
        );
    }

    function _renderLarge() {
        return(
            <div className={styles.header}>
                <Image src={logo} alt="Dads Game logo" width={64} height={64}/>
                <div className={styles.navlinks}>
                    <Link href="#" color="inherit" underline="hover">
                        Home
                    </Link>
                    <Link href="#" color="inherit" underline="hover">
                        Library
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
                        />
                    </Search>
                </div>
                <div className={styles.profile}>
                    <Tooltip title="Open profile">
                        <IconButton sx={{p: 0}}>
                            <Avatar alt="Remy Sharp" src="http://placekitten.com/200/200"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }


}

export default Header;