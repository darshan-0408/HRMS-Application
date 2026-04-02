import Designation from './Designation.model.js';

const designationResolvers = {
  Query: {
    listDesignations: async () => {
      return Designation.find({ isDeleted: false }).sort({ name: 1 });
    },
    getDesignation: async (_, { id }) => {
      return Designation.findById(id);
    },
  },
  Mutation: {
    createDesignation: async (_, { input }) => {
      const desig = new Designation(input);
      return desig.save();
    },
    updateDesignation: async (_, { id, input }) => {
      return Designation.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    },
    deleteDesignation: async (_, { id }) => {
      return Designation.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },
    restoreDesignation: async (_, { id }) => {
      return Designation.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    },
  },
};

export default designationResolvers;
