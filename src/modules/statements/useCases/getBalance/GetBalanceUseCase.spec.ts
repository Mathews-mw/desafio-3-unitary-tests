import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

describe('Get balance use case', () => {
  let getBalanceUseCase: GetBalanceUseCase;
  let inMemoryUsersRepository: IUsersRepository;
  let inMemoryStatementsRepository: IStatementsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  });

  it('Should be able to ger user balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const userBalance = await getBalanceUseCase.execute({
      user_id: user.id
    });

    expect(userBalance).toHaveProperty('balance');
    expect(userBalance).toHaveProperty('statement');
  });

  it('should NOT be able to get a non-existent user', async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: '783888f8-dadc-52fd-8b13-a4ff1893f696'
      })
    ).rejects.toEqual(new GetBalanceError())
  });
})
