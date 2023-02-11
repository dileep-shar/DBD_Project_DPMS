import {Router} from "express"
import draggableTasks from "../models/DraggableTasks.js"
import {}

const router=Router()
/**
 * @route   GET project/dragdrop/create
 * @desc    Create a dragdrop of a project
 * @access  Logged in
 */

router.post("/create",async(req,res)=>{
    const project=req.body.data
    try{
        let dragTask=await draggableTasks.findOne({ProjectID:project.projectID})
    if(dragTask)throw Error("Drag Task Exists")
    const newDragTask=new draggableTasks({
        ProjectID:project.projectID,
        Tasks:[],
        Columns:["To Do","In Progress","To Be Reviewed","Completed"]
    })
    const success=await newDragTask.save()
    if(!success)throw Error("Something Went Wrong")
    return res.status(200).json({
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

/**
 * @route   GET project/dragdrop/get
 * @desc    Get the stored dragdrop of a project
 * @access  Logged in
 */

router.post("/get",async (req,res)=>{
    const user=req.body.data
    try{
        let dragTask=await draggableTasks.findOne({ProjectID:user.projectID})
        let profQuery=`Select * from Project where ProjectID=${user.projectID}`
        let studentQuery=`Select * from Works_On where ProjectID=${user.projectID}`

    if(!dragTask)throw Error("Drag Task Doesn't Exists")
    return res.status(200).json({
        dragTask:dragTask,
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

/**
 * @route   GET project/dragdrop/update
 * @desc    Update the stored dragdrop of a project
 * @access  Logged in
 */

router.post("/update",async (req,res)=>{
    const user=req.body.data
    try{
        let dragTask=await draggableTasks.findOne({ProjectID:user.projectID})
    if(!dragTask)throw Error("Drag Task Doesn't Exists")
        dragTask=await draggableTasks.findOneAndReplace({ProjectID:user.projectID},user.dragTask)
        if(!dragTask)throw Error("Replace Failed")
    return res.status(200).json({
        dragTask:dragTask,
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

export default router

