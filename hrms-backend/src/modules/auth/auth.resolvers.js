import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';
import Tenant from '../../models/Tenant.model.js';

const authResolvers = {
  Mutation: {
    login: async (_, { username, password }) => {
      // Find user by username
      const user = await User.findOne({ username }).populate('tenant_id');
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid username or password');
      }

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          tenant_id: user.tenant_id?._id || null, // Handle Super Admin
          role: user.role 
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );

      return {
        token,
        user: {
          ...user.toObject(),
          tenant_id: user.tenant_id?._id || null,
          tenant: user.tenant_id || null
        }
      };
    },
  },
  Query: {
    me: async (_, __, { currentUser }) => {
      if (!currentUser) return null;
      const user = await User.findById(currentUser.userId).populate('tenant_id');
      if (!user) return null;
      return {
        ...user.toObject(),
        tenant_id: user.tenant_id?._id || null,
        tenant: user.tenant_id || null
      };
    },
  },
};

export default authResolvers;
