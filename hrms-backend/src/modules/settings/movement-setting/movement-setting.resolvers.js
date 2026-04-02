import MovementSetting from './MovementSetting.model.js';

const movementSettingResolvers = {
  Query: {
    // Returns the first (and only) movement setting config
    getMovementSetting: async () => MovementSetting.findOne().sort({ createdAt: -1 }),
  },
  Mutation: {
    upsertMovementSetting: async (_, { input }) => {
      // Keep a single settings document — update it or create if none exists
      const existing = await MovementSetting.findOne().sort({ createdAt: -1 });
      if (existing) {
        return MovementSetting.findByIdAndUpdate(existing._id, input, { new: true, runValidators: true });
      }
      return new MovementSetting(input).save();
    },
  },
};

export default movementSettingResolvers;
