import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TodoList from './todoList';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import ReactLoading from 'react-loading';
import { CircularProgress } from '@material-ui/core';
let TodoSchema = yup.object().shape({
    todo: yup.string().required('This field is required.'),
});
const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(2, 0, 3),
    },
}));
const getTodos = gql`
  {
    todos{
        id
        todo
      }
  }
`

const addTask = gql`
  mutation CreateATodo($todo:String!) {
   addTodo(todo:$todo){
    todo
  }
}
`
const AddTodo = () => {
    const { loading, error, data, refetch } = useQuery(getTodos);
    const [fetchdata, setFetchData] = React.useState(data);
    const [addTodo] = useMutation(addTask);
    const classes = useStyles();
    
    if (loading || data === undefined) {
        return <div style={{textAlign:'center'}}><CircularProgress /></div>
    }
    else {
        return (
            <>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Formik
                            initialValues={{
                                todo: "",
                            }}
                            validationSchema={TodoSchema}
                            onSubmit={(values,{resetForm}) => {
                                
                                resetForm();
                                addTodo({ variables: { todo: values.todo }, refetchQueries: [{ query: getTodos }], })
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'A todo is Added',
                                    showConfirmButton: false,
                                    timer: 1500
                                  })
                                
                            }}
                            
                        >
                            {({ errors, handleChange, touched }) => (
                                <Form className={classes.form}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <TextField
                                                autoComplete="todo"
                                                name="todo"
                                                variant="outlined"
                                                fullWidth
                                                onChange={handleChange}
                                                id="todo"
                                                label="Add todo"
                                                autoFocus
                                                helperText={
                                                    <span style={{ color: 'red' }}> {errors.todo && touched.todo
                                                        ? errors.todo
                                                        : null}</span>
                                                }
                                            />
                                        </Grid>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Add Todo
                                </Button>
                                    </Grid>

                                </Form>

                            )}
                        </Formik>
                    </div>

                </Container>
                <Container >
                <Grid md={12} xs={12}>
                    <Accordion style={{background:'#00004b'}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading} style={{color:'white'}}>
                                Todo List
          </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ display: "block" }}>
                            {data.todos.map((obj) => (
                                <TodoList
                                    id={obj.id}
                                    message={obj.todo}
                                  
                                />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                </Container>
            </>
        )
    }

}
export default AddTodo;