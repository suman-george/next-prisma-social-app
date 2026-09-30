"use client";
import React from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

const FollowButton = ({ userId }: { userId: string }) => {
  const [isLoading, setisLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setisLoading(true);
      await toggleFollow(userId);
      toast.success("User followed successfully");
    } catch (err) {
      toast.error("Failed to follow user");
    } finally {
      setisLoading(false);
    }
  };
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
};

export default FollowButton;
