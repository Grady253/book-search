const {user, User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');
const { findOne } = require('../models/User');

const resolvers = {
    query:{
        me: async(parent, args, context) =>{
            if(context.user){
                const userData = findOne({_id: context.user._id})
                return userData
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

        login: async (parent,{email,password})=> {
            const user = await User.findOne({ email });
            if (!user){
                throw new AuthenticationError('Not Logged In');
            }
            const token = signToken(user);
            return {user, token};
        }

        
    }
}