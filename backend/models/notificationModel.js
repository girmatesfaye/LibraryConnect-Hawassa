import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["borrow-request", "request-accepted", "request-declined"],
      required: true,
    },
    relatedBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    relatedBorrow: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
