exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.user.id,
      text: req.body.text,
    });

    await post.save();

    res.json({
      message: "Comment added",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};
