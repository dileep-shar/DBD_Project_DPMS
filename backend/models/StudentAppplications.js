import mongoose from "mongoose"

const studentApplicationSchema=new mongoose.Schema({
    email:{
        type:String
    },
    appliedApplications:[{
        projectName:{
            type:String
        },
        projectID:{
            type:String
        },
        professorEmail:{
            type:String
        },
        status:{
            type:String
        }
    }]

});
const application=mongoose.model("Student Application",studentApplicationSchema);
export default application;