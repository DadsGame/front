import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import useBreakpoint from "../hooks/useBreakpoint";

const drawerWidth = 240;

function ClippedDrawer({library}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const {breakPointName} = useBreakpoint()
    const [content, setContent] = useState("no content")

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    function setContainerData(game) {
        console.log(game)
        setContent(game.playtime)
    }

    const drawer = (
        <div>
            <Divider />
            <List>
                {library.map((game) => (
                    <ListItem key={game.idGame} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={game.idGame} onClick={() => setContainerData(game) }/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                {breakPointName === "large" ?
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                                marginTop: '5em'
                            }
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                : ""
                }

            </Box>
            <Box
                component="main"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                {content}
            </Box>
        </Box>
    );
}



export default ClippedDrawer;