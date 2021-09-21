import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Connection } from 'mongoose';
import cors from 'cors';
import { IUser, buildUser, UserModel } from './models/userModel';
import { errorMiddleware } from './middleware/error.middleware';
import HttpException from './exceptions/HttpException';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST");
    res.setHeader('Access-Control-Allow-Headers', "Content-Type");
    next();
});

app.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    const { name, surname, birthDate, email, gender } = req.body

    try {
        const userData: IUser = {
            name,
            surname,
            birthDate: new Date(birthDate),
            email: email,
            gender: gender
        }
        const newUser = buildUser(userData);
        const savedUser = await newUser.save();
        res.status(200).json({ newUser: savedUser })
    } catch (err) {
        next(new HttpException(404, 'Failed to add user.'));
    }
})

app.use(errorMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Internal Server Error");
    res.status(501).send({ message: error.message })
});

mongoose.connect('mongodb://localhost:27017/extensi')

let db: Connection = mongoose.connection;
db.once('open', (): void => {
    console.log('Connected to database')
})

app.listen(3005, (): void => {
    console.log('Server started at port 3005')
})