export interface SubtextPosition {
    startAtRow: number;
    startAtCol: number;
    endAtRow: number;
    endAtCol: number;
    remaining: string;
    startIndex: number;
}

export function findSubtext(needle: string, haystack: string): SubtextPosition | undefined {
    const haystackLines = haystack.split('\n');
    const needleChars = needle.split('');

    let needleIndex = 0;
    let startAtRow = -1;
    let startAtCol = -1;
    let endAtRow = -1;
    let endAtCol = -1;
    let startIndex = -1;

    let totalCharacterCount = 0;

    for (let i = 0; i < haystackLines.length; i++) {
        const line = haystackLines[i];
        for (let j = 0; j < line.length; j++) {
            const hayChar = line[j];
            const needleChar = needleChars[needleIndex];

            if (hayChar === needleChar) {
                if (needleIndex === 0) {
                  startAtRow = i;
                  startAtCol = j;
                  startIndex = totalCharacterCount;
                }

                needleIndex++;
                endAtRow = i;
                endAtCol = j;

                if (needleIndex === needleChars.length) {
                  return { startAtRow, startAtCol, endAtRow, endAtCol, remaining: '', startIndex };
                }
            } else {
                if (hayChar !== ' ' && hayChar !== '\n' && hayChar !== '\t') {
                  needleIndex = 0;
                  startAtRow = -1;
                  startAtCol = -1;
                  startIndex = -1;
                }
            }
            totalCharacterCount++;
        }
        totalCharacterCount++; // account for line return
    }

    if (startAtRow === -1 || startAtCol === -1) {
        throw new Error("Subtext not found in the provided text.");
    }

    const remaining = needle.slice(needleIndex);
    return { startAtRow, startAtCol, endAtRow, endAtCol, remaining, startIndex };
}

/*
// Example usage
const haystack = `            I'm a busy man. When I give jobs, I
          don't have time for a lotta B.S. If
          a guy comes to me and says,
          "Michael, this job has been my
          dream since I was a little kid. My
          whole life has been leading up to
          this job," That, I respond to.
          Nothing is more important than
          enthusiasm, from the Greek word`;

const needle = `If a guy comes to me and says, "Michael, this job has been my dream since I was a little kid"`;

const { startAtRow, startAtCol, endAtRow, endAtCol } = findSubtext(needle, haystack);
console.log({ startAtRow, startAtCol, endAtRow, endAtCol });
// Expected output:
// { startAtRow: 2, startAtCol: 6, endAtRow: 5, endAtCol: 43 }
*/