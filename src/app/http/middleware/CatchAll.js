
const { ForbiddenAccess } = require('../../exceptions/ForbiddenAccess');

module.exports =  (req,res,next)=>{
    throw new ForbiddenAccess();
}