import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement user case", () => {
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('Should be able to make a deposit statement', async () => {
    const newUser = await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: newUser.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'value received from tests'
    });

    expect(newStatement).toHaveProperty('id');
    expect(newStatement.type).toEqual(OperationType.DEPOSIT);
    expect(newStatement.amount).toEqual(500);
  });

  it('Should be able to make a withdraw statement if balance matches', async () => {
    const newUser = await createUserUseCase.execute({
      name: 'Ina Phillips',
      email: 'cupofe@paz.kp',
      password: 'Zdo@VKelW!'
    });

    await createStatementUseCase.execute({
      user_id: newUser.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'value received from tests'
    });

    const newWithdrawStatement = await createStatementUseCase.execute({
      user_id: newUser.id,
      type: OperationType.WITHDRAW,
      amount: 300,
      description: 'withdrawal for purchases'
    });

    const { balance } = await inMemoryStatementsRepository.getUserBalance({ user_id: newUser.id });


    expect(newWithdrawStatement).toHaveProperty('id');
    expect(newWithdrawStatement.type).toEqual(OperationType.WITHDRAW);
    expect(balance).toEqual(200);
  });

  it('Should NOT be able to make a statement to a non-existent user', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: '459d55ba-2a08-53e5-a73b-f321d949b75a',
        type: OperationType.DEPOSIT,
        amount: 500,
        description: 'value received from tests'
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound())
  });
})
