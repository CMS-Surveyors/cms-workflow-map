/* ============================================================
   CMS Master Workflow — shared data
   Edited by Mack. This single file feeds BOTH:
     • index.html    (interactive map: propose / edit / ask)
     • training.html (read-only staff mirror)
   Keep them in sync by editing ONLY this file.
   ============================================================ */

const LAST_UPDATED = "26 June 2026";

/* Recent changes — newest first. Shown at the top of the training guide. */
const CHANGES = [
  { date:"26 Jun 2026", text:"Workflow map rebuilt: every automation card now expands to show its exact trigger, where it pulls its information from, and the verbatim message it sends." },
  { date:"26 Jun 2026", text:"Staff Training Guide is now a read-only mirror of the live workflow map, so the training view and the working map can never drift apart." },
  { date:"26 Jun 2026", text:"On the map you can now propose a brand-new automation, suggest an edit to an existing one, and ask Mack for his thoughts on the wording, then send it all over with one button." },
  { date:"Jun 2026", text:"Email to Reonic logger live across all 9 ops mailboxes, mirroring every customer email onto the matching job card automatically." },
  { date:"Jun 2026", text:"Site Visit (#31) and Showroom (#12) confirmation emails live, joining the remote consultation email (#1)." },
  { date:"Jun 2026", text:"BookerBot transcript sweep built and dry-run verified, copying the full Lila chat into Reonic. Awaiting Cameron's go to switch live." }
];

/* Wording and style — the rules every customer-facing message follows.
   Shown near the top of the training guide so staff write in one voice. */
const STYLE = [
  { h:"Say 'CMS', not 'CMS Surveyors'", body:"In anything a customer reads, we are CMS. 'Surveyors' is the legal name, not the brand they hear." },
  { h:"Sign off as the team", body:"Customer-facing emails close with 'Kind regards, The CMS Renewables Team'. Never sign as one person: it keeps the experience consistent whoever is covering." },
  { h:"Plain English, explain the jargon", body:"Spell out the acronyms the first time: DNO (the grid network operator who approves the connection), MCS (the installer certification scheme), EPC (the energy rating). If a customer would have to Google it, explain it." },
  { h:"No dashes mid-sentence", body:"Use a colon, a comma, or split the sentence. It reads cleaner and matches the brand." },
  { h:"Light, not dark", body:"Cyan and green on white. Never a dark background. Quicksand for headings, Assistant for body." },
  { h:"One button name is fixed", body:"The pre-consultation video button always reads exactly: 'What to expect during the remote design consultation video'. Do not reword it." },
  { h:"Nothing goes out unchecked", body:"No customer-facing message is sent without a human (or Mack) checking it first. Draft, review, then send." }
];

/* ============ THE WORKFLOW ============ */
const DATA = [
  { n:"STAGE 1", title:"REQUEST — the lead & sales pipeline", meta:'Reonic board: residential "New Board"',
    steps:[
      { name:"Hot — Brand new lead!", col:'Reonic column: "Hot - Brand new lead!"', dot:"mixed",
        autos:[
          { nm:"Speed to Lead — Enquiries", s:"live", ch:"BookerBot · WhatsApp",
            trigger:"A new enquiry is submitted on the CMS website (Wix) contact form.",
            how:[
              ["Where it runs","Inside BookerBot (the 'Lila' AI assistant), not Mack. The Wix form posts the lead straight into BookerBot."],
              ["What it reads","The form fields — first name, phone/WhatsApp number, enquiry details."],
              ["When it sends","Aims to land within ~2 minutes, 8am–9pm. Outside those hours it holds to WhatsApp only."],
              ["What it does NOT do","It does not qualify the property or product — that is the team's job on the call. It just acknowledges, shares Cameron's intro video, and pins a rough call time."]
            ],
            says:[["First message (verbatim)","Hi {first_name}! Thanks for getting in touch with CMS Surveyors. We have received your enquiry and one of the team will be in touch shortly. In the meantime, here is a quick message from Cameron - our Renewables Director. If you have any questions, just reply here and I can help!"]],
            meta:"System: BookerBot. Channel: WhatsApp. Owner of copy: BookerBot workflow (editable in BookerBot).",
            note:"" },
          { nm:"Lead Qualification", s:"live", ch:"BookerBot · SMS",
            trigger:"An inbound lead arrives by a non-website route and is enrolled into BookerBot.",
            how:[
              ["Where it runs","BookerBot (Lila), SMS channel."],
              ["Two steps","Step 1 fires immediately. Step 2 fires ~2h later ONLY if there has been no reply."],
              ["Who gets alerted","If Step 2 fires (no reply), it notifies Claire + info@ + Rees so a human can pick it up."]
            ],
            says:[
              ["Step 1 (t+0)","Hi {first_name}! Thanks for getting in touch with CMS 🔆\nHere is a quick intro video from our team: https://youtu.be/BO6PdcYWgDM\nI am Lila, CMS's virtual assistant. Just to check I have got the right person, is this {first_name}? And what day and time generally suits for one of the team to give you a quick call? They will take it from there 🙂"],
              ["Step 2 (t+2h · only if no reply)","Hi {first_name}, just following up on your CMS enquiry 🔆 Whenever you have a moment, reply with a good day and time for a quick call and the team will be in touch. No rush!"]
            ],
            meta:"System: BookerBot. Channel: SMS.",
            note:"" },
          { nm:"Email → Reonic logger", s:"live", ch:"Mack · runs across ALL stages",
            trigger:"Any customer emails in, or any team member replies, from one of the CMS mailboxes.",
            how:[
              ["Mailboxes watched","All 9 ops inboxes, both directions (in & out): cameron@, mark@, s.russell@, l.eskdale@, d.mcerlean@, r.mcgachy@, c.mclaughlin@, info@, renewables@."],
              ["How it matches","Reads each new email, takes the customer's email address, looks it up against Reonic contacts, then finds that contact's project (any board, any stage). Only logs when it can confidently match a customer to a project."],
              ["What it writes","A Reonic note on the job card. Inbound headed “📥 Customer email — {date}”, outbound headed “📤 CMS reply ({staff}) — {date}”, with a short summary + the original message. Attachments are uploaded too."],
              ["What it skips","Internal-only emails, auto-replies/out-of-office, newsletters, and Reonic's own “Your quote is ready” template (Reonic already owns that). Never touches tags."],
              ["No double-logging","A ledger keyed on each email's Message-ID stops the same message being written twice."]
            ],
            says:[["What it does","Mirrors every customer email conversation onto the Reonic job card automatically, so staff never copy-paste threads into Reonic and the full back-and-forth lives in one place."]],
            meta:"Mack scheduled task email-to-reonic-logger (id 853e2135). Runs 4× / hour, 08:00–17:00 Mon–Fri. LIVE (writes enabled).",
            note:"Cross-cutting: this runs at every stage, not just here." },
          { nm:"BookerBot transcript sweep", s:"pending", ch:"Mack",
            trigger:"A BookerBot contact has had a two-way (replied-to) SMS/WhatsApp conversation with Lila.",
            how:[
              ["Where it reads","BookerBot API — pulls the full message thread (every inbound/outbound SMS/WhatsApp) for the contact."],
              ["How it matches","Primary: BookerBot contact's reonic_offer_id, which is the exact Reonic project id (no fuzzy matching). Fallback: contact email → Reonic contact → project."],
              ["What it writes","One pinned Reonic note holding the verbatim back-and-forth chat, kept up to date as the conversation continues."],
              ["Guard","Only logs contacts with at least one INBOUND message (a real conversation, not outbound-only)."]
            ],
            says:[["What it does","Copies the full Lila qualification chat into the matching Reonic project as one pinned note — the SMS/WhatsApp equivalent of the email logger."]],
            meta:"Mack script bookerbot-transcript-sweep.mjs. Built & dry-run verified (5 live two-way convos matched). NOT yet wired live — awaiting Cameron's go.",
            note:"" }
        ]},
      { name:"Warm → Cooling → Cold → Cold (1 week later)", col:"Reonic columns: the lead-temperature ladder", dot:"manual",
        autos:[
          { nm:"Lead chasing", s:"manual", ch:"Team",
            trigger:"A lead sits and cools; the team calls / emails / texts and moves the card down the temperature ladder.",
            how:[
              ["Today","Entirely manual. The team works the card by hand and drags it Warm → Cooling → Cold as it ages."]
            ],
            says:[["Candidate (not built)","An automated multi-touch nurture per temperature (email + WhatsApp) with open-rate tracking, so leads stay warm without anyone having to remember to chase."]],
            meta:"",
            note:"Biggest top-of-funnel leak — see Mack's priorities (P5) in the master document." },
          { nm:"Solar Battery Reengagement — 20% Off", s:"paused", ch:"BookerBot · SMS",
            trigger:"(When activated) cold / previous leads who never converted are enrolled.",
            how:[
              ["Where it runs","BookerBot (Lila), SMS."],
              ["Shape","4-touch SMS over ~10 days; each follow-up is suppressed the moment they reply. Lila qualifies and books a no-pressure call around a limited-time 20% off solar battery storage."]
            ],
            says:[["Status","Built but switched OFF."]],
            meta:"",
            note:"Held: needs a real discount deadline, a reviewed enrolment list, and channel confirmation before it runs." }
        ]},
      { name:"Remote consultation", col:'Reonic column: "Remote consultation"', dot:"mixed",
        autos:[
          { nm:"Pre-remote consultation (Automation #1)", s:"live", ch:"Mack · Email",
            trigger:"A card enters the \"Remote consultation\" column (Claire has booked the video-call slot).",
            how:[
              ["How it's detected","Mack sweeps the Reonic \"Remote consultation\" column every 5 minutes, 08:00–17:00 Mon–Fri (cache-busted read so it sees moves immediately). A per-project state file means each customer is only emailed once."],
              ["WHERE the date/time comes from","A calendar lookup, searching ~14 days forward across THREE Google calendars (all read via the renewables@ alias), in priority order: 1) Ryan McGachy's calendar (r.mcgachy@) — most bookings land here; 2) the shared \"Renewable Enquiry Availability\" calendar — Cameron's consultations; 3) renewables@ primary — fallback. First future match wins."],
              ["How it finds the right event","Matches the calendar event whose attendee/title carries the customer's email (or, failing that, their first+last name or mobile). From that event it pulls the start time and the Google Meet join link."],
              ["Who it emails","Customer on To, from renewables@. BCC: Claire (c.mclaughlin@), Mark (mark@) and Diane McErlean (procurement, d.mcerlean@) so the office and procurement see every booking."],
              ["Safety net","If no correct date/time can be found on the calendar (e.g. the card was moved but no slot was entered), Mack emails Claire to fix the calendar rather than sending a dateless email."],
              ["Reminders","Designed: every 72h stepping back from the appointment + a 24h-before + 1h-before nudge. Copy approved, NOT yet switched on live."]
            ],
            says:[
              ["Subject (verbatim)","Your remote consultation with CMS — {Day} {D} {Month} at {HH:MM}\n(the date is added only when a calendar slot is found)"],
              ["Email body (verbatim)","Hi {first_name},\n\nThank you for booking your remote consultation with our Renewables Team. We look forward to speaking with you and discussing the renewable energy options that may be suitable for your property.\n\n— Your consultation —  (shown only when a slot is found)\n{Day} {D} {Month} {Year} at {HH:MM} (UK time)\nApproximately 1 hour, via Google Meet (screen share)\n[ Join the Google Meet ]  or open meet.google.com/{code}\n\nBefore the consultation\nIf you haven't already shared them with us, it helps to have any of the following to hand for the call. Feel free to reply to this email with anything useful ahead of time, or just have it ready for the call:\n• Recent energy bills or consumption data\n• Property plans, drawings or photographs\n• Existing system information or specifications\n• Previous quotations or designs you may have received\n• Any particular requirements, objectives or questions you would like us to discuss\nDon't worry if you don't have any of the above available.\n\nBefore our call, we recommend taking a few minutes to watch our short video. It explains what to expect during the remote design consultation and how we work through your property remotely.\n[ What to expect during the remote design consultation video ] → youtube.com/shorts/cSa1V_9uD2k\n\nWhat to expect during your consultation\nThe consultation lasts approximately 45 minutes to an hour and is carried out via Google Meet with screen sharing. By the end of the session you'll have a clear understanding of:\n• The renewable technologies that may be suitable for your property\n• Potential system sizes and configurations\n• Indicative costs and expected benefits\n• Available grants and funding options (where applicable)\n• The next steps should you wish to proceed\nThere is absolutely no obligation to move forward following the consultation.\n\nIf you need to reschedule or have any queries beforehand, simply reply to this email or call us on 01389 298330, and we'll be happy to help.\n\nWe look forward to speaking with you.\n\nKind regards,\nThe CMS Renewables Team"]
            ],
            meta:"Mack scheduled task pre-call-automation-sweep (id d8000763). Reonic column id ac86d041. Also creates a Reonic task \"Complete remote design consultation — {name}\" assigned to whoever owns the calendar slot.",
            note:"" }
        ]},
      { name:"Site Visit consultation", col:'Reonic column: "Site Visit consultation"', dot:"mixed",
        autos:[
          { nm:"Site Visit consultation (Automation #31)", s:"live", ch:"Mack · Email",
            trigger:"A card enters the \"Site Visit consultation\" column (an in-person property visit by Ryan McGachy is booked).",
            how:[
              ["How it's detected","Same engine as #1: a 5-minute Reonic sweep of the \"Site Visit consultation\" column, once-per-customer state file."],
              ["WHERE the date/time comes from","Same 3-calendar lookup as the remote automation (Ryan's calendar first, then \"Renewable Enquiry Availability\", then renewables@). It reads the booked site-visit event's date/time and the property address."],
              ["Difference vs remote","No Google Meet — this is an in-person visit, so the email confirms the property address and visit time instead of a join link."],
              ["Past-visit guard","If the only matching calendar event is in the PAST, the visit already happened, so it suppresses the confirmation instead of sending a timeless one."],
              ["Safety net","No calendar match → emails Claire to add/correct the slot (same as #1)."]
            ],
            says:[["Confirmation email","Same structure and CMS branding as the remote email (greeting → confirmed date/time → reply-with-documents invite → what-to-expect → sign-off), but anchored to the in-person site visit and property address rather than a Google Meet link."]],
            meta:"Mack scheduled task site-visit-automation-sweep (id 99e20287). BCC Claire + Mark + Diane.",
            note:"" }
        ]},
      { name:"Showroom consultation", col:'Reonic column: "Showroom consultation"', dot:"mixed",
        autos:[
          { nm:"Pre-showroom consultation (Automation #12)", s:"live", ch:"Mack · Email",
            trigger:"A card enters the \"Showroom consultation\" column (customer is coming into the Dumbarton showroom).",
            how:[
              ["How it's detected","Same 5-minute Reonic sweep engine, once-per-customer state file."],
              ["WHERE the date/time comes from","Same 3-calendar lookup (Ryan → \"Renewable Enquiry Availability\" → renewables@)."],
              ["Difference vs remote","Confirms the showroom address (14 Birch Road, Broadmeadow Industrial Estate, Dumbarton, G82 2RE) and shows the intro video as a PLAIN inline link (not a button) so it survives copy/forward."],
              ["Safety net","No calendar match → emails Claire (same as #1)."]
            ],
            says:[["Video line (verbatim)","Watch the video: https://youtu.be/G91mKJgp_MY"]],
            meta:"Mack scheduled task pre-showroom-automation-sweep (id c1dd010d). BCC Claire + Mark + Diane.",
            note:"" }
        ]},
      { name:"Technical Phone Call / No Response / Not Interested", col:"Reonic columns: later-stage & dead-end", dot:"manual",
        autos:[
          { nm:"Manual handling", s:"manual", ch:"Team",
            trigger:"Card sits in a technical-call or dead-end column.",
            how:[["Today","Manual. \"No Response\" feeds the future re-engagement campaign; \"Not Interested\" is parked."]],
            says:[["Status","No dedicated automation today."]],
            meta:"",
            note:"" }
        ]}
    ]},

  { n:"STAGE 2", title:"OFFER — survey, design, quote, decision", meta:'Reonic board: residential "New Board" / offer',
    steps:[
      { name:"Awaiting Tech Survey → Quoted → Requote → Pre-Sales Handover", col:"9 Reonic columns, from survey through to the won handover", dot:"manual",
        autos:[
          { nm:"Email → Reonic logger", s:"live", ch:"Mack",
            trigger:"Customer email in/out at any offer-stage column.",
            how:[["What it does here","The same cross-cutting logger keeps mirroring every customer email onto the job card right through the quoting and decision stages."]],
            says:[["See","Full detail on the logger card in Stage 1."]],
            meta:"",
            note:"" },
          { nm:"Quoting / requoting / decision chasing", s:"manual", ch:"Team",
            trigger:"Job is surveyed, designed, quoted and worked toward a decision.",
            how:[
              ["Today","Manual. Claire copy-pastes from 17 touchpoint templates across 7 journey stages (plus the customer journey page with ?stage= personalisation)."],
              ["CMS principle","Always quote twice; no single sits (bill + partner present)."]
            ],
            says:[["Candidates (roadmap)","'What to expect' appointment video; auto value-nurture emails with open tracking; Reonic stage-trigger automations (e.g. deposit-received auto-advance); auto 3-quote materials/scaffold request."]],
            meta:"",
            note:"Almost entirely manual today — ripe for stage-triggered automation once the front door is proven." },
          { nm:"Deposit structure change (10% + 15% post-DNO)", s:"commercial", ch:"Decision",
            trigger:"n/a — this is a pricing decision, not an automation.",
            how:[["What it is","Moving the deposit structure to 10% upfront + 15% after DNO."]],
            says:[["Owner","A commercial call needing Cameron's sign-off, not something Mack builds."]],
            meta:"",
            note:"" }
        ]}
    ]},

  { n:"STAGE 3", title:"INSTALLATION — handover to completed", meta:'Reonic board: residential "Standard" / installation',
    steps:[
      { name:"Sales Handover", col:'Reonic column: "Sales Handover"', dot:"manual",
        autos:[
          { nm:"Sales-handover pack", s:"manual", ch:"Mack candidate",
            trigger:"Card enters \"Sales Handover\" (sale won, sales → ops).",
            how:[["Today","Manual."]],
            says:[["Candidate (high priority — P3)","An automated, branded pack on entry to this column that sets expectations for what comes next (DNO / SPEN / SSE timelines, who does what, when they'll hear from us). The anti-buyer's-remorse moment — the single biggest protector of won revenue."]],
            meta:"",
            note:"" }
        ]},
      { name:"Pre-electrical → Electrical Design → Procurement", col:"5 engineering / procurement Reonic columns", dot:"manual",
        autos:[ { nm:"Internal ops", s:"manual", ch:"Team", trigger:"Engineering & procurement work.", how:[["Today","Manual, internal. (Leon moves a job into Electrical Design so Prolec can produce the schematic.)"]], says:[["Status","No customer-facing automation here."]], meta:"", note:"" } ]},
      { name:"Awaiting DNO", col:'Reonic column: "Awaiting DNO"', dot:"manual",
        autos:[
          { nm:"DNO communications", s:"manual", ch:"Mack candidate",
            trigger:"Card enters / leaves \"Awaiting DNO\".",
            how:[["Today","Manual — the customer goes quiet to the team but anxious at home during the grid-approval wait."]],
            says:[["Candidate (high priority — P4)","Two stage-triggered messages: “DNO submitted — what it means & how long it takes” on entry, and “DNO approved — here's what happens next” on exit. Cuts cancellations and inbound chase emails."]],
            meta:"",
            note:"The longest, most anxious wait point in the journey." }
        ]},
      { name:"Install Scheduling → Install In Progress", col:"5 Reonic columns from scheduling to install", dot:"manual",
        autos:[
          { nm:"Install-date confirmation + reminders", s:"manual", ch:"Mack candidate",
            trigger:"Install date agreed / card moves through the install columns.",
            how:[["Today","Manual coordination by the field team."]],
            says:[["Candidate","A confirmation + reminder sequence reusing the consultation reminder engine (every-72h + 24h + 1h)."]],
            meta:"",
            note:"" }
        ]},
      { name:"Handover", col:'Reonic column: "Handover"', dot:"manual",
        autos:[
          { nm:"Post-install review request", s:"manual", ch:"Mack candidate",
            trigger:"System commissioned & handed over (export MPAN live, customer generating).",
            how:[["Today","Manual."]],
            says:[["Candidate","A review-incentive ask (Amazon voucher for a video review at 6/12 months, before/after bills) routed through a gated review page (5★ → Google, <5★ → private feedback). The organic-lead flywheel feeding the YouTube/social strategy."]],
            meta:"",
            note:"The gated review-page routing needs Rees to build." }
        ]},
      { name:"Remedials → Project Completed → Cancelled", col:"Closing Reonic columns", dot:"manual",
        autos:[ { nm:"Aftercare nurture", s:"manual", ch:"Mack candidate", trigger:"Job completed.", how:[["Today","Manual."]], says:[["Candidate","Aftercare / service-due nurture that graduates into the Service Booking workflow (see Aftercare)."]], meta:"", note:"" } ]}
    ]},

  { n:"AFTERCARE", title:"AFTERCARE & CROSS-CUTTING", meta:"Runs alongside the whole journey",
    steps:[
      { name:"Service, finance & ops", col:"", dot:"mixed",
        autos:[
          { nm:"Service Booking", s:"paused", ch:"BookerBot",
            trigger:"(When activated) a customer's heat pump is due a service.",
            how:[["Where it runs","BookerBot."],["What it does","Reaches out and books the service appointment into the calendar for the CMS team."]],
            says:[["Status","Built, switched off — no steps yet, needs activation."]],
            meta:"",
            note:"" },
          { nm:"Xero → Reonic job-bag notes", s:"gated", ch:"Finance",
            trigger:"A renewables invoice is raised or an advance deposit (25% then 35%) is received.",
            how:[
              ["Goal","Auto-write a note onto the matching Reonic job card when money moves."],
              ["Why gated","Wiring Xero directly is a new integration — escalated to Rees."],
              ["Interim (non-gated)","Once Xero is set to copy accounts@ on outbound invoices, Mack can detect them by email sweep and write the Reonic note — no direct Xero link needed."]
            ],
            says:[["Status","Awaiting Rees / the Xero copy setting."]],
            meta:"",
            note:"" },
          { nm:"Staff console + comms hub", s:"live", ch:"portal.cmssurveyors.co.uk",
            trigger:"Always-on team screen.",
            how:[
              ["What it shows","A \"Needs reply\" queue driven by Reonic's Reply-Needed tag + unread customer/portal emails."],
              ["Per-staff view","An owner filter (Ryan / Claire / Leon / Cameron / etc.) so each person sees only their own jobs."]
            ],
            says:[["Note","Ops infrastructure, not a customer send."]],
            meta:"",
            note:"" }
        ]}
    ]}
];
