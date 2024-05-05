import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UserModel } from '../model/user'
dotenv.config()

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Real-Estate', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any)

    const existingUser = await UserModel.findOne({ userType: 'admin' })
    if (!existingUser) {
      const saltRounds = parseInt(process.env.SALT_ROUND as string, 10)
      const superadminSeed = [
        {
          name: 'Super Admin',
          email: {
            address:'admin@realestate.io',
          },
          hashedPassword: await bcrypt.hash('password', saltRounds),
          userType: 'super_admin',
        }
      ]

      await UserModel.insertMany(superadminSeed)
      console.log('Admin seed data inserted successfully.')
    } else {
      console.log('Admin user already exists. Skipping seed.')
    }
  } catch (err) {
    console.error('Error seeding admin data:', err)
  } finally {
    mongoose.disconnect()
  }
}

seed()
