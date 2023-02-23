import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

describe('Show user profile use case', () => {
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUserCase: ShowUserProfileUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUserCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('Should be able to show user profile', async () => {
    const { id: user_id } = await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const userProfile = await showUserProfileUserCase.execute(user_id);
    expect(userProfile).toHaveProperty('id')
  });

  it("Should not be able to get a inexistent user profile", async () => {
    const user_id = '2f94a2d5-684f-5041-972f-c0522c298e94';
    await expect(showUserProfileUserCase.execute(user_id)).rejects.toEqual(new ShowUserProfileError())
  });
});
