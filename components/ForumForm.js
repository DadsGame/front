import styles from '../styles/ForumForm.module.css';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { React, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const ForumForm = ({ setFormData, isPost }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ criteriaMode: 'all' });
  const onSubmit = (data) => {
    console.log(data);
    setFormData(data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h3 className={styles['form-title']}>
          {isPost ? 'Insert your post' : 'Add your answer'}
        </h3>
        {isPost ? (
          <TextField
            label="Post Name"
            error={errors.title != null}
            helperText={errors?.title?.message}
            {...register('title', { required: 'This input is required.' })}
          >
            Post Name
          </TextField>
        ) : (
          ''
        )}
        <TextField
          label="Content"
          error={errors.content != null}
          helperText={errors?.content?.message}
          multiline
          rows={4}
          sx={{ width: '20em' }}
          {...register('content', { required: 'This input is required.' })}
        >
          Post Name
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          {isPost ? 'Add Post' : 'Add Comment'}
        </Button>
      </form>
    </div>
  );
};

export default ForumForm;
