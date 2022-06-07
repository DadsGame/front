import { React, useEffect, useRef } from 'react';
import styles from '../styles/AuthForm.module.css';
import { alpha, Button, InputBase, styled, TextField } from '@mui/material';
import useBreakpoint from '../hooks/useBreakpoint.js';
import { useForm } from 'react-hook-form';

const AuthForm = ({ isRegistration, setFormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ criteriaMode: 'all' });
  const onSubmit = (data) => {
    setFormData(data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {isRegistration ? (
          <TextField
            {...register('email', { required: 'This input is required.' })}
            className={styles.input}
            label="Email"
            type="email"
          >
            Email
          </TextField>
        ) : (
          ''
        )}
        <TextField
          {...register('username', { required: 'This input is required.' })}
          error={errors.username != null}
          helperText={errors?.username?.message}
          className={styles.input}
          label="Username"
          type="text"
        >
          Username
        </TextField>
        <TextField
          {...register('password', { required: 'This input is required.' })}
          className={styles.input}
          label="Password"
          type="password"
        >
          Password
        </TextField>
        {isRegistration ? (
          <TextField
            {...register('confirmPassword', {
              required: 'This input is required.',
              deps: ['password'],
              validate: {
                value: (value) =>
                  getValues('password') === value || `Password doesn't match`,
              },
            })}
            className={styles.input}
            error={errors.confirmPassword != null}
            helperText={errors?.confirmPassword?.message}
            label="Confirm Password"
            type="password"
          >
            Confirm Password
          </TextField>
        ) : (
          ''
        )}
        <Button type="submit" variant="contained" color="primary">
          {isRegistration ? 'Register' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
