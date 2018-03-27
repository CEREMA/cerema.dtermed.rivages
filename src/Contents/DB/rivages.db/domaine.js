module.exports = function(sequelize, DataTypes) {
	return sequelize.define('domaine', {
		Id: {
			type: DataTypes.INTEGER(11),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		nomdomaine: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
	})
};