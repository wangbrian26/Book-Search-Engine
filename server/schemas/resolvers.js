const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth.js");
const resolvers = {
  Query: {
    me: async (parents, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id);
        return userData;
      }
      throw new AuthenticationError("Please log in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { user, token };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No email found");
      }
      const password = await user.isCorrectPassword(password);
      if (!password) {
        throw new AuthenticationError("Incorrect password");
      }
      const token = signToken(user);
      return { user, token };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError(
        "Please make sure you are logged in to save a book"
      );
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError(
        "Please make sure you are logged in to remove a book"
      );
    },
  },
};

module.exports = resolvers;
