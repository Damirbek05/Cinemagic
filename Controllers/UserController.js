import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const register = async (req,res) => {
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
};

export const login = async (req,res) => {
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
};

export const getMe = async  (req,res) => {
    try{
        const user = await User.findById(req.userId);


        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const {passwordHash,...userData} = user._doc;

        res.json(userData);
    } catch(err){
        console.log(err)
            res.status(500).json({
                message: 'Нет доступа',
            });
    }
};
