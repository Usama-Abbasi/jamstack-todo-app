import React, { useState, useEffect } from 'react'
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import styles from './todoList.module.css';
import Swal from 'sweetalert2';
import {useQuery,useMutation} from '@apollo/client';
import gql from 'graphql-tag';
const deleteTask=gql`
  mutation DeleteATodo($id:String!) {
   deleteTodo(id:$id){
    todo
  }
}
`
const getTodos = gql`
  {
    todos{
        id
        todo
      }
  }
`
const TodoList=({id, message})=> {
    const [deleteTodo] = useMutation(deleteTask)
    return (
        <ul className={styles.list} key={id}>
        <li>
          <div className={styles.title}>
            <h3>{message} </h3>
          </div>

          <div>
            <Button onClick={()=>{ deleteTodo({
                                                variables:{
                                                    id:id
                                                },
                                                refetchQueries: [{ query: getTodos }]
                                            })
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'A todo is deleted',
                                                showConfirmButton: false,
                                                timer: 1500
                                              })
                                            }}>
              <DeleteIcon />
            </Button>
            {/* <Button onClick={() => updateNote(id, input)}>
              <UpdateIcon />
            </Button> */}
          </div>
        </li>
      </ul>
    )
}
export default TodoList
