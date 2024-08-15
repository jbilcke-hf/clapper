export const sleep = async (durationInMs: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, durationInMs)
  })