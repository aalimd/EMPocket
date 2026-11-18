/* Original fictional teaching cases and educational preparation modules. */
window.EM_LEARNING_DATA = {
  "sources": {
    "als": [
      "AHA adult advanced life support (2025)",
      "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support"
    ],
    "opioid": [
      "AHA special circumstances: opioid poisoning (2025)",
      "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation"
    ],
    "trauma": [
      "NICE NG39: major trauma",
      "https://www.nice.org.uk/guidance/ng39/chapter/Recommendations"
    ],
    "pediatric": [
      "NICE NG9: bronchiolitis",
      "https://www.nice.org.uk/guidance/ng9/chapter/Recommendations"
    ],
    "pregnancy": [
      "NICE NG126: early pregnancy assessment",
      "https://www.nice.org.uk/guidance/NG126/chapter/symptoms-and-signs-of-ectopic-pregnancy-and-initial-assessment"
    ],
    "mental": [
      "NICE NG225: self-harm assessment and care",
      "https://www.nice.org.uk/guidance/ng225/chapter/Recommendations"
    ],
    "lung": [
      "ACEP Sonoguide: lung ultrasound",
      "https://www.acep.org/sonoguide/basic/lung"
    ],
    "sedation": [
      "ACEP: procedural sedation and analgesia policy",
      "https://www.acep.org/siteassets/new-pdfs/clinical-policies/clinical-policy-procedural-sedation-and-analgesia-in-the-emergency-department.pdf"
    ],
    "sbar": [
      "AHRQ TeamSTEPPS: SBAR",
      "https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html"
    ],
    "debrief": [
      "AHRQ TeamSTEPPS: debrief",
      "https://www.ahrq.gov/teamstepps-program/curriculum/team/tools/debrief.html"
    ],
    "abg": [
      "French expert panel: metabolic acidosis (2019)",
      "https://annalsofintensivecare.springeropen.com/articles/10.1186/s13613-019-0563-2"
    ],
    "chest-image": [
      "Radiology Assistant: chest X-ray interpretation",
      "https://radiologyassistant.nl/chest/chest-x-ray/basic-interpretation"
    ],
    "sepsis": [
      "Surviving Sepsis Campaign adult guidelines (2026)",
      "https://survivingsepsis.org/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines"
    ],
    "uroInfectEAU": [
      "EAU urological infections guideline (2026)",
      "https://uroweb.org/guidelines/urological-infections/chapter/the-guideline"
    ],
    "gold": [
      "GOLD report, management of exacerbations (2027)",
      "https://goldcopd.org/2027-gold-report-and-pocket-guide/"
    ],
    "niv": [
      "ERS/ATS acute NIV guideline",
      "https://doi.org/10.1183/13993003.02426-2016"
    ],
    "dka": [
      "Multisociety consensus on adult DKA and HHS (2024)",
      "https://doi.org/10.2337/dci24-0032"
    ],
    "acs": [
      "ESC acute coronary syndromes guideline (2023)",
      "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/"
    ]
  },
  "cases": [
    {
      "id": "resus",
      "title": "A fast rhythm, then a change",
      "domain": "Resuscitation",
      "topic": "palpitations",
      "source": "als",
      "stem": "A 64-year-old has a regular broad-complex tachycardia at 190/min, BP 72/40, confusion and a palpable pulse. The team is at the bedside.",
      "steps": [
        {
          "id": "unstable-pulse",
          "update": "Initial assessment",
          "prompt": "Which immediate plan best matches these findings?",
          "options": [
            {
              "id": "a",
              "text": "Prepare urgent synchronized cardioversion with the resuscitation team.",
              "why": "Poor perfusion with this regular tachycardia and a pulse calls for urgent synchronized treatment.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait for a formal cardiology report.",
              "why": "The patient is unstable; waiting delays time-critical care.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use the pulse rate alone to decide on discharge.",
              "why": "Rate does not establish stability; hypotension and confusion are major concerns.",
              "correct": false
            }
          ]
        },
        {
          "id": "vf-arrest",
          "update": "The team prepares cardioversion. Before it is delivered, the patient becomes unresponsive; no definite pulse is found promptly, and the monitor shows ventricular fibrillation.",
          "prompt": "How must the plan change?",
          "options": [
            {
              "id": "a",
              "text": "Start the shockable cardiac-arrest pathway: CPR and unsynchronized defibrillation.",
              "why": "The patient now has a different clinical state. VF arrest requires defibrillation and CPR.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Continue trying to synchronize to the fibrillatory rhythm.",
              "why": "Synchronization is inappropriate for ventricular fibrillation.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Obtain a 12-lead ECG before starting CPR.",
              "why": "Diagnostic recording must not postpone resuscitation.",
              "correct": false
            }
          ]
        },
        {
          "id": "post-arrest",
          "update": "Following resuscitation, a pulse returns. BP remains low and the patient is not following commands.",
          "prompt": "What is the appropriate next destination?",
          "options": [
            {
              "id": "a",
              "text": "Monitored post-arrest care with stabilization and investigation of the cause.",
              "why": "Return of a pulse does not end the need for critical care.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Discharge after the monitor shows sinus rhythm.",
              "why": "A normal rhythm does not establish recovery.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Remove monitoring to avoid alarms.",
              "why": "Ongoing instability requires monitoring and reassessment.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "What observation changed the treatment pathway?",
        "Explain the difference between treating a rhythm with a pulse and treating cardiac arrest.",
        "Hand over the arrest rhythm, interventions, response and remaining instability."
      ]
    },
    {
      "id": "trauma",
      "title": "Deterioration after chest trauma",
      "domain": "Trauma",
      "topic": "multiple-trauma",
      "source": "trauma",
      "stem": "A 31-year-old arrives after blunt chest trauma. During initial assessment, BP falls to 78/46, respiratory distress worsens and breath sounds are markedly reduced on the left.",
      "steps": [
        {
          "id": "initial-survey",
          "update": "Initial assessment",
          "prompt": "What should the team prioritize?",
          "options": [
            {
              "id": "a",
              "text": "Assess for tension pneumothorax and treat immediate thoracic life threats.",
              "why": "Hypotension, respiratory distress and unilateral reduced breath sounds after chest trauma require immediate assessment for tension pneumothorax.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Finish a routine history before reassessment.",
              "why": "The new deterioration changes the priority.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Assume anxiety explains the respiratory distress.",
              "why": "Shock and asymmetric examination need an urgent physical explanation.",
              "correct": false
            }
          ]
        },
        {
          "id": "bleeding-control",
          "update": "The treating team finds a compelling clinical picture of tension pneumothorax with severe compromise. CT is available on another floor.",
          "prompt": "What principle applies?",
          "options": [
            {
              "id": "a",
              "text": "Perform immediate chest decompression (needle or finger thoracostomy) without waiting for CT.",
              "why": "Severe compromise with suspected tension physiology requires pleural decompression before imaging.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Transfer to CT before treatment in every case.",
              "why": "Transfer would delay care in this unstable patient.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Wait for tracheal deviation to appear.",
              "why": "An absent late sign does not make the patient stable.",
              "correct": false
            }
          ]
        },
        {
          "id": "trauma-handover",
          "update": "After decompression, breathing improves but hypotension persists.",
          "prompt": "What is the next reasoning step?",
          "options": [
            {
              "id": "a",
              "text": "Repeat the primary survey and look for additional causes of shock.",
              "why": "An initial improvement does not explain persistent shock or exclude other injuries.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Stop investigating because one problem was treated.",
              "why": "Trauma can cause more than one life-threatening injury.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use the improved breath sounds alone to discharge.",
              "why": "Persistent hypotension is incompatible with that conclusion.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "Which findings supported treatment before imaging?",
        "What other injuries could explain persistent shock?",
        "Assign roles for reassessment, communication and definitive trauma care."
      ]
    },
    {
      "id": "infant",
      "title": "An infant who becomes quieter",
      "domain": "Pediatric",
      "topic": "pediatric-respiratory-distress",
      "source": "pediatric",
      "stem": "A 7-week-old with coryza has worsening work of breathing and is taking less than half the usual feeds. A parent reports a pause in breathing at home.",
      "steps": [
        {
          "id": "initial-severity",
          "update": "Initial assessment",
          "prompt": "Which feature most strongly supports urgent escalation?",
          "options": [
            {
              "id": "a",
              "text": "The reported apnea, alongside the current respiratory difficulty.",
              "why": "A breathing pause in this infant warrants urgent assessment.",
              "correct": true
            },
            {
              "id": "b",
              "text": "The presence of coryza alone.",
              "why": "Coryza is common and does not capture the immediate concern.",
              "correct": false
            },
            {
              "id": "c",
              "text": "The family having no thermometer.",
              "why": "Equipment at home does not determine the severity of illness.",
              "correct": false
            }
          ]
        },
        {
          "id": "oxygen-and-feeding",
          "update": "While monitored, the infant develops a further apneic episode and becomes less responsive.",
          "prompt": "What should happen now?",
          "options": [
            {
              "id": "a",
              "text": "Call pediatric resuscitation support and support airway and breathing.",
              "why": "Apnea with reduced responsiveness requires immediate support.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait to see whether the next feed is easier.",
              "why": "Feeding is not the priority during apnea.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Assume reduced noise means improvement.",
              "why": "Becoming quieter can reflect exhaustion or deterioration.",
              "correct": false
            }
          ]
        },
        {
          "id": "infant-disposition",
          "update": "The infant improves with the team’s support but remains unable to feed adequately.",
          "prompt": "Which disposition best fits the course?",
          "options": [
            {
              "id": "a",
              "text": "Hospital care with ongoing respiratory and hydration assessment.",
              "why": "Apnea and inadequate feeding require continued assessment and support.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Discharge solely because one saturation reading improved.",
              "why": "A single number does not account for the apnea and feeding problem.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Offer a routine appointment several weeks later.",
              "why": "The immediate problems have not resolved.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "How can a child appear quieter while becoming sicker?",
        "What would you include in the parent’s explanation?",
        "Discuss how age and comorbidity affect local thresholds."
      ]
    },
    {
      "id": "pregnancy",
      "title": "Pain and collapse in early pregnancy",
      "domain": "Obstetric",
      "topic": "pregnancy-emergency",
      "source": "pregnancy",
      "stem": "A 28-year-old with a positive pregnancy test has lower abdominal pain, vaginal spotting and a fainting episode. BP is 84/48 and pulse is 124/min.",
      "steps": [
        {
          "id": "initial-assessment",
          "update": "Initial assessment",
          "prompt": "What is the safest initial approach?",
          "options": [
            {
              "id": "a",
              "text": "Resuscitate and obtain urgent obstetric/gynecologic assessment for possible internal bleeding.",
              "why": "Instability in early pregnancy needs emergency assessment; ectopic pregnancy is a concern.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Book routine outpatient follow-up as the only plan.",
              "why": "That does not address current shock.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Assume light external bleeding excludes major hemorrhage.",
              "why": "External bleeding does not quantify internal blood loss.",
              "correct": false
            }
          ]
        },
        {
          "id": "deterioration",
          "update": "The team starts resuscitation. No intrauterine pregnancy has yet been confirmed; a laboratory result is pending.",
          "prompt": "What should not be delayed?",
          "options": [
            {
              "id": "a",
              "text": "Urgent specialist assessment and management of the unstable patient.",
              "why": "Pending tests must not defer the response to hemodynamic instability.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait for a single hormone result before seeking help.",
              "why": "One laboratory value cannot make this clinical state safe.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Require the patient to walk to another clinic.",
              "why": "An unstable patient needs supported care and appropriate transfer.",
              "correct": false
            }
          ]
        },
        {
          "id": "obstetric-handover",
          "update": "BP improves transiently, but pain and tachycardia continue.",
          "prompt": "How should that response affect disposition?",
          "options": [
            {
              "id": "a",
              "text": "Continue emergency assessment and definitive planning with the specialist team.",
              "why": "A temporary response does not establish resolution of the cause.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Discharge because the last BP was better.",
              "why": "A transient improvement is not sufficient.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Stop observations to reduce anxiety.",
              "why": "The unresolved presentation needs continued reassessment.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "Why can visible bleeding underestimate the problem?",
        "What information belongs in the urgent referral?",
        "How would you explain uncertainty while resuscitation continues?"
      ]
    },
    {
      "id": "opioid",
      "title": "Awake, then drowsy again",
      "domain": "Toxicology",
      "topic": "overdose",
      "source": "opioid",
      "stem": "A 40-year-old is found drowsy with very slow breathing and a palpable pulse. Opioid exposure is suspected; the amount and timing are unknown.",
      "steps": [
        {
          "id": "support-ventilation",
          "update": "Initial assessment",
          "prompt": "Which priority best addresses the immediate threat?",
          "options": [
            {
              "id": "a",
              "text": "Support airway and ventilation (bag-mask if needed) and give titrated naloxone per local protocol.",
              "why": "Respiratory depression is the immediate life threat; ventilatory support accompanies titrated opioid reversal.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait for a toxicology screen before helping ventilation.",
              "why": "Testing must not delay breathing support.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Focus only on making the person fully alert.",
              "why": "Adequate ventilation is the critical physiological goal.",
              "correct": false
            }
          ]
        },
        {
          "id": "recurrent-depression",
          "update": "After treatment, breathing improves. Later the respiratory rate falls again and the patient becomes difficult to wake.",
          "prompt": "What does this change require?",
          "options": [
            {
              "id": "a",
              "text": "Reassess and support ventilation; obtain further treatment and toxicology advice.",
              "why": "Recurrent respiratory depression can outlast an initial antagonist response.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Assume the first response guarantees recovery.",
              "why": "The new respiratory findings contradict that assumption.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Leave the patient unmonitored because the cause is known.",
              "why": "Knowing a likely cause does not remove the need for monitoring.",
              "correct": false
            }
          ]
        },
        {
          "id": "observation",
          "update": "Repeated support has been required; the substance may be long acting.",
          "prompt": "What is the appropriate disposition principle?",
          "options": [
            {
              "id": "a",
              "text": "Continue monitored care and tailor observation/treatment with expert advice.",
              "why": "Recurrence and uncertain exposure make a fixed brief observation rule unsuitable.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Use a universal short discharge time for every opioid.",
              "why": "Duration and recurrence vary with the exposure and clinical course.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Base discharge only on pupil size.",
              "why": "Pupil size is not an adequate assessment of recovery.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "What endpoint matters more than wakefulness alone?",
        "How do recurrent symptoms change your plan?",
        "Include harm-reduction and follow-up needs after acute stabilization."
      ]
    },
    {
      "id": "self-harm",
      "title": "A reassuring score is not the whole story",
      "domain": "Behavioral emergency",
      "topic": "suicidal",
      "source": "mental",
      "stem": "A 22-year-old presents after self-harm. Physical care is underway. The person is distressed and says they do not feel safe returning home.",
      "steps": [
        {
          "id": "immediate-safety",
          "update": "Initial assessment",
          "prompt": "What should the team arrange alongside physical care?",
          "options": [
            {
              "id": "a",
              "text": "A compassionate assessment of immediate safety and psychosocial needs.",
              "why": "The person’s concerns and needs require direct assessment.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Dismiss the concern because observations are normal.",
              "why": "Normal physical observations do not resolve psychological safety.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Delay all conversation until physical care has ended.",
              "why": "Support and assessment can occur alongside physical treatment.",
              "correct": false
            }
          ]
        },
        {
          "id": "psychosocial-assessment",
          "update": "A checklist score is described as low, but the person still reports feeling unsafe and has little support.",
          "prompt": "How should the score be used?",
          "options": [
            {
              "id": "a",
              "text": "It must not determine discharge; assess the individual situation and safety needs.",
              "why": "Risk categories cannot substitute for a psychosocial assessment.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Use the low score as an automatic discharge rule.",
              "why": "This ignores the person’s reported concerns and circumstances.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use the score to guarantee there will be no further self-harm.",
              "why": "Such tools cannot provide that guarantee.",
              "correct": false
            }
          ]
        },
        {
          "id": "confirm-safety-plan",
          "update": "The team is developing a care plan with the person.",
          "prompt": "What is an important part of planning any transition?",
          "options": [
            {
              "id": "a",
              "text": "Agree support, follow-up and a collaborative safety plan with the appropriate team.",
              "why": "A transition needs a practical plan addressing identified needs.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Give generic reassurance without checking the plan is workable.",
              "why": "A plan must fit the person’s circumstances.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Assume agreement means every concern has disappeared.",
              "why": "Agreement does not replace checking understanding and remaining concerns.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "What might a numeric score conceal?",
        "How can you explore immediate safety without judgment?",
        "Discuss capacity, safeguarding and local legal requirements with the supervising team."
      ]
    },
    {
      "id": "adult-septic-shock",
      "checked": "2026-11-18",
      "relatedTopics": ["shock", "fever"],
      "title": "Shock with an obstructed kidney",
      "domain": "Sepsis",
      "topic": "sepsis-and-septic-shock",
      "source": "sepsis",
      "stem": "An adult with fever and right flank pain becomes confused. BP is 78/42, pulse 128/min, respiratory rate 30/min and capillary refill 5 seconds. There is no evident hemorrhage.",
      "steps": [
        {
          "id": "recognition",
          "level": 1,
          "update": "At triage the patient can answer only simple questions and appears poorly perfused.",
          "prompt": "What should the team do first?",
          "review": "A febrile patient with a suspected urinary source has MAP 54 and new confusion. What actions should run in parallel now?",
          "options": [
            {
              "id": "a",
              "text": "Activate resuscitation. Obtain access and start assessment, IV fluids and empiric antibiotics promptly.",
              "why": "Suspected infection and hypoperfusion warrant immediate treatment. Obtain cultures promptly if this does not meaningfully delay antibiotics.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait for lactate and imaging to confirm shock before activating resuscitation.",
              "why": "Cross-sectional imaging and laboratory results are valuable, but persistent hypotension and impaired perfusion already demand action.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Give oral antibiotics while repeating observations in the waiting area.",
              "why": "This degree of circulatory compromise and altered mentation requires monitored IV resuscitation.",
              "correct": false
            }
          ]
        },
        {
          "id": "vasopressor",
          "level": 2,
          "update": "Despite initial balanced crystalloid, MAP is 53 mmHg and capillary refill remains prolonged. Ultrasound suggests fluid tolerance is limited.",
          "prompt": "Which hemodynamic response is most appropriate?",
          "review": "After early fluids, another adult with suspected septic shock has MAP 55 and new signs of fluid intolerance. What should change now?",
          "options": [
            {
              "id": "a",
              "text": "Start norepinephrine promptly and reassess perfusion and responsiveness to fluid.",
              "why": "Norepinephrine is first line. In unstable shock it can begin before a central line under an appropriate peripheral protocol.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Give further fixed-volume boluses before considering a vasopressor.",
              "why": "Persistent shock and limited fluid tolerance warrant early pressor support and individualized fluid decisions.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use dobutamine alone to restore the arterial pressure.",
              "why": "Inotropy may be useful with cardiac dysfunction and persistent hypoperfusion after adequate pressure, but norepinephrine is the first-line pressor here.",
              "correct": false
            }
          ]
        },
        {
          "id": "source-control",
          "source": "uroInfectEAU",
          "level": 3,
          "update": "MAP improves on norepinephrine. Imaging shows an obstructing ureteral stone and hydronephrosis on the symptomatic side.",
          "prompt": "What is the next time-critical decision?",
          "review": "A patient receiving antibiotics and pressors has fever and an infected obstructed collecting system. What definitive intervention must be coordinated?",
          "options": [
            {
              "id": "a",
              "text": "Escalate to urology for urgent drainage and coordinate critical-care support.",
              "why": "An infected obstructed collecting system requires urgent source control alongside resuscitation and antibiotics.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Wait for the culture and susceptibility results before discussing drainage.",
              "why": "Cultures guide antibiotic selection, but they do not relieve the infected obstruction.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Plan stone removal after a trial of outpatient medical expulsive therapy.",
              "why": "Medical expulsive therapy does not provide timely source control for obstructive sepsis.",
              "correct": false
            }
          ]
        },
        {
          "id": "handover",
          "level": 4,
          "update": "Urology can drain the kidney, but the patient remains on a titratable vasopressor. Transfer from the ED is being arranged.",
          "prompt": "What should the team leader confirm before transfer?",
          "review": "A patient with abdominal sepsis needs source control and has rising vasopressor requirements. What must the receiving team know before movement?",
          "options": [
            {
              "id": "a",
              "text": "Confirm the receiving teams, monitored transport, current pressor and perfusion trends, antimicrobial timing and the source-control plan.",
              "why": "A shared plan with named responsibilities supports safe transfer while resuscitation and urgent drainage proceed.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Transfer once a bed is identified and send the detailed clinical history later.",
              "why": "Bed assignment alone does not guarantee pressor monitoring, clinical ownership or access to urgent drainage.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Pause the vasopressor to simplify movement if a recent pressure exceeded the initial target.",
              "why": "A recovered pressure on support does not establish hemodynamic stability without it.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "Name one sign of persistent tissue hypoperfusion despite a better blood pressure.",
        "Discuss how you would reassess further fluids in a patient at risk of overload.",
        "Rehearse the transfer handover and identify who owns each pending action."
      ]
    },
    {
      "id": "niv-failure",
      "checked": "2026-11-18",
      "relatedTopics": ["dyspnea"],
      "title": "When noninvasive ventilation fails",
      "domain": "Respiratory",
      "topic": "copd-exacerbation",
      "source": "niv",
      "stem": "A 69-year-old with COPD presents with marked dyspnea, respiratory rate 34/min and SpO₂ 83% on room air. The patient is alert, cooperative and able to clear secretions. BP is 132/76.",
      "steps": [
        {
          "id": "oxygen",
          "source": "gold",
          "level": 1,
          "update": "There are bilateral wheezes and increased work of breathing. Blood gas results are pending.",
          "prompt": "What is the best initial respiratory support plan?",
          "review": "An alert patient with known COPD is hypoxemic and likely hypercapnic. What oxygen strategy and initial reassessment would you use?",
          "options": [
            {
              "id": "a",
              "text": "Start controlled oxygen targeting SpO₂ 88–92%, obtain a blood gas and initiate exacerbation treatment.",
              "why": "Treat hypoxemia immediately while titrating oxygen. Use gas results and examination to assess ventilation.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Give high-flow oxygen to keep SpO₂ near 100% throughout assessment.",
              "why": "Once oxygenation can be measured, controlled oxygen is preferred in an exacerbation at risk of hypercapnic respiratory failure.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Wait for the blood gas before giving supplemental oxygen.",
              "why": "A blood gas informs ventilation but should not delay correction of significant hypoxemia.",
              "correct": false
            }
          ]
        },
        {
          "id": "trial",
          "level": 2,
          "update": "After initial bronchodilators and controlled oxygen, arterial pH is 7.27 and PaCO₂ is 68 mmHg. Breathing remains labored; the patient is cooperative.",
          "prompt": "Which ventilatory strategy is most appropriate now?",
          "review": "An alert patient with COPD remains tachypneic after initial treatment, with pH 7.30 and hypercapnia. Which support should be considered?",
          "options": [
            {
              "id": "a",
              "text": "Start a monitored bilevel NIV trial and prepare a plan for rapid escalation.",
              "why": "Acute hypercapnic respiratory acidosis in a suitable patient is an indication for bilevel NIV with close reassessment.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Use oxygen alone because the saturation has reached target.",
              "why": "A target saturation does not correct inadequate ventilation or respiratory acidosis.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use CPAP alone as the preferred support for this acidotic COPD exacerbation.",
              "why": "Bilevel NIV provides inspiratory pressure support and is the guideline-supported mode in this setting.",
              "correct": false
            }
          ]
        },
        {
          "id": "escalation",
          "level": 3,
          "update": "Despite optimized NIV and minimal leak, pH falls to 7.18. The patient is increasingly drowsy and can no longer clear secretions.",
          "prompt": "What should guide escalation?",
          "review": "During NIV a patient becomes progressively obtunded, with rising PaCO₂ and inability to manage secretions. What is the next airway plan?",
          "options": [
            {
              "id": "a",
              "text": "Call the airway team and proceed toward invasive ventilation if consistent with the goals of care.",
              "why": "Worsening acidosis and loss of airway protection despite optimized NIV indicate failure. Delaying definitive support adds risk.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Continue NIV unchanged for another scheduled blood gas.",
              "why": "A worsening clinical examination and airway protection override a fixed reassessment schedule.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Switch to high-flow nasal oxygen and reassess later.",
              "why": "High-flow oxygen does not secure the airway or replace needed ventilatory support in this setting.",
              "correct": false
            }
          ]
        },
        {
          "id": "post-intubation",
          "source": "gold",
          "level": 4,
          "update": "The patient is intubated. The team observes high airway pressures and incomplete expiratory flow between breaths.",
          "prompt": "What should be highlighted during the ventilator handover?",
          "review": "An intubated patient with obstructive lung disease has persistent expiratory flow at the start of the next breath. What should the team reassess?",
          "options": [
            {
              "id": "a",
              "text": "Assess for dynamic hyperinflation, provide adequate expiratory time and track pressure, gas exchange and hemodynamics.",
              "why": "Incomplete exhalation suggests air trapping. Individualize ventilation and anticipate hemodynamic effects.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Increase respiratory rate first to normalize PaCO₂ as quickly as possible.",
              "why": "A higher rate may further shorten expiration and worsen air trapping.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Focus on oxygen saturation as the primary measure of adequate ventilation.",
              "why": "Oxygenation alone cannot identify dynamic hyperinflation or ventilation failure.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "Name early findings of NIV response you can assess before a repeat blood gas.",
        "Explain what you would do if intubation is outside the patient’s stated goals.",
        "Discuss what new findings would make you reconsider the diagnosis."
      ]
    },
    {
      "id": "mixed-dka-hhs",
      "checked": "2026-11-18",
      "relatedTopics": ["hyperglycemia", "diabetic-ketoacidosis"],
      "title": "Ketoacidosis with severe hyperosmolality",
      "domain": "Metabolic",
      "topic": "hyperosmolar-hyperglycemic-state",
      "source": "dka",
      "stem": "A 63-year-old with diabetes has several days of polyuria and vomiting, marked dehydration and new confusion. Glucose is 860 mg/dL, measured osmolality 342 mOsm/kg, venous pH 7.18, bicarbonate 12 mmol/L and beta-hydroxybutyrate 5.0 mmol/L.",
      "steps": [
        {
          "id": "classification",
          "level": 1,
          "update": "The venous sample confirms both metabolic acidosis and significant ketonemia.",
          "prompt": "Which description best fits this presentation?",
          "review": "A patient has very high glucose and osmolality plus beta-hydroxybutyrate 4.5 mmol/L and pH 7.22. How does the ketonemia change the working diagnosis?",
          "options": [
            {
              "id": "a",
              "text": "Mixed DKA and HHS.",
              "why": "Substantial ketoacidosis coexists with marked hyperosmolality. Both complications matter for management.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Isolated HHS with minimal ketonemia.",
              "why": "The pronounced ketonemia and acidosis are inconsistent with uncomplicated HHS.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Uncomplicated hyperglycemia and dehydration.",
              "why": "The combination of acidosis, ketosis and hyperosmolality indicates a monitored hyperglycemic crisis.",
              "correct": false
            }
          ]
        },
        {
          "id": "potassium",
          "level": 2,
          "update": "K⁺ is 3.0 mmol/L. ECG is obtained and cardiac monitoring has begun.",
          "prompt": "What sequencing is safest?",
          "review": "A confirmed DKA/HHS overlap has initial K⁺ 3.2 mmol/L. What should precede insulin, and why?",
          "options": [
            {
              "id": "a",
              "text": "Begin appropriate IV fluids and potassium replacement. Defer insulin until potassium is above 3.5 mmol/L.",
              "why": "Insulin shifts potassium intracellularly and can precipitate dangerous hypokalemia. Recheck and individualize replacement.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Start fixed-rate insulin now because ketoacidosis is severe.",
              "why": "Severe acidosis does not remove the risk of giving insulin during baseline hypokalemia.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Withhold fluids until the potassium has normalized.",
              "why": "Volume resuscitation and safe potassium replacement can proceed together with reassessment.",
              "correct": false
            }
          ]
        },
        {
          "id": "insulin",
          "level": 3,
          "update": "After initial therapy potassium is 3.8 mmol/L. Hyperosmolality and significant ketoacidosis persist.",
          "prompt": "How should the insulin and monitoring plan change?",
          "review": "Potassium has recovered above 3.5 mmol/L in a patient with persistent ketonemic acidosis and hyperosmolality. Which protocol features should be combined?",
          "options": [
            {
              "id": "a",
              "text": "Use the mixed-crisis IV insulin pathway for ketoacidosis and monitor the rate of osmolar correction.",
              "why": "Significant ketonemia and acidosis require the DKA approach to insulin. Hyperosmolality still calls for controlled correction and frequent lab review.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Use the lower-dose isolated-HHS approach solely because glucose is very high.",
              "why": "The degree of hyperglycemia does not negate the need to treat ongoing ketoacidosis.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Defer insulin until osmolality normalizes despite persisting ketoacidosis.",
              "why": "Once potassium permits, delaying ketosis treatment solely for osmolality normalization risks ongoing metabolic deterioration.",
              "correct": false
            }
          ]
        },
        {
          "id": "transition",
          "level": 4,
          "update": "Glucose is now 235 mg/dL, ketonemia persists and mental status is improving. Potassium and osmolality are followed serially.",
          "prompt": "What should the team communicate at handover?",
          "review": "During mixed DKA/HHS treatment, glucose reaches the dextrose threshold while ketoacidosis persists. What needs to continue and what should be reassessed?",
          "options": [
            {
              "id": "a",
              "text": "Add dextrose and adjust insulin per protocol. Continue until ketoacidosis resolves and review the osmolar, potassium and neurologic trends.",
              "why": "Glucose falls before ketosis resolves. Dextrose permits continuing insulin while serial checks guide safe correction.",
              "correct": true
            },
            {
              "id": "b",
              "text": "Stop insulin because glucose has reached the usual dextrose threshold.",
              "why": "The dextrose threshold prompts a change in fluids and insulin rate. It does not establish resolution.",
              "correct": false
            },
            {
              "id": "c",
              "text": "Use improvement in mental status alone to transition off IV treatment.",
              "why": "Clinical improvement helps but does not replace biochemical assessment or a planned overlap with subcutaneous insulin.",
              "correct": false
            }
          ]
        }
      ],
      "debrief": [
        "Explain which findings establish overlap in this scenario.",
        "Describe how heart failure or kidney disease would change fluid reassessment.",
        "Rehearse handover of glucose, ketones, potassium, osmolality and the precipitant."
      ]
    }
  ],
  "modules": [
    {
      "id": "sedation",
      "title": "Procedural sedation preparation",
      "kind": "Procedure preparation",
      "source": "sedation",
      "topic": "multiple-trauma",
      "intro": "Rehearse the preparation and recovery discussion with your supervisor.",
      "sections": [
        [
          "Before",
          [
            "Clarify the procedure, alternatives, consent and patient-specific risks.",
            "Assign a qualified person to monitor the patient continuously, in addition to the procedural clinician.",
            "Check oxygen, suction, airway rescue equipment, monitoring and the recovery plan."
          ]
        ],
        [
          "During",
          [
            "Monitor ventilation as well as oxygenation; capnography can identify respiratory depression earlier.",
            "Agree who pauses the procedure and manages a complication."
          ]
        ],
        [
          "After",
          [
            "Reassess airway, breathing, circulation and recovery before transition.",
            "Explain aftercare, supervision and return advice using the local discharge criteria."
          ]
        ]
      ],
      "question": "Who will monitor the patient while the procedure is performed?",
      "answer": "A designated qualified team member with continuous monitoring responsibility, separate from the clinician performing the procedure."
    },
    {
      "id": "cardioversion",
      "title": "Cardioversion team preparation",
      "kind": "Procedure preparation",
      "source": "als",
      "topic": "palpitations",
      "intro": "A preparation exercise for a supervised team; use the actual device and local protocol in training.",
      "sections": [
        [
          "Prepare",
          [
            "Confirm rhythm, pulse and evidence of instability.",
            "Identify team roles, pads, monitoring and airway support; consider sedation where feasible without delaying urgent treatment."
          ]
        ],
        [
          "Verify",
          [
            "For synchronized cardioversion, verify synchronization markers on the actual device.",
            "If the rhythm or pulse changes, reassess the pathway rather than continuing the original plan."
          ]
        ],
        [
          "Reassess",
          [
            "Check rhythm, pulse and perfusion after treatment.",
            "Anticipate recurrence and communicate the cause and next plan."
          ]
        ]
      ],
      "question": "What change would make the original synchronized plan inappropriate?",
      "answer": "Cardiac arrest with ventricular fibrillation requires the shockable-arrest pathway and unsynchronized defibrillation."
    },
    {
      "id": "thoracic",
      "title": "Chest emergency preparation",
      "kind": "Procedure preparation",
      "source": "trauma",
      "topic": "multiple-trauma",
      "intro": "Prepare the team and equipment; technical insertion steps require supervised practical training.",
      "sections": [
        [
          "Recognize",
          [
            "Assess respiratory and circulatory compromise in the context of chest injury.",
            "Escalate suspected tension physiology urgently when severely compromised."
          ]
        ],
        [
          "Prepare",
          [
            "Identify the trained operator and local decompression equipment.",
            "Allocate monitoring, analgesia support and definitive drainage roles."
          ]
        ],
        [
          "Reassess",
          [
            "Repeat the primary survey after intervention.",
            "Continue assessment for hemorrhage and additional injuries if shock persists."
          ]
        ]
      ],
      "question": "Does improved breathing after an intervention explain persistent hypotension?",
      "answer": "No. Repeat the primary survey and investigate additional causes while continuing resuscitation."
    },
    {
      "id": "handover",
      "title": "A focused SBAR handover",
      "kind": "Team skills",
      "source": "sbar",
      "topic": "shock",
      "intro": "Practice aloud using a fictional case. No patient-identifiable information is needed.",
      "sections": [
        [
          "Situation",
          [
            "State who you are, who you are calling about and what requires attention now."
          ]
        ],
        [
          "Background and assessment",
          [
            "Give relevant context, the current findings and the trend.",
            "Explain your concern and what remains uncertain."
          ]
        ],
        [
          "Recommendation",
          [
            "Make a clear request and agree who will do what, and when.",
            "Check that the receiver understood the action and contingency plan."
          ]
        ]
      ],
      "question": "A colleague says “Please review when free” about an unstable patient. What would you improve?",
      "answer": "State the instability, request immediate bedside review and agree the immediate actions and escalation plan."
    },
    {
      "id": "leadership",
      "title": "Leading a resuscitation huddle",
      "kind": "Team skills",
      "source": "debrief",
      "topic": "shock",
      "intro": "Use this short simulation to practice shared priorities and explicit roles.",
      "sections": [
        [
          "Brief",
          [
            "Summarize the current problem and immediate priorities.",
            "Assign roles by name and identify the next reassessment point."
          ]
        ],
        [
          "Respond",
          [
            "Invite concerns when the patient or workload changes.",
            "State decisions clearly and confirm that tasks have an owner."
          ]
        ],
        [
          "Debrief",
          [
            "Ask what worked and what made care difficult.",
            "Agree one specific improvement, an owner and a follow-up point."
          ]
        ]
      ],
      "question": "Two clinicians assume the other has called for help. What team habit could prevent this?",
      "answer": "Assign the task to a named person and confirm completion; make the next escalation step explicit."
    },
    {
      "id": "teaching",
      "title": "Teach and review a difficult decision",
      "kind": "Team skills",
      "source": "debrief",
      "topic": "chest-pain",
      "intro": "For residents, fellows and specialists: turn a case discussion into a practical learning point.",
      "sections": [
        [
          "Elicit reasoning",
          [
            "Ask the learner for their leading explanation and strongest alternative.",
            "Ask what finding would change their plan."
          ]
        ],
        [
          "Explore uncertainty",
          [
            "Separate what was known at the time from what became clear later.",
            "Identify a source or local policy that would help resolve the uncertainty."
          ]
        ],
        [
          "Improve",
          [
            "Give one specific observation and a next practice task.",
            "For a recurring system problem, choose a measurable improvement and revisit it."
          ]
        ]
      ],
      "question": "How can a debrief avoid hindsight bias?",
      "answer": "Reconstruct the information available at the decision point before discussing the eventual outcome."
    }
  ],
  "checked": "2026-10-08"
};
