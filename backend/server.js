import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';


const app = express()
const port = process.env.PORT || 4000


connectDB()
connectCloudinary()

// Middleware setup
app.use(express.json())
app.use(cors())


app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);

// simple test for server verification
app.get('/', (req,res)=> {
    res.send("API working")
})

// server initialization
app.listen(port, ()=> console.log('Server started on my port: ' + port))