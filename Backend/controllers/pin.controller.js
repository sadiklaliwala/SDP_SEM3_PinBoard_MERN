import PinModel from '../models/pinModel.js';
import CommentModel from '../models/comment.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { upload } from '../middlewares/multer.middleware.js';

// Route for creating a pin --> POST /api/pins/create
export const createPin = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const imageUrl = await uploadToCloudinary(fileBuffer, fileName);
    const { title, description, category } = req.body;

    const newPin = new PinModel({
      title,
      description,
      category,
      image: imageUrl,
      owner: req.user._id,
    });

    const savedPin = await newPin.save();

    res.status(201).json({
      success: true,
      message: 'Pin created successfully',
      savedPin,
    });
  } catch (error) {
    console.error('Error creating pin:', error);
    res.status(500).json({ success: false, message: error.message });
    next(error);
  }
};

// Get all pins --> GET /api/pins
export const getAllPins = async (req, res, next) => {
  try {
    const pins = await PinModel.find()
      .populate('owner', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'owner', select: 'name' },
      });

    res.status(200).json({ success: true, pins });
  } catch (error) {
    console.log('Error fetching all pins:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single pin --> GET /api/pins/:id
export const getSinglePin = async (req, res, next) => {
  try {
    const pin = await PinModel.findById(req.params.id)
      .populate('owner', 'name followers')
      .populate({
        path: 'comments',
        populate: { path: 'owner', select: 'name' },
      });

    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });

    res.status(200).json({ success: true, pin });
  } catch (error) {
    console.log('Error fetching pin by id:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete pin --> DELETE /api/pins/:id
export const deletePin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pin = await PinModel.findById(id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    await CommentModel.deleteMany({ pin: id });
    await PinModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Pin deleted' });
  } catch (error) {
    console.log('Error deleting pin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update pin --> PUT /api/pins/:id
export const updatePin = async (req, res, next) => {
  try {
    let pin = await PinModel.findById(req.params.id);
    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      req.body.image = imageUrl;
    }

    pin = await PinModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Pin updated successfully', pin });
  } catch (error) {
    console.log('Error updating pin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like/Unlike pin --> PUT /api/pins/:id/toggleLike
export const likePin = async (req, res, next) => {
  try {
    const pin = await PinModel.findById(req.params.id);
    const userId = req.user._id;

    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });

    const userIndex = pin.reactions.findIndex(r => r.user.toString() === userId.toString() && r.reaction === 'like');

    if (userIndex === -1) {
      pin.reactions.push({ user: userId, reaction: 'like' });
      pin.reactionCounts.like += 1;
    } else {
      pin.reactions.splice(userIndex, 1);
      pin.reactionCounts.like = Math.max(0, pin.reactionCounts.like - 1);
    }

    await pin.save();

    res.status(200).json({
      success: true,
      message: userIndex === -1 ? 'Liked the pin' : 'Unliked the pin',
      pin,
    });
  } catch (error) {
    console.log('Error liking pin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// React to pin --> PUT /api/pins/:id/react
export const reactToPin = async (req, res, next) => {
  try {
    const { reaction } = req.body; // "like", "love", "wow", "sad", "angry"
    const userId = req.user._id;
    const pin = await PinModel.findById(req.params.id);

    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });

    // Check if user already reacted
    const existingReactionIndex = pin.reactions.findIndex(r => r.user.toString() === userId.toString());

    if (existingReactionIndex !== -1) {
      // Decrement old reaction count
      const oldReaction = pin.reactions[existingReactionIndex].reaction;
      pin.reactionCounts[oldReaction] = Math.max(0, pin.reactionCounts[oldReaction] - 1);

      // Update reaction
      pin.reactions[existingReactionIndex].reaction = reaction;
      pin.reactionCounts[reaction] += 1;
    } else {
      // Add new reaction
      pin.reactions.push({ user: userId, reaction });
      pin.reactionCounts[reaction] += 1;
    }

    await pin.save();

    res.status(200).json({
      success: true,
      message: `Reacted with ${reaction}`,
      pin,
    });
  } catch (error) {
    console.log('Error reacting to pin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};