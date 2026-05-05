type MessageBannerProps = {
  tone: "error" | "success";
  message: string;
};

export function MessageBanner({ tone, message }: MessageBannerProps) {
  return (
    <div className={`message-banner ${tone === "error" ? "message-error" : "message-success"}`}>
      {message}
    </div>
  );
}

