import * as mongoSessionStore from 'connect-mongo'
import * as cors from 'cors'
import 'dotenv/config'
import * as express from 'express'
import * as session from 'express-session'
import * as helmet from 'helmet'
import * as mongoose from 'mongoose'
import api from './api'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8000
const {PRODUCTION_URL_APP, PRODUCTION_URL_API} = process.env
const ROOT_URL = dev ? `http://localhost:${port}` : PRODUCTION_URL_API

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
})

const server = express()
const appPort = process.env.APP_PORT || 3000
const origin = dev ? `http://localhost:${appPort}` : PRODUCTION_URL_APP
server.use(cors({origin, credentials: true}))

server.use(helmet())

server.use(express.json())

const MongoStore = mongoSessionStore(session)
const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
        domain: dev ? 'localhost' : '.async-await.com', // todo: change this
    } as any,
}

if (!dev) {
    server.set('trust proxy', 1) // sets req.hostname, req.ip
    sessionOptions.cookie.secure = true // sets cookie over HTTPS only
}

server.use(session(sessionOptions))

api(server)

server.get('*', (_, res) => res.sendStatus(403))

server.listen(port, err => {
    if (err) {
        throw err
    }
    console.log(`> Ready on ${ROOT_URL}`)
})
