const { Model } = require("mongoose");
const userModel = require("../../models/UserModel");
const { loginUser } = require("../AuthController");
const bcrypt = require("bcrypt");

const memoryStore = {
  value: [
    {
      username: "john",
      password: "JOHN123",
    },
  ],
};

describe("AuthController.test.js", () => {
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
    //mocking bcrypt compare to normal equal comparison
    bcrypt.compare = (hashed, raw) => {
      return hashed === raw;
    };
  });

  it("should not login if required params are missing and should throw 404", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    await loginUser(req, res);
    expect(res.status).toBeCalledWith(404);
  });

  it("should not login if passwords didn't match and should throw 401", async () => {
    const req = {
      body: {
        username: "john",
        password: "WRONG_PASSWORD",
      },
    };
    let responseMsg = {};
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    await loginUser(req, res);
    expect(res.status).toBeCalledWith(401);
  });

  it("should login if passwords match and should respond with tokens", async () => {
    const req = {
      body: {
        username: "john",
        password: "JOHN123",
      },
    };
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn().mockImplementationOnce((response) => {
        responseMsg = response;
      }),
    };
    await loginUser(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(responseMsg.access_token).toContain("Bearer ");
    expect(responseMsg.refresh_token).toContain("Bearer ");
  });
});
