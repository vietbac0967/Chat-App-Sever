import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    participantsGroup: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: [],
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
