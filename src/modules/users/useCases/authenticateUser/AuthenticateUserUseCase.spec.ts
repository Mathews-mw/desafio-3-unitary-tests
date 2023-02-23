import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

describe('Authenticate user use case', () => {

  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('Should be able to authenticate an user', async () => {
    await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const result = await authenticateUserUseCase.execute({
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    expect(result).toHaveProperty('token');
  });

  it('Shoul not be able to authenticate a nonexistent user', async () => {
    await expect(authenticateUserUseCase.execute({
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    })).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('Should not be able to authenticate with incorrect password', async () => {
    await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    await expect(authenticateUserUseCase.execute({
      email: 'cupofe@paz.kp',
      password: '123'
    })).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})
