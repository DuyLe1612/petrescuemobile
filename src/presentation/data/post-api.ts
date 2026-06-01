import {
  getById1,
  getCommentsByPost,
  getFeed,
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
  create2 as apiCreatePost,
  createComment as apiCreateComment,
} from "@/src/infrastructure/api/generated/pet-rescue-api";
import type {
  CommentSummaryDto,
  PostResponseDto,
  PostSummaryResponseDto,
  CreatePostRequestDto,
  CreateCommentRequestDto,
} from "@/src/infrastructure/api/generated/model";

export interface FeedPostViewModel {
  id: string;
  author: string;
  initials: string;
  time: string;
  status: string;
  statusColor: string;
  title: string;
  imageUrl?: string;
  location: string;
  tags: string[];
  urgent: boolean;
  comments: number;
  likes: number;
  commentLabel: string;
  cta: string;
  category: string;
  alertText?: string;
}

export interface PostDetailViewModel extends FeedPostViewModel {
  commentsList: CommentSummaryDto[];
}

const formatRelativeTime = (value?: string) => {
  if (!value) return "Vừa xong";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

const buildInitials = (name?: string) =>
  (name ?? "PR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PR";

const inferUrgent = (tags: string[], content?: string) => {
  const text = `${tags.join(" ")} ${content ?? ""}`.toLowerCase();
  return ["khẩn", "urgent", "rescue", "cấp cứu"].some((keyword) => text.includes(keyword));
};

const inferCategory = (tags: string[]) => {
  if (tags.some((tag) => tag.toLowerCase().includes("rescue"))) return "Cứu hộ";
  if (tags.some((tag) => tag.toLowerCase().includes("found"))) return "Đã tìm thấy";
  return "Cộng đồng";
};

const mapSummary = (post: PostSummaryResponseDto): FeedPostViewModel => {
  const tags = post.tags ?? [];
  const urgent = inferUrgent(tags, post.content);
  return {
    id: post.postId ?? `${post.authorId}-${post.createdAt}`,
    author: post.authorUsername ?? "Người dùng Pet Rescue",
    initials: buildInitials(post.authorUsername),
    time: formatRelativeTime(post.createdAt),
    status: urgent ? "Ưu tiên" : "Đang mở",
    statusColor: urgent ? "#ff8c38" : "#5fb95c",
    title: post.content ?? "Bài viết cộng đồng",
    imageUrl: post.imageUrls?.[0],
    location: "Đang cập nhật vị trí",
    tags,
    urgent,
    comments: post.commentCount ?? 0,
    likes: post.likeCount ?? 0,
    commentLabel: `${post.commentCount ?? 0} bình luận`,
    cta: urgent ? "Hỗ trợ" : "Xem thêm",
    category: inferCategory(tags),
    alertText: urgent ? "Bài viết này có dấu hiệu cần ưu tiên xử lý sớm." : undefined,
  };
};

const mapDetail = (post: PostResponseDto, comments: CommentSummaryDto[]): PostDetailViewModel => {
  const tags = post.tags ?? [];
  const urgent = inferUrgent(tags, post.content);
  return {
    id: post.postId ?? `${post.authorId}-${post.createdAt}`,
    author: post.authorUsername ?? "Người dùng Pet Rescue",
    initials: buildInitials(post.authorUsername),
    time: formatRelativeTime(post.createdAt),
    status: urgent ? "Ưu tiên" : "Đang mở",
    statusColor: urgent ? "#ff8c38" : "#5fb95c",
    title: post.content ?? "Bài viết cộng đồng",
    imageUrl: post.imageUrls?.[0],
    location: "Đang cập nhật vị trí",
    tags,
    urgent,
    comments: comments.length,
    likes: 0,
    commentLabel: `${comments.length} bình luận`,
    cta: urgent ? "Hỗ trợ" : "Trao đổi",
    category: inferCategory(tags),
    alertText: urgent ? "Bài viết này có dấu hiệu cần ưu tiên xử lý sớm." : undefined,
    commentsList: comments,
  };
};

export const fetchFeedPosts = async ({
  cursor,
  size = 10,
}: {
  cursor?: string;
  size?: number;
}) => {
  const response = await getFeed({ cursor, pageSize: size });
  const data = response.data;
  return {
    items: (data?.items ?? []).map(mapSummary),
    nextCursor: data?.nextCursor,
    hasMore: Boolean(data?.hasMore),
  };
};

export const fetchPostDetail = async (id: string) => {
  const [postResponse, commentsResponse] = await Promise.all([
    getById1(id),
    getCommentsByPost(id, { page: 0, pageSize: 20 }).catch(() => null),
  ]);

  if (!postResponse.data) return null;

  return mapDetail(postResponse.data, commentsResponse?.data?.items ?? []);
};

export const likePost = async (postId: string) => {
  const response = await apiLikePost(postId);
  return response.data;
};

export const unlikePost = async (postId: string) => {
  const response = await apiUnlikePost(postId);
  return response.data;
};

export const createPost = async (payload: CreatePostRequestDto) => {
  const response = await apiCreatePost(payload);
  return response.data;
};

export const createComment = async (postId: string, payload: CreateCommentRequestDto) => {
  const response = await apiCreateComment(postId, payload);
  return response.data;
};
