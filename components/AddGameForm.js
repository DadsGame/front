import styles from "../styles/AddGameForm.module.css";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem, Radio,
    RadioGroup,
    Select,
    TextField
} from "@mui/material";
import {React, useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";


const AddGameForm = ({isUpdate = false, setFormData, gameName, fromSearch}) => {

    const {register, handleSubmit, formState: {errors}, getValues, control} = useForm({criteriaMode: "all"});
    const [status, setStatus] = useState('not started');
    const [gameNameError, setGameNameError] = useState('');
    const [hasSoldGame, setHasSoldGame] = useState('false');
    const [name, setGameName] = useState('');
    const onSubmit = (data) => {
        if(data.name === '' && gameName === '') {
            return setGameNameError('This input is required.');
        }
        setGameNameError('');
        console.log('game name on submit', gameName, data.name === '');
        if (hasSoldGame === 'false' && data?.soldAt != null) setFormData({
            boughtAt: data.boughtAt,
            name: (data.name === '' )? gameName : data.name,
            playtime: data.playtime,
            status
        });
        else setFormData({...data, name: (data.name === '' )? gameName : data.name,  status});
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };
    const handleChangeSold = (event) => {
        setHasSoldGame(event.target.value);
    };
    const handleChangeGameName = (event) => {
        if(name !== '') setGameNameError('');
        setGameName(event.target.value);
    };

    useEffect(() => {}, [name]);
    useEffect(() => {
        setGameName(gameName);
    }, [gameName]);



    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <TextField
                    error={gameNameError !== ''}
                    helperText={gameNameError}
                    className={styles.input} label="Game Name" type="text" value={name} onInput={handleChangeGameName}
                    disabled={fromSearch}
                    {...register('name', )}>Game Name
                </TextField>
                <FormControl>
                    <InputLabel id="game-statuslabel">Game Status</InputLabel>
                    <Select
                        labelId="game-status-label"
                        id="demo-simple-select"
                        value={status}
                        label="Game Status"
                        onChange={handleChangeStatus}
                    >
                        <MenuItem value="not started">not started</MenuItem>
                        <MenuItem value="started">started</MenuItem>
                        <MenuItem value="finished">finished</MenuItem>
                        <MenuItem value="won't continue">won&apos;t continue</MenuItem>
                    </Select>
                </FormControl>
                <TextField {...register('playtime', {required: "This input is required."})} className={styles.input}
                           label="Playtime"
                           type="number" inputProps={{min: 0}} defaultValue={0}>Playtime</TextField>
                <TextField {...register('boughtAt', {required: "This input is required."})} className={styles.input}
                           label="Bought At"
                           type="number" inputProps={{min: 1}} defaultValue={1}>Bought at</TextField>
                <FormControl>
                    <FormLabel id="controlled-radio-buttons-group">Have you sold your game ?</FormLabel>
                    <RadioGroup
                        aria-labelledby="controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={hasSoldGame}
                        onChange={handleChangeSold}
                    >
                        <FormControlLabel value="true" control={<Radio/>} sx={{color: 'black'}} label="Yes"/>
                        <FormControlLabel value="false" control={<Radio/>} sx={{color: 'black'}} label="No"/>
                    </RadioGroup>
                </FormControl>
                {hasSoldGame === 'true'
                    ? <TextField {...register('soldAt')} className={styles.input}
                                 label="Sold At"
                                 type="number" inputProps={{min: 1}} defaultValue={1}>Sold At</TextField>
                    : ''}

                <Button type="submit" variant="contained" color="primary">
                    {(isUpdate) ? 'Update' : 'Add Game To Library'}
                </Button>
            </form>
        </div>
    );
}

export default AddGameForm;