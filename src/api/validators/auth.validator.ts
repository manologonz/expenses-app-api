import {checkSchema, CustomValidator} from "express-validator";
import userService from "../services/user.service";

export const registerValidator = checkSchema({
    username: {
        isString: {
            errorMessage: "This field must be string."
        },
        exists: {
            errorMessage: "This field is required."
        },
        custom: {
            options: async (value) => {
                const user = await userService.getUserByUsername(value);
                if(user !== null) return Promise.reject();
            },
            errorMessage: "This email is already in use."
        }
    },
    firstName: {
        isString: {
            errorMessage: "This field must be string."
        },
        exists: {
            errorMessage: "This field is required."
        }
    },
    lastName: {
        isString: {
            errorMessage: "This field must be string."
        },
        exists: {
            errorMessage: "This field is required."
        }
    },
    email: {
        isEmail: {
            errorMessage: "Enter a valid email."
        },
        exists: {
            errorMessage: "This field is required."
        },
        custom: {
            options: async (value) => {
                const user = await userService.getUserByEmail(value);
                console.log(user === null)
                if(user !== null) return Promise.reject();
            },
            errorMessage: "This email is already in use."
        }
    },
    password: {
        exists: {
          errorMessage: "This field must be string."
        },
        isString: {
            errorMessage: "This field must be string."
        }
    },
    confirmPassword: {
        exists: {
            errorMessage: "This field is required."
        },
        isString: {
            errorMessage: "This field must be string."
        },
        custom: {
            options: (value: string, {req}) => {
                console.log(value, req.body.password.toString())
                return value.toString() === req.body.password;
            },
            errorMessage: "Passwords don't match."
        }
    }
});

export const loginValidator = checkSchema({
    email: {
        exists: {
          errorMessage: "This is a required field."
        },
        isEmail: {
            errorMessage: "Enter a valid email."
        },
    },
    password: {
        exists: {
            errorMessage: "This is a required field."
        },
        isString: {
            errorMessage: "This field must be string."
        }
    }
});