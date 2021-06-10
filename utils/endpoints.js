const URL =
process.env.NODE_ENV.trim() === "development"
  ? "http://localhost:6000"
  : "https://stormy-badlands-01458.herokuapp.com";
module.exports = {
  auth: {
    login: {
      endpoint: `${URL}/api/v1/users/login`,
      method: "POST",
      payloadFormat: {
        email: {
          type: "string",
          required: true,
        },
        password: {
          type: "string",
          required: true,
        },
      },
    },
    register: {
      endpoint: `${URL}/api/v1/users/signup`,
      method: "POST",
      payloadFormat: {
        firstName: {
          type: "string",
          required: true,
        },
        middleName: {
          type: "string",
        },
        lastName: {
          type: "string",
          required: true,
        },
        email: {
          type: "string",
          required: true,
          unique: true,
        },
        phone: "string",
        bio: "string",
        password: {
          type: "string",
          minlength: 8,
        },
        confirmPassword: {
          type: "string",
          minlength: 8,
        },
      },
    },
  },
  posts: {
    createPost: {
      endpoint: `${URL}/api/v1/post/`,
      method: "POST",
      payloadFormat: {
        user: {
          type: "mongo document id",
        },
        feeling: {
          type: "string",
        },
        message: {
          type: "string",
          required: true,
          minlength: 10,
        },
        tags: [{ type: "mongo document id" }],
      },
    },
    updatePost: {
      endpoint: `${URL}/api/v1/post/{document_id}`,
      method: "PATCH",
      payloadFormat: {
        feeling: {
          type: "string",
        },
        message: {
          type: "string",
          required: true,
          minlength: 10,
        },
        tags: [{ type: "mongo document id" }],
      },
    },
    getPost: {
      endpoint: `${URL}/api/v1/post/{document_id}`,
      method: "GET",
    },
    deletePost: {
      endpoint: `${URL}/api/v1/post/{document_id}`,
      method: "DELETE",
    },
  },
};
