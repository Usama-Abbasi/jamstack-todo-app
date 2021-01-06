const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb=require('faunadb')
const query=faunadb.query;
const typeDefs = gql`
  type Query {
    todos:[Todo]
  }
  type Todo {
    id: String
    todo:String
  }
  type Mutation{
    addTodo(todo:String):Todo
    deleteTodo(id:String):Todo
  }
`;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

const resolvers = {
  Query: {
    todos:async(parent,args,context)=>{
      try {
        var result=await client.query(
          query.Map(
            query.Paginate(query.Documents(query.Collection('crud_op'))),
            query.Lambda(x=>query.Get(x))
          )
        )
        // console.log(result);
        const todos=result.data.map(todo=>({id:todo.ref.id,todo:todo.data.todo}))
        // console.log(todos);
        return todos;
      } catch (error) {
        
      }
    }
  },
  Mutation:{
    addTodo:async(_,{todo})=>{
      const item={
        data:{todo:todo}
      }
      try {
        const result=await client.query(query.Create(query.Collection('crud_op'),item))
        return {
          todo:result.todo,
          id:result.ref.id
        }
      } catch (error) {
        return {
          todo:"error",
          id:"1"
        }
      }
    },
    deleteTodo:async (_,{id})=>{
      console.log("id",id)
      try{
        const result=await client.query(query.Delete(query.Ref(query.Collection('crud_op'),id)))
        console.log("result",result);

        return {
          title:result.data.todo,
          id:result.ref.id
        }
      }
      catch(error){
        console.log("Error",error);
        return {
          title:"error",
          id:"1"
        }
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground:true,
  introspection:true
})

const handler = server.createHandler()

module.exports = { handler }
