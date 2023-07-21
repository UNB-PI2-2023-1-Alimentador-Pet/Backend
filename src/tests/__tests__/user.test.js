const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const { db } = require("../../db/db.js");
const { signup, login, updateUser, forgotPassword, resetPassword } = require("../../controllers/UserController.js");

jest.mock("../../db/db.js", () => ({
  db: {
    users: {
      create: jest.fn((data) => Promise.resolve(data)),
      findOne: jest.fn((params) => Promise.resolve({
          "id": 1,
          "nome": "Hugo",
          "email": "hugo@email.com",
          "senha": "$2b$10$5ZZ0mc2/8hRax.zpV/YC4.zGRKoP7ddMvlIa/LkC.BMFuuX1gMCgC",
          "userHash": "d7f0f61a-2eb8-4a54-9a1a-6d812d3d3703",
          "updatedAt": "2023-07-05T02:26:52.203Z",
          "createdAt": "2023-07-05T02:26:52.203Z",
          "resetpToken": null,
          "resetpExpires": null
       })),
      update: jest.fn(),
    },
  },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("uuid");

describe("signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar e retornar os dados do usuario", async () => {
    const req = {
      body: {
        nome: "Hugo",
        email: "hugo@email.com",
        senha: "password",
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      cookie: jest.fn(),
    };

    bcrypt.hash.mockResolvedValue("hashedPassword");
    jwt.sign.mockReturnValue("generatedToken");
    uuidv4.mockReturnValue("userHash");

    db.users.create.mockResolvedValue({
      id: 1,
      nome: "Hugo",
      email: "hugo@email.com",
      senha: "hashedPassword",
      userHash: "userHash",
    });

    await signup(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1 },
      process.env.secretKey,
      expect.objectContaining({ expiresIn: expect.any(Number) })
    );
    expect(res.cookie).toHaveBeenCalledWith("jwt", "generatedToken", {
      maxAge: 1 * 24 * 60 * 60,
      httpOnly: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      id: 1,
      nome: "Hugo",
      email: "hugo@email.com",
      senha: "hashedPassword",
      userHash: "userHash",
    });
  });

  it("deve injetar usuario e retornar os dados corretos", async () => {
    const req = {
      body: {
        nome: "Hugo",
        email: "hugo@email.com",
        senha: "password",
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      json: jest.fn(),
    };

    bcrypt.hash.mockRejectedValue(new Error("bcrypt error"));

    await signup(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log in the user and return user data", async () => {
    const req = {
      body: {
        email: "hugo@email.com",
        senha: "password",
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      cookie: jest.fn(),
    };
  
    const mockUser = {
      id: 1,
      nome: "Hugo",
      email: "hugo@email.com",
      senha: "hashedPassword",
    };
  
    db.users.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("generatedToken");

    await login(req, res);

    expect(db.users.findOne).toHaveBeenCalledWith({
      where: {
        email: "hugo@email.com",
      },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1 },
      process.env.secretKey,
      expect.objectContaining({ expiresIn: expect.any(Number) })
    );
    expect(res.cookie).toHaveBeenCalledWith("jwt", "generatedToken", {
      maxAge: 1 * 24 * 60 * 60,
      httpOnly: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(mockUser);
  });

  it("should return an error if authentication fails", async () => {
    const req = {
      body: {
        email: "hugo@email.com",
        senha: "password",
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    bcrypt.compare.mockResolvedValue(false);
    db.users.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Authentication failed");
  });

  it("should return an error if an error occurs during login", async () => {
    const req = {
      body: {
        email: "hugo@email.com",
        senha: "password",
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    bcrypt.compare.mockRejectedValue(new Error("bcrypt error"));
    db.users.findOne.mockRejectedValue(new Error("Database error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: expect.any(Error) });
  });
});

describe("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the user data and return updated user", async () => {
    const req = {
      params: {
        userHash: "userHash",
      },
      body: {
        nome: "Updated User",
        email: "updated@example.com",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  
    const mockUser = {
      id: 1,
      nome: "Hugo",
      email: "user@example.com",
    };
  
    db.users.update.mockResolvedValue(); // Resolve with undefined
    db.users.findOne.mockResolvedValue(mockUser);

    await updateUser(req, res);

    expect(db.users.update).toHaveBeenCalledWith(
      {
        nome: "Updated User",
        email: "updated@example.com",
      },
      {
        where: { userHash: "userHash" },
      }
    );
    expect(db.users.findOne).toHaveBeenCalledWith({
      where: { userHash: "userHash" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should return an error if an error occurs during update", async () => {
    const req = {
      params: {
        userHash: "userHash",
      },
      body: {
        nome: "Updated User",
        email: "updated@example.com",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  
    db.users.update.mockRejectedValue(new Error("Database error"));
  
    await updateUser(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Error));
  });
});

