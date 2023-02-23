import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"

describe("Create user use case", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create a new user", async () => {
    const newUser = await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    expect(newUser).toHaveProperty('id');
  });

  it('Should not register a user with an email already in use', async () => {
    await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    await expect(
      createUserUseCase.execute({
        name: 'Ina Phillips',
        email: 'cupofe@paz.kp',
        password: 'Zdo@VKelW!'
      })
    ).rejects.toEqual(new CreateUserError())
  })
})
