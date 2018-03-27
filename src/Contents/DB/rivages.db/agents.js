module.exports = function(sequelize, DataTypes) {
	return sequelize.define('agents', {
		Id: {
			type: DataTypes.INTEGER(11),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		nom: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		prenom: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		actif: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		service: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		servicecvrh: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		initial: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		mail: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		telephone: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		profil: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
	})
};