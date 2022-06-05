import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {withCookies} from "react-cookie";
import AddGameForm from "../../components/AddGameForm.js";
import SearchCard from "../../components/SearchCard.js";
import {route} from "next/dist/server/router.js";
import {Alert, Snackbar} from "@mui/material";

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
    console.log('jsonexists', json)
    return {alreadyExists: Object.values(json).length !== 0, id: json.id};
}

const checkIfGameIsInLibrary = async (token, gameId)  => {
    const postGameUrl = new URL(`/games/userLibrary/isPresent/${gameId}`, process.env.NEXT_PUBLIC_MAIN_API_URL);
    const res = await fetch(postGameUrl.toString(), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return await res.json();
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
    const alreadyExists = (await checkIfGameAlreadyExistsLocal(formData.name, token));
    const alreadyExistBool = alreadyExists.alreadyExists;
    let game = {};
    if(!alreadyExistBool) {
        game = await addGameToApi(formData, token);
    } else {
        const isGameInLibrary = await checkIfGameIsInLibrary(token, alreadyExists.id);
        if(isGameInLibrary[0].count > 0) return {error: 'game is already in library'};
    }
    const res = await fetch(postGameUrl.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify({...formData, idGame: game?.id??alreadyExists.id}),
    });
    return await res.json();
}

const postGameToLibrary = async (formData, gameId, token) => {
    const postGameUrl = new URL('/games/toLibrary', process.env.NEXT_PUBLIC_MAIN_API_URL);
    const alreadyExists = (await checkIfGameAlreadyExists(gameId, token));
    const alreadyExistBool = alreadyExists.alreadyExists;
    console.log('exists', alreadyExists, gameId, formData)
    let game = {};
    if(!alreadyExistBool) {
        game = await addGameToApi({...formData, igdbId: gameId}, token);
    } else {
        const isGameInLibrary = await checkIfGameIsInLibrary(token, alreadyExists.id);
        if(isGameInLibrary[0].count > 0) return {error: 'game is already in library'};
    }
    const res = await fetch(postGameUrl.toString(), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({...formData, idGame: game?.id??alreadyExists.id}),
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
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

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
            const {error}  = (shouldBeLocal)
                ? await postGamelocalToLibrary(formData, token)
                : await postGameToLibrary(formData, gameId, token);
            setOpen(true);
            if(error) {
                setError(error);
            } else {
                setError('');
                await router.push('/library');
            }
        }
        addGame();

    }, [formData]);


    if (token != null && token !== '') {
        return (
            <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                { error !== '' ?
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
                    :  <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                        Game added successfully to library
                    </Alert>
                }


            </Snackbar>
            <AddGameForm gameName={gameName} fromSearch={fromSearch} setFormData={setFormData}/>
            </>
        );
    }

    return '';
};

export default withCookies(AddGame);