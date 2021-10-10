const userModel = require("../../models/UserModel");
const verifyAuth = require("../AuthGuard");
const { signJwt } = require("../AuthService");

const memoryStore = {
  value: [
    {
      username: "john",
      password: "JOHN123",
    },
  ],
};

describe("AuthGuard.test.js", () => {
  beforeEach(() => {
    userModel.findOne = async ({ username }) => {
      const foundValue = memoryStore.value.find((v) => v.username === username);
      if (foundValue) {
        return {
          ...foundValue,
          select: () => {
            return foundValue;
          },
        };
      }
    };
  });

  it("should block the request handler if no authorization header and should throw 401", async () => {
    const req = { header: () => {} };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    const next = jest.fn();
    await verifyAuth("ACCES")(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      message: "Invalid request: Missing Authorization header",
    });
    expect(next).not.toBeCalled();
  });

  it("should block the request handler if JWT is malformed and should throw 401", async () => {
    const req = {
      header: () => {
        return "Bearer Token123$";
      },
    };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    const next = jest.fn();
    await verifyAuth("ACCES")(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      details: "jwt malformed",
      message: "Failed Authorization: Invalid refresh token",
    });
    expect(next).not.toBeCalled();
  });

  it("should block the request handler if JWT is expired and should throw 401", async () => {
    const token = await signJwt({ username: "john" }, 0); //expires in 0s

    const req = {
      header: () => {
        return `Bearer ${token}`;
      },
    };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    const next = jest.fn();
    await verifyAuth("ACCESS")(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      details: "jwt expired",
      message: "Failed Authorization: Invalid refresh token",
    });
    expect(next).not.toBeCalled();
  });

  it("should block the request handler if JWT type is wrong and should throw 401", async () => {
    const token = await signJwt(
      { username: "john", auth_type: "REFRESH" },
      6000
    );

    const req = {
      header: () => {
        return `Bearer ${token}`;
      },
    };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    const next = jest.fn();
    await verifyAuth("ACCESS")(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      details: "Wrong token type",
      message: "Failed Authorization: Invalid refresh token",
    });
    expect(next).not.toBeCalled();
  });

  it("should execute next() request handler because token is valid and request should have the current user", async () => {
    const token = await signJwt(
      { username: "john", auth_type: "ACCESS" },
      6000
    );

    const req = {
      header: () => {
        return `Bearer ${token}`;
      },
    };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    const next = jest.fn();
    await verifyAuth("ACCESS")(req, res, next);

    expect(next).toBeCalled();
    expect(req.currentUser).toBe(
      memoryStore.value.find((v) => v.username === "john")
    );
  });
});
