
require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import {createConnection} from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { ApolloServer } from 'apollo-server-express'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import { UserResolver } from './resolvers/user'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo/build/main/lib/MongoStore'
import session from 'express-session'

const main = async () => {
    await createConnection({
            type : 'postgres',
            database : 'reddit2',
            username : 'postgres',
            password :  'xuanloc123456789',
            logging: true,
            synchronize : true,
            entities : [User , Post]

        }) 

    const app = express()

    //session/cookie store
    await mongoose.connect("mongodb+srv://traitimtrongvang:xuanloc123456789@reddit.stshmcd.mongodb.net/reddit?retryWrites=true&w=majority")
    console.log('mongoDB connected')
    
    const apolloServer = new ApolloServer({
        schema : await buildSchema({resolvers : [HelloResolver , UserResolver] , validate : false}),
        plugins : [ApolloServerPluginLandingPageGraphQLPlayground()]

    })
    await apolloServer.start()
    apolloServer.applyMiddleware({app , cors : false})

    const PORT = process.env.PORT || 4000


    app.listen(PORT , () => console.log(`server started on port ${PORT}. Grapql server started on localhost : ${PORT}${apolloServer.graphqlPath}`))
}

main().catch(error => console.log(error))