import Image from "next/image";
import { Badge } from "../ui/badge";

type BoardPlayerProps = {
  name: string;
  rating: number;
  country: string;
  image: string;
  title?: string;
};

export default function BoardPlayer({
  name,
  rating,
  country,
  image,
  title,
}: BoardPlayerProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="relative h-10 w-10">
          <Image
            src={image}
            alt="Avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-1">
        <p>
          {name}{" "}
          {title && (
            <Badge className="text-xs " variant={"outline"}>
              {title}
            </Badge>
          )}{" "}
        </p>
        <p className="text-sm text-muted-foreground">
          <Badge
            className="font-mono font-medium text-muted-foreground"
            variant={"secondary"}
          >
            {rating}
          </Badge>{" "}
          &bull;{" "}
          <Badge variant={"secondary"} className="text-muted-foreground">
            {country}
          </Badge>
        </p>
      </div>
    </div>
  );
}
