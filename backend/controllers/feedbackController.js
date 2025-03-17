import Feedback from '../models/Feedback.js';
import User from '../models/User.js';


export const addfeedback = async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment.trim()) {
        return res.status(400).json({ message: 'Rating and comment are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newFeedback = new Feedback({
            rating, comment, username: user.username, 
});
        await newFeedback.save();
        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ message: 'Error saving feedback' });
    }
};


export const approveFeedback = async (req, res) => {
    const { feedbackId } = req.params;  // Get feedback ID from params
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied' });
    }

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.approved = true; // Mark as approved
        feedback.status = "approved";
        await feedback.save();
        res.status(200).json({ message: 'Feedback approved successfully' });
    } catch (error) {
        console.error('Error approving feedback:', error);
        res.status(500).json({ message: 'Error approving feedback' });
    }
};



export const rejectFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied' });
    }

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.approved = false;
        feedback.status = "rejected";
        await feedback.save();

        res.status(200).json({ message: 'Feedback rejected successfully' });
    } catch (error) {
        console.error('Error rejecting feedback:', error);
        res.status(500).json({ message: 'Error rejecting feedback' });
    }
};



// Delete Feedback (Admin only)
export const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied' });
    }

    try {
        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Error deleting feedback' });
    }
};


// Get Approved Feedback
export const getApprovedFeedback = async (req, res) => {
    try {
        const approvedFeedback = await Feedback.find({ approved: true });
        res.status(200).json(approvedFeedback);
    } catch (error) {
        console.error('Error fetching approved feedback:', error);
        res.status(500).json({ message: 'Error fetching approved feedback' });
    }
};


export const getAllFeedback = async (req, res) => {
    try {
        const allFeedback = await Feedback.find();
        res.status(200).json(allFeedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching approved feedback' });
    }
};


export const getApprovedFeedbackCount = async (req, res) => {
    try {
        const count = await Feedback.countDocuments({ approved: true });
        res.status(200).json({ approvedCount: count });
    } catch (error) {
        console.error('Error counting approved feedback:', error);
        res.status(500).json({ message: 'Error fetching approved feedback count' });
    }
};
