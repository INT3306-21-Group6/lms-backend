const { AuthenticationError } = require('apollo-server-express');
const { snakeCase, camelCase } = require('change-case-object');
const db = require('../../models');

const getUserCourses = async (_, args, { userCtx }) => {
    const { userId, status, pageNumber = 0, pageSize = 10 } = args;
    
    if (userCtx.error) throw new AuthenticationError(userCtx.error);
    
    const filters = { status, userId };

    const totalRecords = await db.CourseMembers.count({
        where: snakeCase(filters),
    });
    const courseList = await db.Courses.findAll({
        include: [
            {
                association: 'members',
                where: snakeCase(filters),
            },
            {
                model: db.Users,
                as: 'host',
            },
        ],
        limit: pageSize,
        offset: pageNumber * pageSize,
        nest: true,
        raw: true,
    });
    return camelCase({
        courseList,
        status,
        totalRecords,
        pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
    });
};

module.exports = getUserCourses;
