import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get statement operation use case', () => {
  let inMemoryUsersRepository: IUsersRepository;
  let inMemoryStatementsRepository: IStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it('Should be able to get statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'value received from tests'

    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(statementOperation).toHaveProperty('id');
  })

  it('Should NOT be able to get statement to a non-existent user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'value received from tests'

    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: 'a4ff1893f696',
        statement_id: statement.id
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it('Should NOT be able to get statement to a non-existent statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'value received from tests'

    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: '783888f8'
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
})
