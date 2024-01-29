import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import {registerValidation} from './validations/auth.js';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose.connect('mongodb+srv://ospanbekdamir1:qIui4SmcrwcnBU19@dam1rbek.nyj5svt.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error',err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req,res) => {
    try{
        //Ищем пользователя 
        const user = await UserModel.findOne({ email: req.body.email });


        //Проверка 
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message: 'Не верный логин или пароль',
            });
        }

        //Создания токена
        const token = jwt.sign(
            {
            _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const {passwordHash,...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch(err){
        console.log(err)
        res.status(404).json({
            message: 'Не удалось авторизоваться',
        });
    }
} )

app.post('/auth/register' ,registerValidation, async (req,res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json(errors.array());
            }
            //Шифрование пароля
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password,salt);
    
            //создаем пользователя
            const doc = new UserModel({
                email: req.body.email,
                fullname: req.body.fullname,
                passwordHash: hash,
                avatarUrl: req.body.avatarUrl,
            });
    
            //Сохраняем пользователя
            const user = await doc.save();

            //Создания токена
            const token = jwt.sign(
                {
                _id: user._id,
                },
                'secret123',
                {
                    expiresIn: '30d',
                }
            );
    
            const {passwordHash,...userData} = user._doc;

            res.json({
                ...userData,
                token,
            });
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось зарегестрироваться',
            });
        }
})

app.get('/auth/me',checkAuth,  (req,res) => {
    try{
        res.json({
            success: true
        })
    } catch(err){}
});

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server OK');
});