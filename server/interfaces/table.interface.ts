import mongoose, { Document, Model, Schema } from "mongoose";

interface tableDocument extends Document {
  name: String;
  hours: String;
  costs: String;
}

const tableSchema = new Schema<tableDocument>({
  name: { type: String, required: true },
  hours: { type: String, required: true },
  costs: { type: String, required: true },
});

// Define your model using the schema
const tableModel: Model<tableDocument> = mongoose.model<tableDocument>(
  "tableSchema",
  tableSchema
);
