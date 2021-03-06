module.exports = (sequelize, Sequelize) => {
    const CourseMembers = sequelize.define(
        'CourseMembers',
        {
            course_member_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            course_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.ENUM,
                values: ['Pending', 'Accepted', 'Rejected'],
                defaultValue: 'Pending',
            },
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['course_id', 'user_id'],
                },
            ],
        }
    );

    CourseMembers.associate = models => {
        CourseMembers.belongsTo(models.Courses, {
            as: 'course',
            foreignKey: 'course_id',
            targetKey: 'course_id',
        });
        CourseMembers.belongsTo(models.Users, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            as: 'user'
        });
    };
    return CourseMembers;
};
