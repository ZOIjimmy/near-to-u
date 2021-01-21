import React from 'react'
import { useEffect } from 'react'
import {Link} from "react-router-dom";
import './Nav.css'

//font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faStreetView } from '@fortawesome/free-solid-svg-icons'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

//material ui
import {withStyles, makeStyles, styled ,useTheme} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
//menu
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
//drawer
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';
import ListItem from '@material-ui/core/ListItem';
import { dark } from '@material-ui/core/styles/createPalette';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

const MainNav = () => {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    function setTheme(themeName) {
      localStorage.setItem('theme', themeName);
      document.getElementById("theme-controller").className = themeName;
  }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
	};

    return (
	<>
		<div className={classes.root}>
		<CssBaseline />
		<AppBar
			position="fixed"
			className={clsx(classes.appBar, {
			[classes.appBarShift]: open,
			})}
		>
			<Toolbar>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				onClick={handleDrawerOpen}
				edge="start"
				className={clsx(classes.menuButton, {
				[classes.hide]: open,
				})}
			>
				<MenuIcon />
			</IconButton>
     
			<Typography variant="h6" noWrap>
				Near To U
			</Typography>
			</Toolbar>
      
		</AppBar>
		<Drawer
			variant="permanent"
			className={clsx(classes.drawer, {
			[classes.drawerOpen]: open,
			[classes.drawerClose]: !open,
			})}
			classes={{
			paper: clsx({
				[classes.drawerOpen]: open,
				[classes.drawerClose]: !open,
			}),
			}}
		>
			<div className={classes.toolbar}>
			<IconButton onClick={handleDrawerClose}>
				{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</IconButton>
			</div>
			<Divider />
				<StyledMenuItem >
				<IconButton href = "/#/main">
					<ListItemIcon>
						<FontAwesomeIcon icon={faStreetView} size="1x"/>
					</ListItemIcon>
				</IconButton>
					<Link to = "/main">main</Link>
				</StyledMenuItem>

				<StyledMenuItem>
					<IconButton href = "/#/main/search">
				<ListItemIcon>
					<FontAwesomeIcon icon={faSearch} size="1x"/>
				</ListItemIcon>
				</IconButton>
					<Link to = "/main/search">search</Link>
				</StyledMenuItem>

				<StyledMenuItem>
					<IconButton href = "/#/main/post">
				<ListItemIcon>
					<FontAwesomeIcon icon={faPlusSquare} size="1x"/>
				</ListItemIcon>
				</IconButton>
					<Link to = "/main/post">post</Link>
				</StyledMenuItem>

				<StyledMenuItem>
				<IconButton href = "/#/main/profile">
				<ListItemIcon>
					<FontAwesomeIcon icon={faAddressCard} size="1x"/>
				</ListItemIcon>
				</IconButton>
				<Link to = "/main/profile">profile</Link>
				</StyledMenuItem>
				
        <StyledMenuItem>
				<IconButton href = "/#/main/videoEditor">
				<ListItemIcon>
					<FontAwesomeIcon icon={faFilm} size="1x"/>
				</ListItemIcon>
				</IconButton>
				<Link to = "/main/videoEditor">edit video</Link>
				</StyledMenuItem>

		</Drawer>
		<main className={classes.content}>
			<div className={classes.toolbar} />
		</main>
		</div>	
    </>
    );

}

export default MainNav;

