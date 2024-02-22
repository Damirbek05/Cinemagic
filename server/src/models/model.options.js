// Defining options for Mongoose models
const modelOptions = {
    // Options for transforming the document to JSON format
    toJSON: {
        virtuals: true, // Include virtual properties in the JSON output
        transform: (_, obj) => {
            // Transformation function for the JSON output
            delete obj._id; // Exclude the "_id" field from the JSON output
            return obj;
        }
    },
    
    // Options for transforming the document to a plain JavaScript object
    toObject: {
        virtuals: true, // Include virtual properties in the plain object output
        transform: (_, obj) => {
            // Transformation function for the plain object output
            delete obj._id; // Exclude the "_id" field from the plain object output
            return obj;
        }
    },
    
    // Disabling the inclusion of the version key ("__v") in the output
    versionKey: false,
    
    // Adding timestamps to track document creation and modification
    timestamps: true
};

// Exporting the model options
export default modelOptions;
