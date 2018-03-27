module.exports = function(sequelize, DataTypes) {
	return sequelize.define('formations', {
		IdFormation: {
			type: DataTypes.INTEGER(11),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
	})
};