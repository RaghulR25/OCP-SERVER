import Chat from "../modles/Chat.js";


export const getChatByUser = async (req, res) => {
  try {
    const { receiverId } = req.params; 
    const userId = req.user._id;

    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json({ messages });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Server error fetching chat" });
  }
};

export const postMessage = async (req, res) => {
  try {
    const senderId = req.user._id; 
    const { receiverId, text } = req.body;

    if (!receiverId || !text)
      return res.status(400).json({ message: "Receiver and text required" });

    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    const populatedMessage = await chatMessage
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error posting chat message:", err);
    res.status(500).json({ message: "Server error posting chat message" });
  }
};
