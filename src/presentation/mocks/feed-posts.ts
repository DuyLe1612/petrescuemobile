export interface FeedPost {
  id: string;
  author: string;
  initials: string;
  time: string;
  status: string;
  statusColor: string;
  title: string;
  imageUrl: string;
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

export const FEED_POSTS: FeedPost[] = [
  {
    id: "feed-01",
    author: "Nguyễn Hà Linh",
    initials: "HL",
    time: "30 phút trước",
    status: "Đang xử lý",
    statusColor: "#ff8c38",
    title:
      "Phát hiện chó bị thương nặng ở khu vực Đống Đa, gần ngõ Văn Chương. Bé đang nằm dưới gầm xe, không thể đi lại. Cần hỗ trợ cứu hộ khẩn cấp!",
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    location: "Ngõ Văn Chương, Đống Đa, Hà Nội",
    tags: ["CứuHộKhẩnCấp", "ChóBịThương", "ĐốngĐa"],
    urgent: true,
    comments: 47,
    likes: 3,
    commentLabel: "3 bình luận",
    cta: "Hỗ trợ",
    category: "Cần cứu hộ",
    alertText: "Cần hỗ trợ khẩn cấp! Bài đăng này cần có TNV can thiệp trong thời gian sớm nhất.",
  },
  {
    id: "feed-02",
    author: "Trần Minh Khoa",
    initials: "MK",
    time: "2 giờ trước",
    status: "Đang mở",
    statusColor: "#5fb95c",
    title:
      "Tìm thấy chú mèo cam này ở khu vực Hồ Tây hôm nay. Bé có vẻ được nuôi dưỡng tốt, có thể là mèo đi lạc và đang chờ chủ đến đón.",
    imageUrl:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
    location: "Đường Thanh Niên, Tây Hồ, Hà Nội",
    tags: ["TìmThấy", "MèoĐiLạc", "TâyHồ"],
    urgent: false,
    comments: 19,
    likes: 12,
    commentLabel: "12 bình luận",
    cta: "Liên hệ",
    category: "Đã tìm thấy",
  },
];

export const findFeedPostById = (id: string) => FEED_POSTS.find((post) => post.id === id);
