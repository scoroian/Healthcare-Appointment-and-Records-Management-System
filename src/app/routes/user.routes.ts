import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '../user/user.controller';

const userController = Container.get(UserController);

export default userController.getRouter();
