const pad = (value: number) => String(value).padStart(2, "0");

const toDate = (input?: string | null) => {
  if (!input) return null;

  const direct = new Date(input);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const normalized = input.includes(" ") ? input.replace(" ", "T") : input;
  const fallback = new Date(normalized);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
};

export const formatChatClock = (input?: string | null) => {
  const date = toDate(input);
  if (!date) return "--:--";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatChatListTime = (input?: string | null) => {
  const date = toDate(input);
  if (!date) return "";

  const now = new Date();
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (sameDay) {
    return formatChatClock(input);
  }

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};
