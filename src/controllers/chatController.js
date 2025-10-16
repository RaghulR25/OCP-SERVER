
import Chat from "../modles/Chat.js";

export const getChatByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const messages = await Chat.find({ booking: bookingId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};

export const postMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text, bookingId } = req.body;

    if (!receiverId || !text || !bookingId) {
      return res.status(400).json({ message: "receiverId, text, and bookingId are required" });
    }

    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      text,
      booking: bookingId,
    });

    const populatedMessage = await chatMessage
      .populate("sender", "name email")
      .populate("receiver", "name email");


    req.app.get("io")?.emit("receive_message", {
      ...populatedMessage.toObject(),
      booking: bookingId,
    });

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending message" });
  }
};
