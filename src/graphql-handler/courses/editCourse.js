const db = require('../../models');
const {
    UserInputError,
    AuthenticationError,
} = require('apollo-server-express');

const updateCourse = async (_, args, { userCtx }) => {
    try {
        if (userCtx.error) throw new AuthenticationError(userCtx.error);
        const {
            user: { userId },
        } = userCtx;
        const { courseId, name, shortDescription, description } = args;
        const course = await db.Courses.findByPk(courseId);
        if(course === null) {
            throw new UserInputError("Course does not exist.")
        }
        if (course['host_id'] !== userId) {
            throw new AuthenticationError(
                "You don't have permission to edit on this course."
            );
        }

        if (name) {
            course['name'] = name;
            course['update_at'] = Date.now();
        }

        if (shortDescription) {
            course['short_description'] = shortDescription;
            course['update_at'] = Date.now();
        }
        
        if (description) {
            course['description'] = description;
            course['update_at'] = Date.now();
        }
        await course.save();
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
