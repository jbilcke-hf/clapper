import { cn } from "@/lib/utils"

export function StoryboardBuffer({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {

  if (!src) { return null }
  
  return (
    <img    
      className={cn(
        `absolute`,
        `h-full w-full rounded-md overflow-hidden`,

        // iseally we could only use the ease-out and duration-150
        // to avoid a weird fade to grey,
        // but the ease out also depends on which video is on top of each other,
        // in term of z-index, so we should also intervert this
        `transition-all duration-100 ease-out`,
        className
      )}
      src={src}
    />
  )
}