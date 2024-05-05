import { Document, Schema, model, Types } from "mongoose";

interface IDeveloper extends Document {
  userId: Types.ObjectId;
  logo: string;
  book_now_link: string;
  agent_link: string;
}

const roleSchema = new Schema<IDeveloper>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    logo: String,
    book_now_link: String,
    agent_link: String,
  },
  { timestamps: true }
);

type developerDataType = {
  name: string;
  isActive: boolean;
  isDeleted: boolean;
};

const RoleModel = model<IDeveloper>("developer", roleSchema);

export { RoleModel, IDeveloper, developerDataType };
