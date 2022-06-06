import { withCookies } from 'react-cookie';
import { React, useState } from 'react';
import Rating from '@mui/material/Rating';
import styles from '../styles/CommentForm.module.css';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useRouter } from 'next/router';
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import GenericCard from './GenericCard';

const AddCommentForm = ({ gameId, setFormData, userId, cookies }) => {
  const router = useRouter();
  const token = cookies.get('user');
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
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

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('send data ', { comment }, { value });
      const commentUrl = new URL(
        '/games/addReview',
        process.env.NEXT_PUBLIC_MAIN_API_URL
      );
      let res = await fetch(commentUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUser: userId,
          idGame: gameId,
          rate: value,
          review: comment,
        }),
      })
        .then((res) => {
          if (!res.ok) return;
          return res.json();
        })
        .then((res) => {
          setOpen(true);
          if (res == null || Object.values(res).length === 0) {
            console.log('error ');
            setError('invalid review');
          } else {
            setError('');
          }
        });
    } catch (err) {
      console.log(err);
    }
    await router.push('/');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div className={styles['comment-form-title']}>Add a review</div>
          <Rating
            className={styles['comment-form-rate']}
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <TextField
          variant="outlined"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '0.25em',
          }}
          multiline
          rows={4}
          aria-label="comment"
          label="comment"
          className={styles['comment-form-input']}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <br />
        <Button type="submit" variant="contained" sx={{ marginLeft: '1em' }}>
          Send review
        </Button>
      </form>

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
            Review successfully added
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default withCookies(AddCommentForm);
