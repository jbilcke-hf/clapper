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
        `h-full rounded-md overflow-hidden`,

        // ideally we could only use the ease-out and duration-150
        // to avoid a weird fade to grey,
        // but the ease out also depends on which video is on top of each other,
        // in term of z-index, so we should also intervert this
        `transition-all duration-100 ease-out`,

        // yeah well, I couldn't find a better name 
        // (except maybe aspect-128/135, but is that really more familiar?)
        `object-cover aspect-1024/576`,

        className
      )}
      src={src}
      alt="storyboard"
    />
  )
}