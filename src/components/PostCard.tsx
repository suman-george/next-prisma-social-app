"use client";
import getPosts, { toggleLike } from "@/actions/post.actions";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostCard = ({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) => {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId),
  );
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setOptmisticLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      setHasLiked((prev) => !prev);
      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes((prev) => (hasLiked ? prev + 1 : prev - 1));
      setHasLiked((prev) => !prev);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {};

  const handleDeletePost = async () => {};

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>•</span>
                    <span>
                      {/* {formatDistanceToNow(new Date(post.createdAt))} ago */}
                    </span>
                  </div>
                </div>
                {/* Check if current user is the post author */}
                {/* {dbUserId === post.author.id && (
                  <DeleteAlertDialo
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )} */}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>

          {/* POST IMAGE */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt="Post content"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
