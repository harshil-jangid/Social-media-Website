const Post=require('../../../models/post');
const Comment=require('../../../models/comments')

module.exports.index=async function(req,res){

    let posts= await Post.find({})
                    .populate('user')
                    .sort('-createdAt')
                    .populate({
                        path:'comments',
                        populate:{
                            path:'user'
                        }
                    });

    return res.json({
        message:"List of posts v1",
        posts:posts
    })
}

module.exports.destroy= async function(req,res){
    try {
        let post= await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id})
            
            return res.json(200,{
                message:'Post and associated comments deleted successfully'
            });
        }else{
            return res.json(401,{
                message:'you cannot delete this post'
            })
        }
    } catch (error) {
        return res.json(500,{
            message:"Internal server error"
        })
    }
    
}

