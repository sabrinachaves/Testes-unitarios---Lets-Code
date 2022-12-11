const UserController = require("../../../src/controllers/user-ctrl");
const User = require("../../../src/models/User");
const UserService = require("../../../src/services/user-service");
const {
  getReqMock,
  getResMock,
  getResponses,
} = require("../../mocks/users-mock");

class UserControllerMock {
  static async userExists(email) {
    if (email === "emailExiste@teste.com") {
      return true;
    } else {
      return false;
    }
  }

  static async checkPassword(email, password) {
    return password === "123456";
  }
}

describe('User Controller "create"', () => {
  it("Should return the status 200 if name, email and password are valid", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);
    jest.spyOn(User, "create").mockImplementationOnce(() => {
      return {
          name: "Teste",
          email: "email@teste.com",
          password: "123456",
          _id: "638ea57734bac791a9286581",
          __v: 0,
        }
    });
    const req = getReqMock({
      name: "Teste",
      email: "email@teste.com",
      password: "123456",
    });
    const res = getResMock();

    const response = await UserController.create(req, res);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
        user: {
          name: "Teste",
          email: "email@teste.com",
          password: "123456",
          _id: "638ea57734bac791a9286581",
          __v: 0,
        },
      });
  });

  it("Should return the status 400 if email is not provided or is invalid", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);
    const req = getReqMock({ name: "Teste", password: "123456" });
    const res = getResMock();
    const { invalidEmail } = getResponses();

    const response = await UserController.create(req, res);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject(invalidEmail);
  });

  it("Should return the status 400 if email is not provided or is invalid", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);
    const req = getReqMock({ name: "Teste", email: "email@teste.com" });
    const res = getResMock();
    const { invalidPassword } = getResponses();

    const response = await UserController.create(req, res);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject(invalidPassword);
  });
});
