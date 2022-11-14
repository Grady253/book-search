const {user, User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');
const { findOne } = require('../models/User');

const resolvers = {
    query:{
        me: async(parent, args, context) =>{
            if(context.user){
                const userData = findOne({_id: context.user._id})
                return userData;
            }
            throw new AuthenticationError('Not Logged In');
        }
    },
    mutation:{
        addUser: async(parent, args) =>{
            const user = await user.create(args);
            const token =signToken(user);
            return {user, token};
        },

        login: async (parent, {email, password})=> {
            const user = await user.findOne({ email });
            if (!user){
                throw new AuthenticationError('Not Logged In');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Incorrect password'); 
            }

            const token = signToken(user);

            return {user, token};
        },

        saveBook: async (parent, args, context) =>{
            if(context.user){
                const updateUser = await user.findOneAndUpdate(
                    {_id: context.user._id},
                    {$push:{saveBook: args}},
                    {new: true, runValidtors: true}
                );
                return updateUser;
            }
            throw new AuthenticationError('Not Logged In');
        },

        removeBook: async (parent, {bookId}, context) =>{
            if(context.user){
                const updateUser = await user.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull:{saveBook: {bookId}}},
                    {new: true}
                );
                return updateUser;
            }
            throw new AuthenticationError('Not Logged In');
        }

    }
}