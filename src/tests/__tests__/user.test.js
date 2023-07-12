const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;

jest.mock("../../db/db.js", () => ({
  db: {
    users: {
      create: jest.fn((data) => Promise.resolve(data)), 
    },
  },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("uuid");

const { db } = require("../../db/db.js");
const { signup } = require("../../controllers/UserController.js");

describe("signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a user and return the user details", async () => {
    const req = {
      body: {
        nome: "John Doe",
        email: "john@example.com",
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
      nome: "Hugo Dev",
      email: "hugo@example.com",
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
      nome: "Hugo Dev",
      email: "hugo@example.com",
      senha: "hashedPassword",
      userHash: "userHash",
    });
  });

  it("deve injetar usuario e retornar os dados corretos", async () => {
    const req = {
      body: {
        nome: "Hugo Dev",
        email: "hugo@example.com",
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
