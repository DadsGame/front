import AuthForm from "../../components/AuthForm.js";
import {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";
import styles from '../../styles/Login.module.css';


export default function Login() {

    const [formData, setFormData] = useState({});
    const setData = (data) => setFormData(data);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [cookie, setCookie] = useCookies(["user"]);
    const router = useRouter();
    const alert = router.query.alert ?? '';

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
        if (Object.values(formData).length === 0) return;
        const registerTheUser = async () => {
            const registerUrl = new URL('/login', process.env.NEXT_PUBLIC_MAIN_API_URL);
            const res = await fetch(registerUrl.toString(), {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            }).then((res) => {
                if (!res.ok) return;
                return res.json();
            })
                .then((res) => {
                    if (res == null || Object.values(res).length === 0) {
                        console.log("not ok")
                        setError("username or password invalid.");
                    } else {
                        setError('');
                        setCookie("user", res.token, {
                            path: "/",
                            maxAge: 3500 * 24 * 30, // Expires after 1 month
                            sameSite: true,
                        });
                        router.push('/');
                    }
                    setOpen(true);
                });
        };
        registerTheUser();

    }, [formData]);

    return (
        <>
            {alert !== ''
                ? <Alert severity="error" sx={{width: 'max-content'}} className={styles.alert} >{alert}</Alert>
            : ''}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                {(error !== '')
                    ? <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                        {error}
                    </Alert>
                    : <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                        Logged In successfully!
                    </Alert>
                }
            </Snackbar>
            {JSON.stringify(formData)}
            <AuthForm setFormData={setData}/>
        </>
    )
}

