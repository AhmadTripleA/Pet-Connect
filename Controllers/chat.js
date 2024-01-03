const { resErr, resMsg } = require('../middlewares/general');
const Chat = require('../Models/chat');

exports.newChat = async (req, res) => {
    try {
        const participants = req.body.participants;

        const chat = new Chat({
            participants,
            messages,
        })

        await chat.save();

        resMsg('Chat Added!', 200);

    } catch (err) {
        resErr(err.message, 400);
    }
}

exports.addParticipants = async (req, res) => {
    try {
        const participants = req.body.participants;
        const chat = Chat.findById(req.body.chat);

        for (let i = 0; i < participants.length; i++) {
            chat.participants.push(participants[i]);
        }

        await chat.save();

        resMsg('Participants Added!', 200);

    } catch (err) {
        resErr(err.message, 400);
    }
}

exports.removeParticipants = async (req, res) => {
    try {
        const participants = req.body.participants;
        const chat = Chat.findById(req.body.chat);

        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            chat.participants.pull(participant);
        }

        await chat.save();

        resMsg('Participants Removed!', 200);

    } catch (err) {
        resErr(err.message, 400);
    }
}