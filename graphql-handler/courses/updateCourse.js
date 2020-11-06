const db = require('../../models');
const { snakeCase, camelCase } = require('change-case-object');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const updateCourse = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { hostId },
        } = userCtx;
        const { courseId, description } = args;
        const course = await db.Courses.findByPk(courseId);
        if (course['host_id'] !== hostId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this course."
            );
        }
        
        if (content) {
            course['description'] = description;
        }
        await post.save();
        return {
            success: true,
        };
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
module.exports = updateCourse;
