import { AssistantAction } from '@aitube/clapper-services'

/**
 * A simplified action detection routine, for use in two cases:
 * - as a fallback for when the LLM failed to generate a valid JSON
 * - as a quick interception routine for when the user is talking
 * (this allows us to react quickly to user voice for common actions)
 *
 * @param input
 * @returns
 */
export function parseRawInputToAction(input: string = ''): AssistantAction {
  const query = `${input || ''}`
    .toLowerCase()
    .trim()
    .replace(/(?:\.)$/gi, '')

  if (!query) {
    return AssistantAction.NONE
  }

  switch (query) {
    case 'attends':
    case 'arrête':
    case 'arrête. donc':
    case 'arrête. reviens':
    case 'pause':
    case 'stop':
    case 'stops':
    case 'pause the video':
    case 'stop playback':
    case 'stop everything':
    case 'hold on':
    case 'hold here':
    case 'hold there':
    case 'hold right there':
    case 'freeze':
    case 'freeze frame':
      return AssistantAction.PAUSE_VIDEO

    case 'run the video':
    case 'play':
    case 'play back':
    case 'playback':
    case 'start the video':
    case 'play the video':
    case 'plays':
    case 'continue':
    case 'continu':
    case 'joue':
    case 'joues':
    case 'jouer':
    case 'joué':
    case 'jouet':
    case 'lance':
    case 'lancer':
    case 'lancelot': // <-- bug in the recognition
    case 'va en avant':
    case 'vingt-neuf ans': // <-- bug in the recognition
    case "dans l'avant": // <-- bug in the recognition
    case 'dans la vidéo': // <-- bug in the recognition
    case 'dans les vidéos': // <-- bug in the recognition
    case 'bon sla vidéo': // <-- bug in the recognition
    case 'on slave de haut': // <-- another crazyyy bug
    case 'lance la vidéo':
    case 'lance les vidéos':
    case 'lance des vidéos':
    case 'joue la vidéo':
    case 'joue les vidéos':
    case 'joue des vidéos':
      return AssistantAction.PLAY_VIDEO

    case 'retourne au début':
    case 'va au début':
    case 'ça va bien au début': // <- this is a bug in the french detection
    case 'on revient au début': // <- another issue
    case 'il revient au début': // <- another issue
    case 'et revient au début': // <- another issue
    case 'reviens au début':
    case 'revenons au début':
    case 'au début':
    case 'aux débuts':
    case 'reset':
    case 'go back to the start':
      // console.log(`voice order detected: setCursorAt(0 ms)`)
      // console.log(" -> the reset command isn't supported yet")
      return AssistantAction.NONE

    case 'reviens':
    case 'va en arrière':
    case 'reviens en arrière':
    case 'revenons en arrière':
    case 'reviens-nous en arrière': // <- this is a bug in the french detection
    case "aujourd'hui on a rien": // <- this is a bug in the french detection
    case 'ça va bien en arrière': // <- this is a bug in the french detection
    case 'on revient en arrière': // <- another issue
    case 'en arrière':
    case 'aux arrières':
    case 'go back':
    case 'go back one step':
    case 'go back to previous frame':
    case 'back':
    case 'back one step':
    case 'back to previous frame':
      return AssistantAction.GO_BACK

    // TODO: we should handle the separate audio source differently
    case 'silence':
    case 'coupe le son':
    case "coupe l'audio":
    case 'arrête le son':
    case "arrête l'audio":
    case 'mute':
    case 'shut down the sound':
    case 'cut the sound':
    case 'cut the music':
    case 'go back to previous frame':
      return AssistantAction.MUTE_AUDIO

    // TODO: we should handle the separate audio source differently
    case 'unmute':
    case 'joue la musique':
    case 'joue le son':
    case 'rejoue la musique':
    case 'rejoue le son':
    case 'remets le son':
    case "remets l'audio":
    case 'play the music':
    case 'play the sound':
    case 'play the audio':
    case 'play the music again':
    case 'play the sound again':
    case 'play the audio again':
      return AssistantAction.UNMUTE_AUDIO

    case 'undo the last changes':
    case 'undo the last change':
    case 'undo last changes':
    case 'undo last change':
    case 'undo changes':
    case 'undo change':
    case 'undo':
    case 'revert the last changes':
    case 'revert the last change':
    case 'revert last changes':
    case 'revert last change':
    case 'revert changes':
    case 'revert change':
    case 'revert':
    case 'cancel the last changes':
    case 'cancel the last change':
    case 'cancel last changes':
    case 'cancel last change':
    case 'cancel changes':
    case 'cancel change':
    case 'cancel':
    case 'annule':
    case 'annule les changements':
    case 'annule le changement':
      return AssistantAction.UNDO

    case 'redo the last changes':
    case 'redo the last change':
    case 'redo last changes':
    case 'redo last change':
    case 'redo changes':
    case 'redo change':
    case 'redo':
    case 'refait':
    case 'refait les changements':
    case 'refait le changement':
      return AssistantAction.REDO

    default:
      return AssistantAction.NONE
  }
}
