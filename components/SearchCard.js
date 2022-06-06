import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import { withCookies } from 'react-cookie';

const SearchCard = ({ game, cookies }) => {
  const token = cookies.get('user') ?? '';
  const skeleton =
    game == null ||
    game.name == null ||
    game.description == null ||
    game.image == null ||
    game.id == null;

  if (skeleton) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia sx={{ bgColor: 'black' }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height={118}
            sx={{ bgcolor: 'grey.700' }}
          />
        </CardMedia>
        <CardContent>
          <Skeleton sx={{ bgcolor: 'grey.700' }} />
          <Skeleton width="60%" sx={{ bgcolor: 'grey.700' }} />
        </CardContent>
        <CardActions>
          {token !== '' ? (
            <Skeleton sx={{ bgcolor: 'grey.700' }}>
              <Button size="small" color="primary">
                Add to your library
              </Button>
            </Skeleton>
          ) : (
            ''
          )}
          <Skeleton sx={{ bgcolor: 'grey.700' }}>
            <Button size="small" color="primary">
              More Infos
            </Button>
          </Skeleton>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        display: 'grid',
        gridTemplateRows: 'min-content max-content 1fr',
        gridTemplateColumns: '1fr',
        gap: '1em',
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={game.image}
        alt={`${game.name} cover`}
      />
      <CardContent sx={{ alignSelf: 'start' }}>
        <Typography gutterBottom variant="h5" component="div">
          {game.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.description.split('.')[0]}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignSelf: 'end' }}>
        {token !== '' ? (
          <Link
            size="small"
            color="primary"
            href={`/add_game?game_name=${game.name.replace(
              '&',
              '%26'
            )}&fromSearch=true&gameId=${game.id}`}
          >
            Add to your library
          </Link>
        ) : (
          ''
        )}
        <Link href={`/details?gid=${game.id}`} size="small" color="primary">
          More Infos
        </Link>
      </CardActions>
    </Card>
  );
};

export default withCookies(SearchCard);
