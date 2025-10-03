import Image from "next/image";
import { Row } from ".";

const PIECE_ASSET = (
  color: "w" | "b",
  piece: "p" | "n" | "b" | "r" | "q" | "k",
) => `/media/pieces/${color}${piece.toUpperCase()}.svg`;

export default function Ply({ data }: { data?: Row["white"] }) {
  if (!data) return <span />;
  const iconSrc = PIECE_ASSET(data.color, data.piece);
  const isPromotion = Boolean(data.promotion);

  return (
    <span className="inline-flex items-center gap-2">
      {/* piece icon */}
      <span className="relative inline-block w-4 h-4">
        <Image
          src={iconSrc}
          alt={`${data.color}${data.piece}`}
          fill
          className="object-contain"
        />
      </span>

      {/* SAN text */}
      <span>{data.san}</span>

      {/* optional promoted piece icon */}
      {isPromotion && (
        <span className="inline-flex items-center gap-1 text-xs opacity-70">
          <span>=</span>
          <span className="relative inline-block w-3.5 h-3.5">
            <Image
              src={PIECE_ASSET(data.color, data.promotion as any)}
              alt={`promo-${data.promotion}`}
              fill
              className="object-contain"
            />
          </span>
        </span>
      )}
    </span>
  );
}
