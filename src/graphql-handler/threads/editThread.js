const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const editThread = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { threadId, title, content, tags } = args;
        const thread = await db.ForumThreads.findByPk(threadId);
        if(thread === null) {
            throw new UserInputError("Thread does not exist.");
        }
        if (thread['author_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this thread."
            );
        }
        if (title) {
            thread['title'] = title;
            thread['update_at'] = Date.now();
        }
        if (content) {
            thread['content'] = content;
            thread['update_at'] = Date.now();
        }

        if (tags) {
            thread['tags'] = title;
            thread['update_at'] = Date.now();
        }

        await thread.save();
        return { success: true };
    } catch (err) {
        if (
            !(err instanceof UserInputError) &&
            !(err instanceof AuthenticationError)
        ) {
            console.log(err);
        }
        return {
            success: false,
            message: err.message,
        };
    }
};
module.exports = editThread;
