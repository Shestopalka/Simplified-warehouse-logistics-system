const bcrypt = require('bcrypt');
const { RegistrationService } = require('../service/authService.js');
const { query } = require('../db/dbPg.js');

jest.mock('bcrypt');
jest.mock('../db/dbPg.js', () => ({
  query: jest.fn()
}));

describe("RegistrationService - registrationUser", () => {
  let registrationService;
  let mockGenerateToken;

  beforeEach(() => {
    mockGenerateToken = {
      generateToken: jest.fn().mockResolvedValue('mocked-token')
    };

    registrationService = new RegistrationService(mockGenerateToken);
});

  it("Registration user", async () => {
    const userData = {
      email: "test@example.com",
      password: "12345",
      username: "test"
    };

    query.mockResolvedValueOnce({ rows: [] });  // База пуста (немає такого користувача)
    bcrypt.hash.mockResolvedValue('hashed-password');  // Хешування пароля
    query.mockResolvedValueOnce({  // Запис користувача повертає вже з хешем
      rows: [{ id: 1, email: userData.email, password: 'hashed-password', username: userData.username }]
    });

    const result = await registrationService.registrationUser(userData);

    expect(query).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(mockGenerateToken.generateToken).toHaveBeenCalledWith({
      username: userData.username,
      email: userData.email,
      password: 'hashed-password'  // тут передаємо саме захешований пароль
    });

    expect(result).toEqual({
      user: {
        id: 1,
        email: userData.email,
        username: userData.username,
        password: 'hashed-password',
      },
      token: 'mocked-token',
    });
  });

  it("Email is already in use.", async () => {
    const userData = { 
      email: 'test@example.com',
      password: '12345',
      username: "test"
    };

    query.mockResolvedValueOnce({ rows: [{id: 1, email: userData.email, username: userData.username, password: userData.password}]});

    await expect(registrationService.registrationUser(userData)).rejects.toThrow('This email already exists!');
  });
});

describe("authSerivce - login",  () => {
  let registrationService;
  let mockGenerateToken;

  beforeEach(() => {
    mockGenerateToken = {
      generateToken: jest.fn().mockResolvedValue('mocked-token')
    };

    registrationService = new RegistrationService(mockGenerateToken);
  });

  it('Login user', async () => {
    const userData = {
      email: "example@gmail.com",
      password: "12345"
    }

    const mockUser = {
      id: 1,
      username: "test",
      email: 'example@gmail.com',
      password: '12345'
    }
    query.mockResolvedValue({rows: [mockUser]});

    bcrypt.compare.mockResolvedValue(true);

    const result = await registrationService.login(userData);

    expect(query).toHaveBeenCalledTimes(4);
    expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, mockUser.password);
    expect(mockGenerateToken.generateToken).toHaveBeenCalledWith({
      username: mockUser.username,
      email: mockUser.email,
      password: mockUser.password
    });
    expect(result).toEqual({
      message: "Welcome!",
      token: "mocked-token"
    });
  });

  it('Login user - password do not match', async () => {
    const userData = {
      email: "example@gmail.com",
      password: '12345',
    };
    const mockUser = {
      username: 'test',
      email: 'example@gmail.com',
      password: '12345'
    }
    query.mockResolvedValue({rows: [mockUser]});
    bcrypt.compare.mockResolvedValue(false);

    // Спочатку викликаємо сервіс, очікуючи помилку
    await expect(registrationService.login(userData)).rejects.toThrow("Passwords do not match");

    // Тільки після цього перевіряємо, що bcrypt.compare був викликаний
    expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, mockUser.password);
  });
});
