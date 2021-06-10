const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const falsyData = require("./../utils/falsyData");
const sendResponse = require("./../utils/sendResponse");

exports.getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return falsyData(next, `Cannot get post with id: ${id}`, 404);
  }

  sendResponse(post, res);
});

exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  const newPost = await Post.create(req.body);
  sendResponse(newPost, res, 201, { message: "Post Created Successfully" });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return falsyData(next, `Cannot find post with id: ${id}`, 401);
  }
  if (String(post.user) !== String(req.user._id)) {
    return falsyData(next, `Not authorized to update that post`, 401);
  }
  req.body.updatedAt = Date.now();
  const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  sendResponse(updatedPost, res, 200, { message: "Post Updated Successfully" });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return falsyData(next, `Can't find post with id: ${id}`, 404);
  }
  if (String(post.user) !== String(req.user._id)) {
    return falsyData(false, next, `Not authorized to delete that post`, 401);
  }
  await post.deleteOne();
  sendResponse(null, res, 204, { message: "Post deleted successfully" });
});

