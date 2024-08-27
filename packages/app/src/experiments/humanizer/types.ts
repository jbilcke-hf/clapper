export enum Action {
  TALKING = 'TALKING',
  VERTICAL_SHAKE = 'VERTICAL_SHAKE',
  HORIZONTAL_SHAKE = 'HORIZONTAL_SHAKE',
  IDLING = 'IDLING',
}

/**
 * A list of facial expression "packages"
 *
 * The goal is to be able to represent complex expressions
 * (it's not just neutral, happy, sad, angry)
 */
export enum Emotion {
  // an eyes-closed, happy state with the head moving left and right
  // examples:
  // - the character is entranced by music
  BLISS = 'BLISS',

  // the character is feeling pleasure
  // examples:
  // - a massage
  // - sex
  PLEASURED = 'PLEASURED',

  // the character is aching to get something pleasureable
  // examples:
  // - wanting to eat something delicious
  // - craving for sex
  CRAVING = 'CRAVING',

  // examples:
  // - a mother talking to a child
  // - someone announcing good news
  CHEERFUL = 'CHEERFUL', // eg. mom talking

  // an angry state with hostile and agressive facial expressions
  HOSTILE = 'HOSTILE',

  // an unhappy state when the character is displeased and sigh a lot
  // - you have been waiting in a queue for 2 hours
  // - this is the 3th time you have to come back to a clerk and there are still paperwork issues
  FRUSTRATED = 'FRUSTRATED',

  // - Draco Malfoy when talking to Harry Potter
  // - listening to arguments from someone you don't like
  SARCASTIC = 'SARCASTIC',

  // examples:
  // - manager delivery layoff news
  // - journalist during neutral, serious news (eg. demonstration etc)
  SERIOUS = 'SERIOUS',

  // a laughing face
  LAUGHING = 'LAUGHING',

  // a slighly amused face
  // examples:
  // - listening to a joke and expecting a drop
  AMUSED = 'AMUSED',

  // a slighly smiling face
  // examples:
  // - journalist during neutral good news (eg. sunny day)
  RELAXED = 'RELAXED',

  // head pushed down,
  // examples:
  // - learning about death or a terminal disease
  DISBELIEF = 'DISBELIEF',

  // the character is thinking but can also be talking
  // examples:
  // - replying to an interview question
  // - trying to remember while telling a story
  // - replying when asked to pick a meal from a menu
  PENSIVE = 'PENSIVE',

  //listening or looking at something or someone in disbelief
  // examples:
  // - aliens created the panama canal
  DOUBTFUL = 'DOUBTFUL',

  // great surprise, like you are wondering if this is a joke
  // examples:
  // - accidentally coming across a friend in an unexpected place
  ASTONISHMENT = 'ASTONISHMENT',

  // total freeze and amazement at an unexpected event
  // examples:
  // - watching a landslide, volcano exploding spontaneously
  // - witnessing an impressive car accident
  AMAZEMENT = 'AMAZEMENT',

  // agreeing, pinching the mouth
  // - journalist interviewing a victim
  EMPATHETIC = 'EMPATHETIC',

  // when the character is feeling tense about something
  // but there is no immediate danger
  // - the character is fearing a bad news
  // - the character is feeling abandoned
  ANXIOUS = 'ANXIOUS',

  // the character is fearing a potentially dangerous thing
  // examples:
  // - the character has arachnophobia and sees a spider on the wall
  FEARFUL = 'FEARFUL',

  // an extreme state of fear about an imminent threat
  // examples:
  // - the character has arachnophobia and a tarantura is near their face
  // - the character is in a plane which is going to crash
  TERROR = 'TERROR',

  // when the feelings of the character have been hurt
  // example:
  // - everyone receive something but you
  // - a kid being told they couldn't do something
  SULKING = 'SULKING',

  // crying of grief, sorrow, distress
  // - crying over a dead relative
  // - a child is crying
  SORROW = 'SORROW',

  // the character is crying not of sadness but of pain
  // examples:
  // - moaning, crying, screaming in pain after a broken bone
  EXCRUCIATING = 'EXCRUCIATING',

  //
  // telling a secret to someone
  // examples:
  // - a child, a colleague, a secret agent whispering something
  DISCREET = 'DISCREET',

  // a specific expressionless mode
  // examples:
  // - a zombie or catatonic person
  EXPRESSIONLESS = 'EXPRESSIONLESS',
}

export enum Intensity {
  // a very exagerated expression

  // best for sarcastic or comical effect, or animation (3D pixar style, anime)
  EXAGERATED = 'EXAGERATED',

  // ---------- EXTREME STATE (1-5% of situations) -----------------
  //
  // an very intense expression, with large head movement
  // this should be rare, and tied to specific plot events
  // (positive or negative events)
  //
  INTENSE = 'INTENSE',

  // ---------- NORMAL STATES (90% of situations) ------------------
  //
  // a accentuated state
  //
  // this is how far most character will go in most scenes
  // it is usued by a character in the natural state to accentuate a specific
  // line of importance
  //
  ACCENTUATED = 'ACCENTUATED',

  // the "normal", natural state in which most people speak
  // eg when
  // the user naturally speak and use expressions, without trying to hide anything
  NATURAL = 'NATURAL',

  // --------- SOFT STATES (1-5% of situations) -------------------

  //
  // the character is signaling in a subtle way, usually used when
  // the character cannot speak,
  // sitting idle while someone else is talking
  SUBTLE = 'SUBTLE',

  // for situations where the character is trying to keep their composure
  // and be as expressionless as possible
  // this should be rare, and tied to specific plot events
  RESTRAINED = 'RESTRAINED',
}
