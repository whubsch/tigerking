interface ReviewCountBadgeProps {
  count: number;
  verb: "reviewed" | "edited" | "uploaded";
  color?: "gray" | "danger" | "success" | "warning" | "primary";
  singular?: string;
  plural?: string;
}

const ReviewCountBadge: React.FC<ReviewCountBadgeProps> = ({
  count,
  verb,
  color = "gray",
  singular = "way",
  plural = "ways",
}) => {
  const colorVariants = {
    gray: "bg-gray-100 text-gray-700 text-gray-600",
    danger: "bg-red-100 text-red-700 text-red-600",
    success: "bg-green-100 text-green-700 text-green-600",
    warning: "bg-yellow-100 text-yellow-700 text-yellow-600",
    primary: "bg-blue-100 text-blue-700 text-blue-600",
  };

  return (
    <div
      className={`${colorVariants[color].split(" ")[0]} px-6 py-3 rounded-full`}
    >
      <span
        className={`text-2xl font-bold ${colorVariants[color].split(" ")[1]}`}
      >
        {count}
      </span>
      <span className={`${colorVariants[color].split(" ")[2]} ml-2`}>
        {count !== 1 ? plural : singular} {verb}
      </span>
    </div>
  );
};

export default ReviewCountBadge;
