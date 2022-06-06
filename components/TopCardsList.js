import { React } from 'react';
import styles from '../styles/TopCardsList.module.css';
import { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from './GameCard.js';
import useBreakpoint from '../hooks/useBreakpoint.js';

const TOP_COLORS = {
  1: 'gold',
  2: 'silver',
  3: '#cd7f32',
  others: '#fff',
};

const TopCardsList = ({ games, titleCat }) => {
  const { breakPointName, slides } = useBreakpoint();

  return (
    <div className={styles['topten-card-container']}>
      <Swiper
        slidesPerView={slides}
        modules={[Keyboard, Navigation]}
        keyboard={{
          enabled: true,
        }}
        onFocusCapture={(e) => console.log(e)}
        navigation={true}
        className={styles.swiper}
      >
        {games.map((game, index) => {
          return (
            <SwiperSlide key={index} className={styles[`swiper-slide`]}>
              <GameCard
                className={styles.card}
                title={game.name}
                score={game.aggregated_rating}
                scoreColor={TOP_COLORS[index + 1] ?? TOP_COLORS.others}
                cover={game.cover}
                id={game.id}
                igdb_id={game.igdb_id}
                isIgdb={!!game.isIgdb || !!game.igdb_id}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopCardsList;
