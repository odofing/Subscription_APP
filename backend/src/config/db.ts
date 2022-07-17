import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI as string
      //      {
      //     useUnifiedTopology as boolean,
      //     useNewUrlParser: boolean,
      //     useCreateIndex: true
      // }
    )
    // console.log(`MongoDB connected`)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
