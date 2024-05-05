import express, { Application } from 'express'
import multer from 'multer'

import * as dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import { RegisterRoutes } from './routes/routes'
import { config } from './src/helper/config/globalConfig'
import MongoDatabase from './src/helper/db/mongodb'
import { expressLogger, logger } from './src/helper/utils/logger'
import SwaggerDoc from './src/helper/utils/swaggerSetup'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.configureCORS()
    this.setupLogger()
    this.plugins()
    this.mongoDbSync()
    this.routes()
  }

  protected configureCORS(): void {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:4545']
    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
          } else {
            console.log('Not allowed by CORS')
            callback(new Error('Not allowed by CORS'))
          }
        }
      })
    )
  }

  protected plugins(): void {

    const storage = multer.memoryStorage()

    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 50 * 1024 * 1024
      }
    })
    this.app.use(express.json());

    this.app.use((req, res, next) => {
      if (!req.path.startsWith('/api-docs')) {
        upload.single('zipFile')(req, res, (err: any) => {
          if (err instanceof multer.MulterError) {
            console.error('Multer error:', err)
            return res.status(400).json({ error: 'File upload error' })
          } else if (err) {
            console.error('Error:', err)
            return res.status(500).json({ error: 'Internal server error' })
          }
          next()
        })
      } else {
        next()
      }
    })

    this.app.use(express.urlencoded({ extended: false }))
  }

  protected mongoDbSync(): void {
    new MongoDatabase(config)
  }

  protected setupLogger(): void {
    this.app.use(expressLogger)
  }

  protected routes(): void {
    SwaggerDoc.init(this.app)
    RegisterRoutes(this.app)
  }
}

const app = new App().app
const port: number | undefined = config.HOST_PORT
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
