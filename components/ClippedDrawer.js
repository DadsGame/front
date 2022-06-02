import * as React from "react";
import {useState} from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useBreakpoint from "../hooks/useBreakpoint";
import GenericCard from "./GenericCard";
import styles from "../styles/Details.module.css";
import AddCommentForm from "./AddCommentForm";
import UserReview from "./UserReview";

const drawerWidth = 240;

function ClippedDrawer({library}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const {breakPointName} = useBreakpoint()
    const [active, setActive] = useState(-1)
    const [gameContent, setGameContent] = useState()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    async function setContainerData(game) {
        console.log(game)
        if (game.id_game != -1 && game.igdb_id != null){
            const url = new URL ('/api/igdb/games/byId', process.env.NEXT_PUBLIC_BTB_API_URL)
            url.searchParams.set('id', game.igdb_id)
            const res = await fetch(url.toString())
            const gameContent = await res.json()
            setGameContent(gameContent)
            console.log(gameContent)
        }
        setActive(game.id_game)
    }

    const drawer = (
        <div className={styles[`clipped-text`]}>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary="My stats" onClick={() => setContainerData({id_game: -1}) }/>
                    </ListItemButton>
                </ListItem>
                {library.map((game) => (
                    <ListItem key={game.idGame} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={game.name} onClick={() => setContainerData(game) }/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex"}}>
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
                                marginTop: '5em',
                                backgroundColor: "#2E3033",
                                borderRadius: '20px',
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
                <GenericCard>
                    <div>
                        {active === -1 && <div> My stats </div>}
                    </div>
                        {library.map((game) => (
                            <div>
                                {active === game.id_game && <div>
                                    <div className={styles[`details-container-${breakPointName}`]}>
                                        <div className={styles[`details-image-container`]}>
                                            <img className={styles['game-detail-img']} src={gameContent[0].cover}/>
                                        </div>


                                        <div className={styles['game-detail-title']}>
                                            {JSON.stringify(gameContent[0].name).replaceAll('"', '')}
                                        </div>
                                        <div className={styles['game-detail-subtitle']}>
                                            {JSON.stringify(game.playtime)} h
                                            <div>
                                                Bought at: {JSON.stringify(game.bought_at)} €
                                            </div>
                                            { game.sold_at > 0 &&
                                            <div>
                                                Sold at: {JSON.stringify(game.sold_at)} €
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={styles['game-detail-summary']}>
                                        {JSON.stringify(gameContent[0].summary).replaceAll('"', '')}
                                    </div>
                                </div>}
                            </div>
                        ))}
                </GenericCard>

                    {library.map((game) => (
                        <div>
                            { active === game.id_game && <GenericCard>
                            <div>
                                <AddCommentForm gameId={game.id_game} userId={game.id_user}/>
                            </div>
                            </GenericCard>
                                }
                        </div>
                    ))}
                {library.map((game) => (
                    <div>
                        { active === game.id_game && <GenericCard>
                            <div>
                                <UserReview gameId={game.id_game}/>
                            </div>
                        </GenericCard>
                        }
                    </div>
                ))}


            </Box>
        </Box>
    );
}



export default ClippedDrawer;