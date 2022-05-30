import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {withCookies} from "react-cookie";
import AddGameForm from "../../components/AddGameForm.js";
import SearchCard from "../../components/SearchCard.js";
import {route} from "next/dist/server/router.js";

const checkGameShouldBeLocal = async (gameName, gameId) => {
    const gameMatchUrl = new URL('/api/igdb/games/shouldBeLocal', process.env.NEXT_PUBLIC_BTB_API_URL);
    if(isNaN(gameId)) return true;
    gameMatchUrl.searchParams.set('id', gameId);
    gameMatchUrl.searchParams.set('name', gameName);
    const res = await fetch(gameMatchUrl.toString());
    const sbl = await res.json();
    return sbl.shouldBeLocal;
};

const checkIfGameAlreadyExistsLocal = async (gameName, token) => {
    const gameUrl = new URL(`games/byGameName`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    gameUrl.searchParams.set('name', gameName);
    console.log(gameUrl);
    const res = await fetch(gameUrl.toString(), {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const json = await res.json();
    return {alreadyExists: Object.values(json).length !== 0, id: json.id};
}

const checkIfGameAlreadyExists = async (igdbId, token) => {
    const gameUrl = new URL(`games/byIgdb`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    gameUrl.searchParams.set('id', igdbId);
    const res = await fetch(gameUrl.toString(), {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const json = await res.json();
    return {alreadyExists: Object.values(json).length !== 0, id: json.id};
}

const addGameToApi = async (formData, token) => {
    const postGameUrl = new URL('/games', process.env.NEXT_PUBLIC_MAIN_API_URL);
    const res = await fetch(postGameUrl.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(formData),
    });
    return await res.json();
};


const postGamelocalToLibrary = async (formData, token) => {
    const postGameUrl = new URL('/games/toLibrary', process.env.NEXT_PUBLIC_MAIN_API_URL);
    const alreadyExists = (await checkIfGameAlreadyExistsLocal(formData.name, token)).alreadyExists;
    let game = {};
    if(!alreadyExists) {
        game = await addGameToApi(formData, token);
    }
    const res = await fetch(postGameUrl.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify({...formData, idGame: game.id}),
    });
    return await res.json();
}

const postGameToLibrary = async (formData, gameId, token) => {
    const postGameUrl = new URL('/games/toLibrary', process.env.NEXT_PUBLIC_MAIN_API_URL);
    const alreadyExists = (await checkIfGameAlreadyExists(gameId, token)).alreadyExists;
    let game = {};
    if(!alreadyExists) {
        game = await addGameToApi({...formData, igdbId: gameId}, token);
    }
    const res = await fetch(postGameUrl.toString(), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({...formData, idGame: game.id}),
    });
    return await res.json();
}


const AddGame = ({cookies}) => {

    const token = cookies.get('user');

    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [gameName, setGameName] = useState('');
    const [gameId, setGameId] = useState('');
    const [fromSearch, setFromSearch] = useState(false);
    const routerQuery = router.query;
    console.log(gameName);

    useEffect(() => {
        const redirectIfNeeded = async () => {
            if (token == null || token === '') {
                return await router.push('/login?alert=You must be logged in to add a game.');
            }
        };
        redirectIfNeeded();
    });

    useEffect(() => {
        setGameName(routerQuery?.game_name ?? '');
        setFromSearch(routerQuery?.fromSearch === 'true');
        setGameId(parseInt(routerQuery?.gameId) ?? '');
    }, [routerQuery]);

    useEffect(() => {
        if (Object.values(formData).length === 0) return;
        console.log('data', formData, gameId);
        const addGame = async () => {
            const shouldBeLocal = await checkGameShouldBeLocal(formData.name, gameId);
            console.log(shouldBeLocal);
            if (shouldBeLocal) await postGamelocalToLibrary(formData, token);
            else await postGameToLibrary(formData, gameId, token);
        }
        addGame();

    }, [formData]);


    if (token != null && token !== '') {
        return (
            <AddGameForm gameName={gameName} fromSearch={fromSearch} setFormData={setFormData}/>
        );
    }

    return '';
};

export default withCookies(AddGame);