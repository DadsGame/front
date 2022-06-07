import AuthForm from '../../components/AuthForm.js';
import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({});
  const setData = (data) => setFormData(data);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      const registerUrl = new URL(
        '/users/sign-up',
        process.env.NEXT_PUBLIC_MAIN_API_URL
      );
      const res = await fetch(registerUrl.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          profilePicture: '',
        }),
      }).then((res) => {
        setOpen(true);
        if (res?.error) {
          setError(res.message);
          return { error: true };
        }
        return { error: false };
      });
      if (!res.error) return await router.push('/login');
    };
    registerTheUser();
  }, [formData]);

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {error !== '' ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Registered Successfully!
          </Alert>
        )}
      </Snackbar>
      <AuthForm isRegistration={true} setFormData={setData} />
    </>
  );
}
