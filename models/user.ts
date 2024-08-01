'use strict';
import {
  Model
}  from 'sequelize';
interface UserAttributes{
phoneId:number; 
Email:string;
password:string;
UserpackId:string;
fromDate:Date;
toDate:Date;
autolocation:string;
}

module.exports = (sequelize:any, DataTypes:any) => {
  class  User extends Model<UserAttributes>
  implements UserAttributes {
    phoneId!:number;
    Email!:string;
    password!:string;
    UserpackId!:string;
    fromDate!:Date;
     toDate!:Date;
    autolocation!:string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    phoneId: {type:DataTypes.INTEGER},
    Email:{type:DataTypes.STRING,},
    password: {type:DataTypes.STRING},
    UserpackId:{type:DataTypes.STRING},
    fromDate:{type:DataTypes.DATE},
    toDate:{type:DataTypes.DATE},
    autolocation: {type:DataTypes.STRING},

 
  }, {
    sequelize,
    modelName: 'Users',
  });
  return  User;
};
