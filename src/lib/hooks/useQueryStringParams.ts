import { useSearchParams } from "next/navigation"

export function useQueryStringParams({
  clapUrl: defaultClapUrl = ""
}: {
  clapUrl: string
}) {
  const searchParams = useSearchParams()

  const clapUrl = (searchParams?.get('clap') as string) || defaultClapUrl

  return { clapUrl }
}