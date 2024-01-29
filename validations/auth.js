import { body } from 'express-validator';

//проверка данных пользователя
export const registerValidation = [
    body('email', "Invalid mail format").isEmail(),
    body('password', "The password must be at least 5 characters long").isLength({min: 5}),
    body('fullname', "Enter a name").isLength({min: 3}),
    body('avatarUrl', "Invalid link to the avatar").optional().isURL(),
];