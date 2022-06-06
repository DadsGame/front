import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useBreakpoint from '../hooks/useBreakpoint';
import GenericCard from './GenericCard';
import styles from '../styles/Details.module.css';
import AddCommentForm from './AddCommentForm';
import UserReview from './UserReview';
import { Button, Chip, IconButton, Link } from '@mui/material';
import ModifyGameLibrary from './ModifyGameLibrary';
import { act } from 'react-dom/test-utils';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';

const drawerWidth = 200;

function ClippedDrawer({ library, token }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { breakPointName, width } = useBreakpoint();
  const [active, setActive] = useState(-1);
  const [gameContent, setGameContent] = useState();
  const [userStats, setUserStats] = useState();
  const router = useRouter();
  const formatterPercent = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  });
  const formatterCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    maximumFractionDigits: 0,
    currency: 'EUR',
  });

  async function fetchUserStats() {
    const url = new URL(
      '/games/stats/user',
      process.env.NEXT_PUBLIC_MAIN_API_URL
    );
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stats = await res.json();
    setUserStats(stats[0]);
    console.log('stats', stats);
  }

  const [isEdited, setEdit] = useState(false);
  const [localGame, setGame] = useState();

  const childToParent = (childDataEdit, gameChanged) => {
    console.log('gc', gameChanged);
    setEdit(childDataEdit);
    setGame(gameChanged);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  function onEdit(game) {
    setEdit(true);
    console.log(game);
  }

  function renderIsEdited(game) {
    console.log('is edited');
    return (
      <ModifyGameLibrary
        childToParent={childToParent}
        game={localGame}
        gameContent={gameContent}
        breakPointName={breakPointName}
      />
    );
  }

  function renderNotEdited(game) {
    return (
      <div>
        {active === game.id_game ? (
          <div>
            <div className={styles[`details-container-lib-${breakPointName}`]}>
              <div className={styles[`details-image-lib-container`]}>
                {game.igdb_id != null ? (
                  <img
                    className={styles['game-detail-img']}
                    src={gameContent[0].cover}
                  />
                ) : (
                  ''
                )}
              </div>

              <div className={styles['game-detail-title']}>
                {game.igdb_id != null ? (
                  gameContent[0].name
                ) : (
                  <span>{game.name} (local game)</span>
                )}
                <div className={styles['game-detail-add-lib']}>
                  <Button variant="contained" onClick={() => onEdit(game)}>
                    Edit
                  </Button>
                </div>
              </div>
              <div className={styles['game-detail-subtitle']}>
                {localGame.playtime}h
                <div>
                  Bought at: {formatterCurrency.format(localGame.bought_at)}
                </div>
                {game.sold_at > 0 && (
                  <div>
                    Sold at: {formatterCurrency.format(localGame.sold_at)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.25em' }}>
                  <span>Status: </span>
                  <Chip
                    sx={{
                      color: 'white',
                      alignSelf: 'end',
                      backgroundColor: '#424242',
                    }}
                    size="small"
                    variant="filled"
                    label={localGame.status}
                  />
                </div>
                <div>Platform: {localGame.platform}</div>
              </div>
              {game.igdb_id != null ? (
                <div className={styles['game-detail-score']}>
                  {gameContent[0].aggregated_rating != null ? (
                    <span>
                      score:{' '}
                      {formatterPercent.format(
                        gameContent[0].aggregated_rating / 100
                      )}
                    </span>
                  ) : (
                    <span> No rating found.</span>
                  )}
                </div>
              ) : (
                ''
              )}
              {game.igdb_id != null ? (
                <div className={styles['game-detail-genre']}>
                  {gameContent[0].genres != null ? (
                    <>
                      genres:
                      <ul>
                        {gameContent[0].genres.map((genre, index) => (
                          <li key={index}>{genre.name}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className={styles['game-detail-summary']}>
              {game.igdb_id != null ? gameContent[0].summary : ''}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  async function setContainerData(game) {
    setGame(game);
    console.log(game);
    if (game.id_game !== -1 && game.igdb_id != null) {
      const url = new URL(
        '/api/igdb/games/byId',
        process.env.NEXT_PUBLIC_BTB_API_URL
      );
      url.searchParams.set('id', game.igdb_id);
      const res = await fetch(url.toString());
      const gameContent = await res.json();
      setGameContent(gameContent);
      console.log('gc', gameContent);
    } else if (game.id_game === -1) {
      fetchUserStats();
    }
    setActive(game.id_game);
  }

  const drawer = (
    <div className={styles[`clipped-text`]}>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => router.push('/add_game')}>
            Add a game
          </Button>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="My stats"
              onClick={() => setContainerData({ id_game: -1 })}
            />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ backgroundColor: '#bdbdbd' }} />
        {library.map((game) => (
          <ListItem key={game.idGame} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={game.name}
                onClick={() => setContainerData(game)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {breakPointName === 'large' ? (
          <Drawer
            variant="permanent"
            sx={{
              display: {},
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                marginTop: '5em',
                backgroundColor: '#2E3033',
                borderRadius: '20px',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#2E3033',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {breakPointName !== 'large' ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          ''
        )}
        <GenericCard
          className={styles[`generic-card-${breakPointName}`]}
          style={
            active === -1 && userStats != null ? { background: 'none' } : {}
          }
        >
          {active === -1 && userStats != null ? (
            <>
              <h1>My stats</h1>
              <div className={styles.cards}>
                <GenericCard>
                  <h2>Average money spent on games</h2>
                  <span
                    style={{
                      color: 'red',
                      fontSize: 'large',
                    }}
                  >
                    {formatterCurrency.format(userStats.avg_spent)}
                  </span>
                </GenericCard>
                <GenericCard>
                  <h2>Average money gained on games</h2>
                  <span
                    style={{
                      color: 'green',
                      fontSize: 'large',
                    }}
                  >
                    {formatterCurrency.format(userStats.avg_revenue)}
                  </span>
                </GenericCard>
                <GenericCard>
                  <h2>Total of money gained</h2>
                  <span
                    style={{
                      color: 'green',
                      fontSize: 'large',
                    }}
                  >
                    {formatterCurrency.format(userStats.total_revenue_player)}
                  </span>
                </GenericCard>
                <GenericCard>
                  <h2>Total of money spent</h2>
                  <span
                    style={{
                      color: 'red',
                      fontSize: 'large',
                    }}
                  >
                    {formatterCurrency.format(userStats.total_spent_player)}
                  </span>
                </GenericCard>
                <GenericCard>
                  <h2>Most used status for games</h2>
                  <span style={{ fontSize: 'large', fontStyle: 'italic' }}>
                    {userStats.most_present_status}
                  </span>
                </GenericCard>
                <GenericCard>
                  <h2>Number of games</h2>
                  <span style={{ fontSize: 'large', fontStyle: 'italic' }}>
                    {userStats.total_game}
                  </span>
                </GenericCard>
              </div>
            </>
          ) : (
            ''
          )}
          {active === -1 && userStats == null ? (
            <>
              <h1>My stats</h1>
              <p>
                You don&apos;t have any stats yet. <br /> Try to add some games
                to your library.
              </p>
            </>
          ) : (
            ''
          )}
          {library.map((game, index) => (
            <div key={index}>
              {active === game.id_game && (
                <div>
                  {isEdited ? renderIsEdited(game) : renderNotEdited(game)}
                </div>
              )}
            </div>
          ))}
        </GenericCard>
        {library.map((game, index) => (
          <div key={index}>
            {active === game.id_game && game.igdb_id != null ? (
              <GenericCard>
                <div className={styles['forum-header']}>
                  <div className={styles['forum-header-title']}>Forum</div>
                  <div className={styles['forum-header-btns']}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        router.push(`/posts/add?gid=${game.igdb_id}`)
                      }
                    >
                      Add a post
                    </Button>
                    {game.latestsPosts != null &&
                    game.latestsPosts.length > 0 ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push(`/posts?gid=${game.igdb_id}`)
                        }
                      >
                        See all posts
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles['forum-latest-post-title']}>
                    Latests Posts
                  </div>
                  <div className="posts">
                    {game.latestsPosts == null ||
                    game.latestsPosts.length === 0 ? (
                      <span>No posts found for this game yet.</span>
                    ) : (
                      ''
                    )}
                    {game.latestsPosts != null && game.latestsPosts.length > 0
                      ? game.latestsPosts.map((post, index) => (
                          <ul key={index}>
                            <li>
                              Author: {post.author}, title: {post.title}.{' '}
                              <Link
                                href={`/posts/see?id=${post.id}`}
                                aria-label={`Read More - ${post.title}`}
                              >
                                Read More
                              </Link>
                            </li>
                          </ul>
                        ))
                      : ''}
                  </div>
                </div>
              </GenericCard>
            ) : (
              ''
            )}
          </div>
        ))}

        {library.map((game, index) => (
          <div key={index}>
            {active === game.id_game && game.igdb_id != null ? (
              <GenericCard className={styles[`generic-card-${breakPointName}`]}>
                <div style={{ width: 'max-content' }}>
                  <AddCommentForm gameId={game.id_game} userId={game.id_user} />
                </div>
              </GenericCard>
            ) : (
              ''
            )}
          </div>
        ))}
        {library.map((game, index) => (
          <div key={index}>
            {active === game.id_game && game.igdb_id != null ? (
              <GenericCard className={styles[`generic-card-${breakPointName}`]}>
                <div>
                  <UserReview gameId={game.id_game} igdbId={game.igdb_id} />
                </div>
              </GenericCard>
            ) : (
              ''
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
}

export default ClippedDrawer;
