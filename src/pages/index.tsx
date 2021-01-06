import React from "react"
import AddTodo from '..//component/addTodo';
export default function Home() {
    return (
        <div>
            <h1 style={{textAlign:'center'}}>Todo App</h1>
            <AddTodo />
        </div>
    )
}