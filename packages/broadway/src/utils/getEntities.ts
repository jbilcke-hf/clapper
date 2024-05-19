import { deduplicate } from "@/utils/deduplicate"

/**
 * Return uppercase entities
 * 
 * Note:
 * entities might be things like "TED'S CAR" or "JOHN'S VOICE (V.O.)"
 * 
 * @param input 
 * @returns 
 */
export function getEntities(input?: string | string[]): string[] {
  const text = Array.isArray(input) ? input.join(": ") : input
  let result: string[] = [];
  let sentences = `${text || ""}`.split(":").join(".")
                     // .split("'").join(".")
                     .split(",");
  // console.log("sentences:", sentences)
  for (let i = 0; i < sentences.length; i++) {

    // let's make sure we remove all those empty spaces
    let sentence = sentences[i].replaceAll(/\r?\n/gi, " ").replaceAll(/\s+/gi, " ").trim();

    if (sentence === sentence.toUpperCase()) {
      result.push(sentence);
    }
  }

  result = result.filter(x => x)

  /*
  console.log("getEntities: ", {
    input,
    text,
    result,
    sentences,
  })
  */
  const rawEntities = result.map(entity => {

    // first of all, to make pattern patchign easier we add space
    // also we normalize the entity to uppercase
    let tmp = ` ${entity} `.toUpperCase()

    // first we need to eliminate everything which is in parenthesis
    tmp = tmp.split("(").shift() || tmp

    // something seems wrong
    if (tmp.endsWith(" OF ") || tmp.endsWith(" THE ")) {
      return ""
    }

    tmp = tmp
      // common issue: the "MR" is is-typed"
      .replaceAll(" MH. ", " MR. ")
      .replaceAll(" MH ", " MR ")

    /*
      voice over - let keep this enumeration for future use, but not here

      .replaceAll(" (CONT.D) ", "")
      .replaceAll(" (O.S.) ", "")
      .replaceAll(" ( O.S.) ", "")
      .replaceAll(" (O.S. ) ", "")
      .replaceAll(" (OS) ", "")
      .replaceAll(" ( OS) ", "")
      .replaceAll(" (OS ) ", "")
      .replaceAll(" (V.O.) ", "")
      .replaceAll(" ( V.O.) ", "")
      .replaceAll(" (V. O.) ", "")
      .replaceAll(" (V. O. ) ", "")
      .replaceAll(" (V.O. ) ", "")
      .replaceAll(" (VO) ", "")
      .replaceAll(" ( VO) ", "")
      .replaceAll(" (VO ) ", "")
      .replaceAll("'S VOICE ", "")
      .replaceAll(".S VOICE ", "")
      .replaceAll(" VOICE ", "") 
    */

    // do we still need those?
    tmp = tmp
      .replaceAll(" MOVING CLOSE SHOT ", "")
      .replaceAll(" MED. CLOSE SHOT ", "")
      .replaceAll(" MED. SHOT ", "")
      .replaceAll(" MOVING SHOT ", "")
      .replaceAll(" MEDIUM SHOT ", "")
      .replaceAll(" CLOSE SHOT ", "")
      .replaceAll(" FULL SHOT ", "")
      .replaceAll(" LONG SHOT ", "")
      
      .replaceAll(" MOVING CLOSE VIEW ", "")
      .replaceAll(" MED. CLOSE VIEW ", "")
      .replaceAll(" MED. VIEW ", "")
      .replaceAll(" MOVING VIEW ", "")
      .replaceAll(" CLOSE VIEW ", "")
      .replaceAll(" FULL VIEW ", "")

    tmp = tmp.trim()

    if (tmp.endsWith(" -")) {
      tmp = tmp.slice(0, tmp.length - 2)
    }
    if (tmp.endsWith(".S")) {
      tmp = tmp.slice(0, tmp.length - 2)
    }
    if (tmp.endsWith(".")) {
      tmp = tmp.slice(0, tmp.length - 1)
    }
    tmp = tmp.trim()
    return tmp
  }).filter(entity => entity.length > 1)

  
  // finally we need to deduplicate entities
  return deduplicate(rawEntities)
}