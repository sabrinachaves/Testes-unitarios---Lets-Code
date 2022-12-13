const e = require("express");
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
      };
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

  it("Should return a error message", async () => {
    try {
      await UserController.create();
    } catch (error) {
      expect(error).toMatchObject({ message: error.message });
    }
  });
});

describe('User Controller "changePassword"', () => {
  it("Should return status 400 if email is not provides or invalid", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);

    const { invalidEmail } = getResponses();
    const req = getReqMock({
      email: "emailExiste",
      oldPassword: "123456",
      newPassword: "1234567",
      confirmPassword: "1234567",
    });
    const res = getResMock();

    const response = await UserController.changePassword(req, res);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject(invalidEmail);
  });

  it("Should return status 400 if password is not provided", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);

    const { invalidPassword } = getResponses();
    const req = getReqMock({
      email: "emailExiste@teste.com",
      newPassword: "1234567",
      confirmPassword: "1234567",
    });
    const res = getResMock();

    const response = await UserController.changePassword(req, res);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject(invalidPassword);
  });

  it("Should return status 401 if credentials are invalid", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);
    jest
      .spyOn(UserService, "checkPassword")
      .mockImplementationOnce(() => false);

    const { invalidCredentials } = getResponses();
    const req = getReqMock({
      email: "emailNaoExiste@teste.com",
      oldPassword: "123456",
      newPassword: "1234567",
      confirmPassword: "1234567",
    });
    const res = getResMock();

    const response = await UserController.changePassword(req, res);

    expect(response.status).toBe(401);
    expect(response.data).toMatchObject(invalidCredentials);
  });

  it("Should return a ok message if password is updated", async () => {
    jest
      .spyOn(UserService, "userExists")
      .mockImplementationOnce(UserControllerMock.userExists);
    jest.spyOn(UserService, "checkPassword").mockImplementationOnce(() => true);
    jest.spyOn(User, "updateOne").mockImplementationOnce(() => {
      return {
        password: "1234567",
      };
    });

    const { successMessage } = getResponses();
    const req = getReqMock({
      email: "emailExiste@teste.com",
      oldPassword: "123456",
      newPassword: "1234567",
      confirmPassword: "1234567",
    });
    const res = getResMock();

    const response = await UserController.changePassword(req, res);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(successMessage);
  });

  it("Should return a error message", async () => {
    try {
      await UserController.changePassword();
    } catch (error) {
      expect(error).toMatchObject({ message: error.message });
    }
  });
  
});
