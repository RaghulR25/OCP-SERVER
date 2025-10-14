import Chat from "../modles/Chat.js";

// Get messages between logged-in user and receiver
export const getChatByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;

    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ message: "Server error fetching chat messages" });
  }
};

// Send a message
export const postMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text, bookingId } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      text,
      booking: bookingId || null,
    });

    const populatedMessage = await chatMessage
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error posting chat message:", err);
    res.status(500).json({ message: "Server error sending message" });
  }
};
