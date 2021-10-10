const { Model } = require("mongoose");
const userModel = require("../../models/UserModel");
const { createUser, getProfile } = require("../UserController");

const memoryStore = {
  value: [],
};

describe("UserController.test.js", () => {
  beforeEach(() => {
    userModel.findOne = async ({ _id }) => {
      const foundValue = memoryStore.value.find((v) => v._id === _id);
      if (foundValue) {
        return {
          ...foundValue,
          select: () => {
            return foundValue;
          },
        };
      }
    };

    Model.prototype.save = function () {
      memoryStore.value.push(this);
    };
  });

  it("should not create a user if all required params are not there and will throw 404", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.status).toBeCalledWith(404);
  });

  it("should create a user if all required params are there and will respond 200", async () => {
    const req = {
      body: {
        name: "John",
        username: "john123",
        password: "JOHN123$",
        email: "john123@email.com",
      },
    };

    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    await createUser(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(memoryStore.value).toHaveLength(1);
  });

  it("should respond a current api caller profile (assuming AuthGuard success) and request has currentUser", async () => {
    const req = {
      currentUser: {
        username: "john",
      },
    };

    const res = {
      status: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn(),
    };
    await getProfile(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ username: "john" });
  });
});
